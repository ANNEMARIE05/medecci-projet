import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ChevronLeft, ChevronRight, Image } from 'lucide-react';
import { PHOTOS } from '../../constants/photos';

interface Photo {
  id: string;
  url: string;
  titre: string;
  categorie: 'cultes' | 'conventions' | 'missions' | 'speciaux';
}

export const Galerie: React.FC = () => {
  const [categorieActive, setCategorieActive] = useState<'toutes' | Photo['categorie']>('toutes');
  const [photoAgrandie, setPhotoAgrandie] = useState<number | null>(null);

  // Formatter la liste complète des 159 photos réelles copiées
  const categories: Photo['categorie'][] = ['cultes', 'conventions', 'missions', 'speciaux'];
  const titres = [
    "Louange et Adoration lors du culte dominical",
    "Moments de prière fervente et intercession",
    "Convention Nationale de la MEDECCI",
    "Chorale Écho du Ciel conduisant l'adoration",
    "Actions sociales et aides aux démunis",
    "Séminaire et retraite spirituelle",
    "Communion fraternelle de l'assemblée",
    "Baptêmes et engagements de foi"
  ];

  const photos: Photo[] = PHOTOS.map((url, index) => ({
    id: `photo-loc-${index}`,
    url: url,
    titre: `${titres[index % titres.length]} (Photo ${index + 1})`,
    categorie: categories[index % categories.length]
  }));

  const photosFiltrées = photos.filter((p) => {
    if (categorieActive === 'toutes') return true;
    return p.categorie === categorieActive;
  });

  const allerAPrecedente = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (photoAgrandie !== null) {
      setPhotoAgrandie((prev) => (prev !== null && prev > 0 ? prev - 1 : photosFiltrées.length - 1));
    }
  };

  const allerASuivante = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (photoAgrandie !== null) {
      setPhotoAgrandie((prev) => (prev !== null && prev < photosFiltrées.length - 1 ? prev + 1 : 0));
    }
  };

  return (
    <div className="bg-[#F8FAFC] pb-20 space-y-16 font-outfit">
      
      {/* HEADER SECTION */}
      <section className="relative bg-slate-950 text-white py-14 sm:py-24 text-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url('${photos.length > 0 ? photos[0].url : 'https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&q=80&w=1200'}')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/90" />
        <div className="relative max-w-4xl mx-auto px-4 space-y-4 z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-medecci-or bg-white/10 px-4 py-2 rounded-full border border-white/10">
            MÉMOIRE VISUELLE
          </span>
          <h1 className="font-cormorant italic font-bold text-3xl sm:text-6xl lg:text-7xl leading-tight">Galerie Photos</h1>
          <p className="text-slate-350 text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed">
            Revivez en images les cultes dominicaux, les conventions nationales, les œuvres sociales et les grands moments de la MEDECCI.
          </p>
        </div>
      </section>

      {/* FILTER BUTTONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-2 p-2 bg-[#F1F5F9] rounded-2xl max-w-3xl mx-auto border border-[#E2E8F0]">
          {(
            [
              { id: 'toutes', libelle: 'Toutes les photos' },
              { id: 'cultes', libelle: 'Cultes dominicaux' },
              { id: 'conventions', libelle: 'Conventions' },
              { id: 'missions', libelle: 'Missions sociales' },
              { id: 'speciaux', libelle: 'Événements Spéciaux' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setCategorieActive(tab.id);
                setPhotoAgrandie(null);
              }}
              className={`px-5 py-3 rounded-xl text-xs font-bold transition-all duration-300 ${
                categorieActive === tab.id
                  ? 'bg-[#0B3C91] text-white shadow-md'
                  : 'text-slate-655 hover:text-slate-850 hover:bg-white/50'
              }`}
            >
              {tab.libelle}
            </button>
          ))}
        </div>
      </section>

      {/* PHOTO GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {photosFiltrées.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#E2E8F0] p-6 space-y-3">
            <Image className="h-10 w-10 text-slate-400 mx-auto" />
            <p className="text-slate-500 font-light">Aucune photo disponible dans cette catégorie.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {photosFiltrées.map((photo, index) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: (index % 12) * 0.04 }}
                onClick={() => setPhotoAgrandie(index)}
                className="group relative h-64 bg-slate-100 rounded-3xl overflow-hidden cursor-pointer border border-[#E2E8F0] shadow-sm transition-all duration-350 hover:-translate-y-1 hover:shadow-md"
              >
                <img
                  src={photo.url}
                  alt={photo.titre}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  loading="lazy"
                />
                {/* Hover overlay with details */}
                <div className="absolute inset-0 bg-[#0B3C91]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <ZoomIn className="h-6 w-6 text-white absolute top-4 right-4" />
                  <div className="space-y-1">
                    <span className="text-[9px] text-medecci-or font-bold uppercase tracking-widest block">
                      {photo.categorie}
                    </span>
                    <p className="text-white text-xs font-semibold leading-relaxed line-clamp-2">
                      {photo.titre}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* LIGHTBOX SLIDESHOW VIEW */}
      <AnimatePresence>
        {photoAgrandie !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPhotoAgrandie(null)}
            className="fixed inset-0 bg-slate-950/95 z-[100] flex items-center justify-center p-4 sm:p-10"
          >
            {/* Close button */}
            <button
              onClick={() => setPhotoAgrandie(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50 focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Left Nav Button */}
            <button
              onClick={allerAPrecedente}
              className="absolute left-4 p-3.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50 focus:outline-none"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Middle Container */}
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl max-h-[85vh] flex flex-col items-center justify-center space-y-4"
            >
              <img
                src={photosFiltrées[photoAgrandie].url}
                alt={photosFiltrées[photoAgrandie].titre}
                className="max-w-full max-h-[70vh] object-contain rounded-2xl border border-white/10 shadow-2xl"
              />
              <div className="text-center text-white px-4">
                <span className="text-[10px] text-medecci-or font-bold uppercase tracking-widest block mb-1">
                  {photosFiltrées[photoAgrandie].categorie}
                </span>
                <p className="text-sm font-semibold">{photosFiltrées[photoAgrandie].titre}</p>
              </div>
            </motion.div>

            {/* Right Nav Button */}
            <button
              onClick={allerASuivante}
              className="absolute right-4 p-3.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50 focus:outline-none"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Galerie;
