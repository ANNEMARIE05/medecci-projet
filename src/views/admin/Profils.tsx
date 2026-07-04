import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import habilitationService from '../../services/habilitationService';
import type { Profil, HabilitationProfil } from '../../types/models';
import { ShieldCheck, Plus, Edit2, Trash2, Check, X, Key, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PaginationFooter from '../../components/UI/PaginationFooter';

export const Profils: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: profils = [] } = useQuery({ queryKey: ['hab-profils'], queryFn: habilitationService.recupererProfils });
  const { data: menus = [] } = useQuery({ queryKey: ['hab-menus'], queryFn: habilitationService.recupererMenus });
  const { data: actions = [] } = useQuery({ queryKey: ['hab-actions'], queryFn: habilitationService.recupererActions });

  const invalider = () => queryClient.invalidateQueries({ queryKey: ['hab-profils'] });
  const ajouterProfilM = useMutation({ mutationFn: habilitationService.ajouterProfil, onSuccess: invalider });
  const modifierProfilM = useMutation({
    mutationFn: (v: { id: string; data: Partial<Omit<Profil, 'id'>> }) => habilitationService.modifierProfil(v.id, v.data),
    onSuccess: invalider,
  });
  const supprimerProfilM = useMutation({ mutationFn: habilitationService.supprimerProfil, onSuccess: invalider });
  const mettreAJourHabilitationsM = useMutation({
    mutationFn: (v: { profilId: string; habilitations: HabilitationProfil[] }) =>
      habilitationService.mettreAJourHabilitations(v.profilId, v.habilitations),
    onSuccess: invalider,
  });

  // États pour les loaders et la liste
  const [enChargement, setEnChargement] = useState(false);
  const [recherche, setRecherche] = useState('');
  const [page, setPage] = useState(1);
  const [taillePage, setTaillePage] = useState(8);

  // Simulation de chargement initial et lors du filtrage
  useEffect(() => {
    setEnChargement(true);
    const timer = setTimeout(() => setEnChargement(false), 500);
    return () => clearTimeout(timer);
  }, [recherche]);

  // États locaux des formulaires et modales
  const [form, setForm] = useState({ code: '', libelle: '', description: '' });
  const [formModaleOuverte, setFormModaleOuverte] = useState(false);
  const [profilEnModification, setProfilEnModification] = useState<Profil | null>(null);
  
  // Modale d'habilitations
  const [profilHabilId, setProfilHabilId] = useState<string | null>(null);
  const [tempHabilitations, setTempHabilitations] = useState<HabilitationProfil[]>([]);

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
    setForm({ code: '', libelle: '', description: '' });
    setProfilEnModification(null);
    setFormModaleOuverte(false);
  };

  const ouvrirAjout = () => {
    setProfilEnModification(null);
    setForm({ code: '', libelle: '', description: '' });
    setFormModaleOuverte(true);
  };

  const ouvrirModification = (p: Profil) => {
    setProfilEnModification(p);
    setForm({
      code: p.code,
      libelle: p.libelle,
      description: p.description
    });
    setFormModaleOuverte(true);
  };

  const handleAjouterOuModifier = (e: React.FormEvent) => {
    e.preventDefault();

    if (profilEnModification) {
      modifierProfilM.mutate(
        { id: profilEnModification.id, data: { libelle: form.libelle, description: form.description } },
        {
          onSuccess: () => { flash(true, `Le profil "${form.libelle}" a été mis à jour.`); reinitialiserFormulaire(); },
          onError: (err: any) => flash(false, err.message || 'Erreur lors de la modification.'),
        }
      );
    } else {
      ajouterProfilM.mutate(
        { code: form.code, libelle: form.libelle, description: form.description },
        {
          onSuccess: () => { flash(true, `Le profil "${form.libelle}" a été créé.`); reinitialiserFormulaire(); },
          onError: (err: any) => flash(false, err.message || 'Erreur lors de la création.'),
        }
      );
    }
  };

  const handleSupprimer = (p: Profil) => {
    if (p.code === 'ADMIN_COMPLET') {
      flash(false, 'Le profil administrateur complet ne peut pas être supprimé.');
      return;
    }
    if (window.confirm(`Voulez-vous vraiment supprimer le profil "${p.libelle}" ?`)) {
      supprimerProfilM.mutate(p.id, {
        onSuccess: () => flash(true, `Le profil "${p.libelle}" a été supprimé.`),
        onError: (err: any) => flash(false, err.message || 'Erreur lors de la suppression.'),
      });
    }
  };

  const ouvrirHabilitations = (p: Profil) => {
    setProfilHabilId(p.id);
    setTempHabilitations(p.habilitations ? JSON.parse(JSON.stringify(p.habilitations)) : []);
  };

  const fermerHabilitations = () => {
    setProfilHabilId(null);
    setTempHabilitations([]);
  };

  const toggleMenuSelection = (menuId: string) => {
    const existe = tempHabilitations.find(h => h.menuId === menuId);
    if (existe) {
      setTempHabilitations(prev => prev.filter(h => h.menuId !== menuId));
    } else {
      const menu = menus.find(m => m.id === menuId);
      const actionsDispos = menu?.actionsDisponibles || [];
      const actionVoir = actions.find(a => a.code === 'VOIR');
      const actionParDefaut = actionVoir && actionsDispos.includes(actionVoir.id) 
        ? [actionVoir.id] 
        : (actionsDispos.length > 0 ? [actionsDispos[0]] : []);

      setTempHabilitations(prev => [...prev, { menuId, actions: actionParDefaut }]);
    }
  };

  const toggleActionSelection = (menuId: string, actionId: string) => {
    setTempHabilitations(prev => {
      const existe = prev.find(h => h.menuId === menuId);
      if (!existe) return prev;
      
      const aDeja = existe.actions.includes(actionId);
      const nouvellesActions = aDeja 
        ? existe.actions.filter(id => id !== actionId)
        : [...existe.actions, actionId];
      
      return prev.map(h => h.menuId === menuId ? { ...h, actions: nouvellesActions } : h);
    });
  };

  const sauvegarderHabilitations = () => {
    if (!profilHabilId) return;
    mettreAJourHabilitationsM.mutate(
      { profilId: profilHabilId, habilitations: tempHabilitations },
      {
        onSuccess: () => { flash(true, 'Habilitations enregistrées avec succès.'); fermerHabilitations(); },
        onError: (err: any) => flash(false, err.message || 'Erreur lors de l\'enregistrement.'),
      }
    );
  };

  // Filtrage
  const profilsFiltrés = profils.filter(p =>
    p.libelle.toLowerCase().includes(recherche.toLowerCase()) ||
    p.code.toLowerCase().includes(recherche.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(recherche.toLowerCase()))
  );

  // Pagination
  const totalItems = profilsFiltrés.length;
  const totalPages = Math.ceil(totalItems / taillePage) || 1;
  const indexDernier = page * taillePage;
  const indexPremier = indexDernier - taillePage;
  const itemsPaginees = profilsFiltrés.slice(indexPremier, indexDernier);

  const profilActuel = profils.find(p => p.id === profilHabilId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {erreur && <div className="frm-alert err">{erreur}</div>}
      {succes && <div className="frm-alert ok">{succes}</div>}

      {/* Barre de Recherche et Filtres */}
      <div className="flt-bar" style={{ background: 'var(--color-bg-card)', borderRadius: 'var(--radius-md)', padding: '16px 20px', boxShadow: 'var(--shadow-sm)' }}>
        <div className="flt-left">
          <div className="s-wrap">
            <Search className="s-ico h-4.5 w-4.5" />
            <input
              type="text"
              placeholder="Rechercher un profil..."
              value={recherche}
              onChange={(e) => { setRecherche(e.target.value); setPage(1); }}
            />
          </div>
        </div>
        <div className="flt-right">
          <button onClick={ouvrirAjout} className="btn-prim">
            <Plus className="h-4 w-4" />
            <span>Nouveau Profil</span>
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
                    <th>Code du Profil</th>
                    <th>Nom du Profil</th>
                    <th>Description</th>
                    <th>Habilitations</th>
                    <th style={{ textAlign: 'right', width: '160px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {itemsPaginees.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="empty-td">Aucun profil ne correspond aux critères.</td>
                    </tr>
                  ) : (
                    itemsPaginees.map((p, idx) => {
                      const nbMenus = p.habilitations?.length || 0;
                      return (
                        <tr key={p.id}>
                          <td className="col-num">{indexPremier + idx + 1}</td>
                          <td>
                            <span className="badge badge-partial" style={{ fontFamily: 'monospace', fontSize: '11px' }}>
                              {p.code}
                            </span>
                          </td>
                          <td>
                            <span className="fw700" style={{ color: 'var(--color-dark)' }}>{p.libelle}</span>
                          </td>
                          <td style={{ fontSize: '12px', color: 'var(--color-dark-muted)' }}>
                            {p.description || '—'}
                          </td>
                          <td>
                            <span className={`badge ${nbMenus > 0 ? 'badge-success' : 'badge-partial'}`} style={{ fontSize: '11px' }}>
                              {nbMenus} menu{nbMenus !== 1 ? 's' : ''} autorisé{nbMenus !== 1 ? 's' : ''}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', alignItems: 'center' }}>
                              <button
                                onClick={() => ouvrirHabilitations(p)}
                                className="btn-sec"
                                title="Définir les habilitations"
                                style={{ padding: '5px 10px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                              >
                                <Key className="h-3.5 w-3.5" />
                                <span>Habiliter</span>
                              </button>
                              <button
                                onClick={() => ouvrirModification(p)}
                                className="btn-edit"
                                title="Modifier"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              {p.code !== 'ADMIN_COMPLET' ? (
                                <button
                                  onClick={() => handleSupprimer(p)}
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

      {/* MODALE D'AJOUT / MODIFICATION PROFIL */}
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
                  {profilEnModification ? 'Modifier le Profil' : 'Nouveau Profil'}
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
                  <div className="frm-grp">
                    <label className="frm-lbl">Code Profil (Unique / Majuscules) *</label>
                    <input
                      type="text"
                      placeholder="Ex: LECTEUR_SIMPLE"
                      value={form.code}
                      onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                      className="frm-inp"
                      required
                      disabled={!!profilEnModification}
                      style={profilEnModification ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                    />
                  </div>

                  <div className="frm-grp">
                    <label className="frm-lbl">Libellé du Profil *</label>
                    <input
                      type="text"
                      placeholder="Ex: Lecteur Simple"
                      value={form.libelle}
                      onChange={e => setForm(f => ({ ...f, libelle: e.target.value }))}
                      className="frm-inp"
                      required
                    />
                  </div>

                  <div className="frm-grp">
                    <label className="frm-lbl">Description / Rôle</label>
                    <textarea
                      placeholder="Description sommaire du rôle de ce profil..."
                      value={form.description}
                      onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      className="frm-inp"
                      style={{ minHeight: '80px', resize: 'vertical' }}
                    />
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

      {/* MODALE GESTION DES HABILITATIONS */}
      <AnimatePresence>
        {profilHabilId && profilActuel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col"
              style={{ maxHeight: '85vh' }}
            >
              <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white' }}>
                  <ShieldCheck className="h-6 w-6 text-white" />
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'white', margin: 0 }}>
                      Habilitations : {profilActuel.libelle}
                    </h3>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', fontFamily: 'monospace' }}>
                      Code : {profilActuel.code}
                    </span>
                  </div>
                </div>
                <button
                  onClick={fermerHabilitations}
                  style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ fontSize: '12.5px', color: 'var(--color-dark-muted)', margin: 0 }}>
                  Sélectionnez les pages auxquelles ce profil a accès, puis cochez les actions autorisées.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {menus.map((menu) => {
                    const habilitationMenu = tempHabilitations.find(h => h.menuId === menu.id);
                    const estMenuCoche = !!habilitationMenu;

                    return (
                      <div
                        key={menu.id}
                        style={{
                          border: `1.5px solid ${estMenuCoche ? 'var(--color-primary)' : 'var(--color-border)'}`,
                          borderRadius: '10px',
                          overflow: 'hidden',
                          transition: 'all 0.2s ease',
                          boxShadow: estMenuCoche ? '0 4px 12px rgba(11, 60, 145, 0.05)' : 'none',
                        }}
                      >
                        <div
                          style={{
                            padding: '12px 16px',
                            background: estMenuCoche ? 'rgba(11, 60, 145, 0.04)' : '#FAFBFD',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderBottom: estMenuCoche ? '1px solid var(--color-border)' : 'none',
                          }}
                        >
                          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none', width: '70%' }}>
                            <input
                              type="checkbox"
                              checked={estMenuCoche}
                              onChange={() => toggleMenuSelection(menu.id)}
                              style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                            />
                            <span style={{ fontWeight: '700', fontSize: '13.5px', color: estMenuCoche ? 'var(--color-primary)' : 'var(--color-dark)' }}>
                              {menu.libelle}
                            </span>
                            <span style={{ fontSize: '10.5px', color: 'var(--color-dark-muted)', fontFamily: 'monospace' }}>
                              ({menu.chemin})
                            </span>
                          </label>
                          <span className={`badge ${estMenuCoche ? 'badge-success' : 'badge-partial'}`} style={{ fontSize: '10px' }}>
                            {estMenuCoche ? 'Accès Autorisé' : 'Accès Bloqué'}
                          </span>
                        </div>

                        {estMenuCoche && (
                          <div style={{ padding: '12px 16px', background: 'white', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-dark-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                              Actions autorisées :
                            </span>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                              {menu.actionsDisponibles.length === 0 ? (
                                <span style={{ fontSize: '11px', color: 'var(--color-dark-muted)', fontStyle: 'italic' }}>
                                  Aucune action configurée pour ce menu.
                                </span>
                              ) : (
                                menu.actionsDisponibles.map((actId) => {
                                  const action = actions.find(a => a.id === actId);
                                  if (!action) return null;
                                  
                                  const estActionCochee = habilitationMenu.actions.includes(actId);
                                  return (
                                    <label
                                      key={actId}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        cursor: 'pointer',
                                        padding: '5px 10px',
                                        borderRadius: '6px',
                                        fontSize: '11.5px',
                                        fontWeight: '600',
                                        border: `1px solid ${estActionCochee ? 'var(--color-primary)' : 'var(--color-border)'}`,
                                        background: estActionCochee ? 'var(--color-primary-light)' : 'transparent',
                                        color: estActionCochee ? 'var(--color-primary)' : 'var(--color-dark-muted)',
                                        transition: 'all 0.15s ease',
                                        userSelect: 'none',
                                      }}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={estActionCochee}
                                        onChange={() => toggleActionSelection(menu.id, actId)}
                                        style={{ width: '13px', height: '13px', accentColor: 'var(--color-primary)' }}
                                      />
                                      <span>{action.libelle}</span>
                                    </label>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ padding: '16px 24px', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', gap: '10px', background: '#F8FAFC' }}>
                <button type="button" className="btn-sec" onClick={fermerHabilitations}>
                  Annuler
                </button>
                <button type="button" className="btn-prim" onClick={sauvegarderHabilitations}>
                  <Check className="h-4 w-4" />
                  <span>Enregistrer les habilitations</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
    </div>
  );
};

export default Profils;
