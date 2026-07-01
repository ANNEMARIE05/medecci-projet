import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Newspaper,
  Mic,
  Calendar,
  HeartHandshake,
  Settings,
  LogOut,
  Bell,
  Menu,
  ChevronLeft,
  ChevronRight,
  Folder,
  Trash2,
  History,
  Sliders,
  Heart,
  BookOpen,
  Inbox
} from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useDonneesStore } from '../../stores/useDonneesStore';

const logo = '/logo.jpg';

export const LayoutAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarReplie, setSidebarReplie] = useState(false);
  const [menuMobileOuvert, setMenuMobileOuvert] = useState(false);
  const [notifsOuvertes, setNotifsOuvertes] = useState(false);

  const { utilisateur, deconnexion } = useAuthStore();
  const { notifications, marquerNotificationLue, effacerNotifications } = useDonneesStore();
  const pathname = usePathname();
  const router = useRouter();

  const handleDeconnexion = () => {
    deconnexion();
    router.push('/');
  };

  // Liste complète des liens (avec "Dons & Offrandes" retiré car il revient aux Caisses)
  const tousLesLiens = [
    { chemin: '/admin', libelle: 'Tableau de bord', icone: LayoutDashboard, exact: true, roles: ['ADMIN', 'PASTEUR', 'TRESORIER'] },
    { chemin: '/admin/caisses', libelle: 'Caisses (Fonds)', icone: Folder, roles: ['ADMIN', 'TRESORIER'] },
    { chemin: '/admin/membres', libelle: 'Fidèles Cotisants', icone: Users, roles: ['ADMIN', 'TRESORIER'] },
    { chemin: '/admin/archives', libelle: 'Archives Caisses', icone: Trash2, roles: ['ADMIN', 'TRESORIER'] },
    { chemin: '/admin/historique', libelle: 'Historique Global', icone: History, roles: ['ADMIN', 'TRESORIER'] },
    { chemin: '/admin/parametrage', libelle: 'Paramétrage Catégories', icone: Sliders, roles: ['ADMIN', 'TRESORIER'] },
    { chemin: '/admin/dons', libelle: 'Dons en Ligne', icone: Heart, roles: ['ADMIN', 'TRESORIER'] },
    { chemin: '/admin/meditations', libelle: 'Méditations', icone: BookOpen, roles: ['ADMIN', 'PASTEUR'] },
    { chemin: '/admin/suggestions', libelle: 'Suggestions', icone: Inbox, roles: ['ADMIN', 'PASTEUR'] },
    { chemin: '/admin/actualites', libelle: 'Actualités', icone: Newspaper, roles: ['ADMIN', 'PASTEUR'] },
    { chemin: '/admin/sermons', libelle: 'Sermons', icone: Mic, roles: ['ADMIN', 'PASTEUR'] },
    { chemin: '/admin/evenements', libelle: 'Événements', icone: Calendar, roles: ['ADMIN', 'PASTEUR'] },
    { chemin: '/admin/prieres', libelle: 'Demandes de Prière', icone: HeartHandshake, roles: ['ADMIN', 'PASTEUR'] },
    { chemin: '/admin/parametres', libelle: 'Paramètres Généraux', icone: Settings, roles: ['ADMIN', 'PASTEUR'] },
  ];

  const roleUtilisateur = utilisateur?.role || 'PASTEUR';
  const liensNavigation = tousLesLiens.filter(lien => lien.roles.includes(roleUtilisateur));

  const estActif = (chemin: string, exact = false) => {
    if (exact) {
      return pathname === chemin;
    }
    return pathname.startsWith(chemin) && (chemin !== '/admin' || pathname === '/admin');
  };

  const notifsNonLues = notifications.filter(n => !n.lu).length;

  return (
    <div className={`app-layout ${sidebarReplie ? 'sidebar-collapsed' : ''} ${menuMobileOuvert ? 'mobile-menu-open' : ''}`}>
      
      {/* SIDEBAR DESKTOP - Conforme à l'ancien projet */}
      <aside className={`sidebar ${sidebarReplie ? 'sidebar-collapsed' : ''}`}>
        
        {/* Brand */}
        <div className="brand">
          <div className="brand-left">
            <div className="logo-wrapper">
              <img src={logo} alt="MEDEC-CI Logo" className="logo-img" />
            </div>
            {!sidebarReplie && (
              <div className="brand-text">
                <span className="brand-name">MEDEC-CI</span>
                <span className="brand-sub">{roleUtilisateur === 'TRESORIER' ? 'Finances' : 'Administration'}</span>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarReplie(!sidebarReplie)}
            className="sidebar-toggle-btn"
            title={sidebarReplie ? "Déplier" : "Plier"}
          >
            {sidebarReplie ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation avec barre de défilement stylisée et espacement conforme */}
        <nav className="nav">
          <p className="nav-label">Menu principal</p>
          <ul className="menu-list">
            {liensNavigation.map((lien) => {
              const Icone = lien.icone;
              const actif = estActif(lien.chemin, lien.exact);
              return (
                <li key={lien.chemin} className="menu-item">
                  <Link
                    href={lien.chemin}
                    className={`menu-button ${actif ? 'active' : ''}`}
                    title={lien.libelle}
                  >
                    <span className="active-bar"></span>
                    <div className="icon-box">
                      <Icone className="h-4.5 w-4.5 shrink-0" />
                    </div>
                    {!sidebarReplie && <span className="menu-text">{lien.libelle}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Pied de la Sidebar / Profil conforme */}
        <div className="bottom-section">
          {sidebarReplie ? (
            <button
              onClick={handleDeconnexion}
              className="logout-btn"
              title="Se déconnecter"
              style={{ margin: '0 auto' }}
            >
              <LogOut className="h-4 w-4" />
            </button>
          ) : (
            <div className="profile-card">
              <div className="avatar-wrap">
                <div className="avatar" style={{ background: 'var(--color-primary-light)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 'bold' }}>
                  {utilisateur?.prenom.charAt(0)}{utilisateur?.nom.charAt(0)}
                </div>
                <span className="online-dot"></span>
              </div>
              <div className="profile-info">
                <span className="profile-name">
                  {utilisateur?.prenom} {utilisateur?.nom}
                </span>
                <span className="profile-role">
                  {roleUtilisateur === 'TRESORIER' ? 'Trésorier' : roleUtilisateur === 'PASTEUR' ? 'Pasteur' : 'Admin'}
                </span>
              </div>
              <button
                onClick={handleDeconnexion}
                className="logout-btn"
                title="Se déconnecter"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Backdrop mobile */}
      {menuMobileOuvert && (
        <div
          className="fixed inset-0 bg-black/45 z-45 md:hidden backdrop-blur-[2px]"
          onClick={() => setMenuMobileOuvert(false)}
        />
      )}

      {/* SIDEBAR MOBILE */}
      <aside className={`sidebar md:hidden ${menuMobileOuvert ? 'mobile-open' : ''}`} style={{ position: 'fixed', zIndex: 100, transform: menuMobileOuvert ? 'translateX(0)' : 'translateX(-100%)' }}>
        <div className="brand">
          <div className="brand-left">
            <div className="logo-wrapper">
              <img src={logo} alt="MEDEC-CI Logo" className="logo-img" />
            </div>
            <div className="brand-text">
              <span className="brand-name">MEDEC-CI</span>
              <span className="brand-sub">{roleUtilisateur === 'TRESORIER' ? 'Finances' : 'Administration'}</span>
            </div>
          </div>
          <button
            onClick={() => setMenuMobileOuvert(false)}
            className="sidebar-toggle-btn"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>

        <nav className="nav">
          <p className="nav-label">Menu principal</p>
          <ul className="menu-list">
            {liensNavigation.map((lien) => {
              const Icone = lien.icone;
              const actif = estActif(lien.chemin, lien.exact);
              return (
                <li key={lien.chemin} className="menu-item">
                  <Link
                    href={lien.chemin}
                    onClick={() => setMenuMobileOuvert(false)}
                    className={`menu-button ${actif ? 'active' : ''}`}
                    title={lien.libelle}
                  >
                    <span className="active-bar"></span>
                    <div className="icon-box">
                      <Icone className="h-4.5 w-4.5 shrink-0" />
                    </div>
                    <span className="menu-text">{lien.libelle}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="bottom-section">
          <div className="profile-card">
            <div className="avatar-wrap">
              <div className="avatar" style={{ background: 'var(--color-primary-light)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 'bold' }}>
                {utilisateur?.prenom.charAt(0)}{utilisateur?.nom.charAt(0)}
              </div>
              <span className="online-dot"></span>
            </div>
            <div className="profile-info">
              <span className="profile-name">
                {utilisateur?.prenom} {utilisateur?.nom}
              </span>
              <span className="profile-role">
                {utilisateur?.role}
              </span>
            </div>
            <button
              onClick={handleDeconnexion}
              className="logout-btn"
              title="Se déconnecter"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* CONTAINER PRINCIPAL */}
      <div className="main-container">
        
        {/* TOPBAR ADMIN */}
        <header className="topbar">
          {/* Mobile Topbar header content */}
          <div className="mobile-topbar-content">
            <div className="brand-left" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="logo-wrapper" style={{ width: '30px', height: '30px' }}>
                <img src={logo} alt="MEDEC-CI Logo" className="logo-img" />
              </div>
              <div className="brand-text">
                <span className="brand-name" style={{ fontSize: '14px', fontWeight: 800, color: 'white' }}>MEDEC-CI</span>
                <span className="brand-sub" style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>{roleUtilisateur === 'TRESORIER' ? 'Finances' : 'Admin'}</span>
              </div>
            </div>
            <button
              onClick={() => setMenuMobileOuvert(!menuMobileOuvert)}
              className="sidebar-toggle-btn"
              style={{ width: '32px', height: '32px' }}
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>

          {/* Desktop Topbar header content */}
          <div className="desktop-topbar-content">
            <div className="title-area">
              <h1 className="title">
                {liensNavigation.find((l) => estActif(l.chemin, l.exact))?.libelle || 'Administration'}
              </h1>
              <div className="date-badge">
                <Calendar className="h-3.5 w-3.5 date-icon" />
                <span>{new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>

            {/* Outils Header : Notification + Cloche */}
            <div className="controls">
              <div className="relative">
                <button
                  onClick={() => setNotifsOuvertes(!notifsOuvertes)}
                  className="icon-btn"
                >
                  <Bell className="h-4.5 w-4.5" />
                  {notifsNonLues > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-4 min-w-[16px] px-1 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                      {notifsNonLues}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notifsOuvertes && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setNotifsOuvertes(false)} />
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-150 z-50 py-2 animate-scaleIn">
                      <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                        <span className="font-semibold text-slate-800 text-sm font-inter">Notifications ({notifications.length})</span>
                        {notifications.length > 0 && (
                          <button
                            onClick={effacerNotifications}
                            className="text-[11px] text-red-500 hover:text-red-600 font-semibold font-inter"
                          >
                            Tout effacer
                          </button>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto no-scrollbar py-1">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-8 text-center text-slate-400 text-xs font-inter">
                            Aucune notification récente
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => {
                                marquerNotificationLue(notif.id);
                                setNotifsOuvertes(false);
                              }}
                              className={`px-4 py-3 border-b border-slate-50 text-xs hover:bg-slate-50 cursor-pointer transition-colors flex flex-col space-y-1 ${
                                !notif.lu ? 'bg-blue-50/50 font-medium border-l-2 border-[#1B4F8A]' : ''
                              }`}
                            >
                              <p className="text-slate-700 font-inter">{notif.message}</p>
                              <span className="text-[10px] text-slate-400 font-inter">
                                {new Date(notif.date).toLocaleString('fr-FR')}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="h-8 w-8 rounded-full bg-[#1B4F8A] text-white flex items-center justify-center font-bold text-xs uppercase font-poppins shadow-sm">
                {utilisateur?.prenom.charAt(0)}{utilisateur?.nom.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* VIEWPORT CONTENU */}
        <main className="content">
          <div className="view-wrapper">
            <React.Suspense
              fallback={
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B4F8A]" />
                </div>
              }
            >
              {children}
            </React.Suspense>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LayoutAdmin;
