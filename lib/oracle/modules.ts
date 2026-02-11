export type ModuleDef = {
  id: string;
  portal_id: "comprendre" | "aimer" | "prevoir" | "recevoir";
  title: string;
  description: string;
  isPremium: boolean;
};

export const MODULES: ModuleDef[] = [
  {
    id: "vibe-check",
    portal_id: "comprendre",
    title: "Vibe Check",
    description: "Énergie du moment (prénom + humeur).",
    isPremium: false,
  },
  {
    id: "shadow-mirror",
    portal_id: "comprendre",
    title: "Miroir des Ombres",
    description: "Blocage inconscient (peur actuelle).",
    isPremium: true,
  },
  {
    id: "heart-sync",
    portal_id: "aimer",
    title: "Météo du Cœur",
    description: "Dynamique relationnelle (statut).",
    isPremium: false,
  },
  {
    id: "next-step-love",
    portal_id: "aimer",
    title: "Prochain Pas",
    description: "Action concrète en amour.",
    isPremium: true,
  },
  {
    id: "weekly-window",
    portal_id: "prevoir",
    title: "Fenêtre 7 jours",
    description: "Tendance de la semaine.",
    isPremium: false,
  },
  {
    id: "decision-ab",
    portal_id: "prevoir",
    title: "Décision A vs B",
    description: "Cadre pour choisir.",
    isPremium: true,
  },
  {
    id: "daily-mantra",
    portal_id: "recevoir",
    title: "Mantra du Jour",
    description: "Affirmation (intention).",
    isPremium: false,
  },
  {
    id: "abundance-key",
    portal_id: "recevoir",
    title: "Clé d'Abondance",
    description: "Lever les freins financiers.",
    isPremium: true,
  },
];

export function getModulesByPortal(
  portal_id: ModuleDef["portal_id"]
): ModuleDef[] {
  return MODULES.filter((m) => m.portal_id === portal_id);
}
