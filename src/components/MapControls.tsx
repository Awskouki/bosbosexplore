import type React from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Home, Satellite, Map, Mountain, ChevronDown } from 'lucide-react'
import type { BasemapKey } from '../hooks/useMap'

interface Props {
  basemap: BasemapKey
  onSetBasemap: (key: BasemapKey) => void
  onZoomHome: () => void
  onFlyTo: (lon: number, lat: number, zoom: number) => void
}

const BASEMAP_OPTIONS: { key: BasemapKey; icon: React.ReactNode; labelKey: string }[] = [
  { key: 'street',    icon: <Map size={12} />,      labelKey: 'basemap.street' },
  { key: 'topo',      icon: <Mountain size={12} />,  labelKey: 'basemap.topo' },
  { key: 'satellite', icon: <Satellite size={12} />, labelKey: 'basemap.satellite' },
]

/** Quick-access regions with fly-to coordinates */
const QUICK_REGIONS = [
  { labelFr: 'Monde',          labelEn: 'World',         lon: 15,   lat: 20,  zoom: 2.5 },
  { labelFr: 'Tunisie',        labelEn: 'Tunisia',       lon: 9.5,  lat: 33.8, zoom: 7  },
  { labelFr: 'Algérie',        labelEn: 'Algeria',       lon: 2.6,  lat: 28.0, zoom: 5  },
  { labelFr: 'Maroc',          labelEn: 'Morocco',       lon: -6.0, lat: 32.0, zoom: 6  },
  { labelFr: 'Égypte',         labelEn: 'Egypt',         lon: 30.0, lat: 26.8, zoom: 6  },
  { labelFr: 'France',         labelEn: 'France',        lon: 2.3,  lat: 46.2, zoom: 6  },
  { labelFr: 'Himalaya',       labelEn: 'Himalayas',     lon: 85.0, lat: 28.0, zoom: 6  },
  { labelFr: 'Afrique du Sud', labelEn: 'South Africa',  lon: 25.0, lat: -29.0,zoom: 5  },
  { labelFr: 'Japon',          labelEn: 'Japan',         lon: 138,  lat: 36,   zoom: 6  },
  { labelFr: 'USA',            labelEn: 'USA',           lon: -98,  lat: 39,   zoom: 4  },
  { labelFr: 'Australie',      labelEn: 'Australia',     lon: 134,  lat: -26,  zoom: 4  },
  { labelFr: 'Brésil',         labelEn: 'Brazil',        lon: -52,  lat: -10,  zoom: 4  },
]

export default function MapControls({ basemap, onSetBasemap, onZoomHome, onFlyTo }: Props) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as 'fr' | 'en'
  const [regionsOpen, setRegionsOpen] = useState(false)

  return (
    <div className="absolute bottom-10 right-3 z-20 flex flex-col gap-1.5 items-end">

      {/* Quick regions dropdown */}
      <div className="relative">
        <button
          onClick={() => setRegionsOpen(v => !v)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-medium
            bg-[#1a2332]/90 border border-white/[0.12] text-[#8fa3bc]
            hover:text-[#e8edf5] hover:border-white/20 transition-colors rounded-sm"
          aria-expanded={regionsOpen}
          aria-haspopup="listbox"
        >
          {lang === 'fr' ? 'Régions' : 'Regions'}
          <ChevronDown size={10} className={`transition-transform ${regionsOpen ? 'rotate-180' : ''}`} />
        </button>

        {regionsOpen && (
          <div
            role="listbox"
            className="absolute bottom-full right-0 mb-1 w-44
              bg-[#1a2332]/95 border border-white/[0.12] rounded-sm shadow-xl
              backdrop-blur-sm max-h-72 overflow-y-auto"
          >
            {QUICK_REGIONS.map(r => (
              <button
                key={r.labelEn}
                role="option"
                onClick={() => { onFlyTo(r.lon, r.lat, r.zoom); setRegionsOpen(false) }}
                className="w-full text-left px-3 py-1.5 text-[11px] text-[#8fa3bc]
                  hover:text-[#e8edf5] hover:bg-white/[0.05] transition-colors"
              >
                {lang === 'fr' ? r.labelFr : r.labelEn}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Zoom home */}
      <button
        onClick={onZoomHome}
        className="flex items-center justify-center w-8 h-8
          bg-[#1a2332]/90 border border-white/[0.12] text-[#8fa3bc]
          hover:text-[#e8edf5] hover:border-white/20 transition-colors rounded-sm"
        title={t('zoomHome')}
        aria-label={t('zoomHome')}
      >
        <Home size={13} />
      </button>

      {/* Basemap switcher */}
      <div className="flex flex-col bg-[#1a2332]/90 border border-white/[0.12] rounded-sm overflow-hidden">
        {BASEMAP_OPTIONS.map(({ key, icon, labelKey }) => (
          <button
            key={key}
            onClick={() => onSetBasemap(key)}
            className={`flex items-center gap-2 px-2.5 py-1.5 text-[10px] transition-colors
              ${basemap === key
                ? 'bg-[#e8611a]/15 text-[#e8611a] border-l-2 border-[#e8611a]'
                : 'text-[#8fa3bc] hover:text-[#e8edf5] hover:bg-white/[0.04] border-l-2 border-transparent'
              }`}
            aria-pressed={basemap === key}
          >
            {icon}
            <span>{t(labelKey)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
