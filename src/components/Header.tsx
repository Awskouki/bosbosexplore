import type React from 'react'
import { useTranslation } from 'react-i18next'
import { Globe, Map, Compass, Info } from 'lucide-react'
import type { View } from '../types'

interface Props {
  currentView: string
  onNavigate: (v: View) => void
  onToggleLang: () => void
  activeTour?: boolean
}

export default function Header({ currentView, onNavigate, onToggleLang, activeTour }: Props) {
  const { t, i18n } = useTranslation()

  return (
    <header className="absolute top-0 left-0 right-0 z-40 h-14 flex items-center px-4 gap-6
      bg-[#1a2332]/90 border-b border-white/[0.08] backdrop-blur-sm">

      {/* Logo */}
      <button className="flex items-center gap-2 group"
        onClick={() => onNavigate('map')} aria-label="BosboSExplore — accueil">
        <Globe size={22} className="text-[#e8611a] group-hover:rotate-12 transition-transform duration-300" aria-hidden="true" />
        <span className="font-serif font-semibold text-[#e8edf5] text-base tracking-tight leading-none">
          BosboS<span className="text-[#00b4a6]">Explore</span>
        </span>
      </button>

      {/* Tagline */}
      <span className="hidden md:block text-[11px] font-mono text-[#546a80] border-l border-white/[0.08] pl-4 leading-tight uppercase tracking-widest">
        {t('tagline')}
      </span>

      {/* Tour active indicator */}
      {activeTour && (
        <span className="hidden sm:flex items-center gap-1.5 px-2 py-1 text-[10px]
          bg-[#e8611a]/10 border border-[#e8611a]/30 text-[#e8611a] rounded-sm font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[#e8611a] animate-pulse" />
          {i18n.language === 'fr' ? 'Tour en cours' : 'Tour active'}
        </span>
      )}

      {/* Nav */}
      <nav className="ml-auto flex items-center gap-1" aria-label="Navigation principale">
        <NavBtn icon={<Map size={14} />} label={t('nav.map')} active={currentView === 'map'} onClick={() => onNavigate('map')} />
        <NavBtn icon={<Compass size={14} />} label={t('nav.tours')} active={currentView === 'tours'} onClick={() => onNavigate('tours')} />
        <NavBtn icon={<Info size={14} />} label={t('nav.about')} active={currentView === 'about'} onClick={() => onNavigate('about')} />
      </nav>

      {/* Lang toggle */}
      <button onClick={onToggleLang}
        className="ml-2 px-2.5 py-1 text-[11px] font-medium tracking-widest uppercase
          border border-white/[0.14] rounded-sm text-[#8fa3bc]
          hover:border-[#00b4a6] hover:text-[#00b4a6] transition-colors duration-150"
        aria-label={`Switch to ${i18n.language === 'fr' ? 'English' : 'French'}`}>
        {t('langToggle')}
      </button>
    </header>
  )
}

function NavBtn({ icon, label, active, onClick }: {
  icon: React.ReactNode; label: string; active: boolean; onClick: () => void
}) {
  return (
    <button onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium transition-colors duration-150
        ${active
          ? 'bg-[#e8611a]/15 text-[#e8611a] border border-[#e8611a]/30'
          : 'text-[#8fa3bc] border border-transparent hover:text-[#e8edf5] hover:bg-white/[0.05]'}`}
      aria-current={active ? 'page' : undefined}>
      {icon}
      {label}
    </button>
  )
}
