export interface LayerConfig {
  id: string
  titleFr: string
  titleEn: string
  url: string
  layerName: string
  version: '1.1.1' | '1.3.0'
  srs: string[]
  bbox?: [number, number, number, number]
  defaultOn: boolean
  defaultOpacity: number
  minZoom?: number
  maxZoom?: number
  attribution: string
  group?: string
}

/**
 * VERIFIED WORKING WMS layers only.
 * All layer names confirmed via GetCapabilities before inclusion.
 *
 * The CGMW 1:50M onshore layer covers the entire world (including Tunisia,
 * Algeria, Morocco, Egypt, all of Africa, Asia, Americas, etc.).
 * Regional layers below provide HIGHER RESOLUTION for specific countries.
 */
export const GEOLOGY_LAYERS: LayerConfig[] = [

  // ══════════════════════════════════════════════════════════════════════════
  // GLOBAL — CGMW / BRGM (mapsref.brgm.fr) — ALL CONFIRMED WORKING
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'cgmw-world-50m',
    titleFr: 'Géologie mondiale CGMW 1:50M',
    titleEn: 'World Geology CGMW 1:50M',
    url: 'https://mapsref.brgm.fr/wxs/1GG/CGMW_Bedrock_and_Structural_Geology',
    layerName: 'World_CGMW_50M_GeologicalUnitsOnshore',
    version: '1.1.1',
    srs: ['EPSG:4326', 'EPSG:3857', 'CRS:84'],
    defaultOn: true,
    defaultOpacity: 0.65,
    attribution: '© CGMW / BRGM',
    group: 'global',
  },
  {
    id: 'cgmw-world-offshore',
    titleFr: 'Géologie océanique mondiale CGMW',
    titleEn: 'World Ocean Geology CGMW',
    url: 'https://mapsref.brgm.fr/wxs/1GG/CGMW_Bedrock_and_Structural_Geology',
    layerName: 'World_CGMW_50M_GeologicalUnitsOffshore',
    version: '1.1.1',
    srs: ['EPSG:4326', 'EPSG:3857', 'CRS:84'],
    defaultOn: false,
    defaultOpacity: 0.55,
    attribution: '© CGMW / BRGM',
    group: 'global',
  },
  {
    id: 'cgmw-world-structural',
    titleFr: 'Structures tectoniques mondiales CGMW',
    titleEn: 'World Tectonic Structures CGMW',
    url: 'https://mapsref.brgm.fr/wxs/1GG/CGMW_Bedrock_and_Structural_Geology',
    layerName: 'World_CGMW_50M_Structural',
    version: '1.1.1',
    srs: ['EPSG:4326', 'EPSG:3857', 'CRS:84'],
    defaultOn: false,
    defaultOpacity: 0.8,
    attribution: '© CGMW / BRGM',
    group: 'global',
  },
  {
    id: 'cgmw-world-overfeatures',
    titleFr: 'Éléments géologiques majeurs CGMW',
    titleEn: 'Major Geological Features CGMW',
    url: 'https://mapsref.brgm.fr/wxs/1GG/CGMW_Bedrock_and_Structural_Geology',
    layerName: 'World_CGMW_50M_OverFeatures',
    version: '1.1.1',
    srs: ['EPSG:4326', 'EPSG:3857', 'CRS:84'],
    defaultOn: false,
    defaultOpacity: 0.8,
    attribution: '© CGMW / BRGM',
    group: 'global',
  },
  {
    id: 'cgmw-eurasia-12500k',
    titleFr: 'Géologie Eurasie CGMW 1:12.5M',
    titleEn: 'Eurasia Geology CGMW 1:12.5M',
    url: 'https://mapsref.brgm.fr/wxs/1GG/CGMW_Bedrock_and_Structural_Geology',
    layerName: 'Eurasia_CGMW_12500K_GeologicalUnits',
    version: '1.1.1',
    srs: ['EPSG:4326', 'EPSG:3857', 'CRS:84'],
    bbox: [-30, 5, 180, 82],
    defaultOn: false,
    defaultOpacity: 0.65,
    attribution: '© CGMW / BRGM',
    group: 'global',
  },
  {
    id: 'cgmw-eurasia-structural',
    titleFr: 'Structures tectoniques Eurasie CGMW',
    titleEn: 'Eurasia Tectonic Structures CGMW',
    url: 'https://mapsref.brgm.fr/wxs/1GG/CGMW_Bedrock_and_Structural_Geology',
    layerName: 'Eurasia_CGMW_12500K_Structural',
    version: '1.1.1',
    srs: ['EPSG:4326', 'EPSG:3857', 'CRS:84'],
    bbox: [-30, 5, 180, 82],
    defaultOn: false,
    defaultOpacity: 0.8,
    attribution: '© CGMW / BRGM',
    group: 'global',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // EUROPE — high-resolution national surveys (all confirmed working)
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'bgs-uk-bedrock',
    titleFr: 'Socle géologique Royaume-Uni BGS 1:50k',
    titleEn: 'UK Bedrock Geology BGS 1:50k',
    url: 'https://map.bgs.ac.uk/arcgis/services/BGS_Detailed_Geology/MapServer/WMSServer',
    layerName: 'BGS.50k.Bedrock',
    version: '1.3.0',
    srs: ['EPSG:4326', 'EPSG:3857'],
    bbox: [-8, 49, 2, 61],
    defaultOn: false,
    defaultOpacity: 0.65,
    attribution: '© BGS / UKRI',
    group: 'europe',
  },
  {
    id: 'bgs-uk-superficial',
    titleFr: 'Dépôts superficiels Royaume-Uni BGS 1:50k',
    titleEn: 'UK Superficial Deposits BGS 1:50k',
    url: 'https://map.bgs.ac.uk/arcgis/services/BGS_Detailed_Geology/MapServer/WMSServer',
    layerName: 'BGS.50k.Superficial.deposits',
    version: '1.3.0',
    srs: ['EPSG:4326', 'EPSG:3857'],
    bbox: [-8, 49, 2, 61],
    defaultOn: false,
    defaultOpacity: 0.65,
    attribution: '© BGS / UKRI',
    group: 'europe',
  },
  {
    id: 'ngu-norway',
    titleFr: 'Géologie Norvège NGU 1:250k',
    titleEn: 'Norway Bedrock NGU 1:250k',
    url: 'https://geo.ngu.no/mapserver/BerggrunnWMS2',
    layerName: 'BerggrunnN250',
    version: '1.3.0',
    srs: ['EPSG:4326', 'EPSG:3857'],
    bbox: [4, 57, 32, 72],
    defaultOn: false,
    defaultOpacity: 0.65,
    attribution: '© NGU Norway',
    group: 'europe',
  },
  {
    id: 'brgm-france-1m',
    titleFr: 'Géologie France BRGM 1:1M',
    titleEn: 'France Geology BRGM 1:1M',
    url: 'https://geoservices.brgm.fr/geologie',
    layerName: 'SCAN_F_GEOL1M',
    version: '1.3.0',
    srs: ['EPSG:4326', 'EPSG:3857'],
    bbox: [-5.5, 41, 10, 51.5],
    defaultOn: false,
    defaultOpacity: 0.65,
    attribution: '© BRGM France',
    group: 'europe',
  },
  {
    id: 'brgm-france-250k',
    titleFr: 'Géologie France BRGM 1:250k',
    titleEn: 'France Geology BRGM 1:250k',
    url: 'https://geoservices.brgm.fr/geologie',
    layerName: 'SCAN_F_GEOL250',
    version: '1.3.0',
    srs: ['EPSG:4326', 'EPSG:3857'],
    bbox: [-5.5, 41, 10, 51.5],
    defaultOn: false,
    defaultOpacity: 0.65,
    minZoom: 7,
    attribution: '© BRGM France',
    group: 'europe',
  },
  {
    id: 'brgm-france-litho',
    titleFr: 'Lithologie France BRGM 1:1M simplifiée',
    titleEn: 'France Lithology BRGM 1:1M simplified',
    url: 'https://geoservices.brgm.fr/geologie',
    layerName: 'LITHO_1M_SIMPLIFIEE',
    version: '1.3.0',
    srs: ['EPSG:4326', 'EPSG:3857'],
    bbox: [-5.5, 41, 10, 51.5],
    defaultOn: false,
    defaultOpacity: 0.65,
    attribution: '© BRGM France',
    group: 'europe',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ASIA — confirmed working
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'gsj-japan-1m',
    titleFr: 'Géologie Japon GSJ 1:1M',
    titleEn: 'Japan Geology GSJ 1:1M',
    url: 'https://gbank.gsj.jp/ows/GSJ_Combined_Bedrock_and_Superficial_Geology_and_Age/wms',
    layerName: 'JPN_GSJ_1M_Combined_BLT_SLT_BA',
    version: '1.3.0',
    srs: ['EPSG:4326', 'EPSG:3857'],
    bbox: [122, 20, 154, 46],
    defaultOn: false,
    defaultOpacity: 0.65,
    attribution: '© GSJ / AIST Japan',
    group: 'asia',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // AMERICAS — confirmed working
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'usgs-us-geology',
    titleFr: 'Géologie USA USGS SGMC',
    titleEn: 'USA Geology USGS SGMC',
    url: 'https://mrdata.usgs.gov/services/sgmc2',
    layerName: 'sgmc2',
    version: '1.3.0',
    srs: ['EPSG:4326', 'EPSG:3857'],
    bbox: [-125, 24, -66, 50],
    defaultOn: false,
    defaultOpacity: 0.65,
    attribution: '© USGS',
    group: 'americas',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // OCEANIA — confirmed working
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'gns-nz-250k',
    titleFr: 'Géologie Nouvelle-Zélande GNS 1:250k',
    titleEn: 'New Zealand Geology GNS 1:250k',
    url: 'https://maps.gns.cri.nz/geology/wms',
    layerName: 'NZL_GNS_250K_geologic_units',
    version: '1.3.0',
    srs: ['EPSG:4326', 'EPSG:3857'],
    bbox: [166, -47, 178, -34],
    defaultOn: false,
    defaultOpacity: 0.65,
    attribution: '© GNS Science NZ',
    group: 'oceania',
  },
  {
    id: 'gns-nz-faults',
    titleFr: 'Failles Nouvelle-Zélande GNS',
    titleEn: 'New Zealand Faults GNS',
    url: 'https://maps.gns.cri.nz/geology/wms',
    layerName: 'gns:NZL_GNS_250K_faults',
    version: '1.3.0',
    srs: ['EPSG:4326', 'EPSG:3857'],
    bbox: [166, -47, 178, -34],
    defaultOn: false,
    defaultOpacity: 0.9,
    attribution: '© GNS Science NZ',
    group: 'oceania',
  },
]

export const BASEMAPS = {
  street: {
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19,
  },
  topo: {
    url: 'https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '© OpenTopoMap contributors',
    maxZoom: 17,
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '© Esri, Maxar, Earthstar Geographics',
    maxZoom: 19,
  },
}

export const LAYER_GROUPS: Record<string, { labelFr: string; labelEn: string; emoji: string }> = {
  global:   { labelFr: 'Mondial (CGMW)',  labelEn: 'Global (CGMW)',   emoji: '🌍' },
  europe:   { labelFr: 'Europe',           labelEn: 'Europe',          emoji: '🏔️' },
  asia:     { labelFr: 'Asie',            labelEn: 'Asia',            emoji: '🗾' },
  americas: { labelFr: 'Amériques',       labelEn: 'Americas',        emoji: '🌎' },
  oceania:  { labelFr: 'Océanie',         labelEn: 'Oceania',         emoji: '🌏' },
}
