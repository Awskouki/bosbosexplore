/** ICS 2023 International Chronostratigraphic Chart colors & ages */
export interface ChronoUnit {
  id: string
  nameFr: string
  nameEn: string
  rank: 'eon' | 'era' | 'period' | 'epoch'
  startMa: number   // start in millions of years ago
  endMa: number     // end (0 = present)
  color: string     // ICS official hex
  parentId?: string
}

export const TIMESCALE: ChronoUnit[] = [
  // ── Eons ──────────────────────────────────────────────────────────────────
  { id: 'hadean',      nameFr: 'Hadéen',       nameEn: 'Hadean',       rank: 'eon',    startMa: 4600, endMa: 4000, color: '#E8B99A' },
  { id: 'archean',     nameFr: 'Archéen',      nameEn: 'Archean',      rank: 'eon',    startMa: 4000, endMa: 2500, color: '#F0C4A2' },
  { id: 'proterozoic', nameFr: 'Protérozoïque', nameEn: 'Proterozoic', rank: 'eon',    startMa: 2500, endMa: 538,  color: '#F7C6C0' },
  { id: 'phanerozoic', nameFr: 'Phanérozoïque', nameEn: 'Phanerozoic', rank: 'eon',    startMa: 538,  endMa: 0,   color: '#9AD9E2' },

  // ── Eras (Phanerozoic) ────────────────────────────────────────────────────
  { id: 'paleozoic',   nameFr: 'Paléozoïque',  nameEn: 'Paleozoic',   rank: 'era',    startMa: 538,  endMa: 251,  color: '#99C4B8', parentId: 'phanerozoic' },
  { id: 'mesozoic',    nameFr: 'Mésozoïque',   nameEn: 'Mesozoic',    rank: 'era',    startMa: 251,  endMa: 66,   color: '#80CBAD', parentId: 'phanerozoic' },
  { id: 'cenozoic',    nameFr: 'Cénozoïque',   nameEn: 'Cenozoic',    rank: 'era',    startMa: 66,   endMa: 0,    color: '#F9F97F', parentId: 'phanerozoic' },

  // ── Periods ────────────────────────────────────────────────────────────────
  { id: 'cambrian',    nameFr: 'Cambrien',     nameEn: 'Cambrian',    rank: 'period', startMa: 538,  endMa: 485,  color: '#7FA56A', parentId: 'paleozoic' },
  { id: 'ordovician',  nameFr: 'Ordovicien',   nameEn: 'Ordovician',  rank: 'period', startMa: 485,  endMa: 443,  color: '#009270', parentId: 'paleozoic' },
  { id: 'silurian',    nameFr: 'Silurien',     nameEn: 'Silurian',    rank: 'period', startMa: 443,  endMa: 419,  color: '#B3E1B6', parentId: 'paleozoic' },
  { id: 'devonian',    nameFr: 'Dévonien',     nameEn: 'Devonian',    rank: 'period', startMa: 419,  endMa: 358,  color: '#CB8C37', parentId: 'paleozoic' },
  { id: 'carboniferous',nameFr:'Carbonifère',  nameEn: 'Carboniferous',rank:'period', startMa: 358,  endMa: 298,  color: '#67A599', parentId: 'paleozoic' },
  { id: 'permian',     nameFr: 'Permien',      nameEn: 'Permian',     rank: 'period', startMa: 298,  endMa: 251,  color: '#F04028', parentId: 'paleozoic' },
  { id: 'triassic',    nameFr: 'Trias',        nameEn: 'Triassic',    rank: 'period', startMa: 251,  endMa: 201,  color: '#812B92', parentId: 'mesozoic' },
  { id: 'jurassic',    nameFr: 'Jurassique',   nameEn: 'Jurassic',    rank: 'period', startMa: 201,  endMa: 145,  color: '#34B2C9', parentId: 'mesozoic' },
  { id: 'cretaceous',  nameFr: 'Crétacé',      nameEn: 'Cretaceous',  rank: 'period', startMa: 145,  endMa: 66,   color: '#7FC64E', parentId: 'mesozoic' },
  { id: 'paleogene',   nameFr: 'Paléogène',    nameEn: 'Paleogene',   rank: 'period', startMa: 66,   endMa: 23,   color: '#FD9A52', parentId: 'cenozoic' },
  { id: 'neogene',     nameFr: 'Néogène',      nameEn: 'Neogene',     rank: 'period', startMa: 23,   endMa: 2.6,  color: '#FFE619', parentId: 'cenozoic' },
  { id: 'quaternary',  nameFr: 'Quaternaire',  nameEn: 'Quaternary',  rank: 'period', startMa: 2.6,  endMa: 0,    color: '#F9F97F', parentId: 'cenozoic' },
]

export const PERIODS = TIMESCALE.filter(u => u.rank === 'period')
export const ERAS    = TIMESCALE.filter(u => u.rank === 'era')
export const EONS    = TIMESCALE.filter(u => u.rank === 'eon')

/** Age keywords to search WMS feature info HTML */
export const AGE_KEYWORDS: Record<string, string[]> = {
  cambrian:     ['cambrian','cambrien'],
  ordovician:   ['ordovician','ordovicien'],
  silurian:     ['silurian','silurien'],
  devonian:     ['devonian','devonien','dévonien'],
  carboniferous:['carboniferous','carbonifère','mississippian','pennsylvanian'],
  permian:      ['permian','permien'],
  triassic:     ['triassic','trias','triasique'],
  jurassic:     ['jurassic','jurassique'],
  cretaceous:   ['cretaceous','crétacé','cretace'],
  paleogene:    ['paleogene','paléogène','eocene','paleocene','oligocene','éocène','paléocène','oligocène'],
  neogene:      ['neogene','néogène','miocene','pliocene','miocène','pliocène'],
  quaternary:   ['quaternary','quaternaire','pleistocene','holocene','pléistocène','holocène'],
  archean:      ['archean','archéen'],
  proterozoic:  ['proterozoic','protérozoïque'],
}
