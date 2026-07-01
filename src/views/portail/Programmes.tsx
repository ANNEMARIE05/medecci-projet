import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, AlertCircle, ChevronDown, ChevronUp, MessageCircle, HelpCircle, HeartHandshake, Compass } from 'lucide-react';
import { PROGRAMMES_CULTES, INFOS_CONTACT } from '../../constants';
import { PHOTOS } from '../../constants/photos';

export const Programmes: React.FC = () => {
  const [ongletActif, setOngletActif] = useState<'tous' | 'hebd' | 'mens' | 'spec'>('tous');
  const [faqOuvert, setFaqOuvert] = useState<number | null>(null);

  const getPhoto = (index: number, fallback: string) => {
    return PHOTOS && PHOTOS.length > index ? PHOTOS[index] : fallback;
  };

  const programmesFiltrés = PROGRAMMES_CULTES.filter((p) => {
    if (ongletActif === 'tous') return true;
    return p.type === ongletActif;
  });

  const faqs = [
    {
      q: "Comment se déroulent les cultes à la MEDECCI ?",
      a: "Nos cultes débutent par un moment chaleureux de louange et d'adoration conduit par la chorale, suivi d'une prière d'intercession, de la prédication de la Parole de Dieu inspirée, et se terminent par des actions de grâce et les annonces de la communauté."
    },
    {
      q: "Puis-je assister aux cultes si je ne suis pas encore membre ?",
      a: "Absolument ! Tout le monde est le bienvenu, quel que soit votre parcours spirituel ou votre confession de foi. Notre église est ouverte à tous ceux qui cherchent la vérité et l'amour de Christ."
    },
    {
      q: "Proposez-vous un encadrement pour les enfants ?",
      a: "Oui, notre École du Dimanche (Écodim) prend en charge les enfants de tous âges pendant le culte d'adoration dominical. Ils y reçoivent un enseignement biblique adapté à leur âge à travers des activités ludiques, bibliques et édifiantes."
    },
    {
      q: "Comment soumettre une demande de prière ?",
      a: "Vous pouvez soumettre une demande de prière directement en ligne via notre Espace de Prière ou en contactant notre secrétariat pastoral. Nos équipes et pasteurs intercèdent pour chaque sujet reçu avec foi et discrétion."
    }
  ];

  const agendaHebdo = [
    {
      jour: 'Chaque Dimanche',
      description: 'Jour de Seigneur, de célébration et de communion fraternelle.',
      cultes: [
        { titre: 'Culte de la Jeunesse', horaire: '07h00 - 08h30', icone: HeartHandshake, color: 'text-medecci-bleuClair bg-blue-50' },
        { titre: "Culte d'Adoration", horaire: '08h30 - 11h00', icone: Calendar, color: 'text-medecci-bleuRoyal bg-indigo-50' }
      ]
    },
    {
      jour: 'Chaque Jeudi',
      description: 'Étude en profondeur et intercession collective.',
      cultes: [
        { titre: 'Enseignement & Prière', horaire: '19h00 - 20h30', icone: MessageCircle, color: 'text-[#C5A059] bg-amber-50/50' }
      ]
    },
    {
      jour: 'Chaque Vendredi',
      description: 'Combat spirituel, délivrance et veillées mensuelles.',
      cultes: [
        { titre: 'Culte de Délivrance', horaire: '09h00 - 12h00', icone: Compass, color: 'text-indigo-600 bg-purple-50' },
        { titre: "Nuit d'Impact (Dernier ven.)", horaire: '22h00 - 05h00', icone: Clock, color: 'text-slate-800 bg-slate-100' }
      ]
    }
  ];

  return (
    <div className="bg-[#F8FAFC] pb-12 sm:pb-20 space-y-12 sm:space-y-20 font-outfit">
      
      {/* HEADER SECTION */}
      <section className="relative bg-slate-950 text-white py-16 sm:py-28 text-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url('${getPhoto(14, 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1200')}')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/90" />
        <div className="relative max-w-4xl mx-auto px-4 space-y-5 z-10">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-medecci-or bg-white/10 px-4.5 py-2 rounded-full border border-white/10 backdrop-blur-sm">
            LITURGIE & COMMUNION
          </span>
          <h1 className="font-cormorant italic font-bold text-3xl sm:text-6xl lg:text-7xl leading-tight tracking-tight">
            Cultes & Programmes
          </h1>
          <p className="text-slate-350 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            Consultez les horaires et descriptions de nos rendez-vous de louange, d'étude biblique, de délivrance et de veillées de prière pour vous nourrir spirituellement.
          </p>
        </div>
      </section>

      {/* AGENDA VISUEL HEBDOMADAIRE (Enrichissement de la page) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-poppins text-2xl sm:text-3xl font-black text-slate-850">
            Aperçu de notre Semaine
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm font-light">
            Planifiez votre venue en consultant notre planning chronologique de la semaine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 pt-4">
          {agendaHebdo.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300 relative group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-poppins font-black text-slate-800 text-base">{item.jour}</h3>
                  <span className="h-2 w-2 rounded-full bg-[#1E88E5] group-hover:animate-ping" />
                </div>
                <p className="text-slate-400 text-xs font-light leading-relaxed">{item.description}</p>
                <div className="space-y-3 pt-2">
                  {item.cultes.map((culte, cidx) => (
                    <div key={cidx} className="flex items-center space-x-3.5 bg-slate-50 p-3 rounded-lg border border-slate-100/50">
                      <div className={`p-2 rounded-lg shrink-0 ${culte.color}`}>
                        <culte.icone className="h-4.5 w-4.5" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-poppins font-bold text-slate-800 text-xs sm:text-xs.5">{culte.titre}</h4>
                        <span className="text-[10px] text-slate-500 font-semibold block">{culte.horaire}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FILTRE ET PROGRAMMES DETAILLÉS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pt-4">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-poppins text-2xl sm:text-3xl font-black text-slate-850">
            Détails de nos Réunions
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm font-light">
            Découvrez le but et la nature spirituelle de chacun de nos cultes et assemblées.
          </p>
        </div>

        {/* TABS SELECTOR */}
        <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-[#F1F5F9] rounded-xl max-w-xl mx-auto border border-[#E2E8F0]">
          {(
            [
              { id: 'tous', libelle: 'Tous' },
              { id: 'hebd', libelle: 'Hebdomadaires' },
              { id: 'mens', libelle: 'Mensuels' },
              { id: 'spec', libelle: 'Spéciaux' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setOngletActif(tab.id)}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 ${
                ongletActif === tab.id
                  ? 'bg-[#0B3C91] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-850 hover:bg-white/50'
              }`}
            >
              {tab.libelle}
            </button>
          ))}
        </div>

        {/* LIST OF PROGRAMS */}
        <div className="max-w-4xl mx-auto">
          <motion.div layout className="space-y-5">
            <AnimatePresence mode="popLayout">
              {programmesFiltrés.map((prog, index) => (
                <motion.div
                  key={prog.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  className="bg-white rounded-xl p-5 sm:p-6.5 border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-[#1E88E5]/30 transition-all group"
                >
                  <div className="space-y-3 md:max-w-[70%] text-left">
                    <span
                      className={`inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        prog.type === 'hebd'
                          ? 'bg-blue-50 text-[#1E88E5] border border-blue-100'
                          : prog.type === 'mens'
                          ? 'bg-purple-50 text-purple-650 border border-purple-100'
                          : 'bg-amber-50 text-[#C5A059] border border-amber-100'
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        prog.type === 'hebd' ? 'bg-[#1E88E5]' : prog.type === 'mens' ? 'bg-purple-600' : 'bg-[#C5A059]'
                      }`} />
                      <span>{prog.type === 'hebd' ? 'Hebdomadaire' : prog.type === 'mens' ? 'Mensuel' : 'Spécial'}</span>
                    </span>
                    <h3 className="font-poppins text-lg sm:text-xl font-black text-slate-850 group-hover:text-[#1E88E5] transition-colors leading-tight">
                      {prog.titre}
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed font-light">
                      {prog.description}
                    </p>
                  </div>

                  {/* Horaire & Lieu Info */}
                  <div className="space-y-2.5 shrink-0 md:text-right border-t md:border-t-0 pt-3.5 md:pt-0 border-slate-100 font-semibold text-xs text-left md:items-end flex flex-col">
                    <div className="flex items-center md:justify-end space-x-2 text-[#0B3C91]">
                      <Calendar className="h-4 w-4 text-[#C5A059]" />
                      <span>{prog.jour}</span>
                    </div>
                    <div className="flex items-center md:justify-end space-x-2 text-slate-500 text-xs">
                      <Clock className="h-4 w-4 text-[#C5A059]" />
                      <span>{prog.horaire}</span>
                    </div>
                    <div className="flex items-center md:justify-end space-x-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span>Koumassi, Abidjan</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ACCUEIL PASTORAL & FOIRE AUX QUESTIONS (Enrichissement de la page) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 pt-6">
        {/* Accompagnement card */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6.5 sm:p-8 flex flex-col justify-between text-left space-y-6 shadow-sm">
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 text-medecci-bleuRoyal rounded-lg w-fit">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h3 className="font-poppins text-xl sm:text-2xl font-black text-slate-800">Accompagnement Pastoral</h3>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-light">
              Pour des requêtes sacramentelles particulières (baptêmes par immersion, mariages chrétiens, présentations de nouveau-nés) ou pour solliciter un entretien pastoral privé avec le Prophète ou le corps ecclésiastique, notre secrétariat est à votre entière disposition.
            </p>
          </div>
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Secrétariat Général</span>
              <span className="text-sm font-bold text-slate-800">{INFOS_CONTACT.telephone.split('/')[0].trim()}</span>
            </div>
            <a
              href={`tel:${INFOS_CONTACT.telephone.split('/')[0].trim()}`}
              className="px-5 py-2.5 bg-medecci-bleuRoyal hover:bg-medecci-bleuClair text-white text-xs font-bold rounded-lg text-center shadow-md transition-colors"
            >
              Prendre Rendez-vous
            </a>
          </div>
        </div>

        {/* Collapsible FAQ accordion */}
        <div className="space-y-6 text-left">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 bg-[#C5A059]/10 text-[#C5A059] rounded-lg">
              <HelpCircle className="h-5.5 w-5.5" />
            </div>
            <h3 className="font-poppins text-xl sm:text-2xl font-black text-slate-800">Foire Aux Questions</h3>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, index) => {
              const estOuvert = faqOuvert === index;
              return (
                <div
                  key={index}
                  className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setFaqOuvert(estOuvert ? null : index)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left font-poppins font-bold text-slate-800 text-xs sm:text-sm hover:bg-slate-50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {estOuvert ? (
                      <ChevronUp className="h-4.5 w-4.5 text-slate-400 shrink-0 ml-4" />
                    ) : (
                      <ChevronDown className="h-4.5 w-4.5 text-slate-400 shrink-0 ml-4" />
                    )}
                  </button>
                  <AnimatePresence initial={false}>
                    {estOuvert && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="px-5 pb-5 pt-0.5 text-slate-500 text-xs font-light leading-relaxed">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Programmes;
