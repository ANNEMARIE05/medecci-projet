import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import LayoutPublic from '../components/layout/LayoutPublic';
import LayoutAdmin from '../components/layout/LayoutAdmin';
import GardeRoute from './GardeRoute';

// Pages Portail Public
import Accueil from '../pages/portail/Accueil';
import APropos from '../pages/portail/APropos';
import Programmes from '../pages/portail/Programmes';
import Predications from '../pages/portail/Predications';
import Galerie from '../pages/portail/Galerie';
import Blog from '../pages/portail/Blog';
import Contact from '../pages/portail/Contact';
import Dons from '../pages/portail/Dons';
import Meditations from '../pages/portail/Meditations';
import Suggestions from '../pages/portail/Suggestions';

// Page Connexion
import Connexion from '../pages/Connexion';

// Pages Dashboard Admin
import TableauBord from '../pages/admin/TableauBord';
import Membres from '../pages/admin/Membres';
import Actualites from '../pages/admin/Actualites';
import Sermons from '../pages/admin/Sermons';
import Evenements from '../pages/admin/Evenements';
import DonsAdmin from '../pages/admin/DonsAdmin';
import Prieres from '../pages/admin/Prieres';
import Parametres from '../pages/admin/Parametres';
import MeditationsAdmin from '../pages/admin/MeditationsAdmin';
import SuggestionsAdmin from '../pages/admin/SuggestionsAdmin';

// Nouvelles pages administratives financières
import Caisses from '../pages/admin/Caisses';
import Archives from '../pages/admin/Archives';
import Historique from '../pages/admin/Historique';
import Parametrage from '../pages/admin/Parametrage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Routes Publiques */}
      <Route element={<LayoutPublic />}>
        <Route path="/" element={<Accueil />} />
        <Route path="/a-propos" element={<APropos />} />
        <Route path="/programmes" element={<Programmes />} />
        <Route path="/predications" element={<Predications />} />
        <Route path="/galerie" element={<Galerie />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dons" element={<Dons />} />
        <Route path="/meditations" element={<Meditations />} />
        <Route path="/suggestions" element={<Suggestions />} />
      </Route>

      {/* Authentification */}
      <Route path="/connexion" element={<Connexion />} />

      {/* Routes d'Administration Protégées */}
      <Route
        path="/admin"
        element={
          <GardeRoute>
            <LayoutAdmin />
          </GardeRoute>
        }
      >
        <Route index element={<TableauBord />} />
        <Route path="membres" element={<GardeRoute rolesAutorises={['ADMIN', 'TRESORIER']}><Membres /></GardeRoute>} />
        <Route path="actualites" element={<GardeRoute rolesAutorises={['ADMIN', 'PASTEUR']}><Actualites /></GardeRoute>} />
        <Route path="sermons" element={<GardeRoute rolesAutorises={['ADMIN', 'PASTEUR']}><Sermons /></GardeRoute>} />
        <Route path="evenements" element={<GardeRoute rolesAutorises={['ADMIN', 'PASTEUR']}><Evenements /></GardeRoute>} />
        <Route path="dons" element={<GardeRoute rolesAutorises={['ADMIN', 'TRESORIER']}><DonsAdmin /></GardeRoute>} />
        <Route path="prieres" element={<GardeRoute rolesAutorises={['ADMIN', 'PASTEUR']}><Prieres /></GardeRoute>} />
        <Route path="parametres" element={<GardeRoute rolesAutorises={['ADMIN', 'PASTEUR']}><Parametres /></GardeRoute>} />
        <Route path="meditations" element={<GardeRoute rolesAutorises={['ADMIN', 'PASTEUR']}><MeditationsAdmin /></GardeRoute>} />
        <Route path="suggestions" element={<GardeRoute rolesAutorises={['ADMIN', 'PASTEUR']}><SuggestionsAdmin /></GardeRoute>} />
        
        {/* Nouvelles routes de la gestion financière */}
        <Route path="caisses" element={<GardeRoute rolesAutorises={['ADMIN', 'TRESORIER']}><Caisses /></GardeRoute>} />
        <Route path="archives" element={<GardeRoute rolesAutorises={['ADMIN', 'TRESORIER']}><Archives /></GardeRoute>} />
        <Route path="historique" element={<GardeRoute rolesAutorises={['ADMIN', 'TRESORIER']}><Historique /></GardeRoute>} />
        <Route path="parametrage" element={<GardeRoute rolesAutorises={['ADMIN', 'TRESORIER']}><Parametrage /></GardeRoute>} />
      </Route>

      {/* Redirection par défaut */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
