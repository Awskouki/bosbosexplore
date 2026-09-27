import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, MapPin } from 'lucide-react'
import type { TourConfig } from '../tours.config'

interface Props {
  tour: TourConfig
  stepIndex: number
  onNext: () => void
  onPrev: () => void
  onClose: () => void
}

export default function TourOverlay({ tour, stepIndex, onNext, onPrev, onClose }: Props) {
  const { i18n } = useTranslation()
  const lang = i18n.language as 'fr' | 'en'
  const step = tour.steps[stepIndex]
  const total = tour.steps.length
  const isLast = stepIndex === total - 1
  const isFirst = stepIndex === 0

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 w-full max-w-xl px-3 pointer-events-auto"
    >
      <div className="panel-grid bg-[#1a2332]/96 border border-white/[0.14] rounded-sm shadow-2xl backdrop-blur-sm overflow-hidden">

        {/* Tour header */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-white/[0.08] bg-[#0a0f1e]/40">
          <span className="text-base">{tour.emoji}</span>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#e8611a]">
            {lang === 'fr' ? tour.titleFr : tour.titleEn}
          </span>
          {/* Progress dots */}
          <div className="flex items-center gap-1 ml-auto mr-2">
            {tour.steps.map((_, i) => (
              <span key={i}
                className={`rounded-full transition-all duration-300 ${
                  i === stepIndex
                    ? 'w-4 h-1.5 bg-[#e8611a]'
                    : i < stepIndex
                    ? 'w-1.5 h-1.5 bg-[#e8611a]/40'
                    : 'w-1.5 h-1.5 bg-white/[0.12]'
                }`} />
            ))}
          </div>
          <button onClick={onClose}
            className="text-[#546a80] hover:text-[#e8edf5] transition-colors">
            <X size={13} />
          </button>
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div key={stepIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="px-4 py-3"
          >
            <div className="flex items-start gap-2 mb-2">
              <MapPin size={13} className="text-[#00b4a6] mt-0.5 shrink-0" />
              <h3 className="font-serif font-semibold text-sm text-[#e8edf5] leading-snug">
                {lang === 'fr' ? step.titleFr : step.titleEn}
              </h3>
            </div>
            <p className="text-[12px] text-[#8fa3bc] leading-relaxed pl-5">
              {lang === 'fr' ? step.bodyFr : step.bodyEn}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-t border-white/[0.08]">
          <span className="text-[10px] text-[#546a80] font-mono">
            {stepIndex + 1} / {total}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={onPrev} disabled={isFirst}
              className={`flex items-center gap-1 px-3 py-1.5 text-[11px] rounded-sm border transition-colors
                ${isFirst
                  ? 'border-white/[0.05] text-[#546a80]/40 cursor-not-allowed'
                  : 'border-white/[0.12] text-[#8fa3bc] hover:text-[#e8edf5] hover:border-white/20'}`}>
              <ChevronLeft size={12} />
              {lang === 'fr' ? 'Préc.' : 'Prev'}
            </button>
            {isLast ? (
              <button onClick={onClose}
                className="flex items-center gap-1 px-3 py-1.5 text-[11px] rounded-sm
                  bg-[#e8611a] text-white hover:bg-[#e8611a]/90 transition-colors font-medium">
                {lang === 'fr' ? 'Terminer' : 'Finish'}
              </button>
            ) : (
              <button onClick={onNext}
                className="flex items-center gap-1 px-3 py-1.5 text-[11px] rounded-sm
                  bg-[#e8611a]/15 border border-[#e8611a]/40 text-[#e8611a]
                  hover:bg-[#e8611a]/25 transition-colors font-medium">
                {lang === 'fr' ? 'Suiv.' : 'Next'}
                <ChevronRight size={12} />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
