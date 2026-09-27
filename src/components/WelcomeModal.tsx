import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Globe, Layers, MousePointer, Lightbulb } from 'lucide-react'

interface Props {
  onClose: () => void
}

export default function WelcomeModal({ onClose }: Props) {
  const { t } = useTranslation()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      role="dialog" aria-modal="true" aria-labelledby="welcome-title">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 8 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="w-full max-w-lg panel-grid
          bg-[#1a2332] border border-white/[0.12] rounded-sm shadow-2xl overflow-hidden"
      >
        {/* Header band */}
        <div className="bg-[#0a0f1e]/60 border-b border-white/[0.08] px-6 py-5">
          <div className="flex items-center gap-3 mb-2">
            <Globe size={24} className="text-[#e8611a]" aria-hidden="true" />
            <h1 id="welcome-title" className="font-serif text-xl font-semibold text-[#e8edf5]">
              {t('welcome.title')}
            </h1>
          </div>
          <p className="text-sm text-[#8fa3bc] font-serif italic">
            {t('welcome.subtitle')}
          </p>
        </div>

        {/* Two-column body */}
        <div className="grid grid-cols-2 gap-0 divide-x divide-white/[0.06] px-0">
          <div className="px-5 py-4">
            <div className="flex items-center gap-2 mb-2">
              <Layers size={13} className="text-[#00b4a6]" aria-hidden="true" />
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-[#00b4a6]">
                {t('welcome.whatTitle')}
              </h2>
            </div>
            <p className="text-[12px] text-[#8fa3bc] leading-relaxed">
              {t('welcome.whatBody')}
            </p>
          </div>
          <div className="px-5 py-4">
            <div className="flex items-center gap-2 mb-2">
              <MousePointer size={13} className="text-[#00b4a6]" aria-hidden="true" />
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-[#00b4a6]">
                {t('welcome.howTitle')}
              </h2>
            </div>
            <p className="text-[12px] text-[#8fa3bc] leading-relaxed">
              {t('welcome.howBody')}
            </p>
          </div>
        </div>

        {/* Tip */}
        <div className="mx-5 mb-4 flex items-start gap-2 bg-[#0a0f1e]/50 border border-[#00b4a6]/20 rounded-sm px-3 py-2.5">
          <Lightbulb size={13} className="text-[#00b4a6] mt-0.5 shrink-0" aria-hidden="true" />
          <p className="text-[11px] text-[#8fa3bc]">{t('welcome.tip')}</p>
        </div>

        {/* CTA */}
        <div className="px-5 pb-5">
          <button
            onClick={onClose}
            className="w-full py-3 bg-[#e8611a] hover:bg-[#e8611a]/90 text-white
              font-semibold text-sm rounded-sm transition-colors tracking-wide"
            autoFocus
          >
            {t('welcome.start')}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
