import React, { useState, useEffect } from 'react';
import { useHabilitationsStore, UtilisateurDashboard } from '../../stores/useHabilitationsStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { UserPlus, Edit2, Trash2, Check, X, Shield, Lock, Mail, User, ToggleLeft, ToggleRight, Calendar, Search } from 'lucide-react';
import { formaterDate } from '../../utils/formateur';
import { motion, AnimatePresence } from 'framer-motion';
import PaginationFooter from '../../components/UI/PaginationFooter';

export const UtilisateursDashboard: React.FC = () => {
  const store = useHabilitationsStore();
  const { utilisateursDashboard, profils } = store;
  const { utilisateur: currentUser } = useAuthStore();

  // États pour la liste, recherche, pagination et loader
  const [enChargement, setEnChargement] = useState(false);
  const [recherche, setRecherche] = useState('');
  const [page, setPage] = useState(1);
  const [taillePage, setTaillePage] = useState(8);

  // Simulation loader
  useEffect(() => {
    setEnChargement(true);
    const timer = setTimeout(() => setEnChargement(false), 500);
    return () => clearTimeout(timer);
  }, [recherche]);

  // États locaux formulaires / modales
  const [formModaleOuverte, setFormModaleOuverte] = useState(false);
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    profilId: '',
    actif: true,
  });
  const [utilisateurEnModification, setUtilisateurEnModification] = useState<UtilisateurDashboard | null>(null);

  // Alertes
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState('');

  const flash = (ok: boolean, msg: string) => {
    ok ? setSucces(msg) : setErreur(msg);
    ok ? setErreur('') : setSucces('');
    setTimeout(() => {
      setSucces('');
      setErreur('');
    }, 3000);
  };

  const reinitialiserFormulaire = () => {
    setUtilisateurEnModification(null);
    setForm({
      nom: '',
      prenom: '',
      email: '',
      motDePasse: '',
      profilId: profils[0]?.id || '',
      actif: true,
    });
    setFormModaleOuverte(false);
  };

  const ouvrirAjout = () => {
    setUtilisateurEnModification(null);
    setForm({
      nom: '',
      prenom: '',
      email: '',
      motDePasse: '',
      profilId: profils[0]?.id || '',
      actif: true,
    });
    setFormModaleOuverte(true);
  };

  const ouvrirModification = (u: UtilisateurDashboard) => {
    setUtilisateurEnModification(u);
    setForm({
      nom: u.nom,
      prenom: u.prenom,
      email: u.email,
      motDePasse: '',
      profilId: u.profilId,
      actif: u.actif,
    });
    setFormModaleOuverte(true);
  };

  const handleAjouterOuModifier = (e: React.FormEvent) => {
    e.preventDefault();
    const userEmail = currentUser?.email || 'admin@medec-ci.org';

    if (!form.profilId) {
      flash(false, 'Veuillez sélectionner un profil.');
      return;
    }

    if (utilisateurEnModification) {
      // Mode modification
      const dataUpdate: Partial<Omit<UtilisateurDashboard, 'id' | 'dateCreation'>> = {
        nom: form.nom,
        prenom: form.prenom,
        email: form.email,
        profilId: form.profilId,
        actif: form.actif,
      };

      if (form.motDePasse.trim()) {
        if (form.motDePasse.length < 6) {
          flash(false, 'Le mot de passe doit comporter au moins 6 caractères.');
          return;
        }
        dataUpdate.motDePasse = form.motDePasse;
      }

      const res = store.modifierUtilisateurDashboard(utilisateurEnModification.id, dataUpdate, userEmail);
      if (res.success) {
        flash(true, `L'utilisateur ${form.prenom} ${form.nom} a été mis à jour.`);
        reinitialiserFormulaire();
      } else {
        flash(false, res.error || 'Erreur lors de la modification.');
      }
    } else {
      // Mode création
      const res = store.ajouterUtilisateurDashboard({
        nom: form.nom,
        prenom: form.prenom,
        email: form.email,
        motDePasse: form.motDePasse,
        profilId: form.profilId,
        actif: form.actif,
      }, userEmail);

      if (res.success) {
        flash(true, `L'utilisateur ${form.prenom} ${form.nom} a été créé.`);
        reinitialiserFormulaire();
      } else {
        flash(false, res.error || 'Erreur lors de la création.');
      }
    }
  };

  const handleSupprimer = (u: UtilisateurDashboard) => {
    if (u.email === 'admin@medec-ci.org') {
      flash(false, 'Impossible de supprimer le compte super-administrateur principal.');
      return;
    }

    const userEmail = currentUser?.email || 'admin@medec-ci.org';
    if (window.confirm(`Voulez-vous vraiment supprimer le compte utilisateur de "${u.prenom} ${u.nom}" ?`)) {
      const res = store.supprimerUtilisateurDashboard(u.id, userEmail);
      if (res.success) {
        flash(true, 'Utilisateur supprimé avec succès.');
      } else {
        flash(false, res.error || 'Erreur lors de la suppression.');
      }
    }
  };

  const handleToggleActif = (u: UtilisateurDashboard) => {
    if (u.email === 'admin@medec-ci.org') {
      flash(false, 'Impossible de désactiver le compte super-administrateur principal.');
      return;
    }

    const userEmail = currentUser?.email || 'admin@medec-ci.org';
    const res = store.toggleActifUtilisateur(u.id, userEmail);
    if (res.success) {
      flash(true, `Statut de l'utilisateur mis à jour.`);
    } else {
      flash(false, res.error || 'Erreur lors de la modification du statut.');
    }
  };

  // Filtrage
  const utilisateursFiltrés = utilisateursDashboard.filter(u =>
    u.nom.toLowerCase().includes(recherche.toLowerCase()) ||
    u.prenom.toLowerCase().includes(recherche.toLowerCase()) ||
    u.email.toLowerCase().includes(recherche.toLowerCase())
  );

  // Pagination
  const totalItems = utilisateursFiltrés.length;
  const totalPages = Math.ceil(totalItems / taillePage) || 1;
  const indexDernier = page * taillePage;
  const indexPremier = indexDernier - taillePage;
  const itemsPaginees = utilisateursFiltrés.slice(indexPremier, indexDernier);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {erreur && <div className="frm-alert err">{erreur}</div>}
      {succes && <div className="frm-alert ok">{succes}</div>}

      {/* Barre de Filtre et Nouveau */}
      <div className="flt-bar" style={{ background: 'var(--color-bg-card)', borderRadius: 'var(--radius-md)', padding: '16px 20px', boxShadow: 'var(--shadow-sm)' }}>
        <div className="flt-left">
          <div className="s-wrap">
            <Search className="s-ico h-4.5 w-4.5" />
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={recherche}
              onChange={(e) => { setRecherche(e.target.value); setPage(1); }}
            />
          </div>
        </div>
        <div className="flt-right">
          <button onClick={ouvrirAjout} className="btn-prim">
            <UserPlus className="h-4.5 w-4.5" />
            <span>Nouveau Compte</span>
          </button>
        </div>
      </div>

      {/* Tableau en Grand */}
      <div className="tbl-card">
        {enChargement ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B4F8A]" />
          </div>
        ) : (
          <>
            <div className="tbl-scroll">
              <table className="tbl">
                <thead>
                  <tr>
                    <th style={{ width: '44px' }}>#</th>
                    <th>Nom Complet</th>
                    <th>E-mail (Identifiant)</th>
                    <th>Profil d'accès</th>
                    <th>Date de Création</th>
                    <th>Statut d'Activité</th>
                    <th style={{ textAlign: 'right', width: '100px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {itemsPaginees.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="empty-td">Aucun compte ne correspond à votre recherche.</td>
                    </tr>
                  ) : (
                    itemsPaginees.map((u, idx) => {
                      const profil = profils.find(p => p.id === u.profilId);
                      return (
                        <tr key={u.id}>
                          <td className="col-num">{indexPremier + idx + 1}</td>
                          <td>
                            <span className="fw700" style={{ color: 'var(--color-dark)' }}>
                              {u.prenom} {u.nom}
                            </span>
                          </td>
                          <td style={{ fontSize: '12.5px', color: 'var(--color-dark-muted)' }}>
                            {u.email}
                          </td>
                          <td>
                            <span className="badge badge-partial" style={{ fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Shield className="h-3 w-3" />
                              <span>{profil ? profil.libelle : 'Non assigné'}</span>
                            </span>
                          </td>
                          <td style={{ fontSize: '12px', color: 'var(--color-dark-muted)' }}>
                            {formaterDate(u.dateCreation)}
                          </td>
                          <td>
                            <button
                              onClick={() => handleToggleActif(u)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                              title={u.actif ? 'Désactiver' : 'Activer'}
                              disabled={u.email === 'admin@medec-ci.org'}
                            >
                              {u.actif ? (
                                <ToggleRight className="h-6 w-6 text-[#2E9E6B]" />
                              ) : (
                                <ToggleLeft className="h-6 w-6 text-slate-400" />
                              )}
                            </button>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                              <button
                                onClick={() => ouvrirModification(u)}
                                className="btn-edit"
                                title="Modifier"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              {u.email !== 'admin@medec-ci.org' ? (
                                <button
                                  onClick={() => handleSupprimer(u)}
                                  className="btn-del"
                                  title="Supprimer"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              ) : (
                                <div style={{ width: '28px' }} />
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div style={{ padding: '10px 20px', borderTop: '1px solid var(--color-border)' }}>
              <PaginationFooter
                total={totalItems}
                page={page}
                pageSize={taillePage}
                totalPages={totalPages}
                onPageChange={setPage}
                onPageSizeChange={setTaillePage}
              />
            </div>
          </>
        )}
      </div>

      {/* MODALE COMPTE USER */}
      <AnimatePresence>
        {formModaleOuverte && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-primary)' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'white', margin: 0 }}>
                  {utilisateurEnModification ? 'Modifier le Compte' : 'Créer un Compte d\'Accès'}
                </h3>
                <button
                  onClick={reinitialiserFormulaire}
                  style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleAjouterOuModifier}>
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div className="frm-grp" style={{ flex: 1 }}>
                      <label className="frm-lbl">Nom *</label>
                      <input
                        type="text"
                        placeholder="Ex: Kouassi"
                        value={form.nom}
                        onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
                        className="frm-inp"
                        required
                      />
                    </div>
                    <div className="frm-grp" style={{ flex: 1 }}>
                      <label className="frm-lbl">Prénom *</label>
                      <input
                        type="text"
                        placeholder="Ex: Yao"
                        value={form.prenom}
                        onChange={e => setForm(f => ({ ...f, prenom: e.target.value }))}
                        className="frm-inp"
                        required
                      />
                    </div>
                  </div>

                  <div className="frm-grp">
                    <label className="frm-lbl">Adresse e-mail (Login) *</label>
                    <input
                      type="email"
                      placeholder="Ex: y.kouassi@medec-ci.org"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="frm-inp"
                      required
                    />
                  </div>

                  <div className="frm-grp">
                    <label className="frm-lbl">
                      {utilisateurEnModification ? 'Nouveau mot de passe (laisser vide pour inchangé)' : 'Mot de passe *'}
                    </label>
                    <input
                      type="password"
                      placeholder={utilisateurEnModification ? '••••••••' : 'Min. 6 caractères'}
                      value={form.motDePasse}
                      onChange={e => setForm(f => ({ ...f, motDePasse: e.target.value }))}
                      className="frm-inp"
                      required={!utilisateurEnModification}
                    />
                  </div>

                  <div className="frm-grp">
                    <label className="frm-lbl">Profil d'accès / Habilitation *</label>
                    <select
                      value={form.profilId}
                      onChange={e => setForm(f => ({ ...f, profilId: e.target.value }))}
                      className="frm-inp"
                      required
                    >
                      <option value="">-- Choisir un profil --</option>
                      {profils.map(p => (
                        <option key={p.id} value={p.id}>{p.libelle} ({p.code})</option>
                      ))}
                    </select>
                  </div>

                  <div className="frm-grp">
                    <label className="frm-lbl" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={form.actif}
                        onChange={e => setForm(f => ({ ...f, actif: e.target.checked }))}
                        style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                      />
                      <span style={{ fontWeight: '600' }}>Activer le compte utilisateur</span>
                    </label>
                  </div>
                </div>

                <div style={{ padding: '16px 24px', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', gap: '10px', background: '#F8FAFC' }}>
                  <button type="button" className="btn-sec" onClick={reinitialiserFormulaire}>
                    Annuler
                  </button>
                  <button type="submit" className="btn-prim">
                    <Check className="h-4 w-4" />
                    <span>Enregistrer</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default UtilisateursDashboard;
