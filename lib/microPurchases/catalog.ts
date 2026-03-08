export type MicroProduct = {
  id: string;
  title: string;
  description: string;
  price: number; // en euros
  stripePriceId: string; // env var
  generationPrompt: string; // prompt Gemini pour générer le contenu
};

export const MICRO_PRODUCTS: MicroProduct[] = [
  {
    id: "portrait-complet",
    title: "Portrait astro-numérologique complet",
    description:
      "Analyse complète de ton profil : numérologie, thème astral, forces, défis.",
    price: 7.99,
    stripePriceId: process.env.STRIPE_PRICE_PORTRAIT ?? "",
    generationPrompt:
      "Génère un portrait astro-numérologique complet et détaillé pour cet utilisateur. Intègre son chemin de vie, la vibration de son prénom, son signe solaire, son ascendant et son signe lunaire. Structure en sections : Essence (synthèse en 3 lignes), Forces profondes, Défis de vie, Mission d'âme, Conseil pour cette période. Ton : oracle bienveillant, précis, poétique.",
  },
  {
    id: "lecture-couple",
    title: "Lecture de couple approfondie",
    description:
      "Compatibilité totale : prénoms, signes, synthèse narrative.",
    price: 5.99,
    stripePriceId: process.env.STRIPE_PRICE_COUPLE ?? "",
    generationPrompt:
      "Génère une lecture de couple approfondie entre deux personnes. Prends en compte leurs vibrations de prénoms, leurs signes astrologiques, leurs éléments et leurs modalités. Structure en sections : Résonance vibratoire, Dynamique énergétique, Points de friction, Potentiel d'union, Conseil pratique. Ton : oracle bienveillant, nuancé, non-prescriptif.",
  },
  {
    id: "analyse-annee",
    title: "Analyse de ton année 2026",
    description:
      "Mois par mois, basée sur tes transits et ton année personnelle.",
    price: 4.99,
    stripePriceId: process.env.STRIPE_PRICE_ANNEE ?? "",
    generationPrompt:
      "Génère une analyse mois par mois de l'année 2026 pour cet utilisateur. Utilise son année personnelle numérologique et ses positions planétaires natales. Pour chaque mois : thème dominant (2 mots), message court (2 phrases), domaine mis en avant (amour/travail/créativité/soin). Termine par une synthèse annuelle en 3 lignes. Ton : oracle précis, inspirant.",
  },
];

export function findProduct(id: string): MicroProduct | undefined {
  return MICRO_PRODUCTS.find((p) => p.id === id);
}
