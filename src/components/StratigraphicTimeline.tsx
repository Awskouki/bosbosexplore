import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, X, ChevronRight } from 'lucide-react'
import { TIMESCALE, PERIODS, ERAS, type ChronoUnit } from '../data/timescale'

interface Props {
  selectedPeriodId: string | null
  onSelectPeriod: (id: string | null) => void
  onClose: () => void
}

export default function StratigraphicTimeline({ selectedPeriodId, onSelectPeriod, onClose }: Props) {
  const { i18n } = useTranslation()
  const lang = i18n.language as 'fr' | 'en'
  const [hovered, setHovered] = useState<string | null>(null)

  const selected = selectedPeriodId
    ? TIMESCALE.find(u => u.id === selectedPeriodId) ?? null
    : null

  const totalSpan = 538 // Ma shown (Phanerozoic only for display)

  function barHeight(unit: ChronoUnit) {
    const span = unit.startMa - unit.endMa
    return Math.max(8, (span / totalSpan) * 420)
  }

  return (
    <div className="absolute left-3 top-14 bottom-16 z-20 w-52 pointer-events-auto
      panel-grid bg-[#1a2332]/96 border border-white/[0.1] rounded-sm
      backdrop-blur-sm flex flex-col overflow-hidden shadow-2xl">

      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/[0.08] shrink-0">
        <Clock size={13} className="text-[#00b4a6]" />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-[#e8edf5]">
          {lang === 'fr' ? 'Échelle stratigraphique' : 'Stratigraphic Scale'}
        </span>
        <button onClick={onClose} className="ml-auto text-[#546a80] hover:text-[#e8edf5] transition-colors">
          <X size={13} />
        </button>
      </div>

      {/* Active filter badge */}
      {selected && (
        <div className="flex items-center gap-2 px-3 py-1.5 border-b border-white/[0.06] shrink-0"
          style={{ borderLeftColor: selected.color, borderLeftWidth: 3 }}>
          <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: selected.color }} />
          <span className="text-[11px] text-[#e8edf5] font-medium flex-1 truncate">
            {lang === 'fr' ? selected.nameFr : selected.nameEn}
          </span>
          <button onClick={() => onSelectPeriod(null)}
            className="text-[#546a80] hover:text-[#e8611a] transition-colors shrink-0">
            <X size={11} />
          </button>
        </div>
      )}

      {/* Timeline bars */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-2 py-2">

          {/* Precambrian summary row */}
          <button
            onClick={() => onSelectPeriod(selectedPeriodId === 'archean' ? null : 'archean')}
            className={`w-full flex items-center gap-2 px-2 py-1.5 mb-1 rounded-sm border transition-all
              ${selectedPeriodId === 'archean' ? 'border-white/20 bg-white/[0.06]' : 'border-transparent hover:bg-white/[0.04]'}`}
          >
            <span className="w-3 h-5 rounded-sm shrink-0" style={{ background: '#F0C4A2' }} />
            <div className="text-left">
              <div className="text-[10px] font-medium text-[#e8edf5]">
                {lang === 'fr' ? 'Précambrien' : 'Precambrian'}
              </div>
              <div className="text-[8px] text-[#546a80]">4600 – 538 Ma</div>
            </div>
          </button>

          <div className="text-[8px] uppercase tracking-widest text-[#546a80] px-1 mb-1">
            — {lang === 'fr' ? 'Phanérozoïque' : 'Phanerozoic'} —
          </div>

          {/* Era → Period nested layout */}
          {ERAS.map(era => {
            const periods = PERIODS.filter(p => p.parentId === era.id)
            return (
              <div key={era.id} className="mb-1">
                {/* Era label */}
                <div className="flex items-center gap-1 px-1 mb-0.5">
                  <span className="w-2 h-2 rounded-sm" style={{ background: era.color }} />
                  <span className="text-[9px] uppercase tracking-wider text-[#8fa3bc] font-semibold">
                    {lang === 'fr' ? era.nameFr : era.nameEn}
                  </span>
                </div>

                {/* Period rows */}
                {periods.map(p => {
                  const isSelected = selectedPeriodId === p.id
                  const isHovered = hovered === p.id
                  const h = barHeight(p)
                  return (
                    <motion.button
                      key={p.id}
                      onClick={() => onSelectPeriod(isSelected ? null : p.id)}
                      onMouseEnter={() => setHovered(p.id)}
                      onMouseLeave={() => setHovered(null)}
                      whileHover={{ x: 2 }}
                      className={`w-full flex items-stretch gap-2 mb-px rounded-sm border transition-all
                        ${isSelected
                          ? 'border-white/25 bg-white/[0.08]'
                          : 'border-transparent hover:bg-white/[0.04]'
                        }`}
                      style={{ minHeight: Math.max(24, h * 0.12) }}
                      aria-pressed={isSelected}
                    >
                      {/* Color bar */}
                      <span
                        className="w-3 shrink-0 rounded-sm"
                        style={{
                          background: p.color,
                          minHeight: Math.max(24, h * 0.12),
                          opacity: isSelected ? 1 : isHovered ? 0.9 : 0.75,
                        }}
                      />
                      <div className="flex-1 text-left py-1 pr-1">
                        <div className={`text-[10px] font-medium leading-tight
                          ${isSelected ? 'text-white' : 'text-[#e8edf5]'}`}>
                          {lang === 'fr' ? p.nameFr : p.nameEn}
                        </div>
                        <div className="text-[8px] text-[#546a80]">
                          {p.startMa} – {p.endMa === 0 ? '0' : p.endMa} Ma
                        </div>
                      </div>
                      {isSelected && <ChevronRight size={10} className="text-[#e8611a] self-center mr-1 shrink-0" />}
                    </motion.button>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer hint */}
      <div className="px-3 py-2 border-t border-white/[0.06] shrink-0">
        <p className="text-[9px] text-[#546a80] leading-relaxed">
          {selected
            ? (lang === 'fr'
                ? `Filtre actif : inspection limitée aux roches ${lang === 'fr' ? selected.nameFr : selected.nameEn}.`
                : `Active filter: inspection limited to ${selected.nameEn} rocks.`)
            : (lang === 'fr'
                ? 'Sélectionnez une période pour filtrer l\'inspection. Cliquez sur la carte pour voir les données.'
                : 'Select a period to filter inspection. Click the map to see data.')}
        </p>
      </div>
    </div>
  )
}
