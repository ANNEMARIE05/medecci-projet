import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Heart } from 'lucide-react';

const logo = '/logo.jpg';

export const HeaderPublic: React.FC = () => {
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [defile, setDefile] = useState(false);
  const [monté, setMonté] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setDefile(true);
      } else {
        setDefile(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMonté(true);
  }, []);

  const liens = [
    { chemin: '/', libelle: 'Accueil' },
    { chemin: '/a-propos', libelle: 'À Propos' },
    { chemin: '/programmes', libelle: 'Cultes & Programmes' },
    { chemin: '/predications', libelle: 'Prédications' },
    { chemin: '/meditations', libelle: 'Méditations' },
    { chemin: '/galerie', libelle: 'Galerie' },
    { chemin: '/blog', libelle: 'Actualités' },
    { chemin: '/contact', libelle: 'Contact' },
  ];

  const estActif = (chemin: string) => {
    if (chemin === '/' && pathname !== '/') return false;
    return pathname.startsWith(chemin);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        defile
          ? 'glass-effect shadow-premium py-2'
          : 'bg-transparent py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Nom */}
          <Link
            href="/"
            className={`flex items-center space-x-3 group transition-all duration-700 ease-out transform ${
              monté ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'
            }`}
          >
            <img
              src={logo}
              alt="MEDECCI Logo"
              className="h-10 w-10 rounded-xl object-contain bg-white p-0.5 border border-medecci-or/30 shadow-sm transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="font-poppins font-bold text-lg tracking-wider text-medecci-bleuRoyal">
                MEDECCI
              </span>
              <span className="text-[9px] uppercase tracking-widest text-medecci-or font-semibold -mt-1">
                Mission Évangélique
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-3">
            {liens.map((lien, index) => (
              <Link
                key={lien.chemin}
                href={lien.chemin}
                style={{ transitionDelay: monté ? `${index * 50}ms` : '0ms' }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-500 ease-out transform ${
                  monté ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                } ${
                  estActif(lien.chemin)
                    ? 'text-medecci-bleuRoyal bg-medecci-bleuClair/10'
                    : 'text-medecci-texte/80 hover:text-medecci-bleuRoyal hover:bg-black/5'
                }`}
              >
                {lien.libelle}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link
              href="/dons"
              style={{ transitionDelay: monté ? '400ms' : '0ms' }}
              className={`flex items-center space-x-2 bg-gradient-to-r from-medecci-bleuRoyal to-medecci-bleuClair text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-md hover:opacity-95 transition-all duration-300 hover:-translate-y-0.5 transform ${
                monté ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
              }`}
            >
              <Heart className="h-4 w-4 fill-white" />
              <span>Faire un Don</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <Link
              href="/dons"
              className="flex items-center justify-center bg-gradient-to-r from-medecci-bleuRoyal to-medecci-bleuClair text-white p-2.5 rounded-lg shadow-md"
            >
              <Heart className="h-4 w-4 fill-white" />
            </Link>
            <button
              onClick={() => setMenuOuvert(!menuOuvert)}
              className="p-2 rounded-lg text-medecci-texte hover:bg-black/5"
            >
              {menuOuvert ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {menuOuvert && (
        <div className="lg:hidden absolute top-full left-0 right-0 glass-effect border-t border-black/5 shadow-lg py-4 px-4 space-y-2 animate-fadeIn">
          {liens.map((lien) => (
            <Link
              key={lien.chemin}
              href={lien.chemin}
              onClick={() => setMenuOuvert(false)}
              className={`block px-4 py-2 rounded-lg text-base font-medium transition-all ${
                estActif(lien.chemin)
                  ? 'text-medecci-bleuRoyal bg-medecci-bleuClair/10 font-semibold'
                  : 'text-medecci-texte/80 hover:text-medecci-bleuRoyal hover:bg-black/5'
              }`}
            >
              {lien.libelle}
            </Link>
          ))}
          <div className="pt-4 border-t border-black/5 flex flex-col space-y-2">
            <Link
              href="/dons"
              onClick={() => setMenuOuvert(false)}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-medecci-bleuRoyal to-medecci-bleuClair text-white py-3 rounded-lg text-sm font-semibold shadow-md"
            >
              <Heart className="h-4 w-4 fill-white" />
              <span>Faire un Don</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default HeaderPublic;
