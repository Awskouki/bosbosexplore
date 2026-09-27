/**
 * Simplified tectonic plate boundaries as GeoJSON LineString features.
 * Source: based on Bird (2003) PB2002 model, simplified for visualization.
 * Boundary types: subduction, divergent, transform
 */

export type BoundaryType = 'subduction' | 'divergent' | 'transform' | 'uncertain'

export interface PlateBoundary {
  type: BoundaryType
  nameFr: string
  nameEn: string
  coordinates: [number, number][]  // [lon, lat] pairs
}

export const BOUNDARY_COLORS: Record<BoundaryType, string> = {
  subduction: '#e8611a',   // orange — converging
  divergent:  '#00b4a6',   // teal — spreading
  transform:  '#a78bfa',   // purple — sliding
  uncertain:  '#546a80',   // dim — uncertain
}

export const PLATE_BOUNDARIES: PlateBoundary[] = [
  // ── Mid-Atlantic Ridge (divergent) ─────────────────────────────────────────
  {
    type: 'divergent',
    nameFr: 'Dorsale Médio-Atlantique',
    nameEn: 'Mid-Atlantic Ridge',
    coordinates: [
      [-18,66],[-18,63],[-20,60],[-25,57],[-28,54],[-30,52],
      [-32,48],[-35,45],[-38,42],[-38,38],[-36,35],[-35,30],
      [-33,25],[-30,20],[-27,15],[-25,10],[-24,5],[-23,0],
      [-21,-5],[-20,-10],[-18,-15],[-16,-20],[-15,-25],[-14,-30],
      [-13,-35],[-12,-40],[-10,-45],[-8,-50],[-6,-55]
    ],
  },
  // ── East Pacific Rise (divergent) ──────────────────────────────────────────
  {
    type: 'divergent',
    nameFr: 'Dorsale Est-Pacifique',
    nameEn: 'East Pacific Rise',
    coordinates: [
      [-105,20],[-107,15],[-108,10],[-108,5],[-108,0],
      [-110,-5],[-111,-10],[-112,-15],[-113,-20],[-115,-25],
      [-118,-30],[-120,-35],[-115,-40],[-110,-45],[-105,-50],
      [-95,-55],[-85,-60]
    ],
  },
  // ── Juan de Fuca Ridge (divergent) ─────────────────────────────────────────
  {
    type: 'divergent',
    nameFr: 'Dorsale Juan de Fuca',
    nameEn: 'Juan de Fuca Ridge',
    coordinates: [[-130,48],[-130,46],[-128,44],[-127,42]],
  },
  // ── Southwest Indian Ridge (divergent) ─────────────────────────────────────
  {
    type: 'divergent',
    nameFr: 'Dorsale Sud-Ouest Indienne',
    nameEn: 'Southwest Indian Ridge',
    coordinates: [
      [15,-55],[20,-52],[25,-50],[30,-48],[35,-46],
      [40,-44],[45,-42],[50,-40],[55,-38],[60,-36],[65,-34]
    ],
  },
  // ── Southeast Indian Ridge (divergent) ─────────────────────────────────────
  {
    type: 'divergent',
    nameFr: 'Dorsale Sud-Est Indienne',
    nameEn: 'Southeast Indian Ridge',
    coordinates: [
      [78,-28],[85,-32],[90,-35],[100,-40],[110,-45],[120,-48],[130,-50]
    ],
  },
  // ── Pacific-North America subduction (Cascadia) ────────────────────────────
  {
    type: 'subduction',
    nameFr: 'Zone de subduction de Cascadia',
    nameEn: 'Cascadia Subduction Zone',
    coordinates: [[-125,48],[-126,46],[-126,44],[-125,42],[-124,40]],
  },
  // ── Pacific-North America (Aleutian) ────────────────────────────────────────
  {
    type: 'subduction',
    nameFr: 'Fosse des Aléoutiennes',
    nameEn: 'Aleutian Trench',
    coordinates: [
      [-165,53],[-170,52],[-175,51],[-180,51],[175,51],
      [170,50],[165,50],[160,49],[155,48],[150,47],[145,46]
    ],
  },
  // ── Japan Trench (subduction) ───────────────────────────────────────────────
  {
    type: 'subduction',
    nameFr: 'Fosse du Japon',
    nameEn: 'Japan Trench',
    coordinates: [
      [143,40],[143,38],[143,36],[144,34],[144,32],[145,30],[145,28]
    ],
  },
  // ── Tonga Trench (subduction) ───────────────────────────────────────────────
  {
    type: 'subduction',
    nameFr: 'Fosse de Tonga',
    nameEn: 'Tonga Trench',
    coordinates: [
      [-174,-15],[-175,-18],[-175,-21],[-175,-24],[-173,-27]
    ],
  },
  // ── Peru-Chile Trench / Andes subduction ────────────────────────────────────
  {
    type: 'subduction',
    nameFr: 'Fosse Pérou-Chili',
    nameEn: 'Peru-Chile Trench',
    coordinates: [
      [-80,-5],[-79,-10],[-78,-15],[-75,-20],[[-72,-25]],
      [-70,-30],[-70,-35],[-72,-40],[-74,-45],[-76,-50]
    ].flat() as [number,number][],
  },
  // ── Himalayan collision / Indo-Eurasian boundary ────────────────────────────
  {
    type: 'subduction',
    nameFr: 'Collision Indo-Eurasiatique',
    nameEn: 'Indo-Eurasian Collision',
    coordinates: [
      [60,30],[65,32],[70,33],[75,34],[80,34],[85,28],
      [88,27],[92,27],[95,27],[98,26],[100,25]
    ],
  },
  // ── San Andreas Fault (transform) ──────────────────────────────────────────
  {
    type: 'transform',
    nameFr: 'Faille de San Andreas',
    nameEn: 'San Andreas Fault',
    coordinates: [
      [-117,33],[-118,34],[-119,35],[-120,36],[-121,37],
      [-121,38],[-122,38],[-122,39],[-123,40]
    ],
  },
  // ── Dead Sea Transform ──────────────────────────────────────────────────────
  {
    type: 'transform',
    nameFr: 'Faille de la Mer Morte',
    nameEn: 'Dead Sea Transform',
    coordinates: [[35,30],[36,32],[36,34],[36,36],[37,37]],
  },
  // ── North Anatolian Fault (transform) ──────────────────────────────────────
  {
    type: 'transform',
    nameFr: 'Faille Nord-Anatolienne',
    nameEn: 'North Anatolian Fault',
    coordinates: [
      [26,40],[28,40],[30,40],[32,40],[34,40],
      [36,39],[38,39],[40,39],[42,39]
    ],
  },
  // ── East African Rift (divergent) ───────────────────────────────────────────
  {
    type: 'divergent',
    nameFr: 'Rift Est-Africain',
    nameEn: 'East African Rift',
    coordinates: [
      [42,12],[40,8],[37,4],[35,0],[34,-3],
      [33,-6],[32,-9],[34,-12],[34,-15],[35,-18]
    ],
  },
  // ── Mid-Indian Ridge (divergent) ────────────────────────────────────────────
  {
    type: 'divergent',
    nameFr: 'Dorsale Centro-Indienne',
    nameEn: 'Central Indian Ridge',
    coordinates: [
      [67,10],[68,5],[68,0],[68,-5],[68,-10],[68,-15],[70,-20]
    ],
  },
]

/** Major plates for labeling */
export const MAJOR_PLATES = [
  { nameFr: 'Plaque Pacifique',     nameEn: 'Pacific Plate',      lon: -160, lat: 0   },
  { nameFr: 'Plaque Nord-Américaine', nameEn: 'North American Plate', lon: -100, lat: 50  },
  { nameFr: 'Plaque Eurasiatique',  nameEn: 'Eurasian Plate',     lon: 60,   lat: 55  },
  { nameFr: 'Plaque Africaine',     nameEn: 'African Plate',      lon: 20,   lat: 5   },
  { nameFr: 'Plaque Indo-Australienne', nameEn: 'Indo-Australian Plate', lon: 80, lat: -20 },
  { nameFr: 'Plaque Antarctique',   nameEn: 'Antarctic Plate',    lon: 0,    lat: -75 },
  { nameFr: 'Plaque Sud-Américaine', nameEn: 'South American Plate', lon: -60, lat: -20 },
  { nameFr: 'Plaque Nazca',         nameEn: 'Nazca Plate',        lon: -100, lat: -20 },
  { nameFr: 'Plaque Caraïbes',      nameEn: 'Caribbean Plate',    lon: -76,  lat: 15  },
  { nameFr: 'Plaque Arabique',      nameEn: 'Arabian Plate',      lon: 47,   lat: 23  },
  { nameFr: 'Plaque des Philippines', nameEn: 'Philippine Plate', lon: 128,  lat: 15  },
  { nameFr: 'Plaque Juan de Fuca',  nameEn: 'Juan de Fuca Plate', lon: -130, lat: 46  },
]
