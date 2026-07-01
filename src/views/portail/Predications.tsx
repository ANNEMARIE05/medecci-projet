import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Play, Volume2, User, Calendar, BookOpen, ExternalLink } from 'lucide-react';
import { useDonneesStore } from '../../stores/useDonneesStore';
import { formaterDate } from '../../utils/formateur';

export const Predications: React.FC = () => {
  const [recherche, setRecherche] = useState('');
  const [predicateurFiltre, setPredicateurFiltre] = useState('tous');
  const sermons = useDonneesStore((state) => state.sermons);

  // Extraire les prédicateurs uniques pour le filtre
  const predicateurs = ['tous', ...Array.from(new Set(sermons.map((s) => s.predicateur)))];

  const sermonsFiltrés = sermons.filter((sermon) => {
    const correspondRecherche =
      sermon.titre.toLowerCase().includes(recherche.toLowerCase()) ||
      sermon.description.toLowerCase().includes(recherche.toLowerCase()) ||
      sermon.versetRef.toLowerCase().includes(recherche.toLowerCase());

    const correspondPredicateur =
      predicateurFiltre === 'tous' || sermon.predicateur === predicateurFiltre;

    return correspondRecherche && correspondPredicateur;
  });

  return (
    <div className="pb-20 space-y-16">
      {/* HEADER SECTION */}
      <section className="relative bg-slate-950 text-white py-20 text-center">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1200')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/90" />
        <div className="relative max-w-4xl mx-auto px-4 space-y-4">
          <h1 className="font-poppins font-black text-4xl sm:text-5xl">Prédications & Sermons</h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto font-light">
            Écoutez les messages inspirés de la Parole de Dieu, visionnez les cultes passés et approfondissez vos connaissances spirituelles.
          </p>
        </div>
      </section>

      {/* RECHERCHE ET FILTRES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
          {/* Input Recherche */}
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par titre, verset ou thème..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-medecci-bleuClair text-sm"
            />
          </div>

          {/* Sélecteur Prédicateur */}
          <div className="w-full md:w-64">
            <select
              value={predicateurFiltre}
              onChange={(e) => setPredicateurFiltre(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-medecci-bleuClair text-sm text-slate-700"
            >
              {predicateurs.map((pred) => (
                <option key={pred} value={pred}>
                  {pred === 'tous' ? 'Tous les prédicateurs' : pred}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* LISTE DES SERMONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {sermonsFiltrés.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
            <p className="text-slate-500">Aucune prédication ne correspond à vos critères de recherche.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {sermonsFiltrés.map((sermon) => (
              <motion.div
                key={sermon.id}
                layout
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div className="p-6 sm:p-8 space-y-6">
                  {/* Entête Sermon info */}
                  <div className="flex flex-wrap items-center gap-3 text-[10px] sm:text-xs text-slate-400 font-semibold uppercase">
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-3.5 w-3.5 text-medecci-or" />
                      <span>{formaterDate(sermon.date)}</span>
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                    <span className="flex items-center space-x-1">
                      <User className="h-3.5 w-3.5 text-medecci-or" />
                      <span>{sermon.predicateur}</span>
                    </span>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-poppins text-lg sm:text-xl font-bold text-slate-800 leading-tight">
                      {sermon.titre}
                    </h3>
                    <div className="flex items-center space-x-2 text-xs sm:text-sm text-medecci-bleuRoyal font-semibold font-mono bg-medecci-bleuRoyal/5 px-3 py-1.5 rounded-xl w-fit">
                      <BookOpen className="h-4 w-4 shrink-0" />
                      <span>Passage : {sermon.versetRef}</span>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      {sermon.description}
                    </p>
                  </div>

                  {/* Audio Player */}
                  {sermon.lienAudio && (
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col space-y-2">
                      <div className="flex items-center space-x-2 text-xs text-slate-500 font-semibold">
                        <Volume2 className="h-4 w-4 text-medecci-bleuRoyal" />
                        <span>Écouter le podcast audio</span>
                      </div>
                      <audio controls src={sermon.lienAudio} className="w-full h-8" />
                    </div>
                  )}
                </div>

                {/* Lien Vidéo / CTA */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href={sermon.lienYoutube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-xs font-bold text-red-600 hover:text-red-700 transition-colors"
                  >
                    <Play className="h-4 w-4 fill-red-600" />
                    <span>Regarder sur YouTube</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <span className="text-[10px] text-slate-400 font-semibold">MEDECCI Media</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Predications;
