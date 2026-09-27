import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X, GitBranch } from 'lucide-react'
import Map from 'ol/Map'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Feature from 'ol/Feature'
import LineString from 'ol/geom/LineString'
import Point from 'ol/geom/Point'
import { fromLonLat } from 'ol/proj'
import { Style, Stroke, Text, Fill, Circle as CircleStyle } from 'ol/style'
import { PLATE_BOUNDARIES, MAJOR_PLATES, BOUNDARY_COLORS, type BoundaryType } from '../data/tectonicPlates'

interface Props {
  map: Map | null
  onClose: () => void
}

const BOUNDARY_LABELS: Record<BoundaryType, { fr: string; en: string }> = {
  subduction: { fr: 'Subduction',  en: 'Subduction'  },
  divergent:  { fr: 'Divergente',  en: 'Divergent'   },
  transform:  { fr: 'Transformante', en: 'Transform'  },
  uncertain:  { fr: 'Incertaine',  en: 'Uncertain'   },
}

export default function TectonicOverlay({ map, onClose }: Props) {
  const { i18n } = useTranslation()
  const lang = i18n.language as 'fr' | 'en'
  const [opacity, setOpacity] = useState(0.85)
  const [showLabels, setShowLabels] = useState(true)
  const [filter, setFilter] = useState<Set<BoundaryType>>(new Set(['subduction','divergent','transform']))

  const sourceRef = useRef<VectorSource>(new VectorSource())
  const layerRef  = useRef<VectorLayer<VectorSource> | null>(null)
  const labelSrcRef = useRef<VectorSource>(new VectorSource())
  const labelLayerRef = useRef<VectorLayer<VectorSource> | null>(null)

  useEffect(() => {
    if (!map) return
    const layer = new VectorLayer({ source: sourceRef.current, zIndex: 75, opacity })
    const labelLayer = new VectorLayer({ source: labelSrcRef.current, zIndex: 76 })
    layerRef.current = layer
    labelLayerRef.current = labelLayer
    map.addLayer(layer)
    map.addLayer(labelLayer)
    return () => { map.removeLayer(layer); map.removeLayer(labelLayer) }
  }, [map])

  // Update opacity
  useEffect(() => { layerRef.current?.setOpacity(opacity) }, [opacity])

  // Rebuild features when filter changes
  useEffect(() => {
    sourceRef.current.clear()
    labelSrcRef.current.clear()

    PLATE_BOUNDARIES.filter(b => filter.has(b.type)).forEach(b => {
      // Safely convert coordinates
      const coords = b.coordinates
        .filter(c => Array.isArray(c) && c.length === 2)
        .map(c => fromLonLat(c as [number, number]))

      if (coords.length < 2) return

      const f = new Feature({ geometry: new LineString(coords) })
      const color = BOUNDARY_COLORS[b.type]
      f.setStyle(new Style({
        stroke: new Stroke({
          color,
          width: b.type === 'subduction' ? 3 : b.type === 'divergent' ? 2.5 : 2,
          lineDash: b.type === 'transform' ? [6, 3] : undefined,
        }),
      }))
      sourceRef.current.addFeature(f)
    })

    // Plate labels
    if (showLabels) {
      MAJOR_PLATES.forEach(p => {
        const f = new Feature({ geometry: new Point(fromLonLat([p.lon, p.lat])) })
        f.setStyle(new Style({
          text: new Text({
            text: lang === 'fr' ? p.nameFr : p.nameEn,
            font: '600 10px Inter, sans-serif',
            fill: new Fill({ color: 'rgba(255,255,255,0.6)' }),
            stroke: new Stroke({ color: 'rgba(10,15,30,0.8)', width: 3 }),
          }),
        }))
        labelSrcRef.current.addFeature(f)
      })
    }
  }, [filter, showLabels, lang])

  const toggleType = (t: BoundaryType) => {
    setFilter(prev => {
      const next = new Set(prev)
      next.has(t) ? next.delete(t) : next.add(t)
      return next
    })
  }

  const types: BoundaryType[] = ['subduction', 'divergent', 'transform']

  return (
    <div className="absolute left-3 bottom-16 z-20 w-64 pointer-events-auto
      panel-grid bg-[#1a2332]/96 border border-white/[0.1] rounded-sm
      backdrop-blur-sm shadow-xl overflow-hidden">

      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/[0.08]">
        <GitBranch size={13} className="text-[#a78bfa]" />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-[#e8edf5]">
          {lang === 'fr' ? 'Plaques tectoniques' : 'Tectonic Plates'}
        </span>
        <button onClick={onClose} className="ml-auto text-[#546a80] hover:text-[#e8edf5] transition-colors">
          <X size={13} />
        </button>
      </div>

      <div className="p-3 space-y-3">
        {/* Boundary type toggles */}
        <div className="space-y-1.5">
          {types.map(t => (
            <button key={t}
              onClick={() => toggleType(t)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-sm border text-[11px] transition-all
                ${filter.has(t)
                  ? 'border-white/15 bg-white/[0.05] text-[#e8edf5]'
                  : 'border-transparent text-[#546a80] hover:text-[#8fa3bc]'}`}>
              <span className="w-6 h-0.5 shrink-0 rounded"
                style={{
                  background: BOUNDARY_COLORS[t],
                  borderBottom: t === 'transform' ? `2px dashed ${BOUNDARY_COLORS[t]}` : 'none',
                  height: t === 'transform' ? 0 : 2,
                }} />
              {lang === 'fr' ? BOUNDARY_LABELS[t].fr : BOUNDARY_LABELS[t].en}
            </button>
          ))}
        </div>

        {/* Labels toggle */}
        <button onClick={() => setShowLabels(v => !v)}
          className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-sm border text-[11px] transition-all
            ${showLabels
              ? 'border-white/10 bg-white/[0.04] text-[#e8edf5]'
              : 'border-transparent text-[#546a80] hover:text-[#8fa3bc]'}`}>
          <span className="text-[10px]">🏷️</span>
          {lang === 'fr' ? 'Noms des plaques' : 'Plate names'}
        </button>

        {/* Opacity */}
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-[#546a80] w-12 shrink-0">
            {lang === 'fr' ? 'Opacité' : 'Opacity'}
          </span>
          <input type="range" min={0.2} max={1} step={0.05}
            value={opacity}
            onChange={e => setOpacity(Number(e.target.value))}
            className="flex-1 accent-[#a78bfa] h-1" />
          <span className="text-[9px] text-[#546a80] w-7 text-right">
            {Math.round(opacity * 100)}%
          </span>
        </div>

        <div className="text-[9px] text-[#546a80]">
          {lang === 'fr'
            ? 'Source: Bird (2003), modèle PB2002 simplifié'
            : 'Source: Bird (2003), simplified PB2002 model'}
        </div>
      </div>
    </div>
  )
}
