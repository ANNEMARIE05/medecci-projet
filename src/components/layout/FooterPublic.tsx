import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Heart, ArrowUp } from 'lucide-react';
import { INFOS_CONTACT } from '../../constants';

export const FooterPublic: React.FC = () => {
  const remonterEnHaut = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const annee = new Date().getFullYear();

  return (
    <footer className="bg-medecci-bleuRoyal text-white relative pt-16 pb-8 overflow-hidden">
      {/* Accent de couleur dorée au-dessus */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-medecci-bleuRoyal via-medecci-or to-medecci-bleuClair" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo et Slogan */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center border-2 border-medecci-or shadow-md overflow-hidden">
                <span className="text-medecci-bleuRoyal font-black font-poppins text-xs tracking-wider">MED</span>
              </div>
              <div className="flex flex-col">
                <span className="font-poppins font-bold text-lg tracking-wider text-white">MEDECCI</span>
                <span className="text-[9px] uppercase tracking-widest text-medecci-or font-semibold -mt-1">
                  Mission Évangélique
                </span>
              </div>
            </Link>
            <p className="text-slate-350 text-sm leading-relaxed">
              Une église vivante pour proclamer l'évangile pur du salut par la foi en Jésus-Christ et manifester l'amour divin en Côte d'Ivoire et au-delà.
            </p>
            <div className="flex space-x-3 pt-2">
              <a
                href={INFOS_CONTACT.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-white/10 hover:bg-medecci-or text-white transition-all duration-300"
              >
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                </svg>
              </a>
              <a
                href={INFOS_CONTACT.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-white/10 hover:bg-red-600 text-white transition-all duration-300"
              >
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.53 3.5 12 3.5 12 3.5s-7.53 0-9.388.555A3.003 3.003 0 0 0 .502 6.163C0 8.07 0 12 0 12s0 3.93.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.47 20.5 12 20.5 12 20.5s7.53 0 9.388-.555a3.003 3.003 0 0 0 2.11-2.108C24 15.93 24 12 24 12s0-3.93-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Liens Rapides */}
          <div>
            <h3 className="text-white font-poppins font-semibold text-base mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-medecci-or">
              Liens Rapides
            </h3>
            <ul className="space-y-3 text-slate-350 text-sm">
              <li>
                <Link href="/a-propos" className="hover:text-medecci-or transition-colors">Qui sommes-nous ?</Link>
              </li>
              <li>
                <Link href="/programmes" className="hover:text-medecci-or transition-colors">Nos Programmes & Cultes</Link>
              </li>
              <li>
                <Link href="/predications" className="hover:text-medecci-or transition-colors">Prédications & Sermons</Link>
              </li>
              <li>
                <Link href="/galerie" className="hover:text-medecci-or transition-colors">Galerie Photos</Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-medecci-or transition-colors">Actualités & Annonces</Link>
              </li>
              <li>
                <Link href="/meditations" className="hover:text-medecci-or transition-colors">Méditations Quotidiennes</Link>
              </li>
              <li>
                <Link href="/suggestions" className="hover:text-medecci-or transition-colors">Boîte à Suggestions</Link>
              </li>
            </ul>
          </div>

          {/* Contact Direct */}
          <div>
            <h3 className="text-white font-poppins font-semibold text-base mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-medecci-or">
              Nous Contacter
            </h3>
            <ul className="space-y-4 text-slate-350 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-medecci-or shrink-0 mt-0.5" />
                <span>{INFOS_CONTACT.siege}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-medecci-or shrink-0" />
                <span className="text-xs">{INFOS_CONTACT.telephone}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-medecci-or shrink-0" />
                <span>{INFOS_CONTACT.email}</span>
              </li>
            </ul>
          </div>

          {/* Soutien financier */}
          <div>
            <h3 className="text-white font-poppins font-semibold text-base mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-10 after:h-0.5 after:bg-medecci-or">
              Soutenir l'Œuvre
            </h3>
            <p className="text-slate-350 text-sm leading-relaxed mb-4">
              Vos dîmes, offrandes et dons soutiennent les missions d'évangélisation et l'entretien de la maison de Dieu.
            </p>
            <Link
              href="/dons"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-medecci-bleuRoyal to-medecci-bleuClair text-white px-5 py-3 rounded-xl text-sm font-semibold shadow-md hover:opacity-95 transition-opacity duration-200 w-full justify-center"
            >
              <Heart className="h-4 w-4 fill-white" />
              <span>Faire une Offrande</span>
            </Link>
          </div>
        </div>

        {/* Ligne de séparation */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-slate-400 text-xs">
          <p>
            &copy; {annee} MEDECCI. Tous droits réservés. Conçu pour la gloire de Dieu.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <Link href="/connexion" className="hover:text-medecci-or transition-colors">Connexion Admin</Link>
            <button
              onClick={remonterEnHaut}
              className="p-2 rounded-lg bg-white/10 hover:bg-medecci-or hover:text-white transition-colors"
              title="Retourner en haut"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterPublic;
