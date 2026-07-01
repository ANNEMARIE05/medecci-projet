import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Heart } from 'lucide-react';
import { gsap } from 'gsap';

const logo = '/logo.jpg';

export const HeaderPublic: React.FC = () => {
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [defile, setDefile] = useState(false);
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
    // GSAP load stagger transitions
    gsap.fromTo(
      '.header-logo',
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }
    );
    gsap.fromTo(
      '.header-nav-item',
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.08, delay: 0.15 }
    );
    gsap.fromTo(
      '.header-cta',
      { opacity: 0, y: -15 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.65 }
    );
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
          <Link href="/" className="flex items-center space-x-3 group header-logo opacity-0">
            <img
              src={logo}
              alt="MEDECCI Logo"
              className="h-10 w-10 rounded-full object-cover border border-medecci-or/30 shadow-sm transition-transform duration-300 group-hover:scale-105"
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
            {liens.map((lien) => (
              <Link
                key={lien.chemin}
                href={lien.chemin}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 header-nav-item opacity-0 ${
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
              className="flex items-center space-x-2 bg-gradient-to-r from-medecci-bleuRoyal to-medecci-bleuClair text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-md hover:opacity-95 transition-all duration-300 hover:-translate-y-0.5 header-cta opacity-0"
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
