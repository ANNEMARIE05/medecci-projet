import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Heart, CalendarDays, Award, ChevronDown } from 'lucide-react';
import { PHOTOS } from '../../constants/photos';

export const APropos: React.FC = () => {
  const [filtreActif, setFiltreActif] = useState('Tous');
  const [indexDoctrineOuvert, setIndexDoctrineOuvert] = useState<number | null>(null);

  // Utiliser les vraies photos locales
  const getPhoto = (index: number, fallback: string) => {
    return PHOTOS && PHOTOS.length > index ? PHOTOS[index] : fallback;
  };

  const croyances = [
    { 
      titre: 'Les Saintes Écritures', 
      description: 'Nous croyons que la Bible est la Parole inspirée, infaillible et souveraine de Dieu, règle suprême de foi et de vie chrétienne.' 
    },
    { 
      titre: 'La Trinité Divine', 
      description: 'Nous croyons en un seul Dieu, éternellement existant en trois personnes égales et unies : le Père, le Fils et le Saint-Esprit.' 
    },
    { 
      titre: 'Le Salut par la Grâce', 
      description: 'Nous croyons au salut de l\'être humain par la pure grâce divine, reçue uniquement par la foi personnelle en Jésus-Christ et son sacrifice sur la croix.' 
    },
    { 
      titre: 'Le Saint-Esprit et la Sanctification', 
      description: 'Nous croyons au ministère actuel du Saint-Esprit, qui habite le croyant, produit le fruit de l\'Esprit et lui donne la force de vivre saintement.' 
    },
    { 
      titre: 'L\'Église Corps de Christ', 
      description: 'Nous croyons en l\'unité spirituelle de tous les croyants rachetés par le sang de Jésus, formant une seule Église universelle.' 
    },
  ];

  const equipePastors = [
    {
      nom: "Prophète ASSANDE Jacques",
      role: "Président Fondateur de la MEDEC-CI",
      details: "Fondateur et visionnaire principal de la mission. Il assure la direction spirituelle nationale et internationale de la MEDEC-CI.",
      image: "/prophete_assande.png",
      categorie: "Bureau National"
    },
    {
      nom: "Apôtre Christine ASSANDE",
      role: "Directrice Nationale des Femmes (DFEM)",
      details: "Épouse du Président, elle dirige avec passion le département des femmes, œuvrant pour l'épanouissement spirituel et social des foyers.",
      image: "/epouse_assande.png",
      categorie: "Bureau National"
    },
    {
      nom: "Pasteur MORIBA Komon Joseph",
      role: "Vice-Président & 1er Responsable du Siège",
      details: "Il co-dirige la mission nationale et gère directement les activités pastorales du siège national de Koumassi.",
      image: getPhoto(8, "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400"),
      categorie: "Bureau National"
    },
    {
      nom: "Apôtre FALLE Zébo Ambroise",
      role: "Directeur des Églises Locales (DEL)",
      details: "Responsable de la coordination, de l'implantation et de la supervision des temples locaux en Côte d'Ivoire. Pasteur principal de MEDEC-CI Adjouffou.",
      image: getPhoto(12, "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400"),
      categorie: "Bureau National"
    },
    {
      nom: "Rév. Pasteur NOUDE Hubert Tia",
      role: "Responsable de la Zone de Lakota",
      details: "Superviseur spirituel de la zone de Lakota (5 églises) et pasteur principal de l'église locale de Lakota Ville.",
      image: getPhoto(24, "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400"),
      categorie: "Zone Lakota"
    },
    {
      nom: "Pasteur NAHOUNOU Éric",
      role: "Responsable de la Zone d'Abidjan",
      details: "Coordonnateur de la zone d'Abidjan (8 églises locales) et pasteur adjoint au siège national de Koumassi.",
      image: getPhoto(32, "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400"),
      categorie: "Zone Abidjan"
    },
    {
      nom: "Pasteur AKE Brigitte (épouse AYE)",
      role: "Responsable MEDEC-CI Gens Bénis (Jean Folly)",
      details: "Elle dirige l'église locale de Jean Folly (Gens bénis) avec un zèle remarquable pour l'avancement du Royaume.",
      image: getPhoto(40, "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"),
      categorie: "Zone Abidjan"
    },
    {
      nom: "Pasteur MAHI Chantal (épouse BIEDRO)",
      role: "Responsable MEDEC-CI Yopougon",
      details: "Responsable de l'extension de Yopougon Gesco, qu'elle conduit avec ferveur depuis plus de 12 ans.",
      image: getPhoto(48, "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400"),
      categorie: "Zone Abidjan"
    },
    {
      nom: "Pasteur DABONE Pascal",
      role: "Directeur National de la Jeunesse (DJ)",
      details: "Il conduit la direction de la jeunesse (JMEDECCI) pour préparer les leaders de demain à travers des activités spirituelles et éducatives.",
      image: getPhoto(56, "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"),
      categorie: "Bureau National"
    }
  ];

  const pasteursFiltres = equipePastors.filter(
    (p) => filtreActif === 'Tous' || p.categorie === filtreActif
  );

  return (
    <div className="bg-[#F8FAFC] pb-12 sm:pb-20 space-y-12 sm:space-y-24 font-outfit">
      
      {/* 1. HEADER PAGE */}
      <section className="relative bg-slate-950 text-white py-16 sm:py-28 text-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{
            backgroundImage: `url('${getPhoto(11, 'https://images.unsplash.com/photo-1548625361-155deee223cb?auto=format&fit=crop&q=80&w=1200')}')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/90" />
        <div className="relative max-w-4xl mx-auto px-4 space-y-4 z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-medecci-or bg-white/10 px-4 py-2 rounded-full border border-white/10">
            NOTRE IDENTITÉ
          </span>
          <h1 className="font-cormorant italic font-bold text-3xl sm:text-6xl lg:text-7xl leading-tight">Qui Sommes-Nous ?</h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            Découvrez notre histoire prophétique, nos croyances théologiques et les bergers dévoués qui conduisent le peuple de Dieu.
          </p>
        </div>
      </section>

      {/* 2. HISTORIQUE & FONDATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center space-x-2 bg-medecci-or/10 text-medecci-or px-4 py-1.5 rounded-full border border-medecci-or/10">
              <CalendarDays className="h-4.5 w-4.5" />
              <span className="text-xs font-bold uppercase tracking-wider">Notre Historique</span>
            </div>
            <h2 className="font-poppins text-3xl sm:text-5xl font-black text-[#0B3C91] leading-tight">
              Origine et Appel Divin de la MEDECCI
            </h2>
            <p className="text-slate-655 leading-relaxed text-sm sm:text-base font-light">
              La Mission Évangélique de Dieu en Christ en Côte d'Ivoire (MEDECCI) a été suscitée pour apporter un réveil spirituel et enseigner la Parole de Dieu avec rigueur et vérité. Commencée dans un salon de maison par quelques fidèles zélés sous la direction du Prophète ASSANDE Jacques, l'œuvre s'est étendue pour devenir un canal de bénédiction majeur.
            </p>
            <p className="text-slate-655 leading-relaxed text-sm sm:text-base font-light">
              Notre cheminement est jalonné de témoignages marquants de guérison, de délivrance et de relèvement spirituel. Avec pour mot d'ordre 2026 : « Moi, je choisis la bonne Part », nous poursuivons l'édification de disciples accomplis.
            </p>
            
            {/* Chiffres clés */}
            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-[#E2E8F0]">
              <div className="space-y-1">
                <span className="block text-3xl sm:text-4xl font-black text-[#0B3C91] font-poppins">15+</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Années de Ministère</span>
              </div>
              <div className="space-y-1">
                <span className="block text-3xl sm:text-4xl font-black text-[#0B3C91] font-poppins">20+</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Églises & Missions</span>
              </div>
              <div className="space-y-1">
                <span className="block text-3xl sm:text-4xl font-black text-[#0B3C91] font-poppins">5 000+</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Membres Actifs</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -top-6 -left-6 w-80 h-80 bg-blue-50 rounded-3xl blur-3xl -z-10" />
            <div className="overflow-hidden rounded-3xl border border-[#E2E8F0] shadow-premium bg-white p-4">
              <img
                src={getPhoto(29, "https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&q=80&w=800")}
                alt="Assemblée générale MEDECCI"
                className="w-full h-[400px] object-cover rounded-2xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. VISION & MISSION */}
      <section className="bg-white border-y border-[#E2E8F0] py-12 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-[#F8FAFC] p-8 sm:p-10 rounded-3xl border border-[#E2E8F0] space-y-4"
            >
              <div className="p-3.5 bg-[#0B3C91]/5 text-[#0B3C91] rounded-2xl w-fit border border-[#0B3C91]/5">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="font-poppins text-2xl font-black text-[#0B3C91]">Notre Vision</h3>
              <p className="text-slate-655 text-sm leading-relaxed font-light">
                Bâtir des églises vivantes et autonomes où le peuple de Dieu adore en esprit et en vérité, est instruit selon la saine doctrine chrétienne et témoigne par des actions d'amour dans toute la nation et à l'international.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-[#F8FAFC] p-8 sm:p-10 rounded-3xl border border-[#E2E8F0] space-y-4"
            >
              <div className="p-3.5 bg-medecci-or/10 text-medecci-or rounded-2xl w-fit border border-medecci-or/10">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="font-poppins text-2xl font-black text-[#0B3C91]">Notre Mission</h3>
              <ul className="text-slate-655 text-sm space-y-2.5 list-disc list-inside font-light">
                <li>Prêcher l'Évangile pur du salut par la foi en Jésus-Christ.</li>
                <li>Former des leaders chrétiens matures et dévoués à l'œuvre.</li>
                <li>Multiplier des temples locaux pour rapprocher la foi des communautés.</li>
                <li>Intervenir socialement auprès des veuves, orphelins et démunis.</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. MOT DU PRESIDENT FONDATEUR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E2E8F0] shadow-premium">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-12 items-center">
            
            {/* Photo du pasteur */}
            <div className="flex flex-col items-center text-center space-y-4 shrink-0">
              <div className="h-48 w-48 rounded-full overflow-hidden border-4 border-white shadow-xl relative bg-slate-50">
                <img
                  src="/prophete_assande.png"
                  alt="Prophète ASSANDE Jacques"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-poppins font-black text-[#0B3C91] text-lg">Prophète ASSANDE Jacques</h4>
                <span className="text-xs text-medecci-or font-bold uppercase tracking-wider">Président Fondateur</span>
              </div>
            </div>

            {/* Message de bienvenue */}
            <div className="lg:col-span-2 space-y-4">
              <span className="text-6xl text-medecci-or font-cormorant font-bold italic leading-none block h-6">“</span>
              <p className="text-slate-700 italic font-cormorant text-xl sm:text-2xl leading-relaxed">
                Je vous souhaite la plus chaleureuse bienvenue sur notre portail. Notre espérance suprême est de vous voir croître spirituellement dans la connaissance de notre Seigneur Jésus-Christ. MEDECCI est une famille de louange, d'intercession et d'amour authentique. Que la grâce divine surabonde dans votre foyer et que vous fassiez toujours la bonne part.
              </p>
              <span className="block font-poppins font-bold text-slate-400 text-[10px] uppercase tracking-widest pt-2">
                — MESSAGE SPIRITUEL DU PRÉSIDENT
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LE LEADERSHIP PASTORAL (TROMBINOSCOPE ANIMÉ) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 bg-medecci-or/10 text-medecci-or px-3.5 py-1.5 rounded-full border border-medecci-or/10">
            <Award className="h-4.5 w-4.5" />
            <span className="text-xs font-bold uppercase tracking-wider">Notre Leadership</span>
          </div>
          <h2 className="font-poppins text-3xl sm:text-5xl font-black text-[#0B3C91]">Nos Pasteurs & Missionnaires</h2>
          <p className="text-slate-500 text-sm max-w-xl mx-auto font-light">
            Découvrez les serviteurs de Dieu consacrés à l'accompagnement spirituel des temples locaux.
          </p>
        </div>

        {/* Boutons Filtres */}
        <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
          {['Tous', 'Bureau National', 'Zone Abidjan', 'Zone Lakota'].map((filtre) => (
            <button
              key={filtre}
              onClick={() => setFiltreActif(filtre)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                filtreActif === filtre
                  ? 'bg-[#0B3C91] text-white shadow-md'
                  : 'bg-white text-slate-600 border border-[#E2E8F0] hover:bg-slate-50'
              }`}
            >
              {filtre}
            </button>
          ))}
        </div>

        {/* Grille Leadership */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {pasteursFiltres.map((pastor) => (
              <motion.div
                key={pastor.nom}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden shadow-sm flex flex-col justify-between hover:border-medecci-or/40 transition-colors group"
              >
                <div>
                  <div className="h-72 w-full bg-slate-50 overflow-hidden relative">
                    <img
                      src={pastor.image}
                      alt={pastor.nom}
                      className="w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-700"
                    />
                    <span className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-sm text-white text-[9px] font-bold px-3 py-1 rounded-full border border-white/10 uppercase tracking-wider">
                      {pastor.categorie}
                    </span>
                  </div>
                  <div className="p-6 space-y-2">
                    <h3 className="font-poppins text-lg font-bold text-slate-850">{pastor.nom}</h3>
                    <p className="text-xs text-medecci-or font-bold uppercase tracking-wider">{pastor.role}</p>
                    <p className="text-slate-500 text-xs leading-relaxed pt-2 font-light">{pastor.details}</p>
                  </div>
                </div>
                <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                  <span>MEDEC-CI</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-medecci-or" />
                  <span>Service de la Foi</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* 6. CROYANCES FONDAMENTALES (FAQ STYLE ET ACCORDÉON) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 bg-[#0B3C91]/10 text-[#0B3C91] px-3.5 py-1.5 rounded-full border border-[#0B3C91]/10">
            <ShieldCheck className="h-4.5 w-4.5" />
            <span className="text-xs font-bold uppercase tracking-wider">Notre Doctrine</span>
          </div>
          <h2 className="font-poppins text-3xl sm:text-5xl font-black text-[#0B3C91]">Notre Confession de Foi</h2>
          <p className="text-slate-500 text-sm font-light">
            Découvrez les piliers de notre théologie chrétienne et les enseignements bibliques que nous confessons.
          </p>
        </div>

        <div className="space-y-4">
          {croyances.map((croyance, i) => {
            const estOuvert = indexDoctrineOuvert === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm hover:border-[#1E88E5]/30 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setIndexDoctrineOuvert(estOuvert ? null : i)}
                  className="w-full text-left p-6 flex justify-between items-center font-bold text-slate-800 focus:outline-none"
                >
                  <div className="flex items-center space-x-4">
                    <span className="h-7 w-7 rounded-full bg-[#0B3C91]/5 text-[#0B3C91] flex items-center justify-center font-bold text-xs">
                      {i + 1}
                    </span>
                    <span className="font-poppins text-sm sm:text-base">{croyance.titre}</span>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-slate-450 transition-transform duration-300 ${estOuvert ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {estOuvert && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-[#F8FAFC]"
                    >
                      <div className="p-6 bg-[#F8FAFC]/30 text-slate-600 text-xs sm:text-sm leading-relaxed font-light">
                        {croyance.description}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>

    </div>
  );
};

export default APropos;
