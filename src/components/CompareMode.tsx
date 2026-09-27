import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Columns, X } from 'lucide-react'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import OSM from 'ol/source/OSM'
import ImageLayer from 'ol/layer/Image'
import ImageWMS from 'ol/source/ImageWMS'
import { BASEMAPS, GEOLOGY_LAYERS } from '../layers.config'

interface Props {
  mainView: View
  onClose: () => void
}

type PanelContent = 'street' | 'topo' | 'satellite' | string  // string = layer id

export default function CompareMode({ mainView, onClose }: Props) {
  const { i18n } = useTranslation()
  const lang = i18n.language as 'fr' | 'en'

  const leftRef  = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const leftMapRef  = useRef<Map | null>(null)
  const rightMapRef = useRef<Map | null>(null)
  const syncRef = useRef(false)

  const [leftContent,  setLeftContent]  = useState<PanelContent>('street')
  const [rightContent, setRightContent] = useState<PanelContent>('cgmw-world-50m')
  const [dividerX, setDividerX] = useState(50) // percent

  function makeBaseLayer(key: PanelContent) {
    if (key === 'street')    return new TileLayer({ source: new OSM() })
    if (key === 'topo')      return new TileLayer({ source: new XYZ({ url: BASEMAPS.topo.url }) })
    if (key === 'satellite') return new TileLayer({ source: new XYZ({ url: BASEMAPS.satellite.url }) })
    // geology layer
    const cfg = GEOLOGY_LAYERS.find(l => l.id === key)
    if (!cfg) return new TileLayer({ source: new OSM() })
    return new ImageLayer({
      source: new ImageWMS({
        url: cfg.url,
        params: { LAYERS: cfg.layerName, FORMAT: 'image/png', TRANSPARENT: 'true' },
        crossOrigin: 'anonymous',
      }),
    })
  }

  useEffect(() => {
    if (!leftRef.current || !rightRef.current) return

    const center = mainView.getCenter() ?? [0, 0]
    const zoom   = mainView.getZoom() ?? 3

    const leftMap  = new Map({ target: leftRef.current,  layers: [makeBaseLayer(leftContent)],  view: new View({ center, zoom }), controls: [] })
    const rightMap = new Map({ target: rightRef.current, layers: [makeBaseLayer(rightContent)], view: new View({ center, zoom }), controls: [] })

    leftMapRef.current  = leftMap
    rightMapRef.current = rightMap

    // Sync views
    const syncViews = (source: Map, target: Map) => {
      if (syncRef.current) return
      syncRef.current = true
      const v = source.getView()
      target.getView().animate({ center: v.getCenter(), zoom: v.getZoom(), rotation: v.getRotation(), duration: 0 })
      syncRef.current = false
    }

    leftMap.on('moveend',  () => syncViews(leftMap,  rightMap))
    rightMap.on('moveend', () => syncViews(rightMap, leftMap))

    return () => {
      leftMap.setTarget(undefined)
      rightMap.setTarget(undefined)
    }
  }, [leftContent, rightContent])

  const PANEL_OPTIONS = [
    { value: 'street',    label: { fr: 'OpenStreetMap',   en: 'OpenStreetMap' } },
    { value: 'topo',      label: { fr: 'OpenTopoMap',     en: 'OpenTopoMap' } },
    { value: 'satellite', label: { fr: 'Satellite Esri',  en: 'Esri Satellite' } },
    ...GEOLOGY_LAYERS.slice(0, 6).map(l => ({
      value: l.id,
      label: { fr: l.titleFr, en: l.titleEn },
    })),
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 top-14 z-40 flex flex-col bg-[#0a0f1e]"
    >
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-2 bg-[#1a2332]/95 border-b border-white/[0.08] shrink-0">
        <Columns size={14} className="text-[#00b4a6]" />
        <span className="text-[11px] font-semibold text-[#e8edf5] uppercase tracking-widest">
          {lang === 'fr' ? 'Mode comparaison' : 'Compare Mode'}
        </span>

        {/* Left picker */}
        <div className="flex items-center gap-1.5 ml-4">
          <span className="text-[9px] text-[#546a80] uppercase tracking-wider">
            {lang === 'fr' ? 'Gauche' : 'Left'}
          </span>
          <select value={leftContent} onChange={e => setLeftContent(e.target.value)}
            className="bg-[#0a0f1e] border border-white/[0.1] text-[#e8edf5] text-[11px]
              rounded-sm px-2 py-1 focus:outline-none focus:border-[#00b4a6]/50 max-w-40">
            {PANEL_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>
                {lang === 'fr' ? o.label.fr : o.label.en}
              </option>
            ))}
          </select>
        </div>

        {/* Right picker */}
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] text-[#546a80] uppercase tracking-wider">
            {lang === 'fr' ? 'Droite' : 'Right'}
          </span>
          <select value={rightContent} onChange={e => setRightContent(e.target.value)}
            className="bg-[#0a0f1e] border border-white/[0.1] text-[#e8edf5] text-[11px]
              rounded-sm px-2 py-1 focus:outline-none focus:border-[#00b4a6]/50 max-w-40">
            {PANEL_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>
                {lang === 'fr' ? o.label.fr : o.label.en}
              </option>
            ))}
          </select>
        </div>

        <button onClick={onClose}
          className="ml-auto flex items-center gap-1.5 px-2.5 py-1.5 text-[11px]
            border border-white/[0.1] text-[#8fa3bc] hover:text-[#e8edf5] hover:border-white/20
            rounded-sm transition-colors">
          <X size={12} />
          {lang === 'fr' ? 'Quitter' : 'Exit'}
        </button>
      </div>

      {/* Two map panels */}
      <div className="flex-1 flex relative overflow-hidden">
        <div ref={leftRef}  className="flex-1 h-full" style={{ width: `${dividerX}%` }} />
        {/* Divider */}
        <div className="absolute top-0 bottom-0 z-10 flex flex-col items-center justify-center cursor-col-resize select-none"
          style={{ left: `calc(${dividerX}% - 12px)`, width: 24 }}
          onMouseDown={(e) => {
            const startX = e.clientX
            const startPct = dividerX
            const container = e.currentTarget.closest('.flex') as HTMLElement
            const w = container?.offsetWidth ?? 1
            const onMove = (me: MouseEvent) => {
              const delta = (me.clientX - startX) / w * 100
              setDividerX(Math.min(80, Math.max(20, startPct + delta)))
            }
            const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
            window.addEventListener('mousemove', onMove)
            window.addEventListener('mouseup', onUp)
          }}>
          <div className="w-0.5 h-full bg-[#00b4a6]/60" />
          <div className="absolute w-6 h-10 bg-[#1a2332] border border-[#00b4a6]/50 rounded-sm flex items-center justify-center">
            <span className="text-[#00b4a6] text-[14px]">⟺</span>
          </div>
        </div>
        <div ref={rightRef} className="flex-1 h-full" style={{ width: `${100 - dividerX}%` }} />
        {/* Labels */}
        <div className="absolute top-2 left-3 px-2 py-1 text-[9px] text-[#546a80] bg-[#0a0f1e]/70 rounded-sm pointer-events-none">
          {PANEL_OPTIONS.find(o => o.value === leftContent)?.label[lang] ?? leftContent}
        </div>
        <div className="absolute top-2 right-3 px-2 py-1 text-[9px] text-[#546a80] bg-[#0a0f1e]/70 rounded-sm pointer-events-none">
          {PANEL_OPTIONS.find(o => o.value === rightContent)?.label[lang] ?? rightContent}
        </div>
      </div>
    </motion.div>
  )
}
