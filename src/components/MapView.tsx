import { useRef, useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, TrendingUp, Clock, Layers, Zap, GitBranch,
  BookMarked, Columns, Globe, ChevronDown,
} from 'lucide-react'
import { useMap } from '../hooks/useMap'
import LayersPanel from './LayersPanel'
import InfoPanel from './InfoPanel'
import MapControls from './MapControls'
import MeasureTools from './MeasureTools'
import LegendPanel from './LegendPanel'
import ExportTools from './ExportTools'
import ElevationProfile from './ElevationProfile'
import TourOverlay from './TourOverlay'
import SearchBar from './SearchBar'
import StratigraphicTimeline from './StratigraphicTimeline'
import RockFilter, { type RockCategory } from './RockFilter'
import SeismicLayer from './SeismicLayer'
import TectonicOverlay from './TectonicOverlay'
import FieldNotes from './FieldNotes'
import CompareMode from './CompareMode'
import Globe3D from './Globe3D'
import { toLonLat } from 'ol/proj'
import type { Coordinate } from 'ol/coordinate'
import type { TourConfig } from '../tours.config'
import { GEOLOGY_LAYERS } from '../layers.config'

interface Props {
  visible: boolean
  activeTour: { tour: TourConfig; stepIndex: number } | null
  onTourNext: () => void
  onTourPrev: () => void
  onTourClose: () => void
}

export interface ClickInfo {
  lonLat: [number, number]
  pixel: [number, number]
  results: Array<{ layerId: string; html: string }>
  loading: boolean
}

type RightPanel = 'info' | 'legend' | 'seismic' | 'fieldnotes' | null
type LeftExtra  = 'timeline' | 'rockfilter' | 'tectonic' | null

export default function MapView({ visible, activeTour, onTourNext, onTourPrev, onTourClose }: Props) {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)
  const {
    map,
    basemap, setBasemap,
    activeLayers, toggleLayerVisibility, setLayerOpacity, removeLayer, addLayer,
    mouseCoords, zoom, ripple,
    zoomToHome, zoomToExtent, flyTo,
    onMapClick, getFeatureInfo,
  } = useMap(containerRef)

  // Panel state
  const [layersPanelOpen, setLayersPanelOpen]     = useState(true)
  const [rightPanel, setRightPanel]               = useState<RightPanel>(null)
  const [leftExtra, setLeftExtra]                 = useState<LeftExtra>(null)
  const [elevationOpen, setElevationOpen]         = useState(false)
  const [compareOpen, setCompareOpen]             = useState(false)
  const [globeOpen, setGlobeOpen]                 = useState(false)
  const [showEarthquakes, setShowEarthquakes]     = useState(true)
  const [showVolcanoes, setShowVolcanoes]         = useState(false)
  const [selectedPeriod, setSelectedPeriod]       = useState<string | null>(null)
  const [rockFilter, setRockFilter]               = useState<RockCategory>('all')
  const [clickInfo, setClickInfo]                 = useState<ClickInfo | null>(null)
  const [moreMenuOpen, setMoreMenuOpen]           = useState(false)

  const toggleRight = (panel: RightPanel) =>
    setRightPanel(prev => prev === panel ? null : panel)
  const toggleLeft = (panel: LeftExtra) =>
    setLeftExtra(prev => prev === panel ? null : panel)

  // Fly to tour step
  useEffect(() => {
    if (!activeTour) return
    const step = activeTour.tour.steps[activeTour.stepIndex]
    flyTo(step.lon, step.lat, step.zoom)
    if (step.layerIds) {
      step.layerIds.forEach(lid => {
        if (!activeLayers.some(l => l.config.id === lid)) {
          const cfg = GEOLOGY_LAYERS.find(l => l.id === lid)
          if (cfg) addLayer(cfg)
        }
      })
    }
  }, [activeTour?.tour.id, activeTour?.stepIndex])

  // Map click → inspect
  useEffect(() => {
    const unsub = onMapClick(async (coord: Coordinate, pixel: [number, number]) => {
      const ll = toLonLat(coord) as [number, number]
      setClickInfo({ lonLat: [ll[1], ll[0]], pixel, results: [], loading: true })
      setRightPanel('info')
      const results = await getFeatureInfo(coord, pixel)
      setClickInfo(prev => prev ? { ...prev, results, loading: false } : null)
    })
    return unsub
  }, [onMapClick, getFeatureInfo])

  const closeInfo = useCallback(() => {
    setRightPanel(null)
    setClickInfo(null)
  }, [])

  if (globeOpen) {
    return <Globe3D onClose={() => setGlobeOpen(false)} />
  }

  if (compareOpen && map) {
    return <CompareMode mainView={map.getView()} onClose={() => setCompareOpen(false)} />
  }

  return (
    <div
      className={`absolute inset-0 top-14 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      aria-hidden={!visible}
    >
      <div ref={containerRef} className="absolute inset-0" />

      {/* Click ripple */}
      <AnimatePresence>
        {ripple && (
          <motion.div key={ripple.key} className="map-ripple"
            style={{ left: ripple.x, top: ripple.y }}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }} />
        )}
      </AnimatePresence>

      {/* ── Top toolbar ─────────────────────────────────────────────────────── */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 pointer-events-auto flex-wrap justify-center">
        <SearchBar onFlyTo={flyTo} />
        <MeasureTools map={map} />
        <ExportTools map={map} activeLayers={activeLayers} />

        {/* Legend */}
        <ToolbarBtn icon={<BookOpen size={12} />} label="Légendes" active={rightPanel === 'legend'}
          onClick={() => toggleRight('legend')} color="teal" />

        {/* Elevation */}
        <ToolbarBtn icon={<TrendingUp size={12} />} label="Élévation" active={elevationOpen}
          onClick={() => setElevationOpen(v => !v)} color="orange" />

        {/* Timeline */}
        <ToolbarBtn icon={<Clock size={12} />} label="Stratigraphie" active={leftExtra === 'timeline'}
          onClick={() => toggleLeft('timeline')} color="teal" />

        {/* Rock filter */}
        <ToolbarBtn icon={<Layers size={12} />} label="Lithologie" active={leftExtra === 'rockfilter'}
          onClick={() => toggleLeft('rockfilter')} color="orange" />

        {/* Tectonic */}
        <ToolbarBtn icon={<GitBranch size={12} />} label="Tectonique" active={leftExtra === 'tectonic'}
          onClick={() => toggleLeft('tectonic')} color="purple" />

        {/* Seismic */}
        <ToolbarBtn icon={<Zap size={12} />} label="Séismes" active={rightPanel === 'seismic'}
          onClick={() => toggleRight('seismic')} color="orange" />

        {/* Field notes */}
        <ToolbarBtn icon={<BookMarked size={12} />} label="Notes" active={rightPanel === 'fieldnotes'}
          onClick={() => toggleRight('fieldnotes')} color="purple" />

        {/* More menu */}
        <div className="relative">
          <button
            onClick={() => setMoreMenuOpen(v => !v)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] rounded-sm border
              border-white/[0.1] bg-[#1a2332]/80 text-[#8fa3bc]
              hover:text-[#e8edf5] hover:border-white/20 transition-colors">
            <ChevronDown size={11} className={moreMenuOpen ? 'rotate-180' : ''} />
          </button>
          <AnimatePresence>
            {moreMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.12 }}
                className="absolute top-full right-0 mt-1 w-44 bg-[#1a2332]/98 border border-white/[0.12]
                  rounded-sm shadow-xl backdrop-blur-sm z-50 overflow-hidden"
              >
                <button onClick={() => { setCompareOpen(true); setMoreMenuOpen(false) }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[11px] text-[#8fa3bc]
                    hover:text-[#e8edf5] hover:bg-white/[0.05] transition-colors">
                  <Columns size={12} />
                  Mode comparaison
                </button>
                <button onClick={() => { setGlobeOpen(true); setMoreMenuOpen(false) }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[11px] text-[#8fa3bc]
                    hover:text-[#e8edf5] hover:bg-white/[0.05] transition-colors">
                  <Globe size={12} />
                  Globe 3D
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Left panels ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {layersPanelOpen && (
          <motion.div key="layers"
            initial={{ x: -320, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute left-3 top-14 bottom-16 w-72 z-20 pointer-events-auto">
            <LayersPanel
              activeLayers={activeLayers}
              onToggleVisibility={toggleLayerVisibility}
              onSetOpacity={setLayerOpacity}
              onRemove={removeLayer}
              onAdd={addLayer}
              onClose={() => setLayersPanelOpen(false)}
              onZoomToExtent={zoomToExtent}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {!layersPanelOpen && (
        <button onClick={() => setLayersPanelOpen(true)}
          className="absolute left-3 top-14 z-20 px-3 py-2 text-xs font-medium
            bg-[#1a2332]/90 border border-white/[0.12] text-[#8fa3bc]
            hover:text-[#e8edf5] hover:border-white/20 transition-colors rounded-sm">
          {t('layers')}
        </button>
      )}

      {/* Stratigraphic timeline — replaces left panel when open */}
      <AnimatePresence>
        {leftExtra === 'timeline' && (
          <motion.div key="timeline"
            initial={{ x: -260, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            exit={{ x: -260, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute left-3 top-14 bottom-16 z-25 pointer-events-auto">
            <StratigraphicTimeline
              selectedPeriodId={selectedPeriod}
              onSelectPeriod={setSelectedPeriod}
              onClose={() => setLeftExtra(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rock filter — bottom-left */}
      <AnimatePresence>
        {leftExtra === 'rockfilter' && (
          <motion.div key="rockfilter"
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="absolute left-3 bottom-10 z-25 pointer-events-auto">
            <RockFilter selected={rockFilter} onSelect={setRockFilter} onClose={() => setLeftExtra(null)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tectonic overlay controls — bottom-left */}
      <AnimatePresence>
        {leftExtra === 'tectonic' && (
          <motion.div key="tectonic"
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="absolute left-3 bottom-10 z-25 pointer-events-auto">
            <TectonicOverlay map={map} onClose={() => setLeftExtra(null)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Right panels ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {rightPanel === 'info' && clickInfo && (
          <motion.div key="info"
            initial={{ x: 340, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            exit={{ x: 340, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute right-3 top-14 bottom-16 w-80 z-20 pointer-events-auto">
            <InfoPanel
              clickInfo={clickInfo}
              activeLayers={activeLayers}
              onClose={closeInfo}
              rockFilter={rockFilter}
              selectedPeriod={selectedPeriod}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {rightPanel === 'legend' && (
          <motion.div key="legend"
            initial={{ x: 280, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            exit={{ x: 280, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute right-3 top-14 bottom-16 z-20 pointer-events-auto">
            <LegendPanel activeLayers={activeLayers} onClose={() => setRightPanel(null)} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {rightPanel === 'seismic' && (
          <motion.div key="seismic"
            initial={{ x: 290, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            exit={{ x: 290, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute right-3 bottom-10 z-20 pointer-events-auto">
            <SeismicLayer
              map={map}
              showEarthquakes={showEarthquakes}
              showVolcanoes={showVolcanoes}
              onToggleEarthquakes={() => setShowEarthquakes(v => !v)}
              onToggleVolcanoes={() => setShowVolcanoes(v => !v)}
              onClose={() => setRightPanel(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {rightPanel === 'fieldnotes' && (
          <motion.div key="fieldnotes"
            initial={{ x: 290, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            exit={{ x: 290, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute right-3 top-14 bottom-16 z-20 pointer-events-auto">
            <FieldNotes map={map} onClose={() => setRightPanel(null)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Elevation profile */}
      <AnimatePresence>
        {elevationOpen && (
          <ElevationProfile map={map} onClose={() => setElevationOpen(false)} />
        )}
      </AnimatePresence>

      {/* Tour overlay */}
      <AnimatePresence>
        {activeTour && (
          <TourOverlay
            tour={activeTour.tour}
            stepIndex={activeTour.stepIndex}
            onNext={onTourNext}
            onPrev={onTourPrev}
            onClose={onTourClose}
          />
        )}
      </AnimatePresence>

      <MapControls basemap={basemap} onSetBasemap={setBasemap} onZoomHome={zoomToHome} onFlyTo={flyTo} />

      {/* Status bar */}
      <div className="absolute bottom-0 left-0 right-0 h-8 z-10
        bg-[#0a0f1e]/80 border-t border-white/[0.06]
        flex items-center px-4 gap-4 text-[10px] font-mono text-[#546a80]">
        {mouseCoords && (
          <span>{mouseCoords[0].toFixed(5)}°N &nbsp;{mouseCoords[1].toFixed(5)}°E</span>
        )}
        {selectedPeriod && (
          <span className="text-[#00b4a6]">
            ⏱ {selectedPeriod}
          </span>
        )}
        {rockFilter !== 'all' && (
          <span className="text-[#e8611a]">
            🪨 {rockFilter}
          </span>
        )}
        <span className="ml-auto">z {zoom.toFixed(1)}</span>
        <span className="hidden sm:block">EPSG:3857</span>
      </div>

      {!rightPanel && !activeTour && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10
          px-3 py-1 bg-[#1a2332]/70 border border-white/[0.08] rounded-sm
          text-[10px] font-mono text-[#546a80] pointer-events-none select-none">
          {t('clickForInfo')}
        </div>
      )}
    </div>
  )
}

function ToolbarBtn({ icon, label, active, onClick, color }: {
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
  color: 'orange' | 'teal' | 'purple'
}) {
  const colors = {
    orange: 'border-[#e8611a]/40 bg-[#e8611a]/10 text-[#e8611a]',
    teal:   'border-[#00b4a6]/40 bg-[#00b4a6]/10 text-[#00b4a6]',
    purple: 'border-[#a78bfa]/40 bg-[#a78bfa]/10 text-[#a78bfa]',
  }
  return (
    <button onClick={onClick}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] rounded-sm border transition-colors
        ${active
          ? colors[color]
          : 'border-white/[0.1] bg-[#1a2332]/80 text-[#8fa3bc] hover:text-[#e8edf5] hover:border-white/20'}`}>
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}
