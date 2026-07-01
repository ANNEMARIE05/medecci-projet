export interface ProgrammeCulte {
  id: string;
  titre: string;
  jour: string;
  horaire: string;
  description: string;
  type: 'hebd' | 'mens' | 'spec';
}

export interface Departement {
  id: string;
  nom: string;
  description: string;
  slogan: string;
  responsable: string;
  image: string;
}

export interface Verset {
  texte: string;
  reference: string;
}

export const VERSETS_BIBLIQUES: Verset[] = [
  {
    texte: "Moi, je choisis la bonne Part.",
    reference: "Luc 10:42 (Thème de l'année 2026)"
  },
  {
    texte: "Les Adorateurs que le Père demande.",
    reference: "Jean 4:23 (Thème Culte des cultes 2025)"
  },
  {
    texte: "Jésus leur dit : remplissez d'eau ces vases. Et ils les remplirent jusqu'au bord.",
    reference: "Jean 2:7 (Thème Actions de Grâce 2025)"
  },
  {
    texte: "Car là où deux ou trois sont assemblés en mon nom, je suis au milieu d'eux.",
    reference: "Matthieu 18:20"
  },
  {
    texte: "Je puis tout par celui qui me fortifie.",
    reference: "Philippiens 4:13"
  },
  {
    texte: "L'Éternel est mon berger: je ne manquerai de rien.",
    reference: "Psaume 23:1"
  }
];

export const PROGRAMMES_CULTES: ProgrammeCulte[] = [
  {
    id: "culte-jeunesse",
    titre: "Culte de la Jeunesse (JMEDECCI)",
    jour: "Chaque Dimanche",
    horaire: "07h00 - 08h30",
    description: "Un rassemblement dynamique et chaleureux dédié aux jeunes pour adorer Dieu et être fortifiés dans leur marche de foi.",
    type: "hebd"
  },
  {
    id: "culte-culte-d-adoration",
    titre: "Culte d'Adoration et de Louange (Culte des cultes)",
    jour: "Chaque Dimanche",
    horaire: "08h30 - 11h00",
    description: "Un moment intense de louange, d'adoration et de communion fraternelle pour toute la famille.",
    type: "hebd"
  },
  {
    id: "culte-etude-biblique",
    titre: "Enseignement Biblique & Prière",
    jour: "Chaque Jeudi",
    horaire: "19h00 - 20h30",
    description: "Approfondissement de la Parole de Dieu et intercession collective pour les besoins de l'église.",
    type: "hebd"
  },
  {
    id: "culte-culte-de-delivrance",
    titre: "Culte de Délivrance et d'Intercession",
    jour: "Chaque Vendredi",
    horaire: "09h00 - 12h00",
    description: "Prière intense pour la libération spirituelle, la guérison et le brisement des chaînes.",
    type: "hebd"
  },
  {
    id: "culte-nuit-d-impact",
    titre: "Nuit d'Impact & de Traversée",
    jour: "Dernier Vendredi du mois",
    horaire: "22h00 - 05h00",
    description: "Une veillée de prière stratégique pour prophétiser sur le mois à venir et briser les verrous de l'ennemi.",
    type: "mens"
  },
  {
    id: "culte-convention-annuelle",
    titre: "Convention Nationale de la MEDECCI",
    jour: "Août (Annuel)",
    horaire: "Programmation spéciale",
    description: "Le grand rassemblement de tous les temples MEDECCI de Côte d'Ivoire et de la diaspora pour des moments de rafraîchissement spirituel.",
    type: "spec"
  }
];

export const DEPARTEMENTS: Departement[] = [
  {
    id: "jeunesse",
    nom: "Jeunesse (JMEDECCI)",
    description: "Mobiliser, former et équiper la jeune génération pour faire d'eux des leaders chrétiens intègres et dynamiques, impactant leur milieu scolaire, professionnel et social.",
    slogan: "Jeune, lève-toi et brille pour Christ !",
    responsable: "Frère Konan Désiré",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "femmes",
    nom: "Département des Femmes",
    description: "Encourager l'épanouissement spirituel, familial et social des femmes à travers des partages, des formations et des actions de solidarité pour bâtir des foyers stables.",
    slogan: "Femme de valeur, pilier de foi et de sagesse.",
    responsable: "Maman Kouamé Florence",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "hommes",
    nom: "Département des Hommes",
    description: "Rassembler les hommes pour assumer pleinement leur rôle de prêtre de leur maison, de modèle dans la société et de bâtisseur dévoué au sein de l'œuvre de Dieu.",
    slogan: "Des hommes forts dans la foi et l'action.",
    responsable: "Ancien N'Guessan Koffi",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "chorale",
    nom: "Chorale Écho du Ciel",
    description: "Conduire le peuple de Dieu dans sa sainte présence à travers la louange et l'adoration prophétique lors de tous nos rassemblements liturgiques.",
    slogan: "Louer Dieu en esprit et en vérité.",
    responsable: "Sœur Amenan Marie-Ange",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "ecodim",
    nom: "École du Dimanche (Écodim)",
    description: "Instruire les enfants dès leur plus jeune âge selon les préceptes bibliques pour en faire des disciples de Jésus-Christ avec des bases morales et spirituelles solides.",
    slogan: "Laissez venir à moi les petits enfants.",
    responsable: "Monitrice Yao Christiane",
    image: "https://images.unsplash.com/photo-1484981138541-3d074aa97716?auto=format&fit=crop&q=80&w=800"
  }
];

export const INFOS_CONTACT = {
  nomEglise: "MEDEC-CI (Mission Évangélique de Dieu En Christ Côte d'Ivoire)",
  siege: "Koumassi Quartier 32, derrière la station Petro-Ivoire, Abidjan, Côte d'Ivoire",
  telephone: "+225 07 58 52 67 66 / +225 07 57 49 75 32",
  email: "contact@medecci.org",
  facebook: "https://www.facebook.com/medecciofficiel",
  youtube: "https://www.youtube.com/@medecciofficiel",
  horairesSiege: "Jeudi : 19h00 - 20h30 | Dimanche : 08h30 - 11h00 (GMT)",
  pasteurPrincipal: "Prophète ASSANDE Jacques (Président de la MEDEC-CI)"
};
