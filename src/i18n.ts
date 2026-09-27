import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const fr = {
  translation: {
    appName: 'BosboSExplore',
    tagline: 'Cartographie Géologique Interactive',
    nav: {
      map: 'Carte',
      tours: 'Tours',
      about: 'À propos',
    },
    welcome: {
      title: 'Bienvenue sur BosboSExplore',
      subtitle: 'Explorez la géologie mondiale à travers des données WMS haute résolution',
      whatTitle: 'Quoi & Pourquoi',
      whatBody: 'BosboSExplore agrège des couches WMS de services géologiques nationaux — BRGM, BGS, GSJ et plus — pour offrir une fenêtre unifiée sur la lithologie mondiale.',
      howTitle: 'Comment utiliser',
      howBody: 'Activez des couches géologiques depuis le panneau gauche, cliquez sur la carte pour inspecter une formation, et lancez un tour guidé pour explorer les grandes structures tectoniques.',
      tip: 'Conseil : les couches WMS dépendent de serveurs tiers. Un indicateur de chargement vous signale si un serveur est lent ou indisponible.',
      start: 'Commencer l\'exploration',
    },
    layers: 'Couches',
    addLayer: 'Ajouter une couche WMS',
    guidedTours: 'Tours guidés',
    about: 'À propos',
    basemap: {
      street: 'OpenStreetMap',
      topo: 'OpenTopoMap',
      satellite: 'Esri Satellite',
    },
    opacity: 'Opacité',
    zoomToExtent: 'Zoom sur l\'emprise',
    removeLayer: 'Supprimer',
    clickForInfo: 'Cliquez sur la carte pour inspecter',
    geologicalAge: 'Âge géologique',
    rockType: 'Type de roche',
    formation: 'Formation',
    learnMore: 'En savoir plus',
    loading: 'Chargement…',
    error: 'Erreur de chargement',
    noInfo: 'Aucune information disponible à cet endroit.',
    coordinates: 'Coordonnées',
    zoomHome: 'Vue mondiale',
    langToggle: 'EN',
    wmsUrl: 'URL du service WMS',
    connect: 'Connecter',
    selectLayer: 'Sélectionner une couche',
    add: 'Ajouter',
    cancel: 'Annuler',
  }
}

const en = {
  translation: {
    appName: 'BosboSExplore',
    tagline: 'Interactive Geological Mapping',
    nav: {
      map: 'Map',
      tours: 'Tours',
      about: 'About',
    },
    welcome: {
      title: 'Welcome to BosboSExplore',
      subtitle: 'Explore global geology through high-resolution WMS data',
      whatTitle: 'What & Why',
      whatBody: 'BosboSExplore aggregates WMS layers from national geological surveys — BRGM, BGS, GSJ and more — to provide a unified window into global lithology.',
      howTitle: 'How to Use',
      howBody: 'Activate geological layers from the left panel, click the map to inspect a formation, and launch a guided tour to explore major tectonic structures.',
      tip: 'Tip: WMS layers depend on third-party servers. A loading indicator will flag slow or unavailable servers.',
      start: 'Start Exploring',
    },
    layers: 'Layers',
    addLayer: 'Add WMS Layer',
    guidedTours: 'Guided Tours',
    about: 'About',
    basemap: {
      street: 'OpenStreetMap',
      topo: 'OpenTopoMap',
      satellite: 'Esri Satellite',
    },
    opacity: 'Opacity',
    zoomToExtent: 'Zoom to Extent',
    removeLayer: 'Remove',
    clickForInfo: 'Click map to inspect',
    geologicalAge: 'Geological Age',
    rockType: 'Rock Type',
    formation: 'Formation',
    learnMore: 'Learn More',
    loading: 'Loading…',
    error: 'Load Error',
    noInfo: 'No information available at this location.',
    coordinates: 'Coordinates',
    zoomHome: 'World View',
    langToggle: 'FR',
    wmsUrl: 'WMS Service URL',
    connect: 'Connect',
    selectLayer: 'Select a Layer',
    add: 'Add',
    cancel: 'Cancel',
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources: { fr, en },
    lng: 'fr',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })

export default i18n
