import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { BookMarked, Plus, Trash2, X, MapPin, Download, ChevronDown, ChevronUp } from 'lucide-react'
import Map from 'ol/Map'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { fromLonLat, toLonLat } from 'ol/proj'
import { Style, Circle as CircleStyle, Fill, Stroke, Text } from 'ol/style'
import type { MapBrowserEvent } from 'ol'

export interface FieldNote {
  id: string
  lon: number
  lat: number
  title: string
  body: string
  createdAt: string
  color: string
}

const NOTE_COLORS = ['#e8611a', '#00b4a6', '#a78bfa', '#f59e0b', '#22d3ee', '#84cc16']
const STORAGE_KEY = 'bsb_field_notes'

function loadNotes(): FieldNote[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch { return [] }
}

function saveNotes(notes: FieldNote[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
}

interface Props {
  map: Map | null
  onClose: () => void
}

export default function FieldNotes({ map, onClose }: Props) {
  const { i18n } = useTranslation()
  const lang = i18n.language as 'fr' | 'en'

  const [notes, setNotes] = useState<FieldNote[]>(loadNotes)
  const [placing, setPlacing] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [draft, setDraft] = useState({ title: '', body: '', color: NOTE_COLORS[0] })
  const [expanded, setExpanded] = useState<string | null>(null)

  const sourceRef = useRef<VectorSource>(new VectorSource())
  const layerRef  = useRef<VectorLayer<VectorSource> | null>(null)

  // Init vector layer
  useEffect(() => {
    if (!map) return
    const layer = new VectorLayer({ source: sourceRef.current, zIndex: 90 })
    layerRef.current = layer
    map.addLayer(layer)
    return () => { map.removeLayer(layer) }
  }, [map])

  // Sync notes → map features
  useEffect(() => {
    sourceRef.current.clear()
    notes.forEach(note => {
      const f = new Feature({ geometry: new Point(fromLonLat([note.lon, note.lat])), noteId: note.id })
      f.setStyle(new Style({
        image: new CircleStyle({
          radius: 10,
          fill: new Fill({ color: note.color + 'cc' }),
          stroke: new Stroke({ color: '#fff', width: 2 }),
        }),
        text: new Text({
          text: '📍',
          font: '12px sans-serif',
          offsetY: -1,
        }),
      }))
      sourceRef.current.addFeature(f)
    })
  }, [notes])

  // Placing mode — next click drops a pin
  useEffect(() => {
    if (!map || !placing) return
    const handler = (e: MapBrowserEvent<PointerEvent>) => {
      const [lon, lat] = toLonLat(e.coordinate)
      const newNote: FieldNote = {
        id: Date.now().toString(),
        lon, lat,
        title: draft.title || (lang === 'fr' ? 'Affleurement' : 'Outcrop'),
        body: draft.body,
        color: draft.color,
        createdAt: new Date().toISOString(),
      }
      const updated = [newNote, ...notes]
      setNotes(updated)
      saveNotes(updated)
      setPlacing(false)
      setDraft({ title: '', body: '', color: NOTE_COLORS[0] })
      setEditId(newNote.id)
      setExpanded(newNote.id)
    }
    map.once('click', handler as never)
    return () => map.un('click', handler as never)
  }, [map, placing, draft, notes, lang])

  const deleteNote = (id: string) => {
    const updated = notes.filter(n => n.id !== id)
    setNotes(updated)
    saveNotes(updated)
    if (editId === id) setEditId(null)
    if (expanded === id) setExpanded(null)
  }

  const updateNote = (id: string, field: 'title' | 'body', value: string) => {
    const updated = notes.map(n => n.id === id ? { ...n, [field]: value } : n)
    setNotes(updated)
    saveNotes(updated)
  }

  const flyToNote = (note: FieldNote) => {
    map?.getView().animate({ center: fromLonLat([note.lon, note.lat]), zoom: 10, duration: 800 })
  }

  const exportGeoJSON = () => {
    const fc = {
      type: 'FeatureCollection',
      features: notes.map(n => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [n.lon, n.lat] },
        properties: { id: n.id, title: n.title, body: n.body, createdAt: n.createdAt },
      })),
    }
    const blob = new Blob([JSON.stringify(fc, null, 2)], { type: 'application/geo+json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'field-notes.geojson'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <div className="absolute right-3 top-14 bottom-16 w-72 z-20 pointer-events-auto
      panel-grid bg-[#1a2332]/96 border border-white/[0.1] rounded-sm
      backdrop-blur-sm flex flex-col overflow-hidden shadow-2xl">

      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/[0.08] shrink-0">
        <BookMarked size={13} className="text-[#a78bfa]" />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-[#e8edf5]">
          {lang === 'fr' ? 'Notes de terrain' : 'Field Notes'}
        </span>
        <span className="text-[9px] text-[#546a80] bg-white/[0.05] px-1.5 rounded-sm">
          {notes.length}
        </span>
        <div className="ml-auto flex items-center gap-1">
          {notes.length > 0 && (
            <button onClick={exportGeoJSON} title="Export GeoJSON"
              className="p-1 text-[#546a80] hover:text-[#00b4a6] transition-colors">
              <Download size={12} />
            </button>
          )}
          <button onClick={onClose} className="text-[#546a80] hover:text-[#e8edf5] transition-colors">
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Placing mode banner */}
      <AnimatePresence>
        {placing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-[#a78bfa]/30 bg-[#a78bfa]/10 px-3 py-2 shrink-0"
          >
            <p className="text-[11px] text-[#a78bfa]">
              {lang === 'fr' ? '📍 Cliquez sur la carte pour placer la note.' : '📍 Click the map to place the note.'}
            </p>
            <button onClick={() => setPlacing(false)}
              className="text-[9px] text-[#546a80] hover:text-[#e8611a] mt-0.5 transition-colors">
              {lang === 'fr' ? 'Annuler' : 'Cancel'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New note form */}
      {!placing && (
        <div className="px-3 py-2 border-b border-white/[0.06] shrink-0 space-y-1.5">
          <input
            type="text"
            placeholder={lang === 'fr' ? 'Titre de la note…' : 'Note title…'}
            value={draft.title}
            onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
            className="w-full bg-[#0a0f1e]/60 border border-white/[0.08] rounded-sm px-2 py-1
              text-[11px] text-[#e8edf5] placeholder-[#546a80] focus:outline-none focus:border-[#a78bfa]/40"
          />
          <textarea
            rows={2}
            placeholder={lang === 'fr' ? 'Observations…' : 'Observations…'}
            value={draft.body}
            onChange={e => setDraft(d => ({ ...d, body: e.target.value }))}
            className="w-full bg-[#0a0f1e]/60 border border-white/[0.08] rounded-sm px-2 py-1
              text-[11px] text-[#e8edf5] placeholder-[#546a80] focus:outline-none focus:border-[#a78bfa]/40 resize-none"
          />
          <div className="flex items-center gap-2">
            {NOTE_COLORS.map(c => (
              <button key={c} onClick={() => setDraft(d => ({ ...d, color: c }))}
                className="w-4 h-4 rounded-sm transition-transform hover:scale-110"
                style={{ background: c, outline: draft.color === c ? `2px solid white` : 'none', outlineOffset: 1 }} />
            ))}
            <button onClick={() => setPlacing(true)}
              className="ml-auto flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-medium
                bg-[#a78bfa]/15 border border-[#a78bfa]/40 text-[#a78bfa]
                hover:bg-[#a78bfa]/25 rounded-sm transition-colors">
              <MapPin size={11} />
              {lang === 'fr' ? 'Placer' : 'Place'}
            </button>
          </div>
        </div>
      )}

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {notes.length === 0 && (
          <p className="text-[11px] text-[#546a80] text-center py-6">
            {lang === 'fr' ? 'Aucune note. Ajoutez-en une ci-dessus.' : 'No notes. Add one above.'}
          </p>
        )}
        {notes.map(note => (
          <div key={note.id}
            className="border border-white/[0.08] rounded-sm overflow-hidden"
            style={{ borderLeftColor: note.color, borderLeftWidth: 3 }}>
            <div className="flex items-center gap-2 px-2 py-1.5">
              <button onClick={() => flyToNote(note)}
                className="text-[#546a80] hover:text-[#00b4a6] transition-colors shrink-0">
                <MapPin size={11} />
              </button>
              <span className="flex-1 text-[11px] text-[#e8edf5] font-medium truncate">{note.title}</span>
              <button onClick={() => setExpanded(v => v === note.id ? null : note.id)}
                className="text-[#546a80] hover:text-[#e8edf5] transition-colors">
                {expanded === note.id ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
              </button>
              <button onClick={() => deleteNote(note.id)}
                className="text-[#546a80] hover:text-[#e8611a] transition-colors shrink-0">
                <Trash2 size={11} />
              </button>
            </div>
            <AnimatePresence>
              {expanded === note.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-2 pb-2 space-y-1 overflow-hidden"
                >
                  <input
                    value={note.title}
                    onChange={e => updateNote(note.id, 'title', e.target.value)}
                    className="w-full bg-transparent border-b border-white/[0.08] text-[11px] text-[#e8edf5]
                      focus:outline-none focus:border-[#a78bfa]/40 py-0.5"
                  />
                  <textarea
                    rows={3}
                    value={note.body}
                    onChange={e => updateNote(note.id, 'body', e.target.value)}
                    placeholder={lang === 'fr' ? 'Observations…' : 'Observations…'}
                    className="w-full bg-transparent text-[10px] text-[#8fa3bc] focus:outline-none resize-none
                      placeholder-[#546a80]"
                  />
                  <div className="text-[8px] text-[#546a80] font-mono">
                    {note.lat.toFixed(4)}°N {note.lon.toFixed(4)}°E
                    {' · '}{new Date(note.createdAt).toLocaleDateString()}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}
