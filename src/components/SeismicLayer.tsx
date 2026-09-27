import { useEffect, useRef, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Zap, Flame, RefreshCw, X, AlertTriangle } from 'lucide-react'
import Map from 'ol/Map'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { fromLonLat } from 'ol/proj'
import { Style, Circle as CircleStyle, Fill, Stroke, Text } from 'ol/style'
import Overlay from 'ol/Overlay'

interface EarthquakeFeature {
  id: string
  mag: number
  place: string
  time: number
  lon: number
  lat: number
  depth: number
}

interface VolcanoFeature {
  id: string
  name: string
  country: string
  lat: number
  lon: number
  type: string
}

// GVP Smithsonian active volcanoes (curated subset — 50 most notable)
const VOLCANOES: VolcanoFeature[] = [
  { id: 'v1',  name: 'Etna',           country: 'Italy',       lat: 37.73, lon: 15.00, type: 'Stratovolcano' },
  { id: 'v2',  name: 'Stromboli',      country: 'Italy',       lat: 38.79, lon: 15.21, type: 'Stratovolcano' },
  { id: 'v3',  name: 'Vesuvius',       country: 'Italy',       lat: 40.82, lon: 14.43, type: 'Stratovolcano' },
  { id: 'v4',  name: 'Santorini',      country: 'Greece',      lat: 36.40, lon: 25.40, type: 'Caldera' },
  { id: 'v5',  name: 'Mt Fuji',        country: 'Japan',       lat: 35.36, lon: 138.73,type: 'Stratovolcano' },
  { id: 'v6',  name: 'Sakurajima',     country: 'Japan',       lat: 31.58, lon: 130.66,type: 'Stratovolcano' },
  { id: 'v7',  name: 'Kilauea',        country: 'USA (Hawaii)',lat: 19.42, lon: -155.29,type: 'Shield' },
  { id: 'v8',  name: 'Mauna Loa',      country: 'USA (Hawaii)',lat: 19.48, lon: -155.61,type: 'Shield' },
  { id: 'v9',  name: 'Mt St Helens',   country: 'USA',         lat: 46.20, lon: -122.19,type: 'Stratovolcano' },
  { id: 'v10', name: 'Popocatépetl',   country: 'Mexico',      lat: 19.02, lon: -98.62, type: 'Stratovolcano' },
  { id: 'v11', name: 'Cotopaxi',       country: 'Ecuador',     lat: -0.68, lon: -78.44, type: 'Stratovolcano' },
  { id: 'v12', name: 'Villarrica',     country: 'Chile',       lat: -39.42,lon: -71.94, type: 'Stratovolcano' },
  { id: 'v13', name: 'Nyiragongo',     country: 'DRC',         lat: -1.52, lon: 29.25,  type: 'Stratovolcano' },
  { id: 'v14', name: 'Ol Doinyo Lengai',country:'Tanzania',    lat: -2.77, lon: 35.91,  type: 'Stratovolcano' },
  { id: 'v15', name: 'Erta Ale',       country: 'Ethiopia',    lat: 13.60, lon: 40.67,  type: 'Shield' },
  { id: 'v16', name: 'Piton de la Fournaise', country: 'Réunion', lat: -21.23, lon: 55.71, type: 'Shield' },
  { id: 'v17', name: 'Merapi',         country: 'Indonesia',   lat: -7.54, lon: 110.44, type: 'Stratovolcano' },
  { id: 'v18', name: 'Krakatau',       country: 'Indonesia',   lat: -6.10, lon: 105.42, type: 'Caldera' },
  { id: 'v19', name: 'Tambora',        country: 'Indonesia',   lat: -8.25, lon: 117.99, type: 'Stratovolcano' },
  { id: 'v20', name: 'Pinatubo',       country: 'Philippines', lat: 15.14, lon: 120.35, type: 'Stratovolcano' },
  { id: 'v21', name: 'Taal',           country: 'Philippines', lat: 14.01, lon: 120.99, type: 'Caldera' },
  { id: 'v22', name: 'Klyuchevskoy',   country: 'Russia',      lat: 56.06, lon: 160.64, type: 'Stratovolcano' },
  { id: 'v23', name: 'Shiveluch',      country: 'Russia',      lat: 56.65, lon: 161.36, type: 'Stratovolcano' },
  { id: 'v24', name: 'Erebus',         country: 'Antarctica',  lat: -77.53, lon: 167.17,type: 'Stratovolcano' },
  { id: 'v25', name: 'Ruapehu',        country: 'New Zealand', lat: -39.28, lon: 175.57,type: 'Stratovolcano' },
  { id: 'v26', name: 'White Island',   country: 'New Zealand', lat: -37.52, lon: 177.18,type: 'Stratovolcano' },
  { id: 'v27', name: 'Yellowstone',    country: 'USA',         lat: 44.43, lon: -110.67,type: 'Supervolcano' },
  { id: 'v28', name: 'Hekla',          country: 'Iceland',     lat: 63.98, lon: -19.70, type: 'Stratovolcano' },
  { id: 'v29', name: 'Eyjafjallajökull',country:'Iceland',     lat: 63.63, lon: -19.62, type: 'Stratovolcano' },
  { id: 'v30', name: 'Grímsvötn',      country: 'Iceland',     lat: 64.42, lon: -17.33, type: 'Caldera' },
  { id: 'v31', name: 'Soufrière Hills', country: 'Montserrat', lat: 16.72, lon: -62.18, type: 'Stratovolcano' },
  { id: 'v32', name: 'La Soufrière',   country: 'St. Vincent', lat: 13.33, lon: -61.18, type: 'Stratovolcano' },
  { id: 'v33', name: 'Galeras',        country: 'Colombia',    lat: 1.22,  lon: -77.36, type: 'Stratovolcano' },
  { id: 'v34', name: 'Tungurahua',     country: 'Ecuador',     lat: -1.47, lon: -78.44, type: 'Stratovolcano' },
  { id: 'v35', name: 'Sabancaya',      country: 'Peru',        lat: -15.78,lon: -71.86, type: 'Stratovolcano' },
  { id: 'v36', name: 'Sinabung',       country: 'Indonesia',   lat: 3.17,  lon: 98.39,  type: 'Stratovolcano' },
  { id: 'v37', name: 'Semeru',         country: 'Indonesia',   lat: -8.11, lon: 112.92, type: 'Stratovolcano' },
  { id: 'v38', name: 'Bromo',          country: 'Indonesia',   lat: -7.94, lon: 112.95, type: 'Stratovolcano' },
  { id: 'v39', name: 'Batur',          country: 'Indonesia',   lat: -8.24, lon: 115.37, type: 'Caldera' },
  { id: 'v40', name: 'Ambrym',         country: 'Vanuatu',     lat: -16.25,lon: 168.12, type: 'Caldera' },
  { id: 'v41', name: 'Yasur',          country: 'Vanuatu',     lat: -19.53,lon: 169.44, type: 'Stratovolcano' },
  { id: 'v42', name: 'Pagan',          country: 'Mariana Is.', lat: 18.13, lon: 145.80, type: 'Stratovolcano' },
  { id: 'v43', name: 'Sarychev',       country: 'Russia',      lat: 48.09, lon: 153.20, type: 'Stratovolcano' },
  { id: 'v44', name: 'Ulawun',         country: 'Papua NG',    lat: -5.05, lon: 151.33, type: 'Stratovolcano' },
  { id: 'v45', name: 'Tavurvur',       country: 'Papua NG',    lat: -4.27, lon: 152.20, type: 'Stratovolcano' },
  { id: 'v46', name: 'Soufrière Guadeloupe', country: 'Guadeloupe', lat: 16.04, lon: -61.67, type: 'Stratovolcano' },
  { id: 'v47', name: 'Pico de Fogo',   country: 'Cape Verde',  lat: 14.95, lon: -24.35, type: 'Stratovolcano' },
  { id: 'v48', name: 'Campi Flegrei',  country: 'Italy',       lat: 40.83, lon: 14.14,  type: 'Caldera' },
  { id: 'v49', name: 'Torfajökull',    country: 'Iceland',     lat: 63.93, lon: -19.08, type: 'Caldera' },
  { id: 'v50', name: 'Mt Ruapehu',     country: 'New Zealand', lat: -39.28,lon: 175.57, type: 'Stratovolcano' },
]

function magToRadius(mag: number): number {
  return Math.max(4, Math.min(22, (mag - 2) * 3.5))
}

function magToColor(mag: number): string {
  if (mag >= 7) return '#dc2626'
  if (mag >= 6) return '#ea580c'
  if (mag >= 5) return '#f59e0b'
  if (mag >= 4) return '#84cc16'
  return '#22d3ee'
}

interface Props {
  map: Map | null
  showEarthquakes: boolean
  showVolcanoes: boolean
  onToggleEarthquakes: () => void
  onToggleVolcanoes: () => void
  onClose: () => void
}

export default function SeismicLayer({
  map, showEarthquakes, showVolcanoes,
  onToggleEarthquakes, onToggleVolcanoes, onClose,
}: Props) {
  const { i18n } = useTranslation()
  const lang = i18n.language as 'fr' | 'en'

  const [quakes, setQuakes] = useState<EarthquakeFeature[]>([])
  const [loadStatus, setLoadStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const eqSourceRef = useRef<VectorSource>(new VectorSource())
  const eqLayerRef  = useRef<VectorLayer<VectorSource> | null>(null)
  const volSourceRef= useRef<VectorSource>(new VectorSource())
  const volLayerRef = useRef<VectorLayer<VectorSource> | null>(null)

  // Init layers
  useEffect(() => {
    if (!map) return
    const eqLayer = new VectorLayer({ source: eqSourceRef.current, zIndex: 80 })
    const volLayer= new VectorLayer({ source: volSourceRef.current, zIndex: 81 })
    eqLayerRef.current = eqLayer
    volLayerRef.current = volLayer
    map.addLayer(eqLayer)
    map.addLayer(volLayer)
    return () => { map.removeLayer(eqLayer); map.removeLayer(volLayer) }
  }, [map])

  // Fetch earthquakes from USGS
  const fetchQuakes = useCallback(async () => {
    setLoadStatus('loading')
    try {
      const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson'
      const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
      if (!res.ok) throw new Error()
      const data = await res.json()
      const features: EarthquakeFeature[] = data.features
        .filter((f: any) => f.properties.mag >= 2.5)
        .map((f: any) => ({
          id: f.id,
          mag: f.properties.mag,
          place: f.properties.place,
          time: f.properties.time,
          lon: f.geometry.coordinates[0],
          lat: f.geometry.coordinates[1],
          depth: f.geometry.coordinates[2],
        }))
      setQuakes(features)
      setLastUpdated(new Date())
      setLoadStatus('done')
      return features
    } catch {
      setLoadStatus('error')
      return []
    }
  }, [])

  // Populate earthquake features on map
  useEffect(() => {
    eqSourceRef.current.clear()
    if (!showEarthquakes || quakes.length === 0) return

    const olFeatures = quakes.map(q => {
      const f = new Feature({ geometry: new Point(fromLonLat([q.lon, q.lat])), quake: q })
      const r = magToRadius(q.mag)
      const c = magToColor(q.mag)
      f.setStyle(new Style({
        image: new CircleStyle({
          radius: r,
          fill: new Fill({ color: c + '80' }),
          stroke: new Stroke({ color: c, width: 1.5 }),
        }),
      }))
      return f
    })
    eqSourceRef.current.addFeatures(olFeatures)
  }, [quakes, showEarthquakes])

  // Populate volcano features
  useEffect(() => {
    volSourceRef.current.clear()
    if (!showVolcanoes) return

    const olFeatures = VOLCANOES.map(v => {
      const f = new Feature({ geometry: new Point(fromLonLat([v.lon, v.lat])), volcano: v })
      f.setStyle(new Style({
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({ color: '#dc2626cc' }),
          stroke: new Stroke({ color: '#fff', width: 1.5 }),
        }),
        text: new Text({
          text: '🌋',
          font: '10px sans-serif',
          offsetY: -1,
        }),
      }))
      return f
    })
    volSourceRef.current.addFeatures(olFeatures)
  }, [showVolcanoes])

  // Auto-fetch on mount
  useEffect(() => {
    if (showEarthquakes && quakes.length === 0) fetchQuakes()
  }, [showEarthquakes])

  const recentQuakes = quakes.filter(q => Date.now() - q.time < 86400000).slice(0, 5)

  return (
    <div className="absolute right-3 bottom-16 z-20 w-72 pointer-events-auto
      panel-grid bg-[#1a2332]/96 border border-white/[0.1] rounded-sm
      backdrop-blur-sm shadow-xl overflow-hidden">

      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/[0.08]">
        <Zap size={13} className="text-[#e8611a]" />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-[#e8edf5]">
          {lang === 'fr' ? 'Séismes & Volcans' : 'Seismic & Volcanoes'}
        </span>
        <button onClick={onClose} className="ml-auto text-[#546a80] hover:text-[#e8edf5] transition-colors">
          <X size={13} />
        </button>
      </div>

      <div className="p-3 space-y-3">
        {/* Toggle buttons */}
        <div className="flex gap-2">
          <button onClick={onToggleEarthquakes}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[10px] font-medium rounded-sm border transition-all
              ${showEarthquakes
                ? 'border-[#f59e0b]/40 bg-[#f59e0b]/10 text-[#f59e0b]'
                : 'border-white/[0.08] text-[#8fa3bc] hover:text-[#e8edf5]'}`}>
            <Zap size={11} />
            {lang === 'fr' ? 'Séismes' : 'Earthquakes'}
          </button>
          <button onClick={onToggleVolcanoes}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[10px] font-medium rounded-sm border transition-all
              ${showVolcanoes
                ? 'border-[#dc2626]/40 bg-[#dc2626]/10 text-[#dc2626]'
                : 'border-white/[0.08] text-[#8fa3bc] hover:text-[#e8edf5]'}`}>
            <Flame size={11} />
            {lang === 'fr' ? 'Volcans' : 'Volcanoes'}
          </button>
        </div>

        {/* Magnitude legend */}
        {showEarthquakes && (
          <div>
            <div className="text-[9px] uppercase tracking-widest text-[#546a80] mb-1.5">
              {lang === 'fr' ? 'Magnitude (30 derniers jours)' : 'Magnitude (last 30 days)'}
            </div>
            <div className="flex gap-2 items-center">
              {[
                { label: 'M2-3', color: '#22d3ee', r: 5 },
                { label: 'M4-5', color: '#84cc16', r: 7 },
                { label: 'M5-6', color: '#f59e0b', r: 9 },
                { label: 'M6-7', color: '#ea580c', r: 12 },
                { label: 'M7+',  color: '#dc2626', r: 15 },
              ].map(l => (
                <div key={l.label} className="flex flex-col items-center gap-0.5">
                  <span className="rounded-full border-2" style={{
                    width: l.r * 2, height: l.r * 2,
                    background: l.color + '50', borderColor: l.color,
                  }} />
                  <span className="text-[8px] text-[#546a80]">{l.label}</span>
                </div>
              ))}
              {loadStatus === 'loading' && (
                <RefreshCw size={11} className="text-[#00b4a6] animate-spin ml-auto" />
              )}
              {loadStatus === 'done' && (
                <button onClick={fetchQuakes} title="Refresh"
                  className="ml-auto text-[#546a80] hover:text-[#00b4a6] transition-colors">
                  <RefreshCw size={11} />
                </button>
              )}
              {loadStatus === 'error' && (
                <button onClick={fetchQuakes}
                  className="ml-auto flex items-center gap-1 text-[10px] text-[#e8611a]">
                  <AlertTriangle size={10} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Recent big quakes */}
        {showEarthquakes && recentQuakes.length > 0 && (
          <div>
            <div className="text-[9px] uppercase tracking-widest text-[#546a80] mb-1">
              {lang === 'fr' ? 'Dernières 24h' : 'Last 24 hours'}
            </div>
            <div className="space-y-0.5">
              {recentQuakes.map(q => (
                <div key={q.id} className="flex items-center gap-2 py-0.5">
                  <span className="w-7 h-4 flex items-center justify-center rounded text-[9px] font-bold"
                    style={{ background: magToColor(q.mag) + '30', color: magToColor(q.mag) }}>
                    M{q.mag?.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-[#8fa3bc] truncate flex-1">{q.place}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {lastUpdated && (
          <div className="text-[9px] text-[#546a80]">
            {lang === 'fr' ? 'Mis à jour' : 'Updated'}: {lastUpdated.toLocaleTimeString()}
            {' · '}
            {lang === 'fr' ? `${quakes.length} événements` : `${quakes.length} events`}
          </div>
        )}

        {showVolcanoes && (
          <div className="flex items-center gap-2 text-[10px] text-[#8fa3bc]">
            <span className="w-3 h-3 rounded-full bg-[#dc2626] border border-white/50" />
            {lang === 'fr' ? `${VOLCANOES.length} volcans actifs` : `${VOLCANOES.length} active volcanoes`}
          </div>
        )}
      </div>
    </div>
  )
}
