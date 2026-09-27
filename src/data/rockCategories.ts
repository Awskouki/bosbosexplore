export type RockCategory = 'all' | 'igneous' | 'sedimentary' | 'metamorphic' | 'volcanic'

export const ROCK_CATEGORIES: {
  id: RockCategory
  labelFr: string
  labelEn: string
  color: string
  emoji: string
  keywordsFr: string[]
  keywordsEn: string[]
}[] = [
  {
    id: 'igneous',
    labelFr: 'Roches ignées',
    labelEn: 'Igneous Rocks',
    color: '#e8611a',
    emoji: '🔴',
    keywordsFr: ['granite','gabbro','diorite','syénite','péridotite','basalte','andésite','rhyolite','obsidienne','porphyre','pluton','intrusif'],
    keywordsEn: ['granite','gabbro','diorite','syenite','peridotite','basalt','andesite','rhyolite','obsidian','porphyry','igneous','plutonic','intrusive'],
  },
  {
    id: 'sedimentary',
    labelFr: 'Roches sédimentaires',
    labelEn: 'Sedimentary Rocks',
    color: '#f0b429',
    emoji: '🟡',
    keywordsFr: ['calcaire','grès','argile','schiste','craie','dolomie','conglomérat','alluvion','sel','gypse','charbon','sédiment','molasse','flysch','marne'],
    keywordsEn: ['limestone','sandstone','shale','chalk','dolomite','conglomerate','alluvium','salt','gypsum','coal','sediment','mudstone','claystone','marl','flysch'],
  },
  {
    id: 'metamorphic',
    labelFr: 'Roches métamorphiques',
    labelEn: 'Metamorphic Rocks',
    color: '#00b4a6',
    emoji: '🟢',
    keywordsFr: ['gneiss','schiste','quartzite','marbre','amphibolite','migmatite','éclogite','phyllite','ardoise','métamorphique'],
    keywordsEn: ['gneiss','schist','quartzite','marble','amphibolite','migmatite','eclogite','phyllite','slate','metamorphic','mylonite'],
  },
  {
    id: 'volcanic',
    labelFr: 'Roches volcaniques',
    labelEn: 'Volcanic Rocks',
    color: '#dc2626',
    emoji: '🌋',
    keywordsFr: ['tuf','ignimbrite','cinérite','cendre','brèche volcanique','basalte','andésite','rhyolite','lave','volcanique','pyroclastique'],
    keywordsEn: ['tuff','ignimbrite','tephra','ash','volcanic breccia','lava','basalt','andesite','rhyolite','volcanic','pyroclastic','obsidian'],
  },
]
