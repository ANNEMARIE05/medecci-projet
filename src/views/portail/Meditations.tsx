import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, BookOpen, User, Search, ChevronRight, BookMarked, Quote } from 'lucide-react';
import meditationService from '../../services/meditationService';
import type { Meditation } from '../../stores/useDonneesStore';
import { formaterDate } from '../../utils/formateur';
import { PHOTOS } from '../../constants/photos';

export const Meditations: React.FC = () => {
  const [meditations, setMeditations] = useState<Meditation[]>([]);
  const [recherche, setRecherche] = useState('');
  const [enChargement, setEnChargement] = useState(true);
  const [meditationSelectionnee, setMeditationSelectionnee] = useState<Meditation | null>(null);

  const getPhoto = (index: number, fallback: string) => {
    return PHOTOS && PHOTOS.length > index ? PHOTOS[index] : fallback;
  };

  useEffect(() => {
    const chargerMeditations = async () => {
      setEnChargement(true);
      try {
        const data = await meditationService.recupererMeditations();
        setMeditations(data);
      } catch (error) {
        console.error("Erreur lors du chargement des méditations", error);
      } finally {
        setEnChargement(false);
      }
    };
    chargerMeditations();
  }, []);

  const meditationsFiltrées = meditations.filter((m) =>
    m.titre.toLowerCase().includes(recherche.toLowerCase()) ||
    m.versetRef.toLowerCase().includes(recherche.toLowerCase()) ||
    m.contenu.toLowerCase().includes(recherche.toLowerCase())
  );

  const meditationDuJour = meditations.length > 0 ? meditations[0] : null;

  return (
    <div className="bg-[#F8FAFC] pb-20 space-y-16 font-outfit">
      
      {/* HEADER SECTION */}
      <section className="relative bg-slate-950 text-white py-24 text-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{
            backgroundImage: `url('${getPhoto(11, 'https://images.unsplash.com/photo-1504052434569-70ad5836ab90?auto=format&fit=crop&q=80&w=1200')}')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/95" />
        <div className="relative max-w-4xl mx-auto px-4 space-y-4 z-10">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-medecci-or bg-white/10 px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm">
            EDIFICATION & PAROLE DE DIEU
          </span>
          <h1 className="font-cormorant italic font-bold text-4xl sm:text-7xl leading-tight tracking-tight">
            Méditations Quotidiennes
          </h1>
          <p className="text-slate-350 text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed">
            Nourrissez votre homme intérieur chaque jour avec la Parole vivante de Dieu commentée par vos serviteurs.
          </p>
        </div>
      </section>

      {/* CORE CONTENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {enChargement ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-medecci-bleuRoyal" />
            <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Chargement de la Parole...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* LEFT / MAIN COLUMN: TODAY'S MEDITATION & LIST */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* FEATURED: MEDITATION OF THE DAY */}
              {meditationDuJour && (
                <div className="bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="bg-gradient-to-r from-medecci-bleuRoyal to-medecci-bleuClair p-6 sm:p-8 text-white relative">
                    <div className="absolute top-6 right-6 opacity-10">
                      <BookOpen className="h-28 w-28" />
                    </div>
                    <span className="text-[10px] font-extrabold bg-[#C5A059] text-white px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                      ✨ Méditation du Jour
                    </span>
                    <h2 className="font-poppins font-black text-2xl sm:text-3xl mt-4 leading-tight">
                      {meditationDuJour.titre}
                    </h2>
                    <div className="flex items-center space-x-4 mt-6 text-xs text-blue-100 font-semibold">
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="h-4 w-4 text-[#C5A059]" />
                        <span>{formaterDate(meditationDuJour.date)}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <User className="h-4 w-4 text-[#C5A059]" />
                        <span>{meditationDuJour.auteur}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 space-y-6 text-left">
                    {/* Verset Card */}
                    <div className="bg-slate-50 border-l-4 border-[#C5A059] p-5 rounded-r-2xl space-y-3 relative overflow-hidden">
                      <div className="absolute right-4 bottom-4 opacity-5">
                        <Quote className="h-16 w-16" />
                      </div>
                      <div className="flex items-center space-x-2 text-[#0B3C91] font-bold text-xs">
                        <BookMarked className="h-4 w-4 text-[#C5A059]" />
                        <span>{meditationDuJour.versetRef}</span>
                      </div>
                      <p className="text-slate-650 font-cormorant italic text-sm sm:text-base leading-relaxed">
                        "{meditationDuJour.versetTexte}"
                      </p>
                    </div>

                    {/* Contenu */}
                    <div className="space-y-4 text-slate-600 text-xs sm:text-sm leading-relaxed font-light">
                      <p className="whitespace-pre-line">{meditationDuJour.contenu}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* LISTING / FILTERED ARCHIVES */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
                  <h3 className="font-poppins font-black text-slate-800 text-lg sm:text-xl">
                    Archives des Méditations
                  </h3>
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Rechercher une méditation..."
                      value={recherche}
                      onChange={(e) => setRecherche(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-[#E2E8F0] focus:outline-none focus:border-[#1E88E5] text-xs"
                    />
                  </div>
                </div>

                {meditationsFiltrées.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-slate-400 text-xs font-light">
                    Aucune méditation ne correspond à votre recherche.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {meditationsFiltrées.map((med) => (
                      <div
                        key={med.id}
                        onClick={() => setMeditationSelectionnee(med)}
                        className="bg-white p-6 rounded-2xl border border-[#E2E8F0] hover:border-[#1E88E5]/30 hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer group text-left"
                      >
                        <div className="space-y-3">
                          <span className="text-[9px] text-[#1E88E5] font-extrabold uppercase bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100/50 w-fit">
                            {med.versetRef}
                          </span>
                          <h4 className="font-poppins font-black text-slate-800 text-base group-hover:text-[#1E88E5] transition-colors leading-tight">
                            {med.titre}
                          </h4>
                          <p className="text-slate-400 text-xs line-clamp-3 font-light leading-relaxed">
                            {med.contenu}
                          </p>
                        </div>
                        <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          <span>{formaterDate(med.date)}</span>
                          <div className="flex items-center space-x-0.5 text-[#0B3C91] group-hover:translate-x-1 transition-transform">
                            <span>Lire</span>
                            <ChevronRight className="h-3 w-3" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: SIDEBAR */}
            <div className="space-y-8">
              {/* SECRETARIAT CARD */}
              <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6.5 text-left space-y-4 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-5">
                  <BookOpen className="h-36 w-36" />
                </div>
                <h3 className="font-poppins font-black text-slate-800 text-base">Recevoir par WhatsApp</h3>
                <p className="text-slate-500 text-xs font-light leading-relaxed">
                  Rejoignez notre canal WhatsApp officiel pour recevoir gratuitement votre méditation quotidienne, les enseignements audio du Prophète et les annonces de la communauté directement sur votre téléphone.
                </p>
                <a
                  href="https://wa.me/2250758526766"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#20ba59] text-white py-3 px-6 rounded-xl text-xs font-bold w-full transition-colors shadow-sm"
                >
                  <span>Rejoindre le Canal</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* READING VIEW MODAL */}
      <AnimatePresence>
        {meditationSelectionnee && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMeditationSelectionnee(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative z-10 border border-[#E2E8F0]"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-medecci-bleuRoyal to-medecci-bleuClair p-6 text-white text-left">
                <span className="text-[8px] font-extrabold bg-[#C5A059] text-white px-3 py-1 rounded-md uppercase tracking-wider">
                  Méditation chrétienne
                </span>
                <h3 className="font-poppins font-black text-xl sm:text-2xl mt-3 leading-tight">
                  {meditationSelectionnee.titre}
                </h3>
                <div className="flex items-center space-x-4 mt-4 text-[10px] text-blue-100 font-bold uppercase tracking-wider">
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formaterDate(meditationSelectionnee.date)}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <User className="h-3.5 w-3.5" />
                    <span>{meditationSelectionnee.auteur}</span>
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8 space-y-6 text-left">
                {/* Verset Card */}
                <div className="bg-slate-50 border-l-4 border-[#C5A059] p-4.5 rounded-r-xl space-y-2">
                  <span className="text-[#0B3C91] font-bold text-xs block">{meditationSelectionnee.versetRef}</span>
                  <p className="text-slate-600 font-cormorant italic text-sm leading-relaxed">
                    "{meditationSelectionnee.versetTexte}"
                  </p>
                </div>

                {/* Contenu */}
                <p className="text-slate-650 text-xs sm:text-sm leading-relaxed font-light whitespace-pre-line">
                  {meditationSelectionnee.contenu}
                </p>

                {/* Footer Action */}
                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setMeditationSelectionnee(null)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Fermer la lecture
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Meditations;
