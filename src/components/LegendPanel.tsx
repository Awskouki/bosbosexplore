import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BookOpen, ChevronDown, ChevronRight, X, AlertTriangle, Loader2 } from 'lucide-react'
import type { ActiveLayer } from '../hooks/useMap'

interface Props {
  activeLayers: ActiveLayer[]
  onClose: () => void
}

interface LegendEntry {
  layerId: string
  url: string
  status: 'loading' | 'loaded' | 'error'
}

function buildLegendUrl(layer: ActiveLayer): string {
  const params = new URLSearchParams({
    SERVICE: 'WMS',
    VERSION: layer.config.version,
    REQUEST: 'GetLegendGraphic',
    FORMAT: 'image/png',
    LAYER: layer.config.layerName,
    TRANSPARENT: 'true',
    STYLE: '',
  })
  return `${layer.config.url}?${params.toString()}`
}

export default function LegendPanel({ activeLayers, onClose }: Props) {
  const { i18n } = useTranslation()
  const lang = i18n.language as 'fr' | 'en'
  const [expanded, setExpanded] = useState<Set<string>>(new Set(activeLayers.map(l => l.config.id)))
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set())

  const toggle = (id: string) =>
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const visibleLayers = activeLayers.filter(l => l.visible)

  return (
    <div className="absolute right-3 top-3 bottom-16 w-64 z-20 pointer-events-auto
      panel-grid bg-[#1a2332]/95 border border-white/[0.1] rounded-sm backdrop-blur-sm
      flex flex-col overflow-hidden">

      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/[0.08] shrink-0">
        <BookOpen size={13} className="text-[#00b4a6]" aria-hidden="true" />
        <span className="text-xs font-semibold text-[#e8edf5] tracking-wide uppercase">
          {lang === 'fr' ? 'Légendes' : 'Legends'}
        </span>
        <button onClick={onClose}
          className="ml-auto text-[#546a80] hover:text-[#e8edf5] transition-colors">
          <X size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {visibleLayers.length === 0 && (
          <p className="text-[11px] text-[#546a80] px-2 py-4 text-center">
            {lang === 'fr' ? 'Aucune couche visible.' : 'No visible layers.'}
          </p>
        )}
        {visibleLayers.map(layer => {
          const title = lang === 'fr' ? layer.config.titleFr : layer.config.titleEn
          const isOpen = expanded.has(layer.config.id)
          const hasError = imgErrors.has(layer.config.id)
          const legendUrl = buildLegendUrl(layer)

          return (
            <div key={layer.config.id}
              className="border border-white/[0.08] rounded-sm overflow-hidden">
              <button
                onClick={() => toggle(layer.config.id)}
                className="w-full flex items-center gap-2 px-2 py-2 text-left hover:bg-white/[0.03] transition-colors"
              >
                {isOpen ? <ChevronDown size={11} className="text-[#546a80] shrink-0" /> : <ChevronRight size={11} className="text-[#546a80] shrink-0" />}
                <span className="text-[11px] text-[#e8edf5] font-medium truncate flex-1">{title}</span>
              </button>

              {isOpen && (
                <div className="px-2 pb-2 bg-[#0a0f1e]/30">
                  {hasError ? (
                    <div className="flex items-center gap-1.5 py-2 text-[10px] text-[#546a80]">
                      <AlertTriangle size={11} className="text-[#e8611a] shrink-0" />
                      {lang === 'fr' ? 'Légende non disponible' : 'Legend not available'}
                    </div>
                  ) : (
                    <div className="relative min-h-8">
                      {/* Loading state via CSS — the img onError handles failure */}
                      <img
                        src={legendUrl}
                        alt={`Legend: ${title}`}
                        className="max-w-full h-auto rounded-sm bg-white/[0.03]"
                        crossOrigin="anonymous"
                        onError={() => setImgErrors(prev => new Set(prev).add(layer.config.id))}
                        loading="lazy"
                        style={{ imageRendering: 'crisp-edges' }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
