export interface TourStep {
  titleFr: string
  titleEn: string
  bodyFr: string
  bodyEn: string
  lon: number
  lat: number
  zoom: number
  layerIds?: string[]  // layers to activate for this step
}

export interface TourConfig {
  id: string
  titleFr: string
  titleEn: string
  subtitleFr: string
  subtitleEn: string
  emoji: string
  duration: string   // estimated reading time
  steps: TourStep[]
}

export const TOURS: TourConfig[] = [
  // ─────────────────────────────────────────────────────────────
  // 1. Himalayan Collision
  // ─────────────────────────────────────────────────────────────
  {
    id: 'himalayan-collision',
    titleFr: 'La Collision Himalayenne',
    titleEn: 'The Himalayan Collision',
    subtitleFr: 'Comment l\'Inde a percuté l\'Asie',
    subtitleEn: 'How India crashed into Asia',
    emoji: '⛰️',
    duration: '8 min',
    steps: [
      {
        titleFr: 'Vue d\'ensemble — La suture du Téthys',
        titleEn: 'Overview — The Tethys Suture',
        bodyFr: 'Il y a 50 millions d\'années, la plaque Indienne entre en collision avec l\'Eurasie, fermant définitivement l\'océan Téthys. La zone de suture, marquée par des roches ophiolitiques, court du Pakistan au Tibet sur plus de 2 500 km.',
        bodyEn: 'Fifty million years ago, the Indian plate collided with Eurasia, permanently closing the Tethys Ocean. The suture zone, marked by ophiolitic rocks, runs from Pakistan to Tibet over 2 500 km.',
        lon: 80, lat: 30, zoom: 4,
        layerIds: ['cgmw-world-50m', 'cgmw-asia-5m'],
      },
      {
        titleFr: 'Le Front Himalayen Principal',
        titleEn: 'The Main Himalayan Thrust',
        bodyFr: 'La faille de chevauchement principal himalayen (MHT) est le plan de décollement basal sur lequel toute la chaîne glisse vers le sud à ~2 cm/an. Les séismes catastrophiques de la région (Népal 2015) se produisent sur ce plan.',
        bodyEn: 'The Main Himalayan Thrust (MHT) is the basal décollement on which the entire range slides south at ~2 cm/yr. The catastrophic earthquakes of the region (Nepal 2015) nucleate on this plane.',
        lon: 85, lat: 27.5, zoom: 6,
        layerIds: ['cgmw-world-50m', 'cgmw-asia-5m'],
      },
      {
        titleFr: 'Le Plateau Tibétain — Croûte doublée',
        titleEn: 'The Tibetan Plateau — Doubled Crust',
        bodyFr: 'Le Tibet présente une croûte de 70 km d\'épaisseur — le double de la normale. Ce doublement résulte de l\'empilement de nappes crustales lors de la collision. L\'altitude moyenne de 4 500 m est une conséquence directe de cet épaississement.',
        bodyEn: 'Tibet has a crust 70 km thick — double the normal. This doubling results from stacking of crustal nappes during collision. The average altitude of 4 500 m is a direct consequence of this thickening.',
        lon: 88, lat: 32, zoom: 5,
        layerIds: ['cgmw-world-50m'],
      },
      {
        titleFr: 'Les Ophiolites — Témoins de l\'Océan Téthys',
        titleEn: 'Ophiolites — Witnesses of the Tethys Ocean',
        bodyFr: 'Les ophiolites de l\'Indus–Yarlung Tsangpo sont des fragments de plancher océanique téthysien obductés sur le continent. Ces roches ultrabasiques (péridotites, gabbros, basaltes en coussins) prouvent l\'existence d\'un ancien océan.',
        bodyEn: 'The Indus–Yarlung Tsangpo ophiolites are fragments of Tethyan ocean floor obducted onto the continent. These ultramafic rocks (peridotites, gabbros, pillow basalts) prove the former existence of an ocean.',
        lon: 82, lat: 29.5, zoom: 6,
        layerIds: ['cgmw-world-50m', 'cgmw-asia-5m'],
      },
      {
        titleFr: 'Le Fore-land — Bassins Molassiques',
        titleEn: 'The Foreland — Molasse Basins',
        bodyFr: 'Au pied de l\'Himalaya, le bassin du Gange et la formation Siwalik accumulent les sédiments érodés de la chaîne depuis 15 Ma. Ces molasses, riches en fossiles de mammifères, enregistrent l\'exhumation progressive de la chaîne.',
        bodyEn: 'At the foot of the Himalayas, the Ganges basin and Siwalik Formation accumulate sediments eroded from the range since 15 Ma. These molasse deposits, rich in mammal fossils, record the progressive exhumation of the chain.',
        lon: 78, lat: 25, zoom: 6,
        layerIds: ['cgmw-world-50m'],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 2. Pacific Ring of Fire
  // ─────────────────────────────────────────────────────────────
  {
    id: 'ring-of-fire',
    titleFr: 'La Ceinture de Feu du Pacifique',
    titleEn: 'The Pacific Ring of Fire',
    subtitleFr: '75% des volcans actifs de la planète',
    subtitleEn: '75% of the planet\'s active volcanoes',
    emoji: '🌋',
    duration: '7 min',
    steps: [
      {
        titleFr: 'Vue d\'ensemble — La Subduction Pacifique',
        titleEn: 'Overview — Pacific Subduction',
        bodyFr: 'La Ceinture de Feu encercle le Pacifique sur 40 000 km. Elle concentre 90% de la sismicité mondiale et 75% des volcans actifs, tous liés à la subduction des plaques Pacifique, Nazca, Juan de Fuca et Philippines sous les continents environnants.',
        bodyEn: 'The Ring of Fire encircles the Pacific over 40 000 km. It concentrates 90% of global seismicity and 75% of active volcanoes, all linked to the subduction of the Pacific, Nazca, Juan de Fuca and Philippine plates under surrounding continents.',
        lon: -170, lat: 0, zoom: 2,
        layerIds: ['cgmw-world-50m'],
      },
      {
        titleFr: 'Le Japon — Archipel Volcanique',
        titleEn: 'Japan — Volcanic Archipelago',
        bodyFr: 'Le Japon est formé par la subduction de la plaque Pacifique sous la plaque Eurasiatique. Les andésites et rhyolites dominent la géologie superficielle. Le Mont Fuji (3 776 m) est un stratovolcan actif typique d\'arc insulaire, composé de basaltes et andésites.',
        bodyEn: 'Japan is formed by subduction of the Pacific plate under the Eurasian plate. Andesites and rhyolites dominate the surface geology. Mount Fuji (3 776 m) is a typical island-arc stratovolcano composed of basalts and andesites.',
        lon: 138, lat: 36, zoom: 6,
        layerIds: ['cgmw-world-50m', 'gsj-japan-1m'],
      },
      {
        titleFr: 'Les Andes — Arc Volcanique Continental',
        titleEn: 'The Andes — Continental Volcanic Arc',
        bodyFr: 'La subduction de la plaque Nazca sous l\'Amérique du Sud génère la chaîne des Andes. Contrairement aux arcs insulaires, il s\'agit d\'un arc volcanique continental. Les ignimbrites rhyolitiques du plateau altiplanique témoignent d\'éruptions catastrophiques passées.',
        bodyEn: 'Subduction of the Nazca plate under South America generates the Andes chain. Unlike island arcs, this is a continental volcanic arc. Rhyolitic ignimbrites of the altiplano plateau record past catastrophic eruptions.',
        lon: -68, lat: -22, zoom: 5,
        layerIds: ['cgmw-world-50m', 'cgmw-samerica-5m'],
      },
      {
        titleFr: 'Cascades — La Menace Américaine',
        titleEn: 'Cascades — The American Threat',
        bodyFr: 'La chaîne des Cascades (Washington, Oregon) est liée à la subduction de la microplaque Juan de Fuca. Le Mont St. Helens a explosé en 1980, détruisant 400 m de sommet. La région de Seattle est exposée à un risque de méga-tremblement de terre de magnitude 9.',
        bodyEn: 'The Cascades range (Washington, Oregon) is linked to subduction of the Juan de Fuca microplate. Mount St. Helens erupted in 1980, destroying 400 m of summit. The Seattle area is exposed to a mega-earthquake risk of magnitude 9.',
        lon: -121, lat: 46, zoom: 6,
        layerIds: ['cgmw-world-50m', 'usgs-us'],
      },
      {
        titleFr: 'Tonga-Kermadec — La Fosse la Plus Profonde',
        titleEn: 'Tonga-Kermadec — The Deepest Trench',
        bodyFr: 'La fosse de Tonga atteint 10 882 m de profondeur — la deuxième fosse la plus profonde au monde. La subduction y est l\'une des plus rapides de la planète (~24 cm/an). Les séismes profonds (>600 km) y sont fréquents, révélant une dalle plongeante froide.',
        bodyEn: 'The Tonga Trench reaches 10 882 m depth — the second deepest trench in the world. Subduction here is one of the fastest on the planet (~24 cm/yr). Deep earthquakes (>600 km) are frequent, revealing a cold subducting slab.',
        lon: -175, lat: -20, zoom: 5,
        layerIds: ['cgmw-world-50m'],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 3. British Isles Geology
  // ─────────────────────────────────────────────────────────────
  {
    id: 'british-isles',
    titleFr: 'Géologie des Îles Britanniques',
    titleEn: 'Geology of the British Isles',
    subtitleFr: '500 millions d\'années d\'histoire géologique',
    subtitleEn: '500 million years of geological history',
    emoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    duration: '7 min',
    steps: [
      {
        titleFr: 'Vue d\'ensemble — Un Puzzle Calédonien',
        titleEn: 'Overview — A Caledonian Puzzle',
        bodyFr: 'Les Îles Britanniques sont un mosaïque de terranes accrétés lors de l\'orogenèse calédonienne (500–400 Ma). Les Highlands écossais, les Pennines, le Pays de Galles et l\'Irlande ont chacun une histoire géologique distincte assemblée par la fermeture de l\'océan Iapetus.',
        bodyEn: 'The British Isles are a mosaic of terranes accreted during the Caledonian orogeny (500–400 Ma). The Scottish Highlands, Pennines, Wales and Ireland each have a distinct geological history assembled by closure of the Iapetus Ocean.',
        lon: -3, lat: 54.5, zoom: 5,
        layerIds: ['cgmw-world-50m', 'bgs-uk-625k'],
      },
      {
        titleFr: 'Les Highlands Écossais — Gneiss de Lewisian',
        titleEn: 'Scottish Highlands — Lewisian Gneiss',
        bodyFr: 'Le Lewisian Gneiss du nord-ouest de l\'Écosse est parmi les plus anciennes roches d\'Europe (3 000 Ma — Archéen). Ces gneiss à bandes claires et sombres ont été formés à 25 km de profondeur, puis exhumés par l\'érosion sur des milliards d\'années.',
        bodyEn: 'The Lewisian Gneiss of northwest Scotland is among the oldest rocks in Europe (3 000 Ma — Archaean). These banded light and dark gneisses formed at 25 km depth, then exhumed by erosion over billions of years.',
        lon: -5, lat: 58, zoom: 7,
        layerIds: ['bgs-uk-625k'],
      },
      {
        titleFr: 'Les Pennines — Calcaires Carbonifères',
        titleEn: 'The Pennines — Carboniferous Limestone',
        bodyFr: 'Les Pennines exposent les calcaires du Carbonifère (350 Ma) formés dans une mer tropicale peu profonde. Le Yorkshire Dales National Park est un exemple classique de karst à lapiez, dolines et grottes — directement sculptées dans ce calcaire.',
        bodyEn: 'The Pennines expose Carboniferous limestone (350 Ma) formed in a shallow tropical sea. The Yorkshire Dales National Park is a classic example of karst with limestone pavements, dolines and caves — directly carved into this rock.',
        lon: -2.1, lat: 54.2, zoom: 7,
        layerIds: ['bgs-uk-625k'],
      },
      {
        titleFr: 'Le Sud-Est — Craie Crétacée',
        titleEn: 'Southeast England — Cretaceous Chalk',
        bodyFr: 'Les Falaises Blanches de Douvres sont taillées dans la Craie Crétacée (70–90 Ma), formée à partir de coccolithes de micro-algues marines dans une mer épicontinentale. La craie est quasi-pure (>98% CaCO₃) et constitue d\'importants aquifères.',
        bodyEn: 'The White Cliffs of Dover are cut into Cretaceous Chalk (70–90 Ma), formed from coccoliths of marine micro-algae in an epicontinental sea. The chalk is nearly pure (>98% CaCO₃) and forms important aquifers.',
        lon: 1.3, lat: 51.1, zoom: 8,
        layerIds: ['bgs-uk-625k'],
      },
      {
        titleFr: 'Irlande — Le Basalte de Giant\'s Causeway',
        titleEn: 'Ireland — The Giant\'s Causeway Basalt',
        bodyFr: 'La Chaussée des Géants (Irlande du Nord) consiste en ~40 000 colonnes de basalte hexagonales formées lors du volcanisme de l\'Atlantique Nord il y a 60 Ma. Ce volcanisme a précédé l\'ouverture de l\'Atlantique Nord entre l\'Europe et le Groenland.',
        bodyEn: 'The Giant\'s Causeway (Northern Ireland) consists of ~40 000 hexagonal basalt columns formed during North Atlantic volcanism 60 Ma ago. This volcanism preceded the opening of the North Atlantic between Europe and Greenland.',
        lon: -6.5, lat: 55.2, zoom: 8,
        layerIds: ['bgs-uk-625k'],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 4. African Cratons
  // ─────────────────────────────────────────────────────────────
  {
    id: 'african-cratons',
    titleFr: 'Les Cratons Africains',
    titleEn: 'African Cratons',
    subtitleFr: 'Les noyaux anciens du continent africain',
    subtitleEn: 'The ancient nuclei of the African continent',
    emoji: '🌍',
    duration: '8 min',
    steps: [
      {
        titleFr: 'Vue d\'ensemble — L\'Afrique, un Continent Stable',
        titleEn: 'Overview — Africa, a Stable Continent',
        bodyFr: 'L\'Afrique est dominée par des cratons archéens et protérozoïques — des noyaux de croûte continentale ancienne (>2 500 Ma) stabilisés par une lithosphère froide et épaisse. Ces terrains représentent certaines des roches les plus anciennes de la planète.',
        bodyEn: 'Africa is dominated by Archaean and Proterozoic cratons — nuclei of ancient continental crust (>2 500 Ma) stabilised by cold, thick lithosphere. These terrains include some of the oldest rocks on the planet.',
        lon: 20, lat: 0, zoom: 3,
        layerIds: ['cgmw-world-50m', 'cgmw-africa-5m'],
      },
      {
        titleFr: 'Le Bouclier Ouest-Africain',
        titleEn: 'The West African Craton',
        bodyFr: 'Le craton Ouest-Africain comprend les zones archéennes de Man-Léo (3 500 Ma) au sud et les bassins sédimentaires de Taoudéni et Voltaïen au nord. C\'est l\'un des cratons les mieux préservés du monde, avec peu de déformation depuis 2 Ga.',
        bodyEn: 'The West African Craton includes the Archaean Man-Leo domains (3 500 Ma) in the south and the Taoudéni and Voltaian sedimentary basins in the north. It is one of the best-preserved cratons in the world, with little deformation since 2 Ga.',
        lon: -5, lat: 15, zoom: 5,
        layerIds: ['cgmw-africa-5m'],
      },
      {
        titleFr: 'Le Hoggar — Bouclier Saharien Archéen',
        titleEn: 'The Hoggar — Archaean Saharan Shield',
        bodyFr: 'Le massif du Hoggar (Algérie) expose des granites et gneiss archéens au cœur du Sahara. Ce bouclier est traversé par le rift du Hoggar, actif au Cénozoïque avec du volcanisme alcalin récent visible à la surface.',
        bodyEn: 'The Hoggar massif (Algeria) exposes Archaean granites and gneisses in the heart of the Sahara. This shield is cross-cut by the Hoggar rift, active in the Cenozoic with recent alkaline volcanism visible at the surface.',
        lon: 5.5, lat: 23, zoom: 5,
        layerIds: ['cgmw-africa-5m', 'brgm-maghreb'],
      },
      {
        titleFr: 'Le Rift Est-Africain',
        titleEn: 'The East African Rift',
        bodyFr: 'Le Rift Est-Africain est un rift continental actif qui disloque progressivement la corne de l\'Afrique. La Somalie se sépare du reste du continent à ~6 mm/an. Le Lac Tanganyika (1 470 m de profondeur) remplit l\'un des demi-grabens du rift.',
        bodyEn: 'The East African Rift is an active continental rift progressively splitting the Horn of Africa. Somalia is separating from the rest of the continent at ~6 mm/yr. Lake Tanganyika (1 470 m deep) fills one of the rift half-grabens.',
        lon: 36, lat: 0, zoom: 4,
        layerIds: ['cgmw-africa-5m'],
      },
      {
        titleFr: 'Le Kaapvaal — Le Plus Vieux Craton Exposé',
        titleEn: 'The Kaapvaal — The Oldest Exposed Craton',
        bodyFr: 'Le craton du Kaapvaal (Afrique du Sud) contient les roches sédimentaires les plus anciennes connues (3 500 Ma, Formation de Fig Tree). C\'est aussi le seul endroit sur Terre où des diamants d\'origine mantellique primaire (kimberlites archéennes) sont abondants.',
        bodyEn: 'The Kaapvaal craton (South Africa) contains the oldest known sedimentary rocks (3 500 Ma, Fig Tree Formation). It is also the only place on Earth where primary mantle-derived diamonds (Archaean kimberlites) are abundant.',
        lon: 27, lat: -27, zoom: 5,
        layerIds: ['cgmw-africa-5m'],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 5. Australian Outback
  // ─────────────────────────────────────────────────────────────
  {
    id: 'australian-outback',
    titleFr: 'L\'Outback Australien',
    titleEn: 'The Australian Outback',
    subtitleFr: 'Le continent le plus plat et le plus érodé',
    subtitleEn: 'The flattest and most eroded continent',
    emoji: '🦘',
    duration: '7 min',
    steps: [
      {
        titleFr: 'Vue d\'ensemble — Un Continent Archéen',
        titleEn: 'Overview — An Archaean Continent',
        bodyFr: 'L\'Australie est dominée par des terrains précambriens stables. Le bouclier australien occidental est l\'un des plus anciens de la planète (Yilgarn et Pilbara, 3 500–3 800 Ma). La longue stabilité tectonique explique le relief aplani et l\'érosion extrême.',
        bodyEn: 'Australia is dominated by stable Precambrian terrains. The Western Australian Shield is one of the oldest on the planet (Yilgarn and Pilbara, 3 500–3 800 Ma). Long tectonic stability explains the flattened relief and extreme erosion.',
        lon: 134, lat: -26, zoom: 4,
        layerIds: ['cgmw-world-50m', 'ga-australia'],
      },
      {
        titleFr: 'Le Pilbara — Les Stromatolites les Plus Anciens',
        titleEn: 'The Pilbara — The Oldest Stromatolites',
        bodyFr: 'Le craton du Pilbara (Australie Occidentale) contient les stromatolites les plus anciennes connues (3 430–3 480 Ma, Formation de Dresser). Ces structures biosédimentaires formées par des cyanobactéries sont les plus vieilles traces de vie photosynthétique.',
        bodyEn: 'The Pilbara Craton (Western Australia) contains the oldest known stromatolites (3 430–3 480 Ma, Dresser Formation). These biosedimentary structures formed by cyanobacteria are the oldest traces of photosynthetic life.',
        lon: 118, lat: -21, zoom: 6,
        layerIds: ['ga-australia'],
      },
      {
        titleFr: 'Uluru — Arkose Cambrien',
        titleEn: 'Uluru — Cambrian Arkose',
        bodyFr: 'Uluru (Ayers Rock) est un inselberg d\'arkose (grès feldspathique) cambrien (~550 Ma) issu d\'une ancienne chaîne de montagnes érodée. L\'essentiel du rocher est enfoui sous le désert : seulement 340 m émergent sur les ~6 km de profondeur réelle.',
        bodyEn: 'Uluru (Ayers Rock) is an inselberg of Cambrian arkose (feldspathic sandstone, ~550 Ma) derived from an ancient eroded mountain range. Most of the rock is buried under the desert: only 340 m emerge above the ~6 km true depth.',
        lon: 131.0, lat: -25.3, zoom: 8,
        layerIds: ['ga-australia'],
      },
      {
        titleFr: 'Le Bassin de l\'Eromanga — Mer Intérieure Crétacée',
        titleEn: 'The Eromanga Basin — Cretaceous Inland Sea',
        bodyFr: 'Il y a 100 Ma, une mer épicontinentale couvrait un tiers de l\'Australie. Le bassin de l\'Eromanga a livré des fossiles de mosasaures, plésiosaures et des plantes de forêts tropicales. Ces sédiments forment aujourd\'hui le Great Artesian Basin, le plus grand aquifère artésien du monde.',
        bodyEn: 'One hundred Ma ago, an epicontinental sea covered a third of Australia. The Eromanga Basin has yielded fossils of mosasaurs, plesiosaurs and tropical forest plants. These sediments now form the Great Artesian Basin, the world\'s largest artesian aquifer.',
        lon: 143, lat: -27, zoom: 5,
        layerIds: ['ga-australia'],
      },
      {
        titleFr: 'Les Alpes Australiennes — Granites Dévoniens',
        titleEn: 'The Australian Alps — Devonian Granites',
        bodyFr: 'Les Alpes Australiennes (Victoria/NSW) sont les restes érodés de la chaîne calédonienne lachlanienne. Les granites S-type et I-type dévoniens (~380 Ma) exposés ici témoignent d\'une subduction ancienne suivie de collision. Le Mont Kosciuszko (2 228 m) est le point culminant du continent.',
        bodyEn: 'The Australian Alps (Victoria/NSW) are the eroded remnants of the Lachlan Caledonian belt. S-type and I-type Devonian granites (~380 Ma) exposed here record ancient subduction followed by collision. Mount Kosciuszko (2 228 m) is the highest point of the continent.',
        lon: 148, lat: -36.5, zoom: 6,
        layerIds: ['ga-australia'],
      },
    ],
  },
]
