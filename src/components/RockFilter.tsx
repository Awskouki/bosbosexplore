import { useTranslation } from 'react-i18next'
import { X, Layers } from 'lucide-react'
import { ROCK_CATEGORIES, type RockCategory } from '../data/rockCategories'

export type { RockCategory }

interface Props {
  selected: RockCategory
  onSelect: (cat: RockCategory) => void
  onClose: () => void
}

export default function RockFilter({ selected, onSelect, onClose }: Props) {
  const { i18n } = useTranslation()
  const lang = i18n.language as 'fr' | 'en'

  return (
    <div className="w-72 pointer-events-auto
      panel-grid bg-[#1a2332]/96 border border-white/[0.1] rounded-sm
      backdrop-blur-sm shadow-xl overflow-hidden">

      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/[0.08]">
        <Layers size={13} className="text-[#e8611a]" />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-[#e8edf5]">
          {lang === 'fr' ? 'Filtre lithologique' : 'Lithology Filter'}
        </span>
        <button onClick={onClose} className="ml-auto text-[#546a80] hover:text-[#e8edf5] transition-colors">
          <X size={13} />
        </button>
      </div>

      <div className="p-2 grid grid-cols-2 gap-1.5">
        {/* All rocks option */}
        <button
          onClick={() => onSelect('all')}
          className={`col-span-2 flex items-center gap-2 px-3 py-2 rounded-sm border text-[11px] transition-all
            ${selected === 'all'
              ? 'border-white/25 bg-white/[0.08] text-[#e8edf5]'
              : 'border-white/[0.08] text-[#8fa3bc] hover:bg-white/[0.04] hover:text-[#e8edf5]'}`}
        >
          <span>🌍</span>
          <span className="font-medium">{lang === 'fr' ? 'Toutes les roches' : 'All rock types'}</span>
        </button>

        {ROCK_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`flex items-center gap-2 px-2.5 py-2 rounded-sm border text-[11px] transition-all
              ${selected === cat.id
                ? 'border-white/25 bg-white/[0.06] text-[#e8edf5]'
                : 'border-white/[0.07] text-[#8fa3bc] hover:bg-white/[0.04] hover:text-[#e8edf5]'}`}
          >
            <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: cat.color }} />
            <span className="font-medium leading-tight text-left">
              {lang === 'fr' ? cat.labelFr : cat.labelEn}
            </span>
          </button>
        ))}
      </div>

      <div className="px-3 pb-2.5">
        <p className="text-[9px] text-[#546a80] leading-relaxed">
          {selected !== 'all'
            ? (lang === 'fr'
                ? 'Filtre actif — cliquez sur la carte pour inspecter.'
                : 'Filter active — click the map to inspect.')
            : (lang === 'fr'
                ? 'Filtre les résultats d\'inspection par type de roche.'
                : 'Filters inspection results by rock type.')}
        </p>
      </div>
    </div>
  )
}
