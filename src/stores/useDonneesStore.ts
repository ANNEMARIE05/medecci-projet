import { useSyncExternalStore } from 'react';

export interface Membre {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  dateInscription: string;
  statut: string;
}

export interface Actualite {
  id: string;
  titre: string;
  description: string;
  contenu: string;
  datePublication: string;
  image: string;
  auteur: string;
}

export interface Sermon {
  id: string;
  titre: string;
  predicateur: string;
  date: string;
  versetRef: string;
  description: string;
  lienYoutube: string;
  lienAudio: string;
}

export interface Evenement {
  id: string;
  titre: string;
  description: string;
  dateDebut: string;
  dateFin: string;
  lieu: string;
  image: string;
  categorie: string;
}

export interface Don {
  id: string;
  nomDonateur: string;
  telephone: string;
  montant: number;
  typeDon: 'Dîme' | 'Offrande' | 'Construction' | 'Social' | 'Mission';
  modePaiement: 'Wave' | 'Orange Money' | 'MTN MoMo' | 'Moov Money' | 'Carte Bancaire';
  date: string;
  commentaire?: string;
}

export interface DemandePriere {
  id: string;
  nom: string;
  telephone: string;
  sujet: string;
  message: string;
  date: string;
  statut: 'A_TRAITER' | 'EN_PRIERE' | 'EXAUCE';
}

export interface NotificationMed {
  id: string;
  message: string;
  date: string;
  lu: boolean;
}

export interface Meditation {
  id: string;
  titre: string;
  versetRef: string;
  versetTexte: string;
  contenu: string;
  date: string;
  auteur: string;
}

export interface Suggestion {
  id: string;
  nom: string;
  telephone: string;
  sujet: string;
  message: string;
  date: string;
}

export interface ModificationTx {
  date: string;
  ancienMontant: number;
  nouveauMontant: number;
}

export interface Transaction {
  id: string;
  idCaisse: string;
  idMembre: string;
  montant: number;
  commentaire: string;
  date: string;
  modifications?: ModificationTx[];
  typeDon?: string;
  modePaiement?: string;
}

export interface Caisse {
  id: string;
  nom: string;
  code: string;
  responsable: string;
  objectif: number;
  categorie: string;
  description: string;
  dateCreation: string;
  cotisants: Record<string, number>;
  archivee: boolean;
}

export interface DonneesStateData {
  membres: Membre[];
  actualites: Actualite[];
  sermons: Sermon[];
  evenements: Evenement[];
  dons: Don[];
  demandesPriere: DemandePriere[];
  notifications: NotificationMed[];
  meditations: Meditation[];
  suggestions: Suggestion[];
  caisses: Caisse[];
  transactions: Transaction[];
  categories: string[];
  statuts: string[];
}

const STORAGE_KEY = 'medecci-donnees-store';

function scaleNumber(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

const membresInitiaux: Membre[] = [
  { id: 'm-1', nom: 'Koffi', prenom: 'Yao Emmanuel', telephone: '0707894512', email: 'koffi.yao@gmail.com', dateInscription: '2026-01-12T10:15:00Z', statut: 'Pasteur' },
  { id: 'm-2', nom: 'Amenan', prenom: 'Marie Grâce', telephone: '0505123456', email: 'grace.amenan@yahoo.fr', dateInscription: '2026-01-15T11:20:00Z', statut: 'Diaconesse' },
  { id: 'm-3', nom: 'Kouassi', prenom: 'Jean-Pierre', telephone: '0102030405', email: 'jp.kouassi@outlook.com', dateInscription: '2026-01-20T09:45:00Z', statut: 'Fidèle' },
  { id: 'm-4', nom: 'Aka', prenom: 'Marie-Therese', telephone: '0708091011', email: 'mt.aka@gmail.com', dateInscription: '2026-02-05T14:30:00Z', statut: 'Responsable' },
  { id: 'm-5', nom: 'Bamba', prenom: 'Moussa Christian', telephone: '0506070809', email: 'christian.bamba@gmail.com', dateInscription: '2026-02-18T16:00:00Z', statut: 'Fidèle' },
];

const actualitesInitiales: Actualite[] = [
  {
    id: 'fb-post-1',
    titre: 'Moi, je choisis la bonne part (Luc 10 V 42)',
    description: 'Le mot d\'ordre de la MEDEC-CI pour l\'année 2026 décrypté par notre Président, le Prophète ASSANDE Jacques.',
    contenu: `ANNEE 2026 : « Moi, je choisis la bonne Part » ( Luc 10 V 42 )

Que retenir donc de ce nouveau mot d'ordre qui vient élargir les tentes de la MEDEC-CI ?

Le Prophète ASSANDE Jacques, Président de la Mission Evangélique de Dieu En Christ de Côte d'Ivoire (MEDEC-CI) fait une analyse cursive du sujet, laquelle analyse tourne autour de (02) axes majeurs.

Analysons ensemble le texte de base : Luc 10 V 42.

Retenons que notre Seigneur Jésus-Christ est de passage à Béthanie. Il est reçu à cœur joie par (02) deux sœurs, Marthe et Marie, les sœurs de Lazare. Rappelons que Lazare est celui que Jésus-Christ avait ramené d'entre les morts ( Jean 11... ). Marthe très prise par les tâches domestiques, abandonne Jésus-Christ à sa sœur Marie espérant les rejoindre au plus vite. Affichant son impuissance devant le trop plein de tâches qui attendaient toujours d'être évacuées, elle reviendra solliciter avec agacement l'aide de Marie. Cette attitude de Marthe attire l'attention du " visiteur ".

AXE 1 : Privilégier la communion avec CHRIST
« Marthe préoccupée par les charges domestiques »
Retenons d’emblée que la marche chrétienne trouve son sens véritable dans la communion authentique avec notre Seigneur Jésus-Christ. DIEU fut le tout premier à s’ouvrir à la " communion " en tendant la perche à l’Humanité qui déclinait profondément dans les ténèbres, faute du péché. ( Jean 3 V 16 ). 

Communier, c'est tout simplement être en harmonie parfaite. Cela sous-entend une culture du partage, donc de l'équilibre.

Le constat amer que nous faisons de nos jours, c’est que de plus en plus de chrétiens sont investis à fond dans leurs activités lucratives au point de négliger leur communion avec CHRIST. 

Nous précisons qu’il ne s’agit nullement d'encourager au chômage, mais plutôt d'exhorter les chrétiens d'ici et d'ailleurs à plus d’investissement dans les choses du Royaume, autant que nous les savons impliqués dans leurs activités lucratives. 

S’investir pleinement dans nos différentes activités qu'elles soient lucratives ou domestiques et manquer à nos obligations vis à vis du Royaume constitue donc une entrave à l'expansion de l'Evangile et donc à l'extension du Royaume des cieux sur la terre. 

Retenons que toute richesse véritable nous vient de l’Eternel ( 1 Chroniques 29 V 12 ).
Il s'agira donc dans cet axe, d'emmener chrétiens d'ici et d'ailleurs à comprendre l'importance de vivre la communion avec CHRIST.

AXE 2 : Promouvoir les valeurs de l'Esprit, plutôt que celles de la chaire
« Marie attachée aux valeurs qui régissent le Royaume des cieux »
Notons que ce qui nous distingue de ce " monde ", ce sont nos valeurs, celles qui caractérisent le Royaume des cieux auquel nous sommes fortement rattachés.

La BIBLE qui est la Parole de DIEU, révèle le cœur de DIEU ainsi que son plan parfait pour l'Humanité. Elle contribue à notre stabilité spirituelle, laquelle est un gage de sécurité.

Il s'agira donc dans cet axe, d'emmener chrétiens d'ici et d'ailleurs à comprendre l'importance de vivre pleinement la Parole de DIEU et d'en apprécier chacune de ses révélations. (Psaumes 119 V 105).

Nous vous invitons à nous rejoindre dans toutes les églises MEDEC-CI pour qu'ensemble nous puissions vivre une communion pleine avec CHRIST et profiter de chaque mots de sa bouche.

SIEGE de la MEDEC-CI : Koumassi Quartier 32, derrière la station Petro-Ivoire.
Contacts : 07 58 52 67 66 - 07 57 49 75 32
Horaires des cultes :
- Jeudi : 19H - 20H30Mn ( Heure GMT )
- Dimanche : 08H30 - 11H ( Heure GMT )

" Choisir la bonne part, c'est choisir la VIE ".
Que DIEU vous bénisse abondamment !`,
    datePublication: '2026-02-03T18:00:00Z',
    image: '/prophete_assande.png',
    auteur: 'Prophète ASSANDE Jacques'
  },
  {
    id: 'fb-post-2',
    titre: 'Assemblée Générale Ordinaire de la MEDEC-CI',
    description: 'Rencontre de grande portée de la classe dirigeante au siège national de Koumassi.',
    contenu: `La Mission Evangélique de Dieu En Christ de Côte d'Ivoire, en abrégé MEDEC-CI organisait le dimanche 25 janvier 2026, une rencontre extraordinaire, à savoir l'Assemblée Générale de la MEDEC-CI.

Précisons que ce rassemblement de grande portée se tenait au siège de la MEDEC-CI, sis à Koumassi Quartier 32, derrière la station Petro-Ivoire. Un rassemblement qui permettait à toute la classe dirigeante, de travailler au développement de la MEDEC-CI.

Notons que cette rencontre spéciale a vu la participation exceptionnelle du Prophète ASSANDE Jacques, Président de la MEDEC-CI. Le Prophète ASSANDE Jacques, présent la veille aux côtés de la classe pastorale, récidivait lors de cette l'Assemblée Générale (AG), confortant ainsi son attachement aux valeurs qui régissent la MEDEC-CI.

Nous remercions toutes les délégations venues de divers horizons, participer à la rencontre et aider au développement de la MEDEC-CI.

L'Année 2026, baptisée dans toute la MEDEC-CI " 2026 : Je choisis la bonne part " est donc lancée !`,
    datePublication: '2026-01-29T18:00:00Z',
    image: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&q=80&w=800',
    auteur: 'Secrétariat Général'
  },
  {
    id: 'fb-post-3',
    titre: 'Le "Culte des Cultes" Annuel à Lakota Centre',
    description: 'Une journée de reconnaissance intense sous le thème : "Les Adorateurs que le Père demande" (Jean 4 V 23).',
    contenu: `La Mission Evangélique de Dieu En Christ Côte d'Ivoire (MEDEC-CI) tenait le dimanche 16 novembre 2025, à Lakota Centre, son programme spécial annuel dénommé le " culte des cultes ".

Ce culte spécial qui fait désormais partie de la " culture " de la MEDEC-CI permettait aux fidèles de la zone de Lakota, d'exprimer vivement leur reconnaissance à l'Eternel.

Notons que ce rassemblement spécial a vu la participation de plusieurs éminents serviteurs de DIEU de la zone d'Abidjan, venus apporter leur touche d'élégance au tableau de reconnaissance à l'Eternel. Précisons que cette délégation de la classe pastorale avait à leur tête l'Apôtre FALLE Zébo Ambroise, Directeur des Eglises Locales et le Pasteur NAHOUNOU Éric, responsable de la zone d'Abidjan.

Le samedi 15 novembre 2025, veille des festivités, une rencontre de travail pilotée par l'Apôtre FALLE Zébo Ambroise se tenait à l'église de MEDEC-CI Lakota Centre, où Pasteurs et Missionnaires menaient de fortes réflexions autour des grands sujets de la MEDEC-CI, en vue de son développement.

THEME : Les Adorateurs que le Père demande ( Jean 4 V 23 )
Un THEME qui mettait en exergue le devoir du Chrétien, vis à vis de l'Éternel.

Nous retenons que l'Adoration est un principle divin. Il nous appartient donc en tant que Chrétiens de l'appliquer à notre vie de tous les jours, si nous aspirons à toucher le cœur de DIEU. Un THEME très enrichissant, qui appelle à une prise de conscience.

Nous ne cesserons jamais de remercier le très chaleureux peuple de GAGNOA, GOGNE, GOUDOUKO et GBAHIRI, pour avoir contribué à rendre ce moment inoubliable.

Pour terminer, l'Apôtre NOUDE Hubert Tia, Pasteur hôte et responsable de la zone de Lakota, s'est dit réjoui du bon déroulement des évènements. Il a tenu particulièrement à remercier toutes les autorités spirituelles venues de la zone d'Abidjan, pour vivre l'évènement. Il a souhaité que se perpétue cette valeur qu'est la communion fraternelle, propre à la MEDEC-CI et qui constitue sa force.`,
    datePublication: '2025-11-28T08:00:00Z',
    image: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&q=80&w=800',
    auteur: 'Apôtre NOUDE Hubert Tia'
  },
  {
    id: 'fb-post-4',
    titre: 'Culte spécial d\'actions de Grâce au Siège',
    description: 'Une journée de reconnaissance d\'une ferveur exceptionnelle sous le thème "Remplissez d\'eau ces vases".',
    contenu: `La Mission Evangélique de Dieu En Christ Côte d'Ivoire, en abrégé MEDEC-CI, tenait le dimanche 28 septembre 2025 à son siège, sis à Koumassi Quartier 32 derrière la station Petro-Ivoire, son culte spécial d'actions de Grâce à l'Eternel.

Un programme de grande envergure qui a lieu chaque année, donnant occasion à tous les fidèles du siège, de manifester passionnément leur reconnaissance à l'Éternel. Retenons que le culte d'actions de grâce à l'Eternel fait partie des (04) quatre programmes majeurs qui constituent le plan d'activités annuelles de la MEDEC-CI Siège.

Le 24 août 2025, le Pasteur MORIBA Komon Joseph, 1er responsable de la MEDEC-CI Siège, lancera les hostilités pour (05) cinq dimanches spéciaux où chaque intervenant recevait comme mandat d'emmener les fidèles à comprendre l'importance de manifester sa reconnaissance à l'Eternel. Le rassemblement du dimanche 28 septembre 2025 marquait donc l'apothéose de ces dimanches spéciaux.

THEME : JESUS leur dit : remplissez d'eau ces vases. Et ils les remplirent jusqu'au bord (Jean 2 : 7)

Notons que ce rassemblement spécial a vu la participation de plusieurs éminents serviteurs de DIEU de la MEDEC-CI et d'ailleurs, parmi lesquels le Prophète ASSANDE Jacques, Président de la MEDEC-CI. L'orateur principal de l'évènement a, comme à son habitude, rehaussé de sa présence et de son intervention l'évènement, favorisant un atmosphère prophétique.

Nous ne manquerons pas de relever la présence de l'Apôtre FALLE Zébo Ambroise, Directeur des Eglises Locales (DEL), toujours présent lors des rassemblements marquants. C'est sans oublier la forte délégation de l'église de MEDEC-CI Gens bénis, conduite par le Pasteur AKE Brigitte, épouse AYE.

Nous profitons de l'occasion pour remercier la délégation de l'Alliance des Pasteurs Unis de Koumassi ( APUK ), avec à sa tête le Pasteur VONDZOGBE Komi Bernard.

Nous remercions également tous les fidèles du siège, pour s'être impliqués à fond dans le bon déroulement du programme.
L'unité fera notre Force.`,
    datePublication: '2025-10-01T10:00:00Z',
    image: 'https://images.unsplash.com/photo-1548625361-155deee223cb?auto=format&fit=crop&q=80&w=800',
    auteur: 'Pasteur MORIBA Komon Joseph'
  },
  {
    id: 'fb-post-5',
    titre: 'Journée du Jeune Serviteur de Dieu (2JSD) 2025',
    description: 'MEDEC-CI Gens bénis (Jean Folly) remporte la couronne après une compétition mémorable.',
    contenu: `La Mission Evangélique de Dieu En Christ Côte d'Ivoire en abrégé MEDEC-CI tenait le dimanche 14 septembre 2025 à son Siège, sis à Koumassi Quartier 32 derrière la Station Pétro Ivoire, sa journée spéciale annuelle baptisée " Journée du Jeune serviteur de Dieu (2JSD) ".

Ce rassemblement spécial de la classe jeune mettait en compétition (03) trois églises MEDEC-CI de la Zone d'Abidjan, à savoir : MEDEC-CI Siège, MEDEC-CI Adjouffou et MEDEC-CI Gens bénis.
Notons que ce programme spécial is à l'initiative de la Direction de la Jeunesse (DJ), cette dernière tenue par le Pasteur DABONE Pascal.

Alors que tout le monde s'attendait à ce que la MEDEC-CI Adjouffou marque de son emprunte la compétition comme ce fut le cas lors des précédentes éditions, c'est l'église de MEDEC-CI Gens bénis dirigée par le Pasteur AKE Brigitte épouse AYE qui viendra créer la grande sensation en remportant la compétition, relayant le précédent détenteur de la couronne au second rang. La MEDEC-CI Siège quant à elle, occupera la troisième marche du podium.

Ce rassemblement spécial a vu la participation de plusieurs personnalités de la Mission, parmi lesquelles :
- Le Prophète ASSANDE Jacques, Président de la MEDEC-CI,
- Le Pasteur MORIBA Komon Joseph, Vice-Président de la MEDEC-CI,
- L'Apôtre FALLE Zébo Ambroise, Directeur des Eglises Locales (DEL),
- L'Apôtre ASSANDE Christine, Directrice des Femmes (DFEM),
- Le Pasteur AHOLIA Aimé, Directeur de l'Evangélisation Générale (DEL),
- Le Pasteur HIE Hervé, Directeur de la Communication (DCOM),
- Le Pasteur NAHOUNOU Eric, Responsable de la Zone d'Abidjan.

Félicitations également aux encadreurs, pour l'énorme travail abattu ! La Jeunesse de la MEDEC-CI regorge de talents, qui ne demandent qu'à éclore.`,
    datePublication: '2025-09-16T14:30:00Z',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',
    auteur: 'Pasteur DABONE Pascal'
  },
  {
    id: 'fb-post-6',
    titre: 'Culte des Cultes de la Zone d\'Abidjan à Adjouffou',
    description: 'Rassemblement exceptionnel et ferveur divine autour du thème "Nous adorons ce que nous connaissons".',
    contenu: `La Mission Évangélique de Dieu en Christ Côte d'Ivoire ( MEDEC-CI) tenait le dimanche 17 août 2025, son culte spécial annuel, lequel baptisé Culte des cultes.

Notons que ce rassemblement cher aux yeux de la MEDEC-CI is à mettre sur le compte de la Direction des Églises Locales ( DEL ), une structure dirigée par l'Apôtre FALLE Zebo Ambroise.
Il est bon de préciser que ce rassemblement spécial répondait à un objectif majeur, celui de mesurer la force de mobilisation de la classe ouvrière autour de la vision de la MEDEC-CI.

Rappels que la MEDEC-CI est constituée en (02) deux grandes zones, que sont Abidjan et Lakota, lesquelles sont dirigées par le Pasteur NAHOUNOU Éric, pour la zone d'Abidjan et l'Apôtre NOUDE Hubert Tia, pour la zone de Lakota.

Le Pasteur NAHOUNOU Éric accueillait donc l'événement dans sa zone de Port-Bouet, précisément à l'église de MEDEC-CI Adjouffou située dans le prolongement du mur de l'aéroport international Félix Houphouet Boigny.

Les (08) huit églises composant la Zone d'Abidjan étaient attendues à ce programme et ont toutes répondu favorablement : Siège, Adjouffou, Jean folly ( rebaptisée Gens bénis ), Adjahui, Yopougon, Cocody, Adzope, Abobo.

THEME : " Nous adorons ce que nous connaissons " ( Jean 4 V 22 )
L'animation musicale a été assurée par le Groupe de louange " Source de vie " de la zone d'Abidjan.

Que d'émotions, il y'a eu ce jour ! Nous profitons de l'occasion pour remercier la chantre LILLY, pour sa très belle prestation durant l'événement. Merci à toutes les églises de la zone d'Abidjan qui ont toutes donné de leur cœur, pour la réussite de l'évènement. Merci à l'Apôtre NOUDE Hubert Tia et à sa délégation de Pasteurs venus de Lakota, pour vivre l'événement.`,
    datePublication: '2025-08-23T18:00:00Z',
    image: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&q=80&w=800',
    auteur: 'Pasteur NAHOUNOU Éric'
  },
  {
    id: 'fb-post-7',
    titre: 'Convention Nationale des Femmes - 7ème Édition',
    description: 'Deux journées glorieuses d\'intercession sous la présence du Prophète ASSANDE Jacques.',
    contenu: `La Mission Evangélique de Dieu En Christ Côte d'Ivoire en abrégé " MEDEC-CI " organisait à son siège, sis à Koumassi Quartier 32 derrière la Station Petro Ivoire, la septième édition de la convention nationale des femmes. Un évènement qui a vu la participation de plusieurs éminents serviteurs et servantes de DIEU venus de divers horizons.

Une présence s'est faite largement remarquée lors de cette convention, celle du Prophète ASSANDE Jacques, Président de la MEDEC-CI. Le Père de la Mission a rehaussé de sa présence l'évènement, lui donnant une saveur particulière.

Notons que ce rassemblement spécial s'est déroulé sur (02) deux jours, les Mercredi 28 et Jeudi 29 Mai 2025. Un moment de réjouissance et de rapprochement ce fut !

THEME : Rester dans la présence de DIEU ( Mathieu 17 V 1 - 5 )
Nous vous replongeons dans l'évènement.`,
    datePublication: '2025-07-24T18:00:00Z',
    image: '/epouse_assande.png',
    auteur: 'Apôtre Christine ASSANDE'
  }
];

const sermonsInitiaux: Sermon[] = [
  {
    id: 'sermon-1',
    titre: 'La Puissance de l\'Obéissance de la Foi',
    predicateur: 'Pasteur Koffi Yao Emmanuel',
    date: '2026-06-28',
    versetRef: 'Genèse 12:1-4 & Hébreux 11:8',
    description: 'Ce message explore comment l\'obéissance inconditionnelle à la Parole de Dieu déclenche des bénédictions générationnelles, à l\'image d\'Abraham.',
    lienYoutube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    lienAudio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: 'sermon-2',
    titre: 'Surmonter les Tempêtes de la Vie',
    predicateur: 'Pasteur Koffi Yao Emmanuel',
    date: '2026-06-21',
    versetRef: 'Marc 4:35-41',
    description: 'Comment réagir face aux tempêtes inattendues ? Le Pasteur nous enseigne à activer notre foi au lieu de succomber à la panique.',
    lienYoutube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    lienAudio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    id: 'sermon-3',
    titre: 'Bâtir une Famille selon le Cœur de Dieu',
    predicateur: 'Pasteur invité Kassi Jean-Baptiste',
    date: '2026-06-14',
    versetRef: 'Josué 24:14-18',
    description: 'Les clés bibliques indispensables pour restaurer l\'harmonie, le respect mutuel et l\'autel de prière dans nos foyers modernes.',
    lienYoutube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    lienAudio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  }
];

const evenementsInitiaux: Evenement[] = [
  {
    id: 'ev-1',
    titre: 'Grande Veillée de Prière - Impact & Onction',
    description: 'Une nuit de combat spirituel, de délivrance et d\'adoration pour terrasser les œuvres du mal.',
    dateDebut: '2026-07-03T22:00:00Z',
    dateFin: '2026-07-04T05:00:00Z',
    lieu: 'Temple Principal, Cocody Angré',
    image: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&q=80&w=800',
    categorie: 'Prière'
  },
  {
    id: 'ev-2',
    titre: 'Camp National de la Jeunesse (JMEDECCI)',
    description: '5 jours de ressourcement, de fraternité et de sport en forêt du Banco.',
    dateDebut: '2026-07-15T08:00:00Z',
    dateFin: '2026-07-19T18:00:00Z',
    lieu: 'Centre de Retraite JMEDECCI',
    image: 'https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&q=80&w=800',
    categorie: 'Jeunesse'
  },
  {
    id: 'ev-3',
    titre: 'Célébration Spéciale de la Fête des Mères',
    description: 'Un culte d\'honneur avec remise de présents à toutes les mamans de la communauté.',
    dateDebut: '2026-07-05T08:00:00Z',
    dateFin: '2026-07-05T12:00:00Z',
    lieu: 'Temple Principal, Cocody Angré',
    image: 'https://images.unsplash.com/photo-1544717277-994b96273b24?auto=format&fit=crop&q=80&w=800',
    categorie: 'Célébration'
  }
];

const donsInitiaux: Don[] = [
  { id: 'd-1', nomDonateur: 'Kouassi Jean-Pierre', telephone: '0102030405', montant: 50000, typeDon: 'Dîme', modePaiement: 'Wave', date: '2026-06-28T11:45:00Z', commentaire: 'Dîme de Juin' },
  { id: 'd-2', nomDonateur: 'Amenan Marie Grâce', telephone: '0505123456', montant: 25000, typeDon: 'Offrande', modePaiement: 'Orange Money', date: '2026-06-28T12:00:00Z', commentaire: 'Offrande d\'action de grâce' },
  { id: 'd-3', nomDonateur: 'Anonyme', telephone: '0707070707', montant: 200000, typeDon: 'Construction', modePaiement: 'Carte Bancaire', date: '2026-06-25T15:30:00Z', commentaire: 'Soutien aux travaux du temple' },
  { id: 'd-4', nomDonateur: 'Bamba Moussa Christian', telephone: '0506070809', montant: 15000, typeDon: 'Social', modePaiement: 'MTN MoMo', date: '2026-06-24T18:20:00Z' }
];

const demandesPriereInitiales: DemandePriere[] = [
  { id: 'dp-1', nom: 'Kouamé Christiane', telephone: '0709485123', sujet: 'Guérison de ma mère', message: 'Ma mère souffre d\'une grave pneumonie depuis 2 semaines. Elle est hospitalisée. Je demande le soutien en prière de l\'église.', date: '2026-06-29T10:00:00Z', statut: 'EN_PRIERE' },
  { id: 'dp-2', nom: 'Diomandé Lassina', telephone: '0505481236', sujet: 'Recherche d\'emploi', message: 'Je passe un entretien final de recrutement ce vendredi. Je prie pour la faveur de Dieu et la réussite.', date: '2026-06-29T15:45:00Z', statut: 'A_TRAITER' },
  { id: 'dp-3', nom: 'Aka Amenan Rebecca', telephone: '0101458974', sujet: 'Voyage missionnaire', message: 'Action de grâce pour la protection de Dieu lors de mon retour de voyage de la semaine passée.', date: '2026-06-27T08:15:00Z', statut: 'EXAUCE' }
];

const notificationsInitiales: NotificationMed[] = [
  { id: 'n-1', message: 'Nouvelle demande de prière de Kouamé Christiane', date: '2026-06-29T10:00:00Z', lu: false },
  { id: 'n-2', message: 'Nouveau don enregistré : 50 000 FCFA par Kouassi Jean-Pierre', date: '2026-06-28T11:45:00Z', lu: true }
];

const caissesInitiales: Caisse[] = [
  {
    id: 'caisse-dimes',
    nom: 'Dîmes ordinaires',
    code: 'DIM-ORD',
    responsable: 'Pasteur Koffi',
    objectif: 10000000,
    categorie: 'Dîmes & Offrandes',
    description: 'Collecte des dîmes mensuelles des fidèles pour le fonctionnement de l\'église.',
    dateCreation: '2026-01-10T08:30:00Z',
    cotisants: {
      'm-1': 50000,
      'm-2': 30000,
    },
    archivee: false,
  },
  {
    id: 'caisse-offrandes',
    nom: 'Offrandes de culte',
    code: 'OFF-CUL',
    responsable: 'Diacre Yao',
    objectif: 5000000,
    categorie: 'Dîmes & Offrandes',
    description: 'Offrandes collectées lors des cultes dominicaux et des veillées.',
    dateCreation: '2026-01-11T09:00:00Z',
    cotisants: {
      'm-2': 15000,
      'm-3': 25000,
    },
    archivee: false,
  },
  {
    id: 'caisse-construction',
    nom: 'Construction du Temple',
    code: 'CST-TMP',
    responsable: 'M. Kouassi (Comité Construction)',
    objectif: 50000000,
    categorie: 'Investissement',
    description: 'Fonds spécial destiné aux travaux d\'extension et d\'embellissement du temple principal.',
    dateCreation: '2026-02-01T10:00:00Z',
    cotisants: {
      'm-1': 100000,
      'm-3': 150000,
    },
    archivee: false,
  },
  {
    id: 'caisse-social',
    nom: 'Action Sociale & Entraide',
    code: 'SOC-ENT',
    responsable: 'Mme. Amenan Marie',
    objectif: 3000000,
    categorie: 'Social & Assistance',
    description: 'Soutien financier aux familles en difficulté, orphelins et veuves de la communauté.',
    dateCreation: '2026-02-15T14:00:00Z',
    cotisants: {
      'm-2': 10000,
    },
    archivee: false,
  },
];

const transactionsInitiales: Transaction[] = [
  {
    id: 'tx-1',
    idCaisse: 'caisse-dimes',
    idMembre: 'm-1',
    montant: 50000,
    commentaire: 'Dîme du mois de Mai 2026',
    date: '2026-05-10T10:00:00Z',
  },
  {
    id: 'tx-2',
    idCaisse: 'caisse-dimes',
    idMembre: 'm-2',
    montant: 30000,
    commentaire: 'Dîme du mois de Mai 2026',
    date: '2026-05-12T11:30:00Z',
  },
  {
    id: 'tx-3',
    idCaisse: 'caisse-offrandes',
    idMembre: 'm-2',
    montant: 15000,
    commentaire: 'Offrande d\'action de grâce',
    date: '2026-05-15T09:15:00Z',
  },
  {
    id: 'tx-4',
    idCaisse: 'caisse-offrandes',
    idMembre: 'm-3',
    montant: 25000,
    commentaire: 'Action de grâce pour la guérison de sa fille',
    date: '2026-05-18T16:20:00Z',
  },
  {
    id: 'tx-5',
    idCaisse: 'caisse-construction',
    idMembre: 'm-1',
    montant: 100000,
    commentaire: 'Contribution spéciale travaux de toiture',
    date: '2026-05-20T14:00:00Z',
  },
  {
    id: 'tx-6',
    idCaisse: 'caisse-construction',
    idMembre: 'm-3',
    montant: 150000,
    commentaire: 'Don de la famille Kouassi pour le carrelage',
    date: '2026-05-25T17:10:00Z',
  },
  {
    id: 'tx-7',
    idCaisse: 'caisse-social',
    idMembre: 'm-2',
    montant: 10000,
    commentaire: 'Soutien veuves et orphelins',
    date: '2026-05-28T10:45:00Z',
  },
];

const categoriesInitiales = [
  'Dîmes & Offrandes',
  'Investissement',
  'Social & Assistance',
  'Mission & Évangélisation',
];

const statutsInitiales = [
  'Fidèle',
  'Diacre',
  'Diaconesse',
  'Pasteur',
  'Responsable',
];

const meditationsInitiales: Meditation[] = [
  {
    id: 'med-1',
    titre: 'La Puissance de la Persévérance dans la Prière',
    versetRef: 'Luc 18:1',
    versetTexte: 'Jésus leur adressa une parabole, pour montrer qu\'il faut toujours prier, et ne point se relâcher.',
    contenu: 'Dans notre marche avec Dieu, il y a des moments où les réponses à nos prières semblent tarder. C\'est précisément dans ces saisons que notre foi est testée et affinée. Persévérer dans la prière ne signifie pas essayer d\'influencer Dieu par nos répétitions, mais c\'est s\'aligner de manière constante avec Sa volonté et démontrer notre confiance absolue en Son calendrier parfait.',
    date: '2026-07-01T06:00:00Z',
    auteur: 'Prophète ASSANDE Jacques'
  },
  {
    id: 'med-2',
    titre: 'Choisir la Bonne Part au Quotidien',
    versetRef: 'Luc 10:42',
    versetTexte: 'Une seule chose est nécessaire. Marie a choisi la bonne part, qui ne lui sera point ôtée.',
    contenu: 'Comme Marthe, nous courons souvent après de nombreuses tâches quotidiennes légitimes, mais secondaires. Notre mot d\'ordre de cette année nous rappelle que s\'asseoir aux pieds de Jésus pour écouter Sa Parole est l\'activité suprême qui nourrit notre âme éternellement. Prenons le temps de nous arrêter aujourd\'hui pour écouter Sa voix douce.',
    date: '2026-06-30T06:00:00Z',
    auteur: 'Pasteur Koffi Yao Emmanuel'
  }
];

const suggestionsInitiales: Suggestion[] = [
  {
    id: 'sug-1',
    nom: 'Kouadio Kouamé Marc',
    telephone: '0707123456',
    sujet: 'Mise en place d\'une bibliothèque de livres chrétiens',
    message: 'Je suggère que nous mettions en place une petite bibliothèque physique au temple ou numérique sur le site web pour permettre aux jeunes d\'accéder à des ouvrages théologiques et de croissance spirituelle.',
    date: '2026-06-29T14:30:00Z'
  },
  {
    id: 'sug-2',
    nom: 'Anonyme',
    telephone: '0505987654',
    sujet: 'Sonorisation extérieure',
    message: 'Il serait bien d\'ajuster la sonorisation extérieure lors des cultes du dimanche pour éviter de déranger le voisinage immédiat tout en gardant une excellente clarté pour les fidèles assis sous les hangars extérieurs.',
    date: '2026-06-28T09:15:00Z'
  }
];

const getInitialState = (): DonneesStateData => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.state) return parsed.state;
        return parsed;
      }
    } catch (e) {
      console.error(e);
    }
  }
  return {
    membres: membresInitiaux,
    actualites: actualitesInitiales,
    sermons: sermonsInitiaux,
    evenements: evenementsInitiaux,
    dons: donsInitiaux,
    demandesPriere: demandesPriereInitiales,
    notifications: notificationsInitiales,
    meditations: meditationsInitiales,
    suggestions: suggestionsInitiales,
    caisses: caissesInitiales,
    transactions: transactionsInitiales,
    categories: categoriesInitiales,
    statuts: statutsInitiales,
  };
};

let state = getInitialState();
const listeners = new Set<() => void>();

type DonneesAction =
  | { type: 'SET_STATE'; payload: Partial<DonneesStateData> }
  | { type: 'AJOUTER_MEMBRE'; payload: Membre }
  | { type: 'MODIFIER_MEMBRE'; payload: { id: string; membre: Partial<Membre> } }
  | { type: 'SUPPRIMER_MEMBRE'; payload: string }
  | { type: 'AJOUTER_ACTUALITE'; payload: Actualite }
  | { type: 'MODIFIER_ACTUALITE'; payload: { id: string; actu: Partial<Actualite> } }
  | { type: 'SUPPRIMER_ACTUALITE'; payload: string }
  | { type: 'AJOUTER_SERMON'; payload: Sermon }
  | { type: 'MODIFIER_SERMON'; payload: { id: string; sermon: Partial<Sermon> } }
  | { type: 'SUPPRIMER_SERMON'; payload: string }
  | { type: 'AJOUTER_EVENEMENT'; payload: Evenement }
  | { type: 'MODIFIER_EVENEMENT'; payload: { id: string; evenement: Partial<Evenement> } }
  | { type: 'SUPPRIMER_EVENEMENT'; payload: string }
  | { type: 'ENREGISTRER_DON'; payload: { don: Don; notification: NotificationMed } }
  | { type: 'SUPPRIMER_DON'; payload: string }
  | { type: 'SOUMETTRE_DEMANDE_PRIERE'; payload: { demande: DemandePriere; notification: NotificationMed } }
  | { type: 'MODIFIER_STATUT_PRIERE'; payload: { id: string; statut: DemandePriere['statut'] } }
  | { type: 'SUPPRIMER_DEMANDE_PRIERE'; payload: string }
  | { type: 'AJOUTER_NOTIFICATION'; payload: NotificationMed }
  | { type: 'MARQUER_NOTIFICATION_LUE'; payload: string }
  | { type: 'EFFACER_NOTIFICATIONS' }
  | { type: 'AJOUTER_CATEGORIE'; payload: string }
  | { type: 'MODIFIER_CATEGORIE'; payload: { ancienNom: string; nouveauNom: string } }
  | { type: 'SUPPRIMER_CATEGORIE'; payload: string }
  | { type: 'AJOUTER_STATUT'; payload: string }
  | { type: 'MODIFIER_STATUT'; payload: { ancienNom: string; nouveauNom: string } }
  | { type: 'SUPPRIMER_STATUT'; payload: string }
  | { type: 'CREER_CAISSE'; payload: Caisse }
  | { type: 'MODIFIER_CAISSE'; payload: Caisse }
  | { type: 'ARCHIVER_CAISSE'; payload: string }
  | { type: 'DESARCHIVER_CAISSE'; payload: string }
  | { type: 'SUPPRIMER_CAISSE'; payload: string }
  | { type: 'ENREGISTRER_COTISATION'; payload: { transaction: Transaction; caisses: Caisse[]; notification?: NotificationMed } }
  | { type: 'MODIFIER_COTISATION'; payload: { transaction: Transaction; caisses: Caisse[] } }
  | { type: 'AJOUTER_MEDITATION'; payload: Meditation }
  | { type: 'MODIFIER_MEDITATION'; payload: { id: string; med: Partial<Meditation> } }
  | { type: 'SUPPRIMER_MEDITATION'; payload: string }
  | { type: 'SOUMETTRE_SUGGESTION'; payload: { suggestion: Suggestion; notification: NotificationMed } }
  | { type: 'SUPPRIMER_SUGGESTION'; payload: string };

function donneesReducer(state: DonneesStateData, action: DonneesAction): DonneesStateData {
  switch (action.type) {
    case 'SET_STATE':
      return { ...state, ...action.payload };
    case 'AJOUTER_MEMBRE':
      return { ...state, membres: [action.payload, ...state.membres] };
    case 'MODIFIER_MEMBRE':
      return {
        ...state,
        membres: state.membres.map((m) => (m.id === action.payload.id ? { ...m, ...action.payload.membre } : m)),
      };
    case 'SUPPRIMER_MEMBRE': {
      const id = action.payload;
      return {
        ...state,
        membres: state.membres.filter((m) => m.id !== id),
        transactions: state.transactions.filter((tx) => tx.idMembre !== id),
        caisses: state.caisses.map((caisse) => {
          const nouveauxCotisants = { ...caisse.cotisants };
          delete nouveauxCotisants[id];
          return { ...caisse, cotisants: nouveauxCotisants };
        }),
      };
    }
    case 'AJOUTER_ACTUALITE':
      return { ...state, actualites: [action.payload, ...state.actualites] };
    case 'MODIFIER_ACTUALITE':
      return {
        ...state,
        actualites: state.actualites.map((a) => (a.id === action.payload.id ? { ...a, ...action.payload.actu } : a)),
      };
    case 'SUPPRIMER_ACTUALITE':
      return { ...state, actualites: state.actualites.filter((a) => a.id !== action.payload) };
    case 'AJOUTER_SERMON':
      return { ...state, sermons: [action.payload, ...state.sermons] };
    case 'MODIFIER_SERMON':
      return {
        ...state,
        sermons: state.sermons.map((s) => (s.id === action.payload.id ? { ...s, ...action.payload.sermon } : s)),
      };
    case 'SUPPRIMER_SERMON':
      return { ...state, sermons: state.sermons.filter((s) => s.id !== action.payload) };
    case 'AJOUTER_EVENEMENT':
      return { ...state, evenements: [action.payload, ...state.evenements] };
    case 'MODIFIER_EVENEMENT':
      return {
        ...state,
        evenements: state.evenements.map((e) => (e.id === action.payload.id ? { ...e, ...action.payload.evenement } : e)),
      };
    case 'SUPPRIMER_EVENEMENT':
      return { ...state, evenements: state.evenements.filter((e) => e.id !== action.payload) };
    case 'ENREGISTRER_DON':
      return {
        ...state,
        dons: [action.payload.don, ...state.dons],
        notifications: [action.payload.notification, ...state.notifications],
      };
    case 'SUPPRIMER_DON':
      return { ...state, dons: state.dons.filter((d) => d.id !== action.payload) };
    case 'SOUMETTRE_DEMANDE_PRIERE':
      return {
        ...state,
        demandesPriere: [action.payload.demande, ...state.demandesPriere],
        notifications: [action.payload.notification, ...state.notifications],
      };
    case 'MODIFIER_STATUT_PRIERE':
      return {
        ...state,
        demandesPriere: state.demandesPriere.map((dp) => (dp.id === action.payload.id ? { ...dp, statut: action.payload.statut } : dp)),
      };
    case 'SUPPRIMER_DEMANDE_PRIERE':
      return { ...state, demandesPriere: state.demandesPriere.filter((dp) => dp.id !== action.payload) };
    case 'AJOUTER_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };
    case 'MARQUER_NOTIFICATION_LUE':
      return {
        ...state,
        notifications: state.notifications.map((n) => (n.id === action.payload ? { ...n, lu: true } : n)),
      };
    case 'EFFACER_NOTIFICATIONS':
      return { ...state, notifications: [] };
    case 'AJOUTER_CATEGORIE':
      return { ...state, categories: [...state.categories, action.payload] };
    case 'MODIFIER_CATEGORIE':
      return {
        ...state,
        categories: state.categories.map((c) => (c === action.payload.ancienNom ? action.payload.nouveauNom : c)),
        caisses: state.caisses.map((c) => (c.categorie === action.payload.ancienNom ? { ...c, categorie: action.payload.nouveauNom } : c)),
      };
    case 'SUPPRIMER_CATEGORIE':
      return {
        ...state,
        categories: state.categories.filter((c) => c !== action.payload),
        caisses: state.caisses.map((c) => (c.categorie === action.payload ? { ...c, categorie: 'Général' } : c)),
      };
    case 'AJOUTER_STATUT':
      return { ...state, statuts: [...state.statuts, action.payload] };
    case 'MODIFIER_STATUT':
      return {
        ...state,
        statuts: state.statuts.map((s) => (s === action.payload.ancienNom ? action.payload.nouveauNom : s)),
        membres: state.membres.map((m) => (m.statut === action.payload.ancienNom ? { ...m, statut: action.payload.nouveauNom } : m)),
      };
    case 'SUPPRIMER_STATUT':
      return {
        ...state,
        statuts: state.statuts.filter((s) => s !== action.payload),
        membres: state.membres.map((m) => (m.statut === action.payload ? { ...m, statut: 'Fidèle' } : m)),
      };
    case 'CREER_CAISSE':
      return { ...state, caisses: [action.payload, ...state.caisses] };
    case 'MODIFIER_CAISSE':
      return {
        ...state,
        caisses: state.caisses.map((c) => (c.id === action.payload.id ? action.payload : c)),
      };
    case 'ARCHIVER_CAISSE':
      return {
        ...state,
        caisses: state.caisses.map((c) => (c.id === action.payload ? { ...c, archivee: true } : c)),
      };
    case 'DESARCHIVER_CAISSE':
      return {
        ...state,
        caisses: state.caisses.map((c) => (c.id === action.payload ? { ...c, archivee: false } : c)),
      };
    case 'SUPPRIMER_CAISSE':
      return {
        ...state,
        caisses: state.caisses.filter((c) => c.id !== action.payload),
        transactions: state.transactions.filter((tx) => tx.idCaisse !== action.payload),
      };
    case 'ENREGISTRER_COTISATION': {
      const nextState = {
        ...state,
        transactions: [action.payload.transaction, ...state.transactions],
        caisses: action.payload.caisses,
      };
      if (action.payload.notification) {
        nextState.notifications = [action.payload.notification, ...state.notifications];
      }
      return nextState;
    }
    case 'MODIFIER_COTISATION':
      return {
        ...state,
        transactions: state.transactions.map((t) => (t.id === action.payload.transaction.id ? action.payload.transaction : t)),
        caisses: action.payload.caisses,
      };
    case 'AJOUTER_MEDITATION':
      return { ...state, meditations: [action.payload, ...state.meditations] };
    case 'MODIFIER_MEDITATION':
      return {
        ...state,
        meditations: state.meditations.map((m) => (m.id === action.payload.id ? { ...m, ...action.payload.med } : m)),
      };
    case 'SUPPRIMER_MEDITATION':
      return { ...state, meditations: state.meditations.filter((m) => m.id !== action.payload) };
    case 'SOUMETTRE_SUGGESTION':
      return {
        ...state,
        suggestions: [action.payload.suggestion, ...state.suggestions],
        notifications: [action.payload.notification, ...state.notifications],
      };
    case 'SUPPRIMER_SUGGESTION':
      return { ...state, suggestions: state.suggestions.filter((s) => s.id !== action.payload) };
    default:
      return state;
  }
}

const store = {
  getState() {
    return state;
  },
  dispatch(action: DonneesAction) {
    state = donneesReducer(state, action);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ state }));
    }
    listeners.forEach((listener) => listener());
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  // Actions Membres
  ajouterMembre(membre: Omit<Membre, 'id' | 'dateInscription'>) {
    const nouveauMembre: Membre = {
      ...membre,
      id: `m-${Date.now()}`,
      dateInscription: new Date().toISOString(),
    };
    store.dispatch({ type: 'AJOUTER_MEMBRE', payload: nouveauMembre });
  },
  modifierMembre(id: string, membre: Partial<Membre>) {
    store.dispatch({ type: 'MODIFIER_MEMBRE', payload: { id, membre } });
  },
  supprimerMembre(id: string) {
    store.dispatch({ type: 'SUPPRIMER_MEMBRE', payload: id });
  },

  // Actions Actualités
  ajouterActualite(actu: Omit<Actualite, 'id' | 'datePublication'>) {
    const nouvelleActu: Actualite = {
      ...actu,
      id: `actu-${Date.now()}`,
      datePublication: new Date().toISOString(),
    };
    store.dispatch({ type: 'AJOUTER_ACTUALITE', payload: nouvelleActu });
  },
  modifierActualite(id: string, actu: Partial<Actualite>) {
    store.dispatch({ type: 'MODIFIER_ACTUALITE', payload: { id, actu } });
  },
  supprimerActualite(id: string) {
    store.dispatch({ type: 'SUPPRIMER_ACTUALITE', payload: id });
  },

  // Actions Sermons
  ajouterSermon(sermon: Omit<Sermon, 'id'>) {
    const nouveauSermon: Sermon = {
      ...sermon,
      id: `sermon-${Date.now()}`,
    };
    store.dispatch({ type: 'AJOUTER_SERMON', payload: nouveauSermon });
  },
  modifierSermon(id: string, sermon: Partial<Sermon>) {
    store.dispatch({ type: 'MODIFIER_SERMON', payload: { id, sermon } });
  },
  supprimerSermon(id: string) {
    store.dispatch({ type: 'SUPPRIMER_SERMON', payload: id });
  },

  // Actions Événements
  ajouterEvenement(evenement: Omit<Evenement, 'id'>) {
    const nouvelEvenement: Evenement = {
      ...evenement,
      id: `ev-${Date.now()}`,
    };
    store.dispatch({ type: 'AJOUTER_EVENEMENT', payload: nouvelEvenement });
  },
  modifierEvenement(id: string, evenement: Partial<Evenement>) {
    store.dispatch({ type: 'MODIFIER_EVENEMENT', payload: { id, evenement } });
  },
  supprimerEvenement(id: string) {
    store.dispatch({ type: 'SUPPRIMER_EVENEMENT', payload: id });
  },

  // Actions Dons
  enregistrerDon(don: Omit<Don, 'id' | 'date'>) {
    const timestamp = Date.now();
    const nouveauDon: Don = {
      ...don,
      id: `d-${timestamp}`,
      date: new Date().toISOString(),
    };
    const nouvelleNotif: NotificationMed = {
      id: `n-${timestamp}`,
      message: `Nouveau don enregistré : ${don.montant.toLocaleString('fr-FR')} FCFA par ${don.nomDonateur}`,
      date: new Date().toISOString(),
      lu: false,
    };
    store.dispatch({ type: 'ENREGISTRER_DON', payload: { don: nouveauDon, notification: nouvelleNotif } });
  },
  supprimerDon(id: string) {
    store.dispatch({ type: 'SUPPRIMER_DON', payload: id });
  },

  // Actions Demandes de Prière
  soumettreDemandePriere(demande: Omit<DemandePriere, 'id' | 'date' | 'statut'>) {
    const timestamp = Date.now();
    const nouvelleDemande: DemandePriere = {
      ...demande,
      id: `dp-${timestamp}`,
      date: new Date().toISOString(),
      statut: 'A_TRAITER',
    };
    const nouvelleNotif: NotificationMed = {
      id: `n-${timestamp}`,
      message: `Nouvelle demande de prière de ${demande.nom} : "${demande.sujet}"`,
      date: new Date().toISOString(),
      lu: false,
    };
    store.dispatch({ type: 'SOUMETTRE_DEMANDE_PRIERE', payload: { demande: nouvelleDemande, notification: nouvelleNotif } });
  },
  modifierStatutPriere(id: string, statut: DemandePriere['statut']) {
    store.dispatch({ type: 'MODIFIER_STATUT_PRIERE', payload: { id, statut } });
  },
  supprimerDemandePriere(id: string) {
    store.dispatch({ type: 'SUPPRIMER_DEMANDE_PRIERE', payload: id });
  },

  // Actions Notifications
  ajouterNotification(message: string) {
    const nouvelleNotif: NotificationMed = {
      id: `n-${Date.now()}`,
      message,
      date: new Date().toISOString(),
      lu: false,
    };
    store.dispatch({ type: 'AJOUTER_NOTIFICATION', payload: nouvelleNotif });
  },
  marquerNotificationLue(id: string) {
    store.dispatch({ type: 'MARQUER_NOTIFICATION_LUE', payload: id });
  },
  effacerNotifications() {
    store.dispatch({ type: 'EFFACER_NOTIFICATIONS' });
  },

  // Actions Catégories financières
  ajouterCategorie(nom: string): { success: boolean; error?: string } {
    const nomPropre = nom.trim();
    if (!nomPropre) return { success: false, error: 'Le nom de la catégorie ne peut pas être vide.' };
    if (state.categories.some((c) => c.toLowerCase() === nomPropre.toLowerCase())) {
      return { success: false, error: 'Cette catégorie existe déjà.' };
    }
    store.dispatch({ type: 'AJOUTER_CATEGORIE', payload: nomPropre });
    return { success: true };
  },
  modifierCategorie(ancienNom: string, nouveauNom: string): { success: boolean; error?: string } {
    const nouveauNomPropre = nouveauNom.trim();
    if (!nouveauNomPropre) return { success: false, error: 'Le nom de la catégorie ne peut pas être vide.' };
    if (ancienNom === nouveauNomPropre) return { success: true };
    if (state.categories.some((c) => c.toLowerCase() === nouveauNomPropre.toLowerCase() && c !== ancienNom)) {
      return { success: false, error: 'Une autre catégorie porte déjà ce nom.' };
    }
    store.dispatch({ type: 'MODIFIER_CATEGORIE', payload: { ancienNom, nouveauNom: nouveauNomPropre } });
    return { success: true };
  },
  supprimerCategorie(nom: string): { success: boolean; error?: string } {
    store.dispatch({ type: 'SUPPRIMER_CATEGORIE', payload: nom });
    return { success: true };
  },

  // Actions Statuts des membres
  ajouterStatut(nom: string): { success: boolean; error?: string } {
    const nomPropre = nom.trim();
    if (!nomPropre) return { success: false, error: 'Le nom du statut ne peut pas être vide.' };
    if (state.statuts.some((s) => s.toLowerCase() === nomPropre.toLowerCase())) {
      return { success: false, error: 'Ce statut existe déjà.' };
    }
    store.dispatch({ type: 'AJOUTER_STATUT', payload: nomPropre });
    return { success: true };
  },
  modifierStatut(ancienNom: string, nouveauNom: string): { success: boolean; error?: string } {
    const nouveauNomPropre = nouveauNom.trim();
    if (!nouveauNomPropre) return { success: false, error: 'Le nom du statut ne peut pas être vide.' };
    if (ancienNom === nouveauNomPropre) return { success: true };
    if (state.statuts.some((s) => s.toLowerCase() === nouveauNomPropre.toLowerCase() && s !== ancienNom)) {
      return { success: false, error: 'Un autre statut porte déjà ce nom.' };
    }
    store.dispatch({ type: 'MODIFIER_STATUT', payload: { ancienNom, nouveauNom: nouveauNomPropre } });
    return { success: true };
  },
  supprimerStatut(nom: string): { success: boolean; error?: string } {
    store.dispatch({ type: 'SUPPRIMER_STATUT', payload: nom });
    return { success: true };
  },

  // Actions Caisses financières
  creerCaisse(nom: string, description: string, code: string, responsable: string, objectif: number, categorie: string): { success: boolean; caisse?: Caisse; error?: string } {
    let codeCaisse = code;
    if (!codeCaisse || codeCaisse.trim() === '') {
      const cleanNom = nom.replace(/[^a-zA-Z0-9 ]/g, "").toUpperCase();
      const words = cleanNom.split(" ").filter((w) => w.length > 0);
      if (words.length >= 2) {
        codeCaisse = words.slice(0, 3).map((w) => w.slice(0, 3)).join('-');
      } else if (words.length === 1) {
        codeCaisse = words[0].slice(0, 6);
      } else {
        codeCaisse = `C-${Date.now().toString().slice(-4)}`;
      }
    }

    const nouvelleCaisse: Caisse = {
      id: `caisse-${Date.now()}`,
      nom: nom.trim(),
      description: description ? description.trim() : '',
      code: codeCaisse.trim().toUpperCase(),
      responsable: responsable ? responsable.trim() : 'Non spécifié',
      objectif: objectif ? Number(objectif) : 0,
      categorie: categorie ? categorie.trim() : 'Général',
      dateCreation: new Date().toISOString(),
      cotisants: {},
      archivee: false,
    };

    store.dispatch({ type: 'CREER_CAISSE', payload: nouvelleCaisse });
    return { success: true, caisse: nouvelleCaisse };
  },
  modifierCaisse(id: string, nom: string, description: string, code: string, responsable: string, objectif: number, categorie: string): { success: boolean; caisse?: Caisse; error?: string } {
    const caisseExistante = state.caisses.find((c) => c.id === id);
    if (!caisseExistante) {
      return { success: false, error: 'Caisse introuvable.' };
    }

    const caisseModifiee: Caisse = {
      ...caisseExistante,
      nom: nom.trim(),
      description: description ? description.trim() : '',
      code: code ? code.trim().toUpperCase() : 'C-GEN',
      responsable: responsable ? responsable.trim() : 'Non spécifié',
      objectif: objectif ? Number(objectif) : 0,
      categorie: categorie ? categorie.trim() : 'Général',
    };

    store.dispatch({ type: 'MODIFIER_CAISSE', payload: caisseModifiee });
    return { success: true, caisse: caisseModifiee };
  },
  archiverCaisse(id: string) {
    store.dispatch({ type: 'ARCHIVER_CAISSE', payload: id });
    return { success: true };
  },
  desarchiverCaisse(id: string) {
    store.dispatch({ type: 'DESARCHIVER_CAISSE', payload: id });
    return { success: true };
  },
  supprimerCaisse(id: string) {
    store.dispatch({ type: 'SUPPRIMER_CAISSE', payload: id });
    return { success: true };
  },

  // Actions Cotisations
  enregistrerCotisation(idCaisse: string, idMembre: string, montant: number, commentaire?: string, typeDon?: string, modePaiement?: string): { success: boolean; transaction?: Transaction; error?: string } {
    const timestamp = Date.now();
    const nouvelleTx: Transaction = {
      id: `tx-${timestamp}`,
      idCaisse,
      idMembre,
      montant: Number(montant),
      commentaire: commentaire ? commentaire.trim() : '',
      date: new Date().toISOString(),
      modifications: [],
      typeDon: typeDon || 'Don',
      modePaiement: modePaiement || 'Espèces',
    };

    const currentState = store.getState();
    const nouvellesCaisses = currentState.caisses.map((caisse) => {
      if (caisse.id === idCaisse) {
        const anciensCotisants = { ...caisse.cotisants };
        const ancienMontant = anciensCotisants[idMembre] || 0;
        return {
          ...caisse,
          cotisants: {
            ...anciensCotisants,
            [idMembre]: scaleNumber(ancienMontant + nouvelleTx.montant),
          },
        };
      }
      return caisse;
    });

    const membre = currentState.membres.find((m) => m.id === idMembre);
    const caisse = currentState.caisses.find((c) => c.id === idCaisse);
    let notification: NotificationMed | undefined;

    if (membre && caisse) {
      notification = {
        id: `n-${timestamp}`,
        message: `Nouveau versement de ${Number(montant).toLocaleString('fr-FR')} FCFA par ${membre.prenom} ${membre.nom} pour la caisse ${caisse.nom}`,
        date: new Date().toISOString(),
        lu: false,
      };
    }

    store.dispatch({
      type: 'ENREGISTRER_COTISATION',
      payload: { transaction: nouvelleTx, caisses: nouvellesCaisses, notification },
    });

    return { success: true, transaction: nouvelleTx };
  },
  modifierCotisation(idTx: string, nouveauMontant: number): { success: boolean; transaction?: Transaction; error?: string } {
    const valMontant = Number(nouveauMontant);
    const currentState = store.getState();
    const txExistante = currentState.transactions.find((t) => t.id === idTx);
    if (!txExistante) {
      return { success: false, error: 'Versement introuvable.' };
    }

    const modifs = txExistante.modifications || [];
    const nouvelleModif: ModificationTx = {
      date: new Date().toISOString(),
      ancienMontant: txExistante.montant,
      nouveauMontant: valMontant,
    };

    const txModifiee: Transaction = {
      ...txExistante,
      montant: valMontant,
      modifications: [...modifs, nouvelleModif],
    };

    const diff = scaleNumber(valMontant - txExistante.montant);
    const idCaisse = txExistante.idCaisse;
    const idMembre = txExistante.idMembre;

    const nouvellesCaisses = currentState.caisses.map((caisse) => {
      if (caisse.id === idCaisse) {
        const anciensCotisants = { ...caisse.cotisants };
        const ancienCumul = anciensCotisants[idMembre] || 0;
        return {
          ...caisse,
          cotisants: {
            ...anciensCotisants,
            [idMembre]: scaleNumber(ancienCumul + diff),
          },
        };
      }
      return caisse;
    });

    store.dispatch({
      type: 'MODIFIER_COTISATION',
      payload: { transaction: txModifiee, caisses: nouvellesCaisses },
    });

    return { success: true, transaction: txModifiee };
  },

  // Actions Méditations
  ajouterMeditation(med: Omit<Meditation, 'id' | 'date'>) {
    const nouvelleMed: Meditation = {
      ...med,
      id: `med-${Date.now()}`,
      date: new Date().toISOString(),
    };
    store.dispatch({ type: 'AJOUTER_MEDITATION', payload: nouvelleMed });
  },
  modifierMeditation(id: string, med: Partial<Meditation>) {
    store.dispatch({ type: 'MODIFIER_MEDITATION', payload: { id, med } });
  },
  supprimerMeditation(id: string) {
    store.dispatch({ type: 'SUPPRIMER_MEDITATION', payload: id });
  },

  // Actions Suggestions
  soumettreSuggestion(sug: Omit<Suggestion, 'id' | 'date'>) {
    const timestamp = Date.now();
    const nouvelleSug: Suggestion = {
      ...sug,
      id: `sug-${timestamp}`,
      date: new Date().toISOString(),
    };
    const nouvelleNotif: NotificationMed = {
      id: `n-${timestamp}`,
      message: `Nouvelle suggestion reçue de ${sug.nom} : "${sug.sujet}"`,
      date: new Date().toISOString(),
      lu: false,
    };
    store.dispatch({ type: 'SOUMETTRE_SUGGESTION', payload: { suggestion: nouvelleSug, notification: nouvelleNotif } });
  },
  supprimerSuggestion(id: string) {
    store.dispatch({ type: 'SUPPRIMER_SUGGESTION', payload: id });
  },
};

const queryMethods = {
  calculerTotalCaisse(idCaisse: string) {
    const caisse = store.getState().caisses.find((c) => c.id === idCaisse);
    if (!caisse) return 0;
    return Object.values(caisse.cotisants).reduce((sum, val) => sum + val, 0);
  },
  calculerTotalGeneral() {
    return store.getState().caisses.reduce((totalGlobal, caisse) => {
      if (caisse.archivee) return totalGlobal;
      const totalCaisse = Object.values(caisse.cotisants).reduce((sum, val) => sum + val, 0);
      return totalGlobal + totalCaisse;
    }, 0);
  },
  obtenirCotisationsMembre(idMembre: string) {
    return store.getState().transactions.filter((tx) => tx.idMembre === idMembre);
  },
  obtenirSoldeMembreParCaisse(idMembre: string) {
    const resultats: Array<{ idCaisse: string; nomCaisse: string; montant: number; archivee: boolean }> = [];
    store.getState().caisses.forEach((caisse) => {
      const montant = caisse.cotisants[idMembre] || 0;
      if (montant > 0) {
        resultats.push({
          idCaisse: caisse.id,
          nomCaisse: caisse.nom,
          montant,
          archivee: caisse.archivee,
        });
      }
    });
    return resultats;
  },
};

export type DonneesStoreActions = typeof store & typeof queryMethods;

export function useDonneesStore(): DonneesStateData & DonneesStoreActions;
export function useDonneesStore<T>(
  selector: (state: DonneesStateData & DonneesStoreActions) => T
): T;
export function useDonneesStore<T>(
  selector?: (state: DonneesStateData & DonneesStoreActions) => T
): any {
  const currentStoreState = useSyncExternalStore(
    store.subscribe,
    store.getState,
    () => getInitialState()
  );

  const fullState = {
    ...currentStoreState,
    ...store,
    ...queryMethods,
  };

  return selector ? selector(fullState) : (fullState as any);
}

useDonneesStore.getState = () => ({
  ...store.getState(),
  ...store,
  ...queryMethods,
});
