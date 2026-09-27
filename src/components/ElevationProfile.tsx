import { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, X, Loader2, AlertTriangle } from 'lucide-react'
import Map from 'ol/Map'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Style, Stroke, Circle as CircleStyle, Fill } from 'ol/style'
import Draw from 'ol/interaction/Draw'
import Feature from 'ol/Feature'
import LineString from 'ol/geom/LineString'
import { toLonLat } from 'ol/proj'
import { getLength } from 'ol/sphere'
import type { DrawEvent } from 'ol/interaction/Draw'
import type { Coordinate } from 'ol/coordinate'

interface ElevPoint { dist: number; elev: number }

const SAMPLE_POINTS = 50
const OPEN_ELEVATION_API = 'https://api.open-elevation.com/api/v1/lookup'

interface Props {
  map: Map | null
  onClose: () => void
}

/** Interpolate N points along a LineString in EPSG:3857, return lon/lat pairs */
function sampleLine(coords: Coordinate[], n: number): [number, number][] {
  const line = new LineString(coords)
  const total = line.getLength()
  const pts: [number, number][] = []
  for (let i = 0; i <= n; i++) {
    const frac = i / n
    const pt = line.getCoordinateAt(frac)
    const ll = toLonLat(pt)
    pts.push([ll[0], ll[1]])
  }
  return pts
}

async function fetchElevations(pts: [number, number][]): Promise<number[]> {
  const locations = pts.map(([lon, lat]) => ({ latitude: lat, longitude: lon }))
  const res = await fetch(OPEN_ELEVATION_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ locations }),
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  return data.results.map((r: { elevation: number }) => r.elevation)
}

export default function ElevationProfile({ map, onClose }: Props) {
  const { i18n } = useTranslation()
  const lang = i18n.language as 'fr' | 'en'

  const [drawing, setDrawing] = useState(false)
  const [status, setStatus] = useState<'idle' | 'drawing' | 'loading' | 'done' | 'error'>('idle')
  const [profile, setProfile] = useState<ElevPoint[]>([])
  const [errorMsg, setErrorMsg] = useState('')

  const sourceRef = useRef<VectorSource>(new VectorSource())
  const layerRef = useRef<VectorLayer<VectorSource> | null>(null)
  const drawRef = useRef<Draw | null>(null)

  const STYLE = new Style({
    stroke: new Stroke({ color: '#e8611a', width: 2, lineDash: [6, 3] }),
    image: new CircleStyle({
      radius: 5,
      fill: new Fill({ color: '#e8611a' }),
      stroke: new Stroke({ color: '#0a0f1e', width: 2 }),
    }),
  })

  useEffect(() => {
    if (!map) return
    const layer = new VectorLayer({ source: sourceRef.current, style: STYLE, zIndex: 60 })
    layerRef.current = layer
    map.addLayer(layer)
    return () => { map.removeLayer(layer) }
  }, [map])

  const startDraw = useCallback(() => {
    if (!map) return
    sourceRef.current.clear()
    setProfile([])
    setStatus('drawing')
    setDrawing(true)

    const draw = new Draw({ source: sourceRef.current, type: 'LineString', style: STYLE, maxPoints: 2 })
    drawRef.current = draw

    draw.on('drawend', async (evt: DrawEvent) => {
      map.removeInteraction(draw)
      drawRef.current = null
      setDrawing(false)
      setStatus('loading')

      const geom = evt.feature.getGeometry() as LineString
      const coords = geom.getCoordinates()
      const pts = sampleLine(coords, SAMPLE_POINTS)

      // Total distance in km
      const totalM = getLength(geom)

      try {
        const elevs = await fetchElevations(pts)
        const data: ElevPoint[] = elevs.map((elev, i) => ({
          dist: (i / SAMPLE_POINTS) * totalM / 1000,
          elev,
        }))
        setProfile(data)
        setStatus('done')
      } catch (e: unknown) {
        setErrorMsg(e instanceof Error ? e.message : 'Error')
        setStatus('error')
      }
    })

    map.addInteraction(draw)
  }, [map])

  const stopDraw = useCallback(() => {
    if (!map || !drawRef.current) return
    map.removeInteraction(drawRef.current)
    drawRef.current = null
    setDrawing(false)
    setStatus('idle')
  }, [map])

  // SVG path for profile
  const svgProfile = () => {
    if (profile.length < 2) return null
    const W = 320, H = 90, PAD = 8
    const elevs = profile.map(p => p.elev)
    const minE = Math.min(...elevs), maxE = Math.max(...elevs)
    const rangeE = maxE - minE || 1
    const maxD = profile[profile.length - 1].dist

    const x = (d: number) => PAD + (d / maxD) * (W - PAD * 2)
    const y = (e: number) => H - PAD - ((e - minE) / rangeE) * (H - PAD * 2 - 10)

    const line = profile.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(p.dist).toFixed(1)},${y(p.elev).toFixed(1)}`).join(' ')
    const fill = `${line} L${x(maxD).toFixed(1)},${(H - PAD).toFixed(1)} L${PAD},${(H - PAD).toFixed(1)} Z`

    return { W, H, line, fill, minE, maxE, maxD }
  }

  const svg = svgProfile()

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        className="absolute bottom-12 left-3 z-30 w-80 pointer-events-auto
          panel-grid bg-[#1a2332]/96 border border-white/[0.12] rounded-sm shadow-xl backdrop-blur-sm overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.08]">
          <TrendingUp size={13} className="text-[#e8611a]" />
          <span className="text-[11px] font-semibold text-[#e8edf5] uppercase tracking-wide">
            {lang === 'fr' ? 'Profil altimétrique' : 'Elevation Profile'}
          </span>
          <button onClick={onClose} className="ml-auto text-[#546a80] hover:text-[#e8edf5] transition-colors">
            <X size={13} />
          </button>
        </div>

        <div className="px-3 py-3 space-y-3">
          {status === 'idle' && (
            <div className="space-y-2">
              <p className="text-[11px] text-[#8fa3bc]">
                {lang === 'fr'
                  ? 'Dessinez une ligne sur la carte (2 points) pour obtenir le profil altimétrique.'
                  : 'Draw a line on the map (2 points) to get the elevation profile.'}
              </p>
              <button onClick={startDraw}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium
                  bg-[#e8611a]/15 border border-[#e8611a]/40 text-[#e8611a]
                  hover:bg-[#e8611a]/25 rounded-sm transition-colors">
                <TrendingUp size={12} />
                {lang === 'fr' ? 'Tracer le profil' : 'Draw profile line'}
              </button>
            </div>
          )}

          {status === 'drawing' && (
            <div className="space-y-2">
              <p className="text-[11px] text-[#00b4a6]">
                {lang === 'fr' ? 'Cliquez sur le point de départ puis le point d\'arrivée.' : 'Click start point then end point on the map.'}
              </p>
              <button onClick={stopDraw}
                className="text-[10px] text-[#546a80] hover:text-[#e8611a] transition-colors">
                {lang === 'fr' ? 'Annuler' : 'Cancel'}
              </button>
            </div>
          )}

          {status === 'loading' && (
            <div className="flex items-center gap-2 py-2 text-[#8fa3bc]">
              <Loader2 size={14} className="animate-spin text-[#e8611a]" />
              <span className="text-[11px]">
                {lang === 'fr' ? 'Récupération des élévations…' : 'Fetching elevations…'}
              </span>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-2">
              <div className="flex items-start gap-1.5 text-[11px] text-[#e8611a]">
                <AlertTriangle size={12} className="mt-0.5 shrink-0" />
                <span>{lang === 'fr' ? 'Erreur de récupération des données.' : 'Failed to fetch elevation data.'}</span>
              </div>
              <button onClick={startDraw}
                className="text-[10px] text-[#8fa3bc] hover:text-[#e8edf5] transition-colors">
                {lang === 'fr' ? 'Réessayer' : 'Try again'}
              </button>
            </div>
          )}

          {status === 'done' && svg && (
            <div>
              <svg width={svg.W} height={svg.H} className="w-full" aria-label="Elevation profile chart">
                <defs>
                  <linearGradient id="elevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e8611a" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#e8611a" stopOpacity="0.03" />
                  </linearGradient>
                </defs>
                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map(f => (
                  <line key={f}
                    x1={8} y1={(svg.H - 8) - f * (svg.H - 18)}
                    x2={svg.W - 8} y2={(svg.H - 8) - f * (svg.H - 18)}
                    stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
                ))}
                <path d={svg.fill} fill="url(#elevGrad)" />
                <path d={svg.line} fill="none" stroke="#e8611a" strokeWidth={1.5} />
              </svg>
              <div className="flex justify-between text-[9px] font-mono text-[#546a80] mt-1">
                <span>0 km</span>
                <span className="text-[#e8edf5]">
                  {lang === 'fr' ? `Min: ${Math.round(svg.minE)}m  Max: ${Math.round(svg.maxE)}m` : `Min: ${Math.round(svg.minE)}m  Max: ${Math.round(svg.maxE)}m`}
                </span>
                <span>{svg.maxD.toFixed(1)} km</span>
              </div>
              <button onClick={startDraw}
                className="mt-2 text-[10px] text-[#8fa3bc] hover:text-[#e8edf5] transition-colors">
                {lang === 'fr' ? '↺ Nouveau profil' : '↺ New profile'}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
