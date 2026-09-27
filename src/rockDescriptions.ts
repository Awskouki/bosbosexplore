export interface RockEntry {
  fr: string
  en: string
  age?: string
  wikiSlugFr?: string
  wikiSlugEn?: string
}

/**
 * Lookup table: geology code / term → plain-language description.
 * Keys are lowercase normalised. Add entries as WMS responses reveal new codes.
 */
export const ROCK_DESCRIPTIONS: Record<string, RockEntry> = {
  granite: {
    fr: 'Roche plutonique felsique à grain grossier, formée par refroidissement lent d\'un magma en profondeur.',
    en: 'Coarse-grained felsic plutonic rock formed by slow cooling of magma at depth.',
    age: 'Variable',
    wikiSlugFr: 'Granite',
    wikiSlugEn: 'Granite',
  },
  basalt: {
    fr: 'Roche volcanique mafique à grain fin, issue de laves effusives en contexte de dorsale ou de point chaud.',
    en: 'Fine-grained mafic volcanic rock produced by effusive lava flows at ridges or hotspots.',
    wikiSlugFr: 'Basalte',
    wikiSlugEn: 'Basalt',
  },
  limestone: {
    fr: 'Roche sédimentaire carbonatée, souvent d\'origine biogène (coraux, coquilles), dissoute par l\'eau acide.',
    en: 'Carbonate sedimentary rock, often biogenic (corals, shells), dissolved by acidic water.',
    wikiSlugFr: 'Calcaire',
    wikiSlugEn: 'Limestone',
  },
  sandstone: {
    fr: 'Roche sédimentaire détritique composée de grains de sable cimentés, indicateur d\'environnements fluviaux ou côtiers.',
    en: 'Detrital sedimentary rock composed of cemented sand grains, indicating fluvial or coastal environments.',
    wikiSlugFr: 'Grès',
    wikiSlugEn: 'Sandstone',
  },
  shale: {
    fr: 'Roche sédimentaire argilleuse à feuillets fins, formée par compaction de boues en eaux calmes.',
    en: 'Fine-grained argillaceous sedimentary rock formed by compaction of mud in calm water.',
    wikiSlugFr: 'Schiste_argileux',
    wikiSlugEn: 'Shale',
  },
  schist: {
    fr: 'Roche métamorphique foliée à grain moyen, formée à pression et température élevées dans les zones de subduction.',
    en: 'Medium-grained foliated metamorphic rock formed at high pressure and temperature in subduction zones.',
    wikiSlugFr: 'Schiste',
    wikiSlugEn: 'Schist',
  },
  gneiss: {
    fr: 'Roche métamorphique de haut grade à bandes alternées claires et sombres, issue de granites ou sédiments profondément enfouis.',
    en: 'High-grade metamorphic rock with alternating light and dark bands, derived from deeply buried granites or sediments.',
    wikiSlugFr: 'Gneiss',
    wikiSlugEn: 'Gneiss',
  },
  quartzite: {
    fr: 'Métaquartzite formé par métamorphisme d\'un grès, extrêmement résistant à l\'érosion.',
    en: 'Quartzite formed by metamorphism of sandstone, extremely resistant to erosion.',
    wikiSlugFr: 'Quartzite',
    wikiSlugEn: 'Quartzite',
  },
  marble: {
    fr: 'Calcaire recristallisé par métamorphisme thermique, utilisé en sculpture et architecture.',
    en: 'Limestone recrystallised by thermal metamorphism, used in sculpture and architecture.',
    wikiSlugFr: 'Marbre',
    wikiSlugEn: 'Marble',
  },
  dolomite: {
    fr: 'Roche carbonatée composée de carbonate de calcium et magnésium, fréquente dans les plateaux karstiques.',
    en: 'Carbonate rock composed of calcium-magnesium carbonate, common in karst plateaus.',
    wikiSlugFr: 'Dolomie',
    wikiSlugEn: 'Dolomite',
  },
  rhyolite: {
    fr: 'Roche volcanique felsique à grain très fin, équivalent extrusive du granite, associée aux caldeiras.',
    en: 'Very fine-grained felsic volcanic rock, the extrusive equivalent of granite, associated with calderas.',
    wikiSlugFr: 'Rhyolite',
    wikiSlugEn: 'Rhyolite',
  },
  andesite: {
    fr: 'Roche volcanique intermédiaire typique des arcs insulaires et des marges continentales actives.',
    en: 'Intermediate volcanic rock typical of island arcs and active continental margins.',
    wikiSlugFr: 'Andésite',
    wikiSlugEn: 'Andesite',
  },
  gabbro: {
    fr: 'Roche plutonique mafique à grain grossier, constituant la croûte océanique inférieure.',
    en: 'Coarse-grained mafic plutonic rock constituting the lower oceanic crust.',
    wikiSlugFr: 'Gabbro',
    wikiSlugEn: 'Gabbro',
  },
  peridotite: {
    fr: 'Roche ultrabasique du manteau supérieur, remontée à la surface par des processus tectoniques (ophiolites).',
    en: 'Ultramafic upper-mantle rock brought to the surface by tectonic processes (ophiolites).',
    wikiSlugFr: 'Péridotite',
    wikiSlugEn: 'Peridotite',
  },
  conglomerate: {
    fr: 'Roche sédimentaire détritique à éléments grossiers (galets) cimentés, signalant des environnements à forte énergie.',
    en: 'Coarse-grained detrital sedimentary rock of cemented pebbles, indicating high-energy environments.',
    wikiSlugFr: 'Conglomérat_(roche)',
    wikiSlugEn: 'Conglomerate_(geology)',
  },
  chalk: {
    fr: 'Calcaire blanc très pur formé de coccolithes, déposé dans des mers épicontinentales du Crétacé.',
    en: 'Very pure white limestone formed from coccoliths, deposited in Cretaceous epicontinental seas.',
    wikiSlugFr: 'Craie',
    wikiSlugEn: 'Chalk',
  },
  coal: {
    fr: 'Roche sédimentaire organique issue de la compaction de végétaux, principale source d\'énergie fossile.',
    en: 'Organic sedimentary rock formed by compaction of plant material, the main fossil fuel source.',
    wikiSlugFr: 'Charbon',
    wikiSlugEn: 'Coal',
  },
  'volcanic ash': {
    fr: 'Dépôts pyroclastiques fins issus d\'éruptions explosives, marqueurs stratigraphiques précieux (téphra).',
    en: 'Fine pyroclastic deposits from explosive eruptions, valuable stratigraphic markers (tephra).',
    wikiSlugFr: 'Cendre_volcanique',
    wikiSlugEn: 'Volcanic_ash',
  },
  tuff: {
    fr: 'Roche pyroclastique consolidée à partir de cendres et fragments volcaniques.',
    en: 'Consolidated pyroclastic rock formed from volcanic ash and fragments.',
    wikiSlugFr: 'Tuf_volcanique',
    wikiSlugEn: 'Tuff',
  },
  obsidian: {
    fr: 'Verre volcanique naturel formé par refroidissement ultra-rapide d\'une lave rhyolitique.',
    en: 'Natural volcanic glass formed by ultra-rapid cooling of rhyolitic lava.',
    wikiSlugFr: 'Obsidienne',
    wikiSlugEn: 'Obsidian',
  },
  ophiolite: {
    fr: 'Séquence de roches océaniques obductées sur un continent, témoin d\'une ancienne suture.',
    en: 'Sequence of oceanic rocks obducted onto a continent, witness to an ancient suture zone.',
    wikiSlugFr: 'Ophiolite',
    wikiSlugEn: 'Ophiolite',
  },
  flysch: {
    fr: 'Alternances rythmiques de grès et argiles déposées en eaux profondes devant un front orogénique.',
    en: 'Rhythmic alternations of sandstone and clay deposited in deep water in front of an orogenic belt.',
    wikiSlugFr: 'Flysch',
    wikiSlugEn: 'Flysch',
  },
  molasse: {
    fr: 'Sédiments continentaux ou peu profonds issus de l\'érosion d\'une chaîne de montagnes.',
    en: 'Continental or shallow-water sediments derived from erosion of a mountain belt.',
    wikiSlugFr: 'Molasse',
    wikiSlugEn: 'Molasse',
  },
  alluvium: {
    fr: 'Dépôts détritiques récents transportés et déposés par des cours d\'eau.',
    en: 'Recent detrital deposits transported and laid down by rivers.',
    wikiSlugFr: 'Alluvion',
    wikiSlugEn: 'Alluvium',
  },
  till: {
    fr: 'Sédiment non trié déposé directement par un glacier, caractéristique des régions englacées au Quaternaire.',
    en: 'Unsorted sediment deposited directly by a glacier, characteristic of Quaternary glaciated regions.',
    wikiSlugFr: 'Till',
    wikiSlugEn: 'Till',
  },
  loess: {
    fr: 'Dépôt éolien de silt fin, formant des plateaux fertiles en zones périglaciaires.',
    en: 'Fine aeolian silt deposit forming fertile plateaus in periglacial zones.',
    wikiSlugFr: 'Loess',
    wikiSlugEn: 'Loess',
  },
  evaporite: {
    fr: 'Roche sédimentaire chimique formée par évaporation d\'eaux marines ou lacustres (sel, gypse, anhydrite).',
    en: 'Chemical sedimentary rock formed by evaporation of marine or lake waters (salt, gypsum, anhydrite).',
    wikiSlugFr: 'Évaporite',
    wikiSlugEn: 'Evaporite',
  },
  chert: {
    fr: 'Roche siliceuse dense formée de microquartz, souvent associée aux fonds océaniques profonds.',
    en: 'Dense siliceous rock of microcrystalline quartz, often associated with deep ocean floors.',
    wikiSlugFr: 'Chert',
    wikiSlugEn: 'Chert',
  },
  eclogite: {
    fr: 'Roche métamorphique de haute pression formée lors de la subduction de croûte océanique.',
    en: 'High-pressure metamorphic rock formed during subduction of oceanic crust.',
    wikiSlugFr: 'Éclogite',
    wikiSlugEn: 'Eclogite',
  },
  amphibolite: {
    fr: 'Roche métamorphique riche en amphibole, issue du métamorphisme de basaltes ou gabbros.',
    en: 'Amphibole-rich metamorphic rock derived from metamorphism of basalts or gabbros.',
    wikiSlugFr: 'Amphibolite',
    wikiSlugEn: 'Amphibolite',
  },
  migmatite: {
    fr: 'Roche partiellement fondue au contact entre roches métamorphiques et magma, à la limite croûte/manteau.',
    en: 'Partially melted rock at the boundary between metamorphic rocks and magma, at the crust/mantle interface.',
    wikiSlugFr: 'Migmatite',
    wikiSlugEn: 'Migmatite',
  },
}

/** Fuzzy-match a raw WMS feature attribute to a rock description */
export function lookupRock(raw: string): RockEntry | null {
  const key = raw.toLowerCase().trim()
  // Exact match
  if (ROCK_DESCRIPTIONS[key]) return ROCK_DESCRIPTIONS[key]
  // Partial match
  for (const [k, v] of Object.entries(ROCK_DESCRIPTIONS)) {
    if (key.includes(k) || k.includes(key)) return v
  }
  return null
}
