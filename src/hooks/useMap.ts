import { useEffect, useRef, useState, useCallback } from 'react'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import ImageLayer from 'ol/layer/Image'
import XYZ from 'ol/source/XYZ'
import OSM from 'ol/source/OSM'
import ImageWMS from 'ol/source/ImageWMS'
import ScaleLine from 'ol/control/ScaleLine'
import Zoom from 'ol/control/Zoom'
import Attribution from 'ol/control/Attribution'
import { fromLonLat, toLonLat } from 'ol/proj'
import { defaults as defaultInteractions } from 'ol/interaction'
import type { Coordinate } from 'ol/coordinate'
import type MapBrowserEvent from 'ol/MapBrowserEvent'
import { BASEMAPS, GEOLOGY_LAYERS, type LayerConfig } from '../layers.config'

/**
 * Parse WMS GetFeatureInfo XML/GML response into a clean HTML table.
 * Handles CGMW (WMS 1.1.1 XML), GML FeatureCollection, and generic XML.
 */
function parseFeatureInfoXml(xml: string, _layerId: string): string | null {
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(xml, 'application/xml')

    // Collect all leaf text nodes that aren't empty
    const rows: Array<[string, string]> = []

    // Strategy 1: WMS GetFeatureInfoResponse → FIELDS element attributes
    const fields = doc.querySelectorAll('FIELDS')
    if (fields.length > 0) {
      fields.forEach(f => {
        Array.from(f.attributes).forEach(attr => {
          if (attr.value.trim()) rows.push([attr.name, attr.value.trim()])
        })
      })
    }

    // Strategy 2: GML Feature → child elements with text content
    if (rows.length === 0) {
      const featureMembers = doc.querySelectorAll('featureMember, member, Feature')
      featureMembers.forEach(fm => {
        fm.querySelectorAll('*').forEach(el => {
          const text = el.textContent?.trim()
          const localName = el.localName.replace(/^[^:]+:/, '') // strip namespace
          if (text && el.childElementCount === 0 && text.length < 200) {
            rows.push([localName, text])
          }
        })
      })
    }

    // Strategy 3: Any element with text, skip containers
    if (rows.length === 0) {
      doc.querySelectorAll('*').forEach(el => {
        const text = el.textContent?.trim()
        if (text && el.childElementCount === 0 && text.length > 0 && text.length < 300) {
          const name = el.localName.replace(/^[^:]+:/, '')
          if (!['xml', 'schema', 'complextype', 'simpletype'].includes(name.toLowerCase())) {
            rows.push([name, text])
          }
        }
      })
    }

    if (rows.length === 0) return null

    // Filter out boring/duplicate rows
    const seen = new Set<string>()
    const filtered = rows.filter(([k, v]) => {
      const key = `${k}:${v}`
      if (seen.has(key)) return false
      seen.add(key)
      // Skip pure coordinate rows and schema noise
      if (/^[-\d.,\s]+$/.test(v) && v.length > 30) return false
      return true
    }).slice(0, 20)

    if (filtered.length === 0) return null

    const tableRows = filtered.map(([k, v]) =>
      `<tr><th style="color:#8fa3bc;padding-right:8px;white-space:nowrap;vertical-align:top">${k}</th><td style="color:#e8edf5">${v}</td></tr>`
    ).join('')

    return `<table style="font-size:10px;width:100%;border-collapse:collapse">${tableRows}</table>`
  } catch {
    return null
  }
}

export type BasemapKey = 'street' | 'topo' | 'satellite'

export interface ActiveLayer {
  config: LayerConfig
  olLayer: ImageLayer<ImageWMS>
  visible: boolean
  opacity: number
  status: 'loading' | 'loaded' | 'error' | 'idle'
}

function makeBaseTileLayer(key: BasemapKey): TileLayer<XYZ | OSM> {
  const cfg = BASEMAPS[key]
  if (key === 'street') {
    return new TileLayer({ source: new OSM(), zIndex: 0 })
  }
  return new TileLayer({
    source: new XYZ({
      url: cfg.url,
      attributions: cfg.attribution,
      maxZoom: cfg.maxZoom,
    }),
    zIndex: 0,
  })
}

function makeWMSLayer(config: LayerConfig): ImageLayer<ImageWMS> {
  const params: Record<string, string> = {
    LAYERS: config.layerName,
    FORMAT: 'image/png',
    TRANSPARENT: 'true',
  }
  if (config.version === '1.3.0') {
    params['VERSION'] = '1.3.0'
  } else {
    params['VERSION'] = '1.1.1'
  }

  const source = new ImageWMS({
    url: config.url,
    params,
    ratio: 1,
    serverType: 'geoserver',
    crossOrigin: 'anonymous',
  })

  return new ImageLayer({
    source,
    opacity: config.defaultOpacity,
    visible: config.defaultOn,
    zIndex: 10,
    minZoom: config.minZoom,
    maxZoom: config.maxZoom,
  })
}

export function useMap(containerRef: React.RefObject<HTMLDivElement | null>) {
  const mapRef = useRef<Map | null>(null)
  const baseTileRef = useRef<TileLayer<XYZ | OSM> | null>(null)

  const [basemap, setBasemapState] = useState<BasemapKey>('street')
  const [activeLayers, setActiveLayers] = useState<ActiveLayer[]>([])
  const [mouseCoords, setMouseCoords] = useState<[number, number] | null>(null)
  const [zoom, setZoom] = useState(3)
  const [ripple, setRipple] = useState<{ x: number; y: number; key: number } | null>(null)

  // Init map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const baseTile = makeBaseTileLayer('street')
    baseTileRef.current = baseTile

    const map = new Map({
      target: containerRef.current,
      layers: [baseTile],
      view: new View({
        center: fromLonLat([15, 30]),
        zoom: 3,
        minZoom: 2,
        maxZoom: 19,
      }),
      controls: [
        new ScaleLine({ units: 'metric' }),
        new Zoom(),
        new Attribution({ collapsible: true }),
      ],
      interactions: defaultInteractions(),
    })

    mapRef.current = map

    // Mouse move → coordinates
    map.on('pointermove', (e) => {
      const lonLat = toLonLat(e.coordinate)
      setMouseCoords([lonLat[1], lonLat[0]])
    })

    // Zoom state
    map.getView().on('change:resolution', () => {
      setZoom(map.getView().getZoom() ?? 3)
    })

    // Init geology layers
    const initLayers: ActiveLayer[] = []
    for (const cfg of GEOLOGY_LAYERS.filter(l => l.defaultOn)) {
      const olLayer = makeWMSLayer(cfg)
      map.addLayer(olLayer)

      const src = olLayer.getSource()!
      const active: ActiveLayer = {
        config: cfg,
        olLayer,
        visible: true,
        opacity: cfg.defaultOpacity,
        status: 'idle',
      }

      src.on('imageloadstart', () => {
        setActiveLayers(prev => prev.map(l => l.config.id === cfg.id ? { ...l, status: 'loading' } : l))
      })
      src.on('imageloadend', () => {
        setActiveLayers(prev => prev.map(l => l.config.id === cfg.id ? { ...l, status: 'loaded' } : l))
      })
      src.on('imageloaderror', () => {
        setActiveLayers(prev => prev.map(l => l.config.id === cfg.id ? { ...l, status: 'error' } : l))
      })

      initLayers.push(active)
    }
    setActiveLayers(initLayers)

    return () => {
      map.setTarget(undefined)
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setBasemap = useCallback((key: BasemapKey) => {
    const map = mapRef.current
    if (!map) return
    const old = baseTileRef.current
    if (old) map.removeLayer(old)
    const next = makeBaseTileLayer(key)
    baseTileRef.current = next
    map.getLayers().insertAt(0, next)
    setBasemapState(key)
  }, [])

  const toggleLayerVisibility = useCallback((id: string) => {
    setActiveLayers(prev => prev.map(l => {
      if (l.config.id !== id) return l
      l.olLayer.setVisible(!l.visible)
      return { ...l, visible: !l.visible }
    }))
  }, [])

  const setLayerOpacity = useCallback((id: string, opacity: number) => {
    setActiveLayers(prev => prev.map(l => {
      if (l.config.id !== id) return l
      l.olLayer.setOpacity(opacity)
      return { ...l, opacity }
    }))
  }, [])

  const removeLayer = useCallback((id: string) => {
    const map = mapRef.current
    if (!map) return
    setActiveLayers(prev => {
      const target = prev.find(l => l.config.id === id)
      if (target) map.removeLayer(target.olLayer)
      return prev.filter(l => l.config.id !== id)
    })
  }, [])

  const addLayer = useCallback((config: LayerConfig) => {
    const map = mapRef.current
    if (!map) return
    const olLayer = makeWMSLayer(config)
    map.addLayer(olLayer)

    const src = olLayer.getSource()!
    const active: ActiveLayer = {
      config,
      olLayer,
      visible: true,
      opacity: config.defaultOpacity,
      status: 'idle',
    }

    src.on('imageloadstart', () => {
      setActiveLayers(prev => prev.map(l => l.config.id === config.id ? { ...l, status: 'loading' } : l))
    })
    src.on('imageloadend', () => {
      setActiveLayers(prev => prev.map(l => l.config.id === config.id ? { ...l, status: 'loaded' } : l))
    })
    src.on('imageloaderror', () => {
      setActiveLayers(prev => prev.map(l => l.config.id === config.id ? { ...l, status: 'error' } : l))
    })

    setActiveLayers(prev => [...prev, active])
  }, [])

  const zoomToHome = useCallback(() => {
    mapRef.current?.getView().animate({ center: fromLonLat([15, 30]), zoom: 3, duration: 800 })
  }, [])

  const zoomToExtent = useCallback((bbox: [number, number, number, number]) => {
    const map = mapRef.current
    if (!map) return
    const [minLon, minLat, maxLon, maxLat] = bbox
    const extent = [
      ...fromLonLat([minLon, minLat]),
      ...fromLonLat([maxLon, maxLat]),
    ] as [number, number, number, number]
    map.getView().fit(extent, { duration: 800, padding: [60, 60, 60, 60] })
  }, [])

  const flyTo = useCallback((lon: number, lat: number, targetZoom: number) => {
    mapRef.current?.getView().animate({
      center: fromLonLat([lon, lat]),
      zoom: targetZoom,
      duration: 1200,
    })
  }, [])

  const onMapClick = useCallback((handler: (coord: Coordinate, pixel: [number, number]) => void) => {
    const map = mapRef.current
    if (!map) return () => {}
    const listener = (e: MapBrowserEvent<PointerEvent>) => {
      const pixel = map.getEventPixel(e.originalEvent)
      setRipple({ x: pixel[0], y: pixel[1], key: Date.now() })
      handler(e.coordinate, [pixel[0], pixel[1]])
    }
    map.on('click', listener as never)
    return () => map.un('click', listener as never)
  }, [])

  const getFeatureInfo = useCallback(async (
    coordinate: Coordinate,
    _pixel: [number, number]
  ): Promise<Array<{ layerId: string; html: string }>> => {
    const map = mapRef.current
    if (!map) return []

    const results: Array<{ layerId: string; html: string }> = []
    const view = map.getView()
    const viewResolution = view.getResolution() ?? 1
    const proj = view.getProjection()

    const visible = activeLayers.filter(l => l.visible)

    await Promise.allSettled(
      visible.map(async (al) => {
        const src = al.olLayer.getSource()
        if (!src) return
        try {
          const url = src.getFeatureInfoUrl(coordinate, viewResolution, proj, {
            INFO_FORMAT: 'text/html',
            FEATURE_COUNT: '5',
          })
          if (!url) return
          const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
          if (!res.ok) return
          const html = await res.text()
          const trimmed = html.trim()

          // Skip empty, bare XML declarations, or WFS/OWS error envelopes
          if (
            !trimmed ||
            trimmed.length < 15 ||
            trimmed.startsWith('<?xml') ||
            trimmed.startsWith('<wfs:') ||
            trimmed.startsWith('<ows:') ||
            trimmed === '<table></table>' ||
            trimmed === '<table/>'
          ) return

          results.push({ layerId: al.config.id, html: trimmed })
        } catch {
          // Server unavailable or CORS — silent
        }
      })
    )

    return results
  }, [activeLayers])

  return {
    map: mapRef.current,
    basemap,
    setBasemap,
    activeLayers,
    toggleLayerVisibility,
    setLayerOpacity,
    removeLayer,
    addLayer,
    mouseCoords,
    zoom,
    ripple,
    zoomToHome,
    zoomToExtent,
    flyTo,
    onMapClick,
    getFeatureInfo,
  }
}
