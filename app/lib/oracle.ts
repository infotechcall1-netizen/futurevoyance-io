export type OracleVibration = {
  vibration: number;
  title: string;
  keyword: string;
  dailyMessage: string;
  dailyRitual: string;
  personalMessage: string;
  personalRitual: string;
  day_calc_steps?: string[];
  life_path_steps?: string[];
  personal_resonance_steps?: string[];
};

export const ORACLE_VIBRATIONS: Record<number, OracleVibration> = {
  1: {
    vibration: 1,
    title: "Étincelle originelle",
    keyword: "Initiation",
    dailyMessage:
      "Aujourd’hui, une première marche se présente. Même si le chemin n’est pas encore net, ton premier pas suffit à réveiller la suite.",
    dailyRitual:
      "Choisis une seule action claire à accomplir avant ce soir. Écris-la, prononce-la à voix haute, puis engage-toi à la terminer.",
    personalMessage:
      "Ton énergie appelle un nouveau départ lucide. Fais confiance à ton premier élan : il porte en lui plus de sagesse que tu ne l’imagines.",
    personalRitual:
      "Note un projet ou un désir que tu repousses. Trace autour de lui un cercle, puis écris : « J’autorise ce commencement ». Garde la feuille à portée de vue.",
  },
  2: {
    vibration: 2,
    title: "Alliance subtile",
    keyword: "Écoute",
    dailyMessage:
      "La journée favorise les échanges calmes et les accords silencieux. Ce que tu entends entre les mots compte autant que ce qui est dit.",
    dailyRitual:
      "Prends dix minutes pour écouter quelqu’un ou écrire ce que tu ressens, sans chercher à répondre ni à conclure.",
    personalMessage:
      "Ta vibration du moment t’invite à co-créer plutôt qu’à porter seul·e. Une relation, un partenariat ou un soutien veut se révéler.",
    personalRitual:
      "Identifie une personne ou une force (guide, allié, ancêtre) que tu souhaites inviter à tes côtés. Murmure son nom et demande explicitement son aide pour la période qui s’ouvre.",
  },
  3: {
    vibration: 3,
    title: "Verbe créateur",
    keyword: "Expression",
    dailyMessage:
      "Les idées affluent et cherchent une forme. Ce que tu exprimes aujourd’hui peut semer une joie durable autour de toi.",
    dailyRitual:
      "Écris ou prononce trois phrases qui commencent par « Je choisis ». Laisse-les devenir ton mantra discret de la journée.",
    personalMessage:
      "Ton univers intérieur a besoin de sortir de l’ombre. Une histoire, un talent, une nuance de toi demande à être partagée.",
    personalRitual:
      "Consacre quinze minutes à créer quelque chose de simple : quelques lignes, un dessin, une mélodie. Peu importe le résultat, honore le geste créatif.",
  },
  4: {
    vibration: 4,
    title: "Temple intérieur",
    keyword: "Structure",
    dailyMessage:
      "L’énergie du jour consolide ce qui est prêt à durer. Ce que tu organises maintenant offrira un socle fiable aux prochains mouvements.",
    dailyRitual:
      "Range ou réorganise un petit espace que tu utilises chaque jour. En le clarifiant, tu signales à la vie que tu es prêt·e pour plus de stabilité.",
    personalMessage:
      "Ton Oracle souligne un besoin de cadre bienveillant : poser des limites, des horaires, des priorités qui protègent ton énergie.",
    personalRitual:
      "Écris quatre piliers pour les jours à venir (sommeil, corps, liens, projets). Pour chacun, choisis une petite action concrète à respecter.",
  },
  5: {
    vibration: 5,
    title: "Vent des possibles",
    keyword: "Mouvement",
    dailyMessage:
      "Le jour porte une vibration de changement. Même un léger déplacement peut transformer ta perception et ouvrir un passage inattendu.",
    dailyRitual:
      "Modifie un détail de ta routine : chemin, heure, ordre des actions. Observe comment ton corps réagit à cette liberté minuscule.",
    personalMessage:
      "Ton énergie appelle l’exploration. Il est temps d’oser une variation, un essai, un espace où tu ne connais pas encore la suite.",
    personalRitual:
      "Choisis un domaine où tu te sens figé·e. Écris une petite expérience à tenter cette semaine et engage-toi à la vivre avant la prochaine lune.",
  },
  6: {
    vibration: 6,
    title: "Cercle sacré",
    keyword: "Harmonie",
    dailyMessage:
      "La vibration du jour enveloppe tes liens et ton foyer. Ce que tu offres avec douceur revient vers toi sous une autre forme.",
    dailyRitual:
      "Allume une bougie ou une lumière douce. En la plaçant devant toi, pense à trois personnes ou lieux que tu souhaites bénir aujourd’hui.",
    personalMessage:
      "Ton Oracle te parle de responsabilité choisie, pas subie. Il t’invite à prendre soin sans t’oublier, à ajuster la balance entre toi et les autres.",
    personalRitual:
      "Note ce que tu donnes beaucoup en ce moment, puis ce que tu reçois. Ajoute une action simple pour nourrir ton propre cœur dès ce soir.",
  },
  7: {
    vibration: 7,
    title: "Silence révélateur",
    keyword: "Intuition",
    dailyMessage:
      "La journée se prête aux réponses intérieures. Les signes te parlent dans les interstices : un silence, un regard, un souvenir qui insiste.",
    dailyRitual:
      "Accorde-toi sept minutes de calme sans écran. Observe ta respiration, puis note le premier mot, image ou sensation qui se présente.",
    personalMessage:
      "Ton Oracle t’invite à faire confiance à ce que tu pressens déjà. Tu n’as pas besoin de toutes les preuves pour ajuster ta trajectoire.",
    personalRitual:
      "Avant de dormir, formule une question précise. Pose-la à voix basse, puis dépose un verre d’eau ou un carnet près de ton lit pour accueillir la réponse.",
  },
  8: {
    vibration: 8,
    title: "Flux et maîtrise",
    keyword: "Puissance",
    dailyMessage:
      "L’énergie du jour met en lumière ton rapport à la matière : temps, argent, engagements. Ce que tu clarifies se remet à circuler.",
    dailyRitual:
      "Choisis un engagement concret (facture, mail, décision) et règle-le aujourd’hui. Ce geste libère une part de ta puissance retenue.",
    personalMessage:
      "Ton potentiel demande à se tenir droit, sans excès ni retrait. Il t’appelle à assumer ce que tu vaux, dans tous les sens du terme.",
    personalRitual:
      "Écris une phrase commençant par « Je mérite » en parlant de ton temps, de ton énergie ou de ton travail. Relis-la trois fois en respirant profondément.",
  },
  9: {
    vibration: 9,
    title: "Clôture lumineuse",
    keyword: "Transmutation",
    dailyMessage:
      "La vibration du jour soutient les fins nécessaires. Ce que tu remercies et laisses partir libère un espace précieux pour la suite.",
    dailyRitual:
      "Note quelque chose que tu es prêt·e à laisser derrière toi. Plie le papier, remercie ce qu’il t’a appris, puis range-le dans un endroit que tu n’ouvres presque jamais.",
    personalMessage:
      "Ton Oracle souligne une mue : une version de toi a terminé son cycle. Tu peux honorer ce qui a été tout en accueillant ce qui vient.",
    personalRitual:
      "Choisis un objet, une habitude ou une croyance dont tu sens l’usure. Décide d’un geste concret pour t’en détacher avant la fin du mois.",
  },  11: {
    vibration: 11,
    title: "Portail de l'Illumination",
    keyword: "Vision",
    dailyMessage:
      "Un nombre maître éclaire cette journée. Les synchronicités parlent plus fort : accueille-les comme des confirmations silencieuses de ta direction.",
    dailyRitual:
      "Note trois signes ou coïncidences que tu observes aujourd'hui. Avant de dormir, relis-les et cherche le fil invisible qui les relie.",
    personalMessage:
      "Le 11 amplifie ton intuition et souligne un alignement rare entre ton chemin de naissance et l'énergie du jour. Ce que tu pressens mérite d'être écouté.",
    personalRitual:
      "Assieds-toi en silence, ferme les yeux et pose une question intérieure. Reste attentif·e au premier symbole, mot ou image qui émerge — il porte un message pour toi.",
  },
  22: {
    vibration: 22,
    title: "L'Architecte sacré",
    keyword: "Manifestation",
    dailyMessage:
      "Le nombre maître 22 porte la vision la plus ambitieuse vers la matière. Ce que tu construis aujourd'hui peut dépasser ce que tu imaginais possible.",
    dailyRitual:
      "Dessine ou écris ta vision la plus large pour les mois à venir. Pas de censure : laisse émerger l'ampleur, puis choisis un premier geste concret.",
    personalMessage:
      "Le 22 t'appelle à devenir bâtisseur·euse : un projet, un lien, une fondation intérieure demande ta maîtrise calme et ta patience structurée.",
    personalRitual:
      "Choisis un domaine de ta vie et décris en quatre phrases la forme idéale qu'il pourrait prendre. Engage une première action dès demain.",
  },
  33: {
    vibration: 33,
    title: "Le Maître enseignant",
    keyword: "Compassion",
    dailyMessage:
      "Le 33 est le plus rare des nombres maîtres. L'énergie du jour t'invite à élever les autres en partageant ce que tu as traversé avec douceur et vérité.",
    dailyRitual:
      "Envoie un message sincère à quelqu'un qui a besoin d'être entendu. Pas de conseil : juste ta présence et tes mots vrais.",
    personalMessage:
      "Le 33 unit la vision du 11 et la force du 22. Ton chemin aujourd'hui demande un acte de service lucide, sans sacrifice ni oubli de toi-même.",
    personalRitual:
      "Identifie un savoir ou une expérience que tu pourrais transmettre. Offre-le aujourd'hui, même modestement, à une personne qui en a besoin.",
  },};

export function reduceTo9(input: number): number {
  const n = Math.abs(Math.floor(input));
  if (!n) return 9;
  return ((n - 1) % 9) + 1;
}

/* ── Traditional numerology helpers ─────────────────────────── */

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function fmtDate(day: number, month: number, year: number): string {
  return `${pad2(day)}/${pad2(month)}/${year}`;
}

/**
 * Traditional digit-sum reduction of a DD/MM/YYYY date string.
 * Reduces to 1–9. Notes master numbers 11/22/33 if they appear.
 */
export function traditionalDateReduce(dateStr: string): { value: number; steps: string[] } {
  const digits = dateStr.replace(/\//g, "").split("");
  const steps: string[] = [dateStr];

  let sum = digits.reduce((s, c) => s + Number(c), 0);
  steps.push(`${digits.join("+")} = ${sum}`);

  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    const chars = String(sum).split("");
    const next = chars.reduce((s, c) => s + Number(c), 0);
    steps.push(`${chars.join("+")} = ${next}`);
    sum = next;
  }

  if (sum === 11 || sum === 22 || sum === 33) {
    steps.push(`${sum} est un nombre maître`);
  }

  return { value: sum, steps };
}

/**
 * Life path from a DD/MM/YYYY date string.
 * Stops reduction at master numbers 11/22/33.
 */
export function lifePathFromDate(dateStr: string): {
  traditional: number;
  reduced: number;
  steps: string[];
} {
  const digits = dateStr.replace(/\//g, "").split("");
  const steps: string[] = [dateStr];

  let sum = digits.reduce((s, c) => s + Number(c), 0);
  steps.push(`${digits.join("+")} = ${sum}`);

  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    const chars = String(sum).split("");
    const next = chars.reduce((s, c) => s + Number(c), 0);
    steps.push(`${chars.join("+")} = ${next}`);
    sum = next;
  }

  const traditional = sum;
  let reduced = sum;
  if (reduced > 9) {
    reduced = String(reduced)
      .split("")
      .reduce((s, c) => s + Number(c), 0);
  }

  return { traditional, reduced, steps };
}

/* ── Exported helpers ───────────────────────────────────────── */

export function dailyVibration(date: Date): number {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return traditionalDateReduce(fmtDate(day, month, year)).value;
}

export function oracleOfDay(date: Date): OracleVibration {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const dateStr = fmtDate(day, month, year);
  const { value, steps } = traditionalDateReduce(dateStr);

  return {
    ...ORACLE_VIBRATIONS[value],
    day_calc_steps: steps,
  };
}

export function oraclePersonal(date: Date, birthISO: string): OracleVibration {
  const birth = new Date(birthISO);

  if (Number.isNaN(birth.getTime())) {
    return oracleOfDay(date);
  }

  /* Life path */
  const bDay = birth.getDate();
  const bMonth = birth.getMonth() + 1;
  const bYear = birth.getFullYear();
  const birthDateStr = fmtDate(bDay, bMonth, bYear);
  const lp = lifePathFromDate(birthDateStr);
  const lifePathSteps = [...lp.steps];
  if (lp.traditional !== lp.reduced) {
    lifePathSteps.push(`${lp.traditional} est un nombre maître`);
  }

  /* Daily vibration (same digital-root as traditional sum) */
  const dayVib = dailyVibration(date);

  /* Resonance = life_path + daily_vibration */
  const raw = lp.traditional + dayVib;
  const resonanceSteps: string[] = [];
  let resonance: number;

  if (raw === 11 || raw === 22 || raw === 33) {
    resonanceSteps.push(`${lp.traditional} + ${dayVib} = ${raw}`);
    resonanceSteps.push(`${raw} est un nombre maître`);
    resonance = raw;
  } else if (raw > 9) {
    resonanceSteps.push(`${lp.traditional} + ${dayVib} = ${raw}`);
    const chars = String(raw).split("");
    const reduced = chars.reduce((s, c) => s + Number(c), 0);
    resonanceSteps.push(`${chars.join("+")} = ${reduced}`);
    resonance = reduced;
  } else {
    resonanceSteps.push(`${lp.traditional} + ${dayVib} = ${raw}`);
    resonance = raw;
  }

  return {
    ...ORACLE_VIBRATIONS[resonance],
    life_path_steps: lifePathSteps,
    personal_resonance_steps: resonanceSteps,
  };
}

