import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Layers, Eye, EyeOff, ZoomIn, Trash2, Plus, X,
  Loader2, AlertTriangle, CheckCircle2, ChevronDown, ChevronRight,
} from 'lucide-react'
import type { ActiveLayer } from '../hooks/useMap'
import type { LayerConfig } from '../layers.config'
import { GEOLOGY_LAYERS, LAYER_GROUPS } from '../layers.config'
import AddWMSModal from './AddWMSModal'

interface Props {
  activeLayers: ActiveLayer[]
  onToggleVisibility: (id: string) => void
  onSetOpacity: (id: string, opacity: number) => void
  onRemove: (id: string) => void
  onAdd: (config: LayerConfig) => void
  onClose: () => void
  onZoomToExtent: (bbox: [number, number, number, number]) => void
}

export default function LayersPanel({
  activeLayers, onToggleVisibility, onSetOpacity,
  onRemove, onAdd, onClose, onZoomToExtent,
}: Props) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as 'fr' | 'en'

  const [showAddModal, setShowAddModal] = useState(false)
  const [showPresetPicker, setShowPresetPicker] = useState(false)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ global: true, africa: true })

  const activeIds = new Set(activeLayers.map(l => l.config.id))
  const availablePresets = GEOLOGY_LAYERS.filter(l => !activeIds.has(l.id))

  // Group available presets
  const groupedPresets: Record<string, LayerConfig[]> = {}
  for (const l of availablePresets) {
    const g = l.group ?? 'other'
    if (!groupedPresets[g]) groupedPresets[g] = []
    groupedPresets[g].push(l)
  }

  const toggleGroup = (g: string) =>
    setOpenGroups(prev => ({ ...prev, [g]: !prev[g] }))

  return (
    <>
      <div className="h-full flex flex-col panel-grid
        bg-[#1a2332]/95 border border-white/[0.1] rounded-sm
        backdrop-blur-sm overflow-hidden">

        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/[0.08] shrink-0">
          <Layers size={14} className="text-[#e8611a]" aria-hidden="true" />
          <span className="text-xs font-semibold text-[#e8edf5] tracking-wide uppercase">
            {t('layers')}
          </span>
          <span className="ml-1 text-[9px] text-[#546a80] bg-white/[0.05] px-1.5 py-0.5 rounded-sm">
            {activeLayers.length}
          </span>
          <button
            onClick={onClose}
            className="ml-auto text-[#546a80] hover:text-[#e8edf5] transition-colors"
            aria-label="Fermer le panneau"
          >
            <X size={14} />
          </button>
        </div>

        {/* Active layer list */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
          {activeLayers.length === 0 && (
            <p className="text-[11px] text-[#546a80] px-2 py-4 text-center">
              {lang === 'fr' ? 'Aucune couche active.' : 'No active layers.'}
            </p>
          )}
          {activeLayers.map(layer => (
            <LayerRow
              key={layer.config.id}
              layer={layer}
              lang={lang}
              onToggle={() => onToggleVisibility(layer.config.id)}
              onOpacity={v => onSetOpacity(layer.config.id, v)}
              onRemove={() => onRemove(layer.config.id)}
              onZoom={() => layer.config.bbox && onZoomToExtent(layer.config.bbox)}
            />
          ))}
        </div>

        {/* Footer: add layers */}
        <div className="border-t border-white/[0.08] p-2 space-y-1 shrink-0">
          {/* Preset picker — grouped by region */}
          {availablePresets.length > 0 && (
            <div>
              <button
                onClick={() => setShowPresetPicker(v => !v)}
                className="w-full flex items-center justify-between gap-1.5 px-2 py-1.5 text-[11px]
                  text-[#8fa3bc] hover:text-[#e8edf5] hover:bg-white/[0.04] rounded-sm transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Plus size={12} />
                  {lang === 'fr' ? 'Ajouter couche prédéfinie' : 'Add preset layer'}
                </span>
                {showPresetPicker ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
              </button>

              {showPresetPicker && (
                <div className="mt-1 bg-[#0a0f1e]/80 border border-white/[0.1] rounded-sm max-h-64 overflow-y-auto">
                  {Object.entries(groupedPresets).map(([groupKey, layers]) => {
                    const groupMeta = LAYER_GROUPS[groupKey]
                    const isOpen = openGroups[groupKey] ?? false
                    return (
                      <div key={groupKey}>
                        <button
                          onClick={() => toggleGroup(groupKey)}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-[10px] font-semibold
                            uppercase tracking-widest text-[#546a80] hover:text-[#8fa3bc]
                            hover:bg-white/[0.03] transition-colors border-b border-white/[0.05]"
                        >
                          <span>{groupMeta?.emoji}</span>
                          <span>{lang === 'fr' ? groupMeta?.labelFr : groupMeta?.labelEn}</span>
                          <span className="ml-auto text-[9px] opacity-50">{layers.length}</span>
                          {isOpen ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
                        </button>
                        {isOpen && layers.map(l => (
                          <button
                            key={l.id}
                            onClick={() => { onAdd(l); setShowPresetPicker(false) }}
                            className="w-full text-left pl-6 pr-3 py-1.5 text-[11px] text-[#8fa3bc]
                              hover:text-[#e8edf5] hover:bg-white/[0.05] transition-colors"
                          >
                            {lang === 'fr' ? l.titleFr : l.titleEn}
                          </button>
                        ))}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Custom WMS */}
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full flex items-center gap-1.5 px-2 py-1.5 text-[11px]
              text-[#00b4a6] hover:text-[#e8edf5] hover:bg-[#00b4a6]/10 rounded-sm transition-colors"
          >
            <Plus size={12} />
            {t('addLayer')}
          </button>
        </div>
      </div>

      {showAddModal && (
        <AddWMSModal
          onAdd={(config) => { onAdd(config); setShowAddModal(false) }}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </>
  )
}

function LayerRow({
  layer, lang, onToggle, onOpacity, onRemove, onZoom,
}: {
  layer: ActiveLayer
  lang: 'fr' | 'en'
  onToggle: () => void
  onOpacity: (v: number) => void
  onRemove: () => void
  onZoom: () => void
}) {
  const { t } = useTranslation()
  const title = lang === 'fr' ? layer.config.titleFr : layer.config.titleEn
  const groupMeta = layer.config.group ? LAYER_GROUPS[layer.config.group] : null

  return (
    <div className={`rounded-sm border transition-colors
      ${layer.visible
        ? 'border-white/[0.1] bg-white/[0.02]'
        : 'border-transparent bg-transparent opacity-50'}`}>
      <div className="flex items-center gap-1.5 px-2 py-1.5">
        {/* Status indicator */}
        <span className="shrink-0 w-3">
          {layer.status === 'loading' && <Loader2 size={10} className="text-[#00b4a6] animate-spin" />}
          {layer.status === 'error'   && <AlertTriangle size={10} className="text-[#e8611a]" />}
          {layer.status === 'loaded'  && <CheckCircle2 size={10} className="text-[#00b4a6]" />}
          {layer.status === 'idle'    && <span className="w-2 h-2 rounded-full bg-[#546a80]/40 inline-block" />}
        </span>

        <div className="flex-1 min-w-0">
          <div className="text-[11px] text-[#e8edf5] truncate font-medium leading-tight">
            {title}
          </div>
          {groupMeta && (
            <div className="text-[9px] text-[#546a80]">
              {lang === 'fr' ? groupMeta.labelFr : groupMeta.labelEn}
            </div>
          )}
        </div>

        <div className="flex items-center gap-0.5 shrink-0">
          {layer.config.bbox && (
            <button onClick={onZoom}
              className="p-0.5 text-[#546a80] hover:text-[#00b4a6] transition-colors"
              aria-label={t('zoomToExtent')} title={t('zoomToExtent')}>
              <ZoomIn size={11} />
            </button>
          )}
          <button onClick={onToggle}
            className="p-0.5 text-[#546a80] hover:text-[#e8edf5] transition-colors"
            aria-label={layer.visible ? 'Masquer' : 'Afficher'}>
            {layer.visible ? <Eye size={11} /> : <EyeOff size={11} />}
          </button>
          <button onClick={onRemove}
            className="p-0.5 text-[#546a80] hover:text-[#e8611a] transition-colors"
            aria-label={t('removeLayer')}>
            <Trash2 size={11} />
          </button>
        </div>
      </div>

      {layer.visible && (
        <div className="px-2 pb-1.5 flex items-center gap-2">
          <span className="text-[9px] text-[#546a80] w-12 shrink-0">{t('opacity')}</span>
          <input
            type="range" min={0} max={1} step={0.05}
            value={layer.opacity}
            onChange={e => onOpacity(Number(e.target.value))}
            className="flex-1 accent-[#e8611a] h-1"
            aria-label={`Opacité de ${title}`}
          />
          <span className="text-[9px] text-[#546a80] w-7 text-right shrink-0">
            {Math.round(layer.opacity * 100)}%
          </span>
        </div>
      )}

      <div className="px-2 pb-1">
        <span className="text-[9px] text-[#546a80]/60">{layer.config.attribution}</span>
      </div>
    </div>
  )
}
