import { useTranslation } from 'react-i18next'
import { ArrowLeft, ExternalLink } from 'lucide-react'

interface Props {
  onClose: () => void
}

export default function AboutPage({ onClose }: Props) {
  const { i18n } = useTranslation()
  const fr = i18n.language === 'fr'

  return (
    <div className="min-h-full bg-[#0a0f1e]/95 panel-grid">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-[11px] text-[#8fa3bc] hover:text-[#e8edf5]
            transition-colors mb-8 uppercase tracking-widest"
        >
          <ArrowLeft size={13} />
          {fr ? 'Retour à la carte' : 'Back to Map'}
        </button>

        <h1 className="font-serif text-2xl font-semibold text-[#e8edf5] mb-1">
          {fr ? 'À propos de BosboSExplore' : 'About BosboSExplore'}
        </h1>
        <p className="text-sm font-serif italic text-[#8fa3bc] mb-8">
          {fr ? 'Cartographie Géologique Interactive' : 'Interactive Geological Mapping'}
        </p>

        <section className="mb-8 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#00b4a6]">
            {fr ? 'Objet' : 'Purpose'}
          </h2>
          <p className="text-sm text-[#8fa3bc] leading-relaxed">
            {fr
              ? 'BosboSExplore est un outil pédagogique destiné aux étudiants en géologie et génie géologique. Il agrège des couches WMS issues de services géologiques nationaux pour permettre l\'exploration interactive de la lithologie mondiale.'
              : 'BosboSExplore is an educational tool for geology and geological engineering students. It aggregates WMS layers from national geological surveys to enable interactive exploration of global lithology.'}
          </p>
        </section>

        <section className="mb-8 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#00b4a6]">
            {fr ? 'Comment fonctionne le WMS ?' : 'How does WMS work?'}
          </h2>
          <p className="text-sm text-[#8fa3bc] leading-relaxed">
            {fr
              ? 'Le Web Map Service (WMS) est un standard OGC permettant à des serveurs de publier des cartes sous forme d\'images géoréférencées. Pour chaque étendue affichée, le client envoie une requête GetMap ; le serveur renvoie une image PNG ou JPEG superposable au fond de carte. La requête GetFeatureInfo permet d\'interroger les attributs d\'un pixel cliqué.'
              : 'The Web Map Service (WMS) is an OGC standard that allows servers to publish maps as georeferenced images. For each displayed extent, the client sends a GetMap request; the server returns a PNG or JPEG image overlaid on the base map. The GetFeatureInfo request retrieves attributes for a clicked pixel.'}
          </p>
        </section>

        <section className="mb-8 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#00b4a6]">
            {fr ? 'Sources de données' : 'Data Sources'}
          </h2>
          <ul className="space-y-2">
            {DATA_SOURCES.map(src => (
              <li key={src.url} className="flex items-start gap-2 text-sm">
                <span className="text-[#546a80] mt-0.5">—</span>
                <div>
                  <a href={src.url} target="_blank" rel="noopener noreferrer"
                    className="text-[#00b4a6] hover:text-[#e8edf5] transition-colors inline-flex items-center gap-1">
                    {src.name}
                    <ExternalLink size={10} />
                  </a>
                  <span className="text-[#546a80] text-xs ml-1">— {fr ? src.descFr : src.descEn}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-8 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#00b4a6]">
            {fr ? 'Crédits' : 'Credits'}
          </h2>
          <p className="text-sm text-[#8fa3bc] leading-relaxed">
            {fr
              ? 'Construit avec OpenLayers 8, React, Vite, Tailwind CSS, Framer Motion et react-i18next. Tuiles de base : OpenStreetMap, OpenTopoMap, Esri.'
              : 'Built with OpenLayers 8, React, Vite, Tailwind CSS, Framer Motion and react-i18next. Base tiles: OpenStreetMap, OpenTopoMap, Esri.'}
          </p>
        </section>

        <p className="text-xs text-[#546a80] border-t border-white/[0.06] pt-6">
          BosboSExplore — {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}

const DATA_SOURCES = [
  {
    name: 'CGMW / BRGM',
    url: 'https://www.ccgm.org',
    descFr: 'Carte géologique mondiale 1:50M',
    descEn: 'World geological map 1:50M',
  },
  {
    name: 'GSJ / AIST (Japan)',
    url: 'https://gbank.gsj.jp',
    descFr: 'Géologie du Japon 1:1M',
    descEn: 'Japan geology 1:1M',
  },
  {
    name: 'BGS / UKRI',
    url: 'https://www.bgs.ac.uk',
    descFr: 'Socle géologique Royaume-Uni 625k',
    descEn: 'UK bedrock geology 625k',
  },
  {
    name: 'BRGM France',
    url: 'https://infoterre.brgm.fr',
    descFr: 'Géologie France 1:50k',
    descEn: 'France geology 1:50k',
  },
  {
    name: 'NGU Norway',
    url: 'https://www.ngu.no',
    descFr: 'Géologie Norvège',
    descEn: 'Norway geology',
  },
  {
    name: 'USGS',
    url: 'https://mrdata.usgs.gov',
    descFr: 'Géologie États-Unis',
    descEn: 'USA geology',
  },
  {
    name: 'Geoscience Australia',
    url: 'https://www.ga.gov.au',
    descFr: 'Géologie Australie',
    descEn: 'Australia geology',
  },
  {
    name: 'SGU Sweden',
    url: 'https://www.sgu.se',
    descFr: 'Géologie Suède',
    descEn: 'Sweden geology',
  },
  {
    name: 'GNS Science NZ',
    url: 'https://www.gns.cri.nz',
    descFr: 'Géologie Nouvelle-Zélande',
    descEn: 'New Zealand geology',
  },
  {
    name: 'OpenStreetMap',
    url: 'https://www.openstreetmap.org',
    descFr: 'Fond de carte street',
    descEn: 'Street base map',
  },
]
