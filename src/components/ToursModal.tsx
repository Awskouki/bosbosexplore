import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, ChevronLeft, Clock, Play, ArrowLeft } from 'lucide-react'
import { TOURS, type TourConfig } from '../tours.config'
import type { LayerConfig } from '../layers.config'
import { GEOLOGY_LAYERS } from '../layers.config'

interface Props {
  onClose: () => void
  onStartTour: (tour: TourConfig, stepIndex: number) => void
}

export default function ToursModal({ onClose, onStartTour }: Props) {
  const { i18n } = useTranslation()
  const lang = i18n.language as 'fr' | 'en'
  const [selected, setSelected] = useState<TourConfig | null>(null)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      role="dialog" aria-modal="true"
      aria-label={lang === 'fr' ? 'Tours guidés' : 'Guided Tours'}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        className="w-full max-w-2xl panel-grid bg-[#1a2332] border border-white/[0.12] rounded-sm shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.08] bg-[#0a0f1e]/40">
          {selected && (
            <button onClick={() => setSelected(null)}
              className="text-[#546a80] hover:text-[#e8edf5] transition-colors mr-1">
              <ArrowLeft size={16} />
            </button>
          )}
          <div>
            <h2 className="font-serif text-base font-semibold text-[#e8edf5]">
              {selected
                ? (lang === 'fr' ? selected.titleFr : selected.titleEn)
                : (lang === 'fr' ? 'Tours Guidés' : 'Guided Tours')}
            </h2>
            {selected && (
              <p className="text-[11px] text-[#8fa3bc] font-serif italic">
                {lang === 'fr' ? selected.subtitleFr : selected.subtitleEn}
              </p>
            )}
          </div>
          <button onClick={onClose}
            className="ml-auto text-[#546a80] hover:text-[#e8edf5] transition-colors">
            <X size={16} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {!selected ? (
            /* Tour list */
            <motion.div key="list"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
              className="p-4 grid grid-cols-1 gap-2"
            >
              {TOURS.map(tour => (
                <button key={tour.id} onClick={() => setSelected(tour)}
                  className="flex items-center gap-4 px-4 py-3 text-left
                    border border-white/[0.08] rounded-sm bg-white/[0.02]
                    hover:bg-white/[0.05] hover:border-white/[0.15] transition-all group">
                  <span className="text-2xl shrink-0">{tour.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-serif font-medium text-sm text-[#e8edf5] group-hover:text-white">
                      {lang === 'fr' ? tour.titleFr : tour.titleEn}
                    </div>
                    <div className="text-[11px] text-[#546a80] mt-0.5">
                      {lang === 'fr' ? tour.subtitleFr : tour.subtitleEn}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="flex items-center gap-1 text-[10px] text-[#546a80]">
                      <Clock size={10} />
                      {tour.duration}
                    </span>
                    <span className="text-[10px] text-[#546a80]">
                      {tour.steps.length} {lang === 'fr' ? 'étapes' : 'steps'}
                    </span>
                    <ChevronRight size={14} className="text-[#546a80] group-hover:text-[#e8611a] transition-colors" />
                  </div>
                </button>
              ))}
            </motion.div>
          ) : (
            /* Tour detail / step preview */
            <motion.div key="detail"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}
              className="p-4"
            >
              <div className="space-y-2 mb-4 max-h-72 overflow-y-auto pr-1">
                {selected.steps.map((step, i) => (
                  <div key={i}
                    className="flex items-start gap-3 px-3 py-2.5
                      border border-white/[0.07] rounded-sm bg-white/[0.02]">
                    <span className="shrink-0 w-5 h-5 flex items-center justify-center
                      rounded-full border border-[#e8611a]/40 text-[#e8611a] text-[10px] font-bold mt-0.5">
                      {i + 1}
                    </span>
                    <div>
                      <div className="text-[12px] font-serif font-medium text-[#e8edf5]">
                        {lang === 'fr' ? step.titleFr : step.titleEn}
                      </div>
                      <div className="text-[11px] text-[#546a80] mt-0.5 leading-relaxed line-clamp-2">
                        {lang === 'fr' ? step.bodyFr : step.bodyEn}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => { onStartTour(selected, 0); onClose() }}
                className="w-full flex items-center justify-center gap-2 py-3
                  bg-[#e8611a] hover:bg-[#e8611a]/90 text-white
                  font-semibold text-sm rounded-sm transition-colors"
              >
                <Play size={14} />
                {lang === 'fr' ? `Commencer le tour — ${selected.titleFr}` : `Start Tour — ${selected.titleEn}`}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
