import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { X, Loader2 } from 'lucide-react'
import type { LayerConfig } from '../layers.config'

interface Props {
  onAdd: (config: LayerConfig) => void
  onClose: () => void
}

interface CapabilityLayer {
  name: string
  title: string
  abstract?: string
}

export default function AddWMSModal({ onAdd, onClose }: Props) {
  const { t } = useTranslation()
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [capLayers, setCapLayers] = useState<CapabilityLayer[]>([])
  const [selected, setSelected] = useState<CapabilityLayer | null>(null)

  async function fetchCapabilities() {
    if (!url.trim()) return
    setStatus('loading')
    setErrorMsg('')
    setCapLayers([])
    setSelected(null)

    try {
      const capUrl = `${url.trim()}?SERVICE=WMS&REQUEST=GetCapabilities`
      const res = await fetch(capUrl, { signal: AbortSignal.timeout(10000) })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const text = await res.text()
      const parser = new DOMParser()
      const doc = parser.parseFromString(text, 'application/xml')
      const layerEls = Array.from(doc.querySelectorAll('Layer > Name')).slice(0, 50)
      const layers: CapabilityLayer[] = layerEls.map(el => {
        const parent = el.parentElement!
        return {
          name: el.textContent?.trim() ?? '',
          title: parent.querySelector('Title')?.textContent?.trim() ?? el.textContent?.trim() ?? '',
          abstract: parent.querySelector('Abstract')?.textContent?.trim(),
        }
      }).filter(l => l.name)

      if (layers.length === 0) throw new Error('No named layers found')
      setCapLayers(layers)
      setStatus('done')
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      setErrorMsg(msg)
      setStatus('error')
    }
  }

  function handleAdd() {
    if (!selected) return
    const config: LayerConfig = {
      id: `custom-${Date.now()}`,
      titleFr: selected.title || selected.name,
      titleEn: selected.title || selected.name,
      url: url.trim(),
      layerName: selected.name,
      version: '1.3.0',
      srs: ['EPSG:4326', 'EPSG:3857'],
      defaultOn: true,
      defaultOpacity: 0.6,
      attribution: new URL(url.trim()).hostname,
    }
    onAdd(config)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      role="dialog" aria-modal="true" aria-label="Ajouter une couche WMS">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md mx-4 panel-grid
          bg-[#1a2332] border border-white/[0.12] rounded-sm shadow-2xl"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08]">
          <h2 className="text-sm font-semibold text-[#e8edf5]">{t('addLayer')}</h2>
          <button onClick={onClose} className="text-[#546a80] hover:text-[#e8edf5] transition-colors" aria-label="Fermer">
            <X size={16} />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <div>
            <label className="block text-[11px] text-[#8fa3bc] mb-1">{t('wmsUrl')}</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://example.com/wms"
                className="flex-1 bg-[#0a0f1e] border border-white/[0.1] rounded-sm px-3 py-1.5
                  text-[12px] text-[#e8edf5] placeholder-[#546a80]
                  focus:outline-none focus:border-[#00b4a6] transition-colors"
                onKeyDown={e => e.key === 'Enter' && fetchCapabilities()}
              />
              <button
                onClick={fetchCapabilities}
                disabled={status === 'loading' || !url.trim()}
                className="px-3 py-1.5 bg-[#00b4a6]/15 border border-[#00b4a6]/40 text-[#00b4a6]
                  text-[11px] rounded-sm hover:bg-[#00b4a6]/25 disabled:opacity-40 transition-colors"
              >
                {status === 'loading' ? <Loader2 size={12} className="animate-spin" /> : t('connect')}
              </button>
            </div>
          </div>

          {status === 'error' && (
            <p className="text-[11px] text-[#e8611a] bg-[#e8611a]/10 border border-[#e8611a]/20 rounded-sm px-3 py-2">
              {errorMsg}
            </p>
          )}

          {capLayers.length > 0 && (
            <div>
              <label className="block text-[11px] text-[#8fa3bc] mb-1">{t('selectLayer')}</label>
              <div className="max-h-48 overflow-y-auto border border-white/[0.08] rounded-sm">
                {capLayers.map(l => (
                  <button
                    key={l.name}
                    onClick={() => setSelected(l)}
                    className={`w-full text-left px-3 py-2 text-[11px] transition-colors
                      ${selected?.name === l.name
                        ? 'bg-[#e8611a]/15 text-[#e8611a] border-l-2 border-[#e8611a]'
                        : 'text-[#8fa3bc] hover:text-[#e8edf5] hover:bg-white/[0.04]'
                      }`}
                  >
                    <div className="font-medium">{l.title}</div>
                    <div className="text-[9px] opacity-60">{l.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-end px-4 py-3 border-t border-white/[0.08]">
          <button onClick={onClose}
            className="px-3 py-1.5 text-[11px] text-[#8fa3bc] border border-white/[0.1] rounded-sm
              hover:text-[#e8edf5] hover:border-white/20 transition-colors">
            {t('cancel')}
          </button>
          <button
            onClick={handleAdd}
            disabled={!selected}
            className="px-3 py-1.5 text-[11px] bg-[#e8611a] text-white rounded-sm
              hover:bg-[#e8611a]/90 disabled:opacity-40 transition-colors font-medium"
          >
            {t('add')}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
