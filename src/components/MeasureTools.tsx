import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Ruler, Pentagon, Trash2, X } from 'lucide-react'
import Map from 'ol/Map'
import Draw from 'ol/interaction/Draw'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { getLength, getArea } from 'ol/sphere'
import { Style, Fill, Stroke, Circle as CircleStyle } from 'ol/style'
import type { Geometry } from 'ol/geom'
import type { DrawEvent } from 'ol/interaction/Draw'

interface Props {
  map: Map | null
}

type MeasureMode = 'none' | 'line' | 'polygon'

function formatLength(meters: number): string {
  if (meters >= 1000) return `${(meters / 1000).toFixed(2)} km`
  return `${Math.round(meters)} m`
}

function formatArea(sqMeters: number): string {
  if (sqMeters >= 1_000_000) return `${(sqMeters / 1_000_000).toFixed(2)} km²`
  return `${Math.round(sqMeters)} m²`
}

const DRAW_STYLE = new Style({
  fill: new Fill({ color: 'rgba(0,180,166,0.12)' }),
  stroke: new Stroke({ color: '#00b4a6', width: 2, lineDash: [6, 3] }),
  image: new CircleStyle({
    radius: 5,
    fill: new Fill({ color: '#00b4a6' }),
    stroke: new Stroke({ color: '#0a0f1e', width: 1.5 }),
  }),
})

export default function MeasureTools({ map }: Props) {
  const { i18n } = useTranslation()
  const lang = i18n.language as 'fr' | 'en'

  const [mode, setMode] = useState<MeasureMode>('none')
  const [measurements, setMeasurements] = useState<string[]>([])

  const vectorSourceRef = useRef<VectorSource>(new VectorSource())
  const vectorLayerRef = useRef<VectorLayer<VectorSource> | null>(null)
  const drawRef = useRef<Draw | null>(null)

  // Mount vector layer
  useEffect(() => {
    if (!map) return
    const layer = new VectorLayer({
      source: vectorSourceRef.current,
      style: DRAW_STYLE,
      zIndex: 50,
    })
    vectorLayerRef.current = layer
    map.addLayer(layer)
    return () => { map.removeLayer(layer) }
  }, [map])

  // Start/stop draw interaction
  useEffect(() => {
    if (!map) return
    // Remove existing draw
    if (drawRef.current) {
      map.removeInteraction(drawRef.current)
      drawRef.current = null
    }
    if (mode === 'none') return

    const draw = new Draw({
      source: vectorSourceRef.current,
      type: mode === 'line' ? 'LineString' : 'Polygon',
      style: DRAW_STYLE,
    })

    draw.on('drawend', (evt: DrawEvent) => {
      const geom: Geometry = evt.feature.getGeometry()!
      let result = ''
      if (mode === 'line') {
        // getLength returns meters
        const len = getLength(geom as Parameters<typeof getLength>[0])
        result = formatLength(len)
      } else {
        const area = getArea(geom as Parameters<typeof getArea>[0])
        result = formatArea(area)
      }
      setMeasurements(prev => [result, ...prev].slice(0, 8))
    })

    map.addInteraction(draw)
    drawRef.current = draw

    return () => {
      map.removeInteraction(draw)
      drawRef.current = null
    }
  }, [map, mode])

  const clearAll = () => {
    vectorSourceRef.current.clear()
    setMeasurements([])
  }

  const labels = {
    line:    { fr: 'Mesurer distance',  en: 'Measure distance' },
    polygon: { fr: 'Mesurer surface',   en: 'Measure area' },
    clear:   { fr: 'Effacer',           en: 'Clear' },
    stop:    { fr: 'Arrêter',           en: 'Stop' },
  }

  return (
    <div className="flex flex-col gap-1">
      {/* Tool buttons */}
      <div className="flex gap-1">
        <button
          onClick={() => setMode(mode === 'line' ? 'none' : 'line')}
          title={labels.line[lang]}
          aria-pressed={mode === 'line'}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] rounded-sm border transition-colors
            ${mode === 'line'
              ? 'bg-[#00b4a6]/15 border-[#00b4a6]/40 text-[#00b4a6]'
              : 'bg-[#1a2332]/80 border-white/[0.1] text-[#8fa3bc] hover:text-[#e8edf5] hover:border-white/20'}`}
        >
          <Ruler size={12} />
          <span className="hidden sm:inline">{labels.line[lang]}</span>
        </button>

        <button
          onClick={() => setMode(mode === 'polygon' ? 'none' : 'polygon')}
          title={labels.polygon[lang]}
          aria-pressed={mode === 'polygon'}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] rounded-sm border transition-colors
            ${mode === 'polygon'
              ? 'bg-[#00b4a6]/15 border-[#00b4a6]/40 text-[#00b4a6]'
              : 'bg-[#1a2332]/80 border-white/[0.1] text-[#8fa3bc] hover:text-[#e8edf5] hover:border-white/20'}`}
        >
          <Pentagon size={12} />
          <span className="hidden sm:inline">{labels.polygon[lang]}</span>
        </button>

        {measurements.length > 0 && (
          <button onClick={clearAll} title={labels.clear[lang]}
            className="flex items-center gap-1 px-2 py-1.5 text-[10px] rounded-sm border
              border-white/[0.1] text-[#546a80] hover:text-[#e8611a] hover:border-[#e8611a]/40 transition-colors">
            <Trash2 size={11} />
          </button>
        )}
      </div>

      {/* Active mode hint */}
      {mode !== 'none' && (
        <div className="flex items-center gap-2 px-2 py-1 bg-[#00b4a6]/10 border border-[#00b4a6]/20 rounded-sm">
          <span className="text-[10px] text-[#00b4a6] flex-1">
            {mode === 'line'
              ? (lang === 'fr' ? 'Cliquez pour tracer. Double-cliquez pour terminer.' : 'Click to draw. Double-click to finish.')
              : (lang === 'fr' ? 'Cliquez pour tracer. Double-cliquez pour fermer.' : 'Click to draw. Double-click to close.')}
          </span>
          <button onClick={() => setMode('none')}
            className="text-[#546a80] hover:text-[#e8edf5] transition-colors">
            <X size={11} />
          </button>
        </div>
      )}

      {/* Results */}
      {measurements.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-0.5">
          {measurements.map((m, i) => (
            <span key={i}
              className="px-2 py-0.5 bg-[#0a0f1e]/60 border border-white/[0.08] rounded-sm
                text-[10px] font-mono text-[#00b4a6]">
              {m}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
