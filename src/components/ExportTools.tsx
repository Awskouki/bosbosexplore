import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Camera, FileJson, Loader2, Check } from 'lucide-react'
import Map from 'ol/Map'
import { toLonLat } from 'ol/proj'
import type { ActiveLayer } from '../hooks/useMap'

interface Props {
  map: Map | null
  activeLayers: ActiveLayer[]
}

export default function ExportTools({ map, activeLayers }: Props) {
  const { i18n } = useTranslation()
  const lang = i18n.language as 'fr' | 'en'
  const [screenshotStatus, setScreenshotStatus] = useState<'idle' | 'loading' | 'done'>('idle')
  const [geojsonStatus, setGeojsonStatus] = useState<'idle' | 'done'>('idle')

  async function exportScreenshot() {
    if (!map) return
    setScreenshotStatus('loading')
    try {
      map.once('rendercomplete', () => {
        const canvas = document.createElement('canvas')
        const mapEl = map.getTargetElement() as HTMLElement
        const size = map.getSize() ?? [800, 600]
        canvas.width = size[0]
        canvas.height = size[1]
        const ctx = canvas.getContext('2d')!

        // Draw all visible canvases (base map + WMS layers)
        mapEl.querySelectorAll<HTMLCanvasElement>('.ol-layer canvas').forEach(src => {
          if (src.width > 0) {
            ctx.globalAlpha = parseFloat(src.style.opacity || '1')
            const transform = src.style.transform
            if (transform) {
              const match = transform.match(/matrix\(([^)]+)\)/)
              if (match) {
                const m = match[1].split(',').map(Number)
                ctx.setTransform(m[0], m[1], m[2], m[3], m[4], m[5])
              }
            }
            ctx.drawImage(src, 0, 0)
            ctx.setTransform(1, 0, 0, 1, 0, 0)
          }
        })
        ctx.globalAlpha = 1

        // Watermark
        ctx.fillStyle = 'rgba(10,15,30,0.6)'
        ctx.fillRect(0, size[1] - 22, 180, 22)
        ctx.fillStyle = '#8fa3bc'
        ctx.font = '11px Inter, sans-serif'
        ctx.fillText('BosboSExplore — geology map', 8, size[1] - 7)

        const link = document.createElement('a')
        link.href = canvas.toDataURL('image/png')
        link.download = `bosbosexplore-${new Date().toISOString().slice(0,10)}.png`
        link.click()
        setScreenshotStatus('done')
        setTimeout(() => setScreenshotStatus('idle'), 2000)
      })
      map.renderSync()
    } catch {
      setScreenshotStatus('idle')
    }
  }

  function exportGeoJSON() {
    if (!map) return
    const view = map.getView()
    const extent = view.calculateExtent(map.getSize())
    const [minLon, minLat] = toLonLat([extent[0], extent[1]])
    const [maxLon, maxLat] = toLonLat([extent[2], extent[3]])

    const geojson = {
      type: 'FeatureCollection',
      metadata: {
        app: 'BosboSExplore',
        exported: new Date().toISOString(),
        zoom: view.getZoom(),
        center: toLonLat(view.getCenter()!),
        bbox: [minLon, minLat, maxLon, maxLat],
      },
      activeLayers: activeLayers.filter(l => l.visible).map(l => ({
        id: l.config.id,
        title: lang === 'fr' ? l.config.titleFr : l.config.titleEn,
        url: l.config.url,
        layer: l.config.layerName,
        opacity: l.opacity,
      })),
      features: [
        {
          type: 'Feature',
          properties: { type: 'viewport', zoom: view.getZoom() },
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [minLon, minLat], [maxLon, minLat],
              [maxLon, maxLat], [minLon, maxLat], [minLon, minLat],
            ]],
          },
        },
      ],
    }

    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/geo+json' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `bosbosexplore-bookmark-${new Date().toISOString().slice(0,10)}.geojson`
    link.click()
    URL.revokeObjectURL(link.href)
    setGeojsonStatus('done')
    setTimeout(() => setGeojsonStatus('idle'), 2000)
  }

  return (
    <div className="flex gap-1">
      <button
        onClick={exportScreenshot}
        disabled={screenshotStatus === 'loading'}
        title={lang === 'fr' ? 'Capture d\'écran PNG' : 'PNG Screenshot'}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] rounded-sm border transition-colors
          ${screenshotStatus === 'done'
            ? 'border-[#00b4a6]/40 bg-[#00b4a6]/10 text-[#00b4a6]'
            : 'border-white/[0.1] bg-[#1a2332]/80 text-[#8fa3bc] hover:text-[#e8edf5] hover:border-white/20'}`}
      >
        {screenshotStatus === 'loading' ? <Loader2 size={12} className="animate-spin" />
          : screenshotStatus === 'done' ? <Check size={12} />
          : <Camera size={12} />}
        <span className="hidden sm:inline">PNG</span>
      </button>

      <button
        onClick={exportGeoJSON}
        title={lang === 'fr' ? 'Exporter GeoJSON' : 'Export GeoJSON'}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] rounded-sm border transition-colors
          ${geojsonStatus === 'done'
            ? 'border-[#00b4a6]/40 bg-[#00b4a6]/10 text-[#00b4a6]'
            : 'border-white/[0.1] bg-[#1a2332]/80 text-[#8fa3bc] hover:text-[#e8edf5] hover:border-white/20'}`}
      >
        {geojsonStatus === 'done' ? <Check size={12} /> : <FileJson size={12} />}
        <span className="hidden sm:inline">GeoJSON</span>
      </button>
    </div>
  )
}
