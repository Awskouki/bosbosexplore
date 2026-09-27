import { useState, useRef, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, Loader2, X } from 'lucide-react'

interface NominatimResult {
  place_id: number
  display_name: string
  lat: string
  lon: string
  type: string
  class: string
  boundingbox: [string, string, string, string]
}

interface Props {
  onFlyTo: (lon: number, lat: number, zoom: number) => void
}

export default function SearchBar({ onFlyTo }: Props) {
  const { i18n } = useTranslation()
  const lang = i18n.language as 'fr' | 'en'
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<NominatimResult[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) { setResults([]); return }
    abortRef.current?.abort()
    abortRef.current = new AbortController()
    setStatus('loading')
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=6&accept-language=${lang}`
      const res = await fetch(url, {
        signal: abortRef.current.signal,
        headers: { 'User-Agent': 'BosboSExplore/1.0' },
      })
      if (!res.ok) throw new Error()
      const data: NominatimResult[] = await res.json()
      setResults(data)
      setStatus('done')
    } catch (e: unknown) {
      if ((e as Error).name !== 'AbortError') setStatus('error')
    }
  }, [lang])

  // Debounce
  useEffect(() => {
    if (!query.trim()) { setResults([]); setStatus('idle'); return }
    const t = setTimeout(() => search(query), 400)
    return () => clearTimeout(t)
  }, [query, search])

  const handleSelect = (r: NominatimResult) => {
    // Estimate zoom from bounding box size
    const bb = r.boundingbox
    const latSpan = Math.abs(parseFloat(bb[1]) - parseFloat(bb[0]))
    const lonSpan = Math.abs(parseFloat(bb[3]) - parseFloat(bb[2]))
    const span = Math.max(latSpan, lonSpan)
    const zoom = span > 40 ? 4 : span > 10 ? 5 : span > 3 ? 6 : span > 0.5 ? 8 : 10
    onFlyTo(parseFloat(r.lon), parseFloat(r.lat), zoom)
    setQuery(r.display_name.split(',')[0])
    setResults([])
    setOpen(false)
  }

  const placeholder = lang === 'fr' ? 'Rechercher un lieu…' : 'Search a place…'

  return (
    <div className="relative">
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border transition-all
        ${open ? 'bg-[#1a2332] border-[#00b4a6]/50 w-64' : 'bg-[#1a2332]/80 border-white/[0.1] w-36'}
        `}>
        {status === 'loading'
          ? <Loader2 size={13} className="text-[#00b4a6] animate-spin shrink-0" />
          : <Search size={13} className="text-[#546a80] shrink-0" />
        }
        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setOpen(true)}
          onChange={e => setQuery(e.target.value)}
          placeholder={placeholder}
          className="bg-transparent text-[12px] text-[#e8edf5] placeholder-[#546a80]
            focus:outline-none w-full"
          aria-label={placeholder}
          role="combobox"
          aria-expanded={results.length > 0}
          aria-autocomplete="list"
        />
        {query && (
          <button onClick={() => { setQuery(''); setResults([]); setOpen(false) }}
            className="text-[#546a80] hover:text-[#e8edf5] transition-colors shrink-0">
            <X size={11} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            role="listbox"
            className="absolute top-full left-0 mt-1 w-72 z-50
              bg-[#1a2332]/98 border border-white/[0.12] rounded-sm shadow-xl backdrop-blur-sm
              max-h-60 overflow-y-auto"
          >
            {results.map(r => (
              <button key={r.place_id} role="option"
                onClick={() => handleSelect(r)}
                className="w-full flex items-start gap-2 px-3 py-2 text-left
                  hover:bg-white/[0.06] transition-colors border-b border-white/[0.05] last:border-0"
              >
                <MapPin size={11} className="text-[#00b4a6] mt-0.5 shrink-0" />
                <div>
                  <div className="text-[12px] text-[#e8edf5] leading-tight">
                    {r.display_name.split(',').slice(0, 2).join(', ')}
                  </div>
                  <div className="text-[10px] text-[#546a80] mt-0.5 capitalize">
                    {r.type} · {r.class}
                  </div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
