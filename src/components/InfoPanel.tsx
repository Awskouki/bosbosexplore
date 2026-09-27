import { useTranslation } from 'react-i18next'
import { X, Loader2, MapPin, ExternalLink, AlertTriangle } from 'lucide-react'
import { lookupRock } from '../rockDescriptions'
import type { ActiveLayer } from '../hooks/useMap'
import type { ClickInfo } from './MapView'

import type { RockCategory } from './RockFilter'
import { ROCK_CATEGORIES } from '../data/rockCategories'
import { AGE_KEYWORDS, TIMESCALE } from '../data/timescale'

interface Props {
  clickInfo: ClickInfo
  activeLayers: ActiveLayer[]
  onClose: () => void
  rockFilter?: RockCategory
  selectedPeriod?: string | null
}

export default function InfoPanel({ clickInfo, activeLayers, onClose, rockFilter = 'all', selectedPeriod = null }: Props) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as 'fr' | 'en'

  const getLayerTitle = (id: string) => {
    const al = activeLayers.find(l => l.config.id === id)
    if (!al) return id
    return lang === 'fr' ? al.config.titleFr : al.config.titleEn
  }

  const extractRockHint = (html: string): string | null => {
    const match = html.match(/<td[^>]*>([^<]{3,50})<\/td>/i)
    return match ? match[1].trim() : null
  }

  // Check if HTML matches the selected rock filter
  const matchesRockFilter = (html: string): boolean => {
    if (rockFilter === 'all') return true
    const cat = ROCK_CATEGORIES.find(c => c.id === rockFilter)
    if (!cat) return true
    const lower = html.toLowerCase()
    const keywords = lang === 'fr' ? cat.keywordsFr : cat.keywordsEn
    return keywords.some(k => lower.includes(k))
  }

  // Check if HTML matches the selected period
  const matchesPeriod = (html: string): boolean => {
    if (!selectedPeriod) return true
    const keywords = AGE_KEYWORDS[selectedPeriod] ?? []
    const lower = html.toLowerCase()
    return keywords.some(k => lower.includes(k))
  }

  // Get period info for display
  const getPeriodMatch = (html: string) => {
    const lower = html.toLowerCase()
    for (const [periodId, keywords] of Object.entries(AGE_KEYWORDS)) {
      if (keywords.some(k => lower.includes(k))) {
        return TIMESCALE.find(u => u.id === periodId) ?? null
      }
    }
    return null
  }

  const filteredResults = clickInfo.results.filter(r =>
    matchesRockFilter(r.html) && matchesPeriod(r.html)
  )

  return (
    <div className="h-full flex flex-col panel-grid
      bg-[#1a2332]/95 border border-white/[0.1] rounded-sm
      backdrop-blur-sm overflow-hidden">

      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/[0.08] shrink-0">
        <MapPin size={14} className="text-[#00b4a6]" aria-hidden="true" />
        <span className="text-xs font-semibold text-[#e8edf5] tracking-wide uppercase">
          Inspection
        </span>
        <button
          onClick={onClose}
          className="ml-auto text-[#546a80] hover:text-[#e8edf5] transition-colors"
          aria-label="Fermer l'inspection"
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        {/* Coordinates */}
        <div className="border border-white/[0.08] rounded-sm px-3 py-2 bg-[#0a0f1e]/40">
          <div className="text-[9px] uppercase tracking-widest text-[#546a80] mb-1">
            {t('coordinates')}
          </div>
          <div className="font-mono text-[12px] text-[#00b4a6]">
            {clickInfo.lonLat[0].toFixed(5)}°N &nbsp;
            {clickInfo.lonLat[1].toFixed(5)}°E
          </div>
        </div>

        {/* Loading */}
        {clickInfo.loading && (
          <div className="flex items-center gap-2 py-4 justify-center text-[#8fa3bc]">
            <Loader2 size={16} className="animate-spin text-[#00b4a6]" />
            <span className="text-[11px]">{t('loading')}</span>
          </div>
        )}

        {/* No results */}
        {!clickInfo.loading && filteredResults.length === 0 && (
          <div className="flex items-start gap-2 py-3 px-2 text-[#546a80]">
            <AlertTriangle size={13} className="mt-0.5 shrink-0" />
            <p className="text-[11px]">
              {clickInfo.results.length > 0
                ? (lang === 'fr' ? 'Aucun résultat ne correspond aux filtres actifs.' : 'No results match the active filters.')
                : t('noInfo')}
            </p>
          </div>
        )}

        {/* Results per layer */}
        {filteredResults.map((result, i) => {
          const hint = extractRockHint(result.html)
          const desc = hint ? lookupRock(hint) : null
          const period = getPeriodMatch(result.html)

          return (
            <div key={i} className="border border-white/[0.08] rounded-sm overflow-hidden">
              {/* Layer title */}
              <div className="bg-[#0a0f1e]/50 px-3 py-1.5 border-b border-white/[0.06]">
                <span className="text-[10px] font-medium text-[#8fa3bc] uppercase tracking-wide">
                  {getLayerTitle(result.layerId)}
                </span>
              </div>

              {/* Enriched description if we matched a rock type */}
              {desc && (
                <div className="px-3 py-2 space-y-1.5 border-b border-white/[0.06]">
                  {hint && (
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-[#546a80]">
                        {t('rockType')}
                      </span>
                      <p className="text-xs font-serif text-[#e8edf5] capitalize">{hint}</p>
                    </div>
                  )}
                  {period && (
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: period.color }} />
                      <span className="text-[10px] text-[#8fa3bc]">
                        {lang === 'fr' ? period.nameFr : period.nameEn}
                        {' '}({period.startMa}–{period.endMa} Ma)
                      </span>
                    </div>
                  )}
                  <p className="text-[11px] text-[#8fa3bc] leading-relaxed">
                    {lang === 'fr' ? desc.fr : desc.en}
                  </p>
                  {desc[`wikiSlug${lang === 'fr' ? 'Fr' : 'En'}` as 'wikiSlugFr'|'wikiSlugEn'] && (
                    <a
                      href={`https://${lang}.wikipedia.org/wiki/${desc[lang === 'fr' ? 'wikiSlugFr' : 'wikiSlugEn']}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] text-[#00b4a6]
                        hover:text-[#e8edf5] transition-colors"
                    >
                      {t('learnMore')}
                      <ExternalLink size={9} />
                    </a>
                  )}
                </div>
              )}

              {/* Raw WMS HTML response */}
              <div
                className="px-3 py-2 text-[10px] text-[#8fa3bc] overflow-x-auto max-h-40 overflow-y-auto
                  [&_table]:w-full [&_td]:py-0.5 [&_th]:py-0.5 [&_td]:pr-2 [&_th]:text-left
                  [&_th]:text-[#546a80] [&_a]:text-[#00b4a6]"
                dangerouslySetInnerHTML={{ __html: result.html }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
