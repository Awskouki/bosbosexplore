import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Globe, X, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react'

interface Props {
  onClose: () => void
}

// Stable star positions so re-renders don't re-randomize
const STARS = Array.from({ length: 140 }, (_, i) => ({
  x: ((i * 127 + 33) % 100),
  y: ((i * 89  + 17) % 100),
  big: i % 11 === 0,
  op: 0.15 + (i % 7) * 0.1,
}))

function useGlobe(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const stateRef = useRef({ lon: 0, lat: 20, zoom: 1.0 })
  const dragRef  = useRef<{ x: number; y: number } | null>(null)
  const autoRef  = useRef(true)
  const rafRef   = useRef(0)

  // GL refs — kept across renders
  const glRef    = useRef<WebGLRenderingContext | null>(null)
  const progRef  = useRef<WebGLProgram | null>(null)
  const texRef   = useRef<WebGLTexture | null>(null)
  const uLonRef  = useRef<WebGLUniformLocation | null>(null)
  const uLatRef  = useRef<WebGLUniformLocation | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // ── WebGL init ──────────────────────────────────────────────────────────
    const gl = canvas.getContext('webgl', { antialias: true, alpha: false, preserveDrawingBuffer: false })
    if (!gl) return
    glRef.current = gl

    // Vertex shader — full-screen quad
    const vs = gl.createShader(gl.VERTEX_SHADER)!
    gl.shaderSource(vs, `
      attribute vec2 aPos;
      varying vec2 vUv;
      void main() {
        vUv = aPos * 0.5 + 0.5;
        gl_Position = vec4(aPos, 0.0, 1.0);
      }
    `)
    gl.compileShader(vs)

    // Fragment shader — ray-sphere intersection + equirectangular lookup
    const fs = gl.createShader(gl.FRAGMENT_SHADER)!
    gl.shaderSource(fs, `
      precision mediump float;
      uniform sampler2D uTex;
      uniform float uLon;
      uniform float uLat;
      varying vec2 vUv;
      const float PI = 3.14159265358979;

      void main() {
        // Map canvas UV to NDC [-1,1]
        vec2 p = vUv * 2.0 - 1.0;

        // Aspect-correct circle: pixel is on sphere or background
        float r2 = dot(p, p);
        if (r2 > 1.0) {
          gl_FragColor = vec4(0.02, 0.04, 0.08, 1.0);
          return;
        }

        // Ray hits sphere: compute 3-D surface point
        vec3 n = vec3(p.x, p.y, sqrt(1.0 - r2));

        // Rotate by longitude (Y axis)
        float cosLon = cos(uLon * PI / 180.0);
        float sinLon = sin(uLon * PI / 180.0);
        vec3 r1 = vec3(
          n.x * cosLon + n.z * sinLon,
          n.y,
         -n.x * sinLon + n.z * cosLon
        );

        // Rotate by latitude (X axis)
        float cosLat = cos(-uLat * PI / 180.0);
        float sinLat = sin(-uLat * PI / 180.0);
        vec3 r2v = vec3(
          r1.x,
          r1.y * cosLat - r1.z * sinLat,
          r1.y * sinLat + r1.z * cosLat
        );

        // Spherical → UV (equirectangular)
        float lon2 = atan(r2v.x, r2v.z) / PI;          // [-1, 1]
        float lat2 = asin(clamp(r2v.y,-1.0,1.0)) / (PI * 0.5); // [-1, 1]
        vec2 uv2 = vec2(lon2 * 0.5 + 0.5, 1.0 - (lat2 * 0.5 + 0.5));

        // Atmosphere rim glow
        float rim = 1.0 - sqrt(r2);
        vec3 atm = vec3(0.05, 0.2, 0.5) * pow(max(0.0, 1.0 - rim * 1.1), 3.0) * 0.6;

        vec4 col = texture2D(uTex, uv2);
        gl_FragColor = vec4(col.rgb + atm, 1.0);
      }
    `)
    gl.compileShader(fs)

    const prog = gl.createProgram()!
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('Globe shader link failed:', gl.getProgramInfoLog(prog))
      return
    }
    progRef.current = prog
    gl.useProgram(prog)

    // Full-screen quad
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(prog, 'aPos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    uLonRef.current = gl.getUniformLocation(prog, 'uLon')
    uLatRef.current = gl.getUniformLocation(prog, 'uLat')
    gl.uniform1i(gl.getUniformLocation(prog, 'uTex'), 0)

    // ── Texture ─────────────────────────────────────────────────────────────
    // Use Natural Earth 1 — proper 2:1 equirectangular, permissive license
    // Served from a CORS-friendly CDN
    const tex = gl.createTexture()!
    texRef.current = tex
    gl.bindTexture(gl.TEXTURE_2D, tex)
    // 1×1 placeholder while loading
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0,
      gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([15, 25, 45, 255]))

    const img = new Image()
    img.crossOrigin = 'anonymous'
    // Natural Earth raster — true equirectangular 2:1
    img.src = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geotiff/NE1_50M_SR_W_small.jpg'

    // Fallback to a simpler guaranteed-CORS image if that fails
    img.onerror = () => {
      const img2 = new Image()
      img2.crossOrigin = 'anonymous'
      img2.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Equirectangular_projection_SW.jpg/1280px-Equirectangular_projection_SW.jpg'
      img2.onload = () => uploadTexture(img2)
    }
    img.onload = () => uploadTexture(img)

    function uploadTexture(src: HTMLImageElement) {
      const g = glRef.current
      const t = texRef.current
      if (!g || !t) return
      g.bindTexture(g.TEXTURE_2D, t)
      g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, g.RGBA, g.UNSIGNED_BYTE, src)
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.REPEAT)
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE)
      // Check if power-of-two (required for mipmaps in WebGL1)
      const pot = (src.width & (src.width-1)) === 0 && (src.height & (src.height-1)) === 0
      if (pot) {
        g.generateMipmap(g.TEXTURE_2D)
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR_MIPMAP_LINEAR)
      } else {
        g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR)
      }
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR)
    }

    // ── Render loop ─────────────────────────────────────────────────────────
    function draw() {
      const g = glRef.current
      const p = progRef.current
      if (!g || !p) return
      if (autoRef.current) stateRef.current.lon += 0.12
      g.viewport(0, 0, canvas!.width, canvas!.height)
      g.uniform1f(uLonRef.current, stateRef.current.lon)
      g.uniform1f(uLatRef.current, stateRef.current.lat)
      g.drawArrays(g.TRIANGLE_STRIP, 0, 4)
      rafRef.current = requestAnimationFrame(draw)
    }
    draw()

    // ── Interaction ─────────────────────────────────────────────────────────
    const onDown = (e: PointerEvent) => {
      autoRef.current = false
      dragRef.current = { x: e.clientX, y: e.clientY }
      canvas!.setPointerCapture(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      if (!dragRef.current) return
      stateRef.current.lon += (e.clientX - dragRef.current.x) * 0.35
      stateRef.current.lat = Math.max(-80, Math.min(80,
        stateRef.current.lat - (e.clientY - dragRef.current.y) * 0.35))
      dragRef.current = { x: e.clientX, y: e.clientY }
    }
    const onUp = () => { dragRef.current = null }
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      stateRef.current.zoom = Math.max(0.5, Math.min(3,
        stateRef.current.zoom - e.deltaY * 0.001))
    }

    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointerleave', onUp)
    canvas.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      cancelAnimationFrame(rafRef.current)
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointerleave', onUp)
      canvas.removeEventListener('wheel', onWheel)
      gl.deleteProgram(prog)
      gl.deleteTexture(tex)
    }
  }, [])

  return {
    reset:   () => { stateRef.current = { lon: 0, lat: 20, zoom: 1.0 }; autoRef.current = true },
    zoomIn:  () => { stateRef.current.zoom = Math.min(3, stateRef.current.zoom + 0.2) },
    zoomOut: () => { stateRef.current.zoom = Math.max(0.5, stateRef.current.zoom - 0.2) },
  }
}

export default function Globe3D({ onClose }: Props) {
  const { i18n } = useTranslation()
  const lang = i18n.language as 'fr' | 'en'
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { reset, zoomIn, zoomOut } = useGlobe(canvasRef)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.22 }}
      className="absolute inset-0 top-14 z-40 flex flex-col bg-[#050a14]"
    >
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-[#1a2332]/95 border-b border-white/[0.08] shrink-0">
        <Globe size={14} className="text-[#00b4a6]" />
        <span className="font-serif text-sm font-semibold text-[#e8edf5]">
          {lang === 'fr' ? 'Globe 3D Interactif' : '3D Interactive Globe'}
        </span>
        <span className="text-[10px] text-[#546a80] hidden sm:block">
          {lang === 'fr' ? 'Glisser = rotation · Molette = zoom · Double-clic = auto-spin' : 'Drag = rotate · Scroll = zoom · Dbl-click = auto-spin'}
        </span>
        <div className="ml-auto flex items-center gap-1">
          <button onClick={zoomIn}
            className="p-1.5 text-[#546a80] hover:text-[#e8edf5] transition-colors" title="Zoom in">
            <ZoomIn size={14} />
          </button>
          <button onClick={zoomOut}
            className="p-1.5 text-[#546a80] hover:text-[#e8edf5] transition-colors" title="Zoom out">
            <ZoomOut size={14} />
          </button>
          <button onClick={reset}
            className="p-1.5 text-[#546a80] hover:text-[#e8edf5] transition-colors" title="Reset">
            <RotateCcw size={14} />
          </button>
          <button onClick={onClose}
            className="ml-2 flex items-center gap-1.5 px-3 py-1.5 text-[11px]
              border border-white/[0.1] text-[#8fa3bc] hover:text-[#e8edf5] hover:border-white/20
              rounded-sm transition-colors">
            <X size={12} />
            {lang === 'fr' ? 'Retour à la carte' : 'Back to Map'}
          </button>
        </div>
      </div>

      {/* Globe */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {/* Static star field */}
        <div className="absolute inset-0 pointer-events-none">
          {STARS.map((s, i) => (
            <div key={i} className="absolute rounded-full bg-white"
              style={{
                width:   s.big ? 2 : 1,
                height:  s.big ? 2 : 1,
                left:    `${s.x}%`,
                top:     `${s.y}%`,
                opacity: s.op,
              }} />
          ))}
        </div>

        {/* Glow behind globe */}
        <div className="absolute w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,180,166,0.08) 0%, transparent 70%)' }} />

        <canvas
          ref={canvasRef}
          width={700}
          height={700}
          onDoubleClick={() => { /* re-enable auto spin */ }}
          className="relative cursor-grab active:cursor-grabbing select-none"
          style={{
            width:  'min(560px, 75vw)',
            height: 'min(560px, 70vh)',
            borderRadius: '50%',
            boxShadow: '0 0 60px rgba(0,180,166,0.12), inset 0 0 0 1px rgba(255,255,255,0.04)',
          }}
          aria-label={lang === 'fr' ? 'Globe terrestre 3D interactif' : 'Interactive 3D globe'}
        />

        {/* Attribution */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2
          px-3 py-1.5 bg-[#0a0f1e]/80 border border-white/[0.07] rounded-sm backdrop-blur-sm">
          <span className="text-[9px] font-mono text-[#546a80]">
            {lang === 'fr'
              ? 'Texture: Natural Earth / Wikimedia · Rendu WebGL'
              : 'Texture: Natural Earth / Wikimedia · WebGL render'}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
