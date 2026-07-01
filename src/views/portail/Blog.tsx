import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, Search, BookOpen, X, ArrowLeft } from 'lucide-react';
import { useDonneesStore } from '../../stores/useDonneesStore';
import type { Actualite } from '../../stores/useDonneesStore';
import { formaterDate } from '../../utils/formateur';
import { PHOTOS } from '../../constants/photos';

export const Blog: React.FC = () => {
  const [recherche, setRecherche] = useState('');
  const [articleSelectionne, setArticleSelectionne] = useState<Actualite | null>(null);
  const actualites = useDonneesStore((state) => state.actualites);

  const getPhoto = (index: number, fallback: string) => {
    return PHOTOS && PHOTOS.length > index ? PHOTOS[index] : fallback;
  };

  const actualitesFiltrées = actualites.filter((actu) =>
    actu.titre.toLowerCase().includes(recherche.toLowerCase()) ||
    actu.description.toLowerCase().includes(recherche.toLowerCase()) ||
    actu.contenu.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <div className="bg-[#F8FAFC] pb-20 space-y-16 font-outfit">
      
      {/* HEADER SECTION */}
      <section className="relative bg-slate-950 text-white py-14 sm:py-24 text-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url('${getPhoto(18, 'https://images.unsplash.com/photo-1548625361-155deee223cb?auto=format&fit=crop&q=80&w=1200')}')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/90" />
        <div className="relative max-w-4xl mx-auto px-4 space-y-4 z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-medecci-or bg-white/10 px-4 py-2 rounded-full border border-white/10">
            COMMUNAUTÉ & ENSEIGNEMENT
          </span>
          <h1 className="font-cormorant italic font-bold text-3xl sm:text-6xl lg:text-7xl leading-tight">Actualités & Annonces</h1>
          <p className="text-slate-350 text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed">
            Tenez-vous au courant des événements, séminaires, cultes spéciaux et lisez les notes d'exhortations pastorales.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* LISTE D'ARTICLES */}
          <div className="lg:col-span-2 space-y-6">
            {/* Input Recherche mobile */}
            <div className="relative w-full mb-6 lg:hidden">
              <Search className="absolute left-4 top-3 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher une annonce..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-[#E2E8F0] focus:outline-none focus:border-[#1E88E5] text-xs font-bold shadow-sm"
              />
            </div>

            {actualitesFiltrées.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-[#E2E8F0] p-6">
                <p className="text-slate-500 font-light">Aucune actualité ne correspond à votre recherche.</p>
              </div>
            ) : (
              actualitesFiltrées.map((actu, index) => (
                <motion.article
                  key={actu.id}
                  layoutId={`actu-card-${actu.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
                  className="bg-white rounded-3xl overflow-hidden border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row h-full sm:h-64 cursor-pointer group"
                  onClick={() => setArticleSelectionne(actu)}
                >
                  <div className="h-52 sm:h-full sm:w-1/3 overflow-hidden shrink-0">
                    <img
                      src={actu.image || getPhoto(20 + index * 4, '')}
                      alt={actu.titre}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-750"
                    />
                  </div>
                  <div className="p-6 sm:p-8 flex flex-col justify-between flex-1 min-w-0">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                        <Calendar className="h-4 w-4 text-medecci-or shrink-0" />
                        <span>Le {formaterDate(actu.datePublication)}</span>
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-200 shrink-0" />
                        <User className="h-4 w-4 text-medecci-or shrink-0" />
                        <span className="truncate">{actu.auteur}</span>
                      </div>
                      <h3 className="font-poppins text-base sm:text-xl font-bold text-slate-850 group-hover:text-[#1E88E5] transition-colors line-clamp-2 leading-snug">
                        {actu.titre}
                      </h3>
                      <p className="text-slate-500 text-xs sm:text-sm leading-relaxed line-clamp-3 font-light">
                        {actu.description}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#0B3C91] hover:text-[#1E88E5] inline-flex items-center space-x-1.5 pt-3 border-t border-slate-50 mt-2">
                      <span>Lire l'article complet &rarr;</span>
                    </span>
                  </div>
                </motion.article>
              ))
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-6">
            {/* Boîte de recherche desktop */}
            <div className="hidden lg:block bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-4">
              <h3 className="font-poppins font-black text-[#0B3C91] text-sm">Filtrer & Rechercher</h3>
              <div className="relative">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher un article..."
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] focus:outline-none focus:border-[#1E88E5] text-xs font-bold"
                />
              </div>
            </div>

            {/* Verset d'encouragement */}
            <div className="bg-gradient-to-br from-slate-950 to-[#0B3C91] p-6 sm:p-8 rounded-3xl text-white border border-white/5 shadow-lg space-y-4 relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-medecci-or pointer-events-none">
                <BookOpen className="h-32 w-32" />
              </div>
              <h3 className="font-poppins text-[10px] font-bold uppercase tracking-widest text-medecci-or">
                Parole de Vérité
              </h3>
              <p className="font-cormorant italic text-base leading-relaxed text-slate-300">
                "Que ce livre de la loi ne s'éloigne point de ta bouche; médite-le jour et nuit, pour agir fidèlement selon tout ce qui y est écrit; car c'est alors que tu auras du succès dans tes entreprises, c'est alors que tu réussiras."
              </p>
              <span className="block font-poppins text-[9px] font-bold text-slate-400 tracking-wider">
                — JOSUÉ 1:8
              </span>
            </div>
          </aside>
        </div>
      </section>

      {/* POPUP MODAL */}
      <AnimatePresence>
        {articleSelectionne && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
            onClick={() => setArticleSelectionne(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#E2E8F0] max-w-3xl w-full max-h-[90vh] flex flex-col font-outfit"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image d'entête */}
              <div className="relative h-64 w-full shrink-0">
                <img
                  src={articleSelectionne.image || getPhoto(21, '')}
                  alt={articleSelectionne.titre}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setArticleSelectionne(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/85 transition-colors focus:outline-none"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Contenu Déroulable */}
              <div className="p-6 sm:p-8 overflow-y-auto no-scrollbar space-y-6">
                <div className="flex items-center space-x-2 text-xs text-slate-400 font-bold uppercase tracking-wider">
                  <Calendar className="h-4 w-4 text-medecci-or" />
                  <span>Publié le {formaterDate(articleSelectionne.datePublication)}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                  <User className="h-4 w-4 text-medecci-or" />
                  <span>Par {articleSelectionne.auteur}</span>
                </div>

                <div className="space-y-4">
                  <h2 className="font-poppins text-xl sm:text-3xl font-black text-[#0B3C91] leading-tight">
                    {articleSelectionne.titre}
                  </h2>
                  <p className="text-[#0B3C91] font-medium text-sm leading-relaxed border-l-4 border-medecci-or pl-4 italic">
                    {articleSelectionne.description}
                  </p>
                  <hr className="border-slate-100" />
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line font-light">
                    {articleSelectionne.contenu}
                  </p>
                </div>
              </div>

              {/* Pied */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0 text-xs font-bold text-slate-450 uppercase tracking-widest">
                <button
                  onClick={() => setArticleSelectionne(null)}
                  className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 focus:outline-none"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Retour à la liste</span>
                </button>
                <span>MEDECCI</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Blog;
