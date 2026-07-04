import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import categorieService, { Categorie } from '../../services/categorieService';
import statutService, { Statut } from '../../services/statutService';
import habilitationService from '../../services/habilitationService';
import type { Action, Menu } from '../../types/models';
import {
  Plus, Edit2, Trash2, Check, Tags, ShieldAlert,
  Zap, LayoutGrid, X, ChevronDown, ChevronUp, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PaginationFooter from '../../components/UI/PaginationFooter';

export const Parametrage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: categorieService.recupererCategories });
  const { data: statuts = [] } = useQuery({ queryKey: ['statuts'], queryFn: statutService.recupererStatuts });
  const { data: actions = [] } = useQuery({ queryKey: ['hab-actions'], queryFn: habilitationService.recupererActions });
  const { data: menus = [] } = useQuery({ queryKey: ['hab-menus'], queryFn: habilitationService.recupererMenus });

  const invalider = (cle: string) => queryClient.invalidateQueries({ queryKey: [cle] });

  const ajouterCategorieM = useMutation({ mutationFn: categorieService.ajouterCategorie, onSuccess: () => invalider('categories') });
  const modifierCategorieM = useMutation({
    mutationFn: (v: { id: string; nom: string }) => categorieService.modifierCategorie(v.id, v.nom),
    onSuccess: () => invalider('categories'),
  });
  const supprimerCategorieM = useMutation({ mutationFn: categorieService.supprimerCategorie, onSuccess: () => invalider('categories') });

  const ajouterStatutM = useMutation({ mutationFn: statutService.ajouterStatut, onSuccess: () => invalider('statuts') });
  const modifierStatutM = useMutation({
    mutationFn: (v: { id: string; nom: string }) => statutService.modifierStatut(v.id, v.nom),
    onSuccess: () => invalider('statuts'),
  });
  const supprimerStatutM = useMutation({ mutationFn: statutService.supprimerStatut, onSuccess: () => invalider('statuts') });

  const ajouterActionM = useMutation({ mutationFn: habilitationService.ajouterAction, onSuccess: () => invalider('hab-actions') });
  const modifierActionM = useMutation({
    mutationFn: (v: { id: string; data: Partial<Omit<Action, 'id'>> }) => habilitationService.modifierAction(v.id, v.data),
    onSuccess: () => invalider('hab-actions'),
  });
  const supprimerActionM = useMutation({ mutationFn: habilitationService.supprimerAction, onSuccess: () => invalider('hab-actions') });

  const ajouterMenuM = useMutation({ mutationFn: habilitationService.ajouterMenu, onSuccess: () => invalider('hab-menus') });
  const modifierMenuM = useMutation({
    mutationFn: (v: { id: string; data: Partial<Omit<Menu, 'id'>> }) => habilitationService.modifierMenu(v.id, v.data),
    onSuccess: () => invalider('hab-menus'),
  });
  const supprimerMenuM = useMutation({ mutationFn: habilitationService.supprimerMenu, onSuccess: () => invalider('hab-menus') });
  const assignerActionsMenuM = useMutation({
    mutationFn: (v: { menuId: string; actionIds: string[] }) => habilitationService.assignerActionsMenu(v.menuId, v.actionIds),
    onSuccess: () => invalider('hab-menus'),
  });

  type OngletType = 'categories' | 'statuts' | 'actions' | 'menus';
  const [ongletActif, setOngletActif] = useState<OngletType>('categories');

  // États de filtrage, pagination et loaders
  const [recherche, setRecherche] = useState('');
  const [page, setPage] = useState(1);
  const [taillePage, setTaillePage] = useState(8);
  const [enChargement, setEnChargement] = useState(false);

  // Modale d'édition / création unique
  const [modaleOuverte, setModaleOuverte] = useState(false);
  const [elementEnModification, setElementEnModification] = useState<any | null>(null);

  // Formulaires selon l'onglet
  const [formCat, setFormCat] = useState('');
  const [formStatut, setFormStatut] = useState('');
  const [formAction, setFormAction] = useState({ code: '', libelle: '', description: '' });
  const [formMenu, setFormMenu] = useState({ code: '', libelle: '', chemin: '', icone: '' });

  // Accordion pour l'onglet menus
  const [menuExpand, setMenuExpand] = useState<string | null>(null);

  // Alertes
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState('');

  const flash = (ok: boolean, msg: string) => {
    ok ? setSucces(msg) : setErreur(msg);
    ok ? setErreur('') : setSucces('');
    setTimeout(() => { setSucces(''); setErreur(''); }, 3000);
  };

  // Reset pagination et loader au changement d'onglet
  useEffect(() => {
    setRecherche('');
    setPage(1);
    setEnChargement(true);
    const timer = setTimeout(() => setEnChargement(false), 400);
    return () => clearTimeout(timer);
  }, [ongletActif]);

  // Loader lors de la recherche
  useEffect(() => {
    setEnChargement(true);
    const timer = setTimeout(() => setEnChargement(false), 300);
    return () => clearTimeout(timer);
  }, [recherche]);

  const reinitialiserFormulaire = () => {
    setElementEnModification(null);
    setFormCat('');
    setFormStatut('');
    setFormAction({ code: '', libelle: '', description: '' });
    setFormMenu({ code: '', libelle: '', chemin: '', icone: '' });
    setModaleOuverte(false);
  };

  const ouvrirAjout = () => {
    setElementEnModification(null);
    setFormCat('');
    setFormStatut('');
    setFormAction({ code: '', libelle: '', description: '' });
    setFormMenu({ code: '', libelle: '', chemin: '', icone: '' });
    setModaleOuverte(true);
  };

  const ouvrirModification = (el: any) => {
    setElementEnModification(el);
    if (ongletActif === 'categories') {
      setFormCat(el.nom);
    } else if (ongletActif === 'statuts') {
      setFormStatut(el.nom);
    } else if (ongletActif === 'actions') {
      setFormAction({ code: el.code, libelle: el.libelle, description: el.description || '' });
    } else if (ongletActif === 'menus') {
      setFormMenu({ code: el.code, libelle: el.libelle, chemin: el.chemin || '', icone: el.icone || '' });
    }
    setModaleOuverte(true);
  };

  const handleValiderFormulaire = (e: React.FormEvent) => {
    e.preventDefault();

    if (ongletActif === 'categories') {
      const nomClean = formCat.trim();
      if (!nomClean) return flash(false, 'Le nom ne peut pas être vide.');
      const mutation = elementEnModification
        ? modifierCategorieM.mutateAsync({ id: elementEnModification.id, nom: nomClean })
        : ajouterCategorieM.mutateAsync(nomClean);
      mutation
        .then(() => { flash(true, elementEnModification ? 'Catégorie renommée avec succès.' : 'Catégorie ajoutée avec succès.'); reinitialiserFormulaire(); })
        .catch((err: any) => flash(false, err.message || 'Erreur.'));
    }

    else if (ongletActif === 'statuts') {
      const nomClean = formStatut.trim();
      if (!nomClean) return flash(false, 'Le nom ne peut pas être vide.');
      const mutation = elementEnModification
        ? modifierStatutM.mutateAsync({ id: elementEnModification.id, nom: nomClean })
        : ajouterStatutM.mutateAsync(nomClean);
      mutation
        .then(() => { flash(true, elementEnModification ? 'Statut renommé avec succès.' : 'Statut ajouté avec succès.'); reinitialiserFormulaire(); })
        .catch((err: any) => flash(false, err.message || 'Erreur.'));
    }

    else if (ongletActif === 'actions') {
      const mutation = elementEnModification
        ? modifierActionM.mutateAsync({ id: elementEnModification.id, data: formAction })
        : ajouterActionM.mutateAsync(formAction);
      mutation
        .then(() => { flash(true, elementEnModification ? 'Action mise à jour avec succès.' : 'Action créée avec succès.'); reinitialiserFormulaire(); })
        .catch((err: any) => flash(false, err.message || 'Erreur.'));
    }

    else if (ongletActif === 'menus') {
      const mutation = elementEnModification
        ? modifierMenuM.mutateAsync({ id: elementEnModification.id, data: formMenu })
        : ajouterMenuM.mutateAsync(formMenu);
      mutation
        .then(() => { flash(true, elementEnModification ? 'Menu mis à jour avec succès.' : 'Menu créé avec succès.'); reinitialiserFormulaire(); })
        .catch((err: any) => flash(false, err.message || 'Erreur.'));
    }
  };

  const handleSupprimer = (el: any) => {
    if (ongletActif === 'categories') {
      if (window.confirm(`Supprimer la catégorie "${el.nom}" ?`)) {
        supprimerCategorieM.mutate(el.id, {
          onSuccess: () => flash(true, 'Catégorie supprimée.'),
          onError: (err: any) => flash(false, err.message || 'Erreur.'),
        });
      }
    }

    else if (ongletActif === 'statuts') {
      if (window.confirm(`Supprimer le statut "${el.nom}" ?`)) {
        supprimerStatutM.mutate(el.id, {
          onSuccess: () => flash(true, 'Statut supprimé.'),
          onError: (err: any) => flash(false, err.message || 'Erreur.'),
        });
      }
    }

    else if (ongletActif === 'actions') {
      if (window.confirm(`Supprimer l'action "${el.libelle}" ?`)) {
        supprimerActionM.mutate(el.id, {
          onSuccess: () => flash(true, 'Action supprimée.'),
          onError: (err: any) => flash(false, err.message || 'Erreur.'),
        });
      }
    }

    else if (ongletActif === 'menus') {
      if (window.confirm(`Supprimer le menu "${el.libelle}" ?`)) {
        supprimerMenuM.mutate(el.id, {
          onSuccess: () => flash(true, 'Menu supprimé.'),
          onError: (err: any) => flash(false, err.message || 'Erreur.'),
        });
      }
    }
  };

  const toggleActionMenu = (menuId: string, actionId: string) => {
    const menu = menus.find(m => m.id === menuId);
    if (!menu) return;
    const current = menu.actionsDisponibles;
    const updated = current.includes(actionId)
      ? current.filter(id => id !== actionId)
      : [...current, actionId];
    assignerActionsMenuM.mutate({ menuId, actionIds: updated }, {
      onError: (err: any) => flash(false, err.message || 'Erreur.'),
    });
  };

  // Filtrage selon l'onglet
  let donneesFiltrees: any[] = [];
  if (ongletActif === 'categories') {
    donneesFiltrees = categories.filter((c: Categorie) => c.nom.toLowerCase().includes(recherche.toLowerCase()));
  } else if (ongletActif === 'statuts') {
    donneesFiltrees = statuts.filter((s: Statut) => s.nom.toLowerCase().includes(recherche.toLowerCase()));
  } else if (ongletActif === 'actions') {
    donneesFiltrees = actions.filter(a =>
      a.libelle.toLowerCase().includes(recherche.toLowerCase()) ||
      a.code.toLowerCase().includes(recherche.toLowerCase())
    );
  } else if (ongletActif === 'menus') {
    donneesFiltrees = menus.filter(m =>
      m.libelle.toLowerCase().includes(recherche.toLowerCase()) ||
      m.code.toLowerCase().includes(recherche.toLowerCase())
    );
  }

  // Pagination
  const totalItems = donneesFiltrees.length;
  const totalPages = Math.ceil(totalItems / taillePage) || 1;
  const indexDernier = page * taillePage;
  const indexPremier = indexDernier - taillePage;
  const itemsPaginees = donneesFiltrees.slice(indexPremier, indexDernier);

  const onglets: { key: OngletType; label: string; icon: React.ReactNode }[] = [
    { key: 'categories', label: 'Catégories Financières', icon: <Tags className="h-4 w-4" /> },
    { key: 'statuts',    label: 'Statuts des Membres',    icon: <ShieldAlert className="h-4 w-4" /> },
    { key: 'actions',    label: 'Actions Habilitations',  icon: <Zap className="h-4 w-4" /> },
    { key: 'menus',      label: 'Menus & Permissions',    icon: <LayoutGrid className="h-4 w-4" /> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Sélecteur d'onglets premium */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px', flexWrap: 'wrap' }}>
        {onglets.map(o => (
          <button
            key={o.key}
            onClick={() => setOngletActif(o.key)}
            className={ongletActif === o.key ? 'btn-prim' : 'btn-sec'}
            style={{ padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer', transition: 'all 0.2s ease', fontWeight: 600, fontSize: '13px' }}
          >
            {o.icon}
            <span>{o.label}</span>
          </button>
        ))}
      </div>

      {erreur && <div className="frm-alert err">{erreur}</div>}
      {succes && <div className="frm-alert ok">{succes}</div>}

      {/* Barre de Recherche et Filtres */}
      <div className="flt-bar" style={{ background: 'var(--color-bg-card)', borderRadius: 'var(--radius-md)', padding: '16px 20px', boxShadow: 'var(--shadow-sm)' }}>
        <div className="flt-left">
          <div className="s-wrap">
            <Search className="s-ico h-4.5 w-4.5" />
            <input
              type="text"
              placeholder={`Rechercher dans ${onglets.find(o => o.key === ongletActif)?.label}...`}
              value={recherche}
              onChange={(e) => { setRecherche(e.target.value); setPage(1); }}
            />
          </div>
        </div>
        <div className="flt-right">
          <button onClick={ouvrirAjout} className="btn-prim">
            <Plus className="h-4 w-4" />
            <span>Nouveau</span>
          </button>
        </div>
      </div>

      {/* Liste en Grand */}
      <div className="tbl-card">
        {enChargement ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B4F8A]" />
          </div>
        ) : (
          <>
            <div className="tbl-scroll">
              <table className="tbl">
                {ongletActif === 'categories' && (
                  <>
                    <thead>
                      <tr>
                        <th style={{ width: '44px' }}>#</th>
                        <th>Nom de la Catégorie Financière</th>
                        <th style={{ textAlign: 'right', width: '120px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemsPaginees.length === 0 ? (
                        <tr><td colSpan={3} className="empty-td">Aucune catégorie.</td></tr>
                      ) : (
                        itemsPaginees.map((cat: Categorie, idx) => (
                          <tr key={cat.id}>
                            <td className="col-num">{indexPremier + idx + 1}</td>
                            <td><span className="fw700">{cat.nom}</span></td>
                            <td style={{ textAlign: 'right' }}>
                              <div className="act-cell" style={{ justifyContent: 'flex-end' }}>
                                <button onClick={() => ouvrirModification(cat)} className="btn-edit" title="Modifier"><Edit2 className="h-3.5 w-3.5" /></button>
                                <button onClick={() => handleSupprimer(cat)} className="btn-del" title="Supprimer"><Trash2 className="h-3.5 w-3.5" /></button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </>
                )}

                {ongletActif === 'statuts' && (
                  <>
                    <thead>
                      <tr>
                        <th style={{ width: '44px' }}>#</th>
                        <th>Statut de Fidèle</th>
                        <th style={{ textAlign: 'right', width: '120px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemsPaginees.length === 0 ? (
                        <tr><td colSpan={3} className="empty-td">Aucun statut.</td></tr>
                      ) : (
                        itemsPaginees.map((st: Statut, idx) => (
                          <tr key={st.id}>
                            <td className="col-num">{indexPremier + idx + 1}</td>
                            <td><span className="fw700">{st.nom}</span></td>
                            <td style={{ textAlign: 'right' }}>
                              <div className="act-cell" style={{ justifyContent: 'flex-end' }}>
                                <button onClick={() => ouvrirModification(st)} className="btn-edit" title="Modifier"><Edit2 className="h-3.5 w-3.5" /></button>
                                <button onClick={() => handleSupprimer(st)} className="btn-del" title="Supprimer"><Trash2 className="h-3.5 w-3.5" /></button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </>
                )}

                {ongletActif === 'actions' && (
                  <>
                    <thead>
                      <tr>
                        <th style={{ width: '44px' }}>#</th>
                        <th>Code Action</th>
                        <th>Libellé</th>
                        <th>Description</th>
                        <th style={{ textAlign: 'right', width: '120px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemsPaginees.length === 0 ? (
                        <tr><td colSpan={5} className="empty-td">Aucune action.</td></tr>
                      ) : (
                        itemsPaginees.map((act: Action, idx) => (
                          <tr key={act.id}>
                            <td className="col-num">{indexPremier + idx + 1}</td>
                            <td><span className="badge badge-partial" style={{ fontFamily: 'monospace' }}>{act.code}</span></td>
                            <td><span className="fw700">{act.libelle}</span></td>
                            <td style={{ fontSize: '12px', color: 'var(--color-dark-muted)' }}>{act.description}</td>
                            <td style={{ textAlign: 'right' }}>
                              <div className="act-cell" style={{ justifyContent: 'flex-end' }}>
                                <button onClick={() => ouvrirModification(act)} className="btn-edit" title="Modifier"><Edit2 className="h-3.5 w-3.5" /></button>
                                <button onClick={() => handleSupprimer(act)} className="btn-del" title="Supprimer"><Trash2 className="h-3.5 w-3.5" /></button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </>
                )}

                {ongletActif === 'menus' && (
                  <>
                    <thead>
                      <tr>
                        <th style={{ width: '44px' }}>#</th>
                        <th>Code Menu</th>
                        <th>Libellé</th>
                        <th>Chemin URL</th>
                        <th>Permissions Liées</th>
                        <th style={{ textAlign: 'right', width: '160px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemsPaginees.length === 0 ? (
                        <tr><td colSpan={6} className="empty-td">Aucun menu.</td></tr>
                      ) : (
                        itemsPaginees.map((m: Menu, idx) => {
                          const isExpanded = menuExpand === m.id;
                          return (
                            <React.Fragment key={m.id}>
                              <tr>
                                <td className="col-num">{indexPremier + idx + 1}</td>
                                <td><span className="badge badge-partial" style={{ fontFamily: 'monospace' }}>{m.code}</span></td>
                                <td><span className="fw700">{m.libelle}</span></td>
                                <td style={{ fontSize: '12px', color: 'var(--color-dark-muted)', fontFamily: 'monospace' }}>{m.chemin}</td>
                                <td>
                                  <span className="badge badge-partial">
                                    {m.actionsDisponibles.length} action(s)
                                  </span>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', alignItems: 'center' }}>
                                    <button
                                      onClick={() => setMenuExpand(isExpanded ? null : m.id)}
                                      className="btn-sec"
                                      style={{ padding: '5px 10px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                                    >
                                      {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                                      <span>Droits</span>
                                    </button>
                                    <button onClick={() => ouvrirModification(m)} className="btn-edit" title="Modifier"><Edit2 className="h-3.5 w-3.5" /></button>
                                    <button onClick={() => handleSupprimer(m)} className="btn-del" title="Supprimer"><Trash2 className="h-3.5 w-3.5" /></button>
                                  </div>
                                </td>
                              </tr>
                              {isExpanded && (
                                <tr>
                                  <td colSpan={6} style={{ padding: '12px 20px', background: 'rgba(11,60,145,0.02)', borderBottom: '1.5px solid var(--color-primary)' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                      <span style={{ fontSize: '11px', fontWeight: '750', color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                                        Configurer les actions valides sur le menu "{m.libelle}" :
                                      </span>
                                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {actions.map(act => {
                                          const checked = m.actionsDisponibles.includes(act.id);
                                          return (
                                            <label
                                              key={act.id}
                                              style={{
                                                display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
                                                padding: '4px 10px', borderRadius: '6px', fontSize: '11.5px', fontWeight: '600',
                                                border: `1.5px solid ${checked ? 'var(--color-primary)' : 'var(--color-border)'}`,
                                                background: checked ? 'var(--color-primary-light)' : 'white',
                                                color: checked ? 'var(--color-primary)' : 'var(--color-dark-muted)',
                                                transition: 'all 0.15s ease',
                                                userSelect: 'none',
                                              }}
                                            >
                                              <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={() => toggleActionMenu(m.id, act.id)}
                                                style={{ width: '13px', height: '13px', accentColor: 'var(--color-primary)' }}
                                              />
                                              <span>{act.libelle}</span>
                                            </label>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })
                      )}
                    </tbody>
                  </>
                )}
              </table>
            </div>

            {/* Footer de Pagination */}
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

      {/* MODALE D'AJOUT / MODIFICATION D'ÉLÉMENT */}
      <AnimatePresence>
        {modaleOuverte && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-primary)' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'white', margin: 0 }}>
                  {elementEnModification ? 'Modifier la configuration' : 'Ajouter une configuration'}
                </h3>
                <button
                  onClick={reinitialiserFormulaire}
                  style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleValiderFormulaire}>
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {ongletActif === 'categories' && (
                    <div className="frm-grp">
                      <label className="frm-lbl">Nom de la Catégorie Financière *</label>
                      <input
                        type="text"
                        placeholder="Ex: Projet Spécial, Dîme..."
                        value={formCat}
                        onChange={e => setFormCat(e.target.value)}
                        className="frm-inp"
                        required
                        autoFocus
                      />
                    </div>
                  )}

                  {ongletActif === 'statuts' && (
                    <div className="frm-grp">
                      <label className="frm-lbl">Nom du Statut de Fidèle *</label>
                      <input
                        type="text"
                        placeholder="Ex: Pasteur, Membre d'honneur..."
                        value={formStatut}
                        onChange={e => setFormStatut(e.target.value)}
                        className="frm-inp"
                        required
                        autoFocus
                      />
                    </div>
                  )}

                  {ongletActif === 'actions' && (
                    <>
                      <div className="frm-grp">
                        <label className="frm-lbl">Code (majuscules) *</label>
                        <input
                          type="text"
                          placeholder="Ex: IMPRIMER"
                          value={formAction.code}
                          onChange={e => setFormAction(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                          className="frm-inp"
                          required
                          disabled={!!elementEnModification}
                        />
                      </div>
                      <div className="frm-grp">
                        <label className="frm-lbl">Libellé *</label>
                        <input
                          type="text"
                          placeholder="Ex: Imprimer"
                          value={formAction.libelle}
                          onChange={e => setFormAction(f => ({ ...f, libelle: e.target.value }))}
                          className="frm-inp"
                          required
                        />
                      </div>
                      <div className="frm-grp">
                        <label className="frm-lbl">Description</label>
                        <input
                          type="text"
                          placeholder="Description succincte..."
                          value={formAction.description}
                          onChange={e => setFormAction(f => ({ ...f, description: e.target.value }))}
                          className="frm-inp"
                        />
                      </div>
                    </>
                  )}

                  {ongletActif === 'menus' && (
                    <>
                      <div className="frm-grp">
                        <label className="frm-lbl">Code Menu (majuscules) *</label>
                        <input
                          type="text"
                          placeholder="Ex: RAPPORTS"
                          value={formMenu.code}
                          onChange={e => setFormMenu(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                          className="frm-inp"
                          required
                          disabled={!!elementEnModification}
                        />
                      </div>
                      <div className="frm-grp">
                        <label className="frm-lbl">Libellé *</label>
                        <input
                          type="text"
                          placeholder="Ex: Rapports"
                          value={formMenu.libelle}
                          onChange={e => setFormMenu(f => ({ ...f, libelle: e.target.value }))}
                          className="frm-inp"
                          required
                        />
                      </div>
                      <div className="frm-grp">
                        <label className="frm-lbl">Chemin (URL du dashboard)</label>
                        <input
                          type="text"
                          placeholder="Ex: /admin/rapports"
                          value={formMenu.chemin}
                          onChange={e => setFormMenu(f => ({ ...f, chemin: e.target.value }))}
                          className="frm-inp"
                        />
                      </div>
                      <div className="frm-grp">
                        <label className="frm-lbl">Icône (Nom Lucide)</label>
                        <input
                          type="text"
                          placeholder="Ex: FileText"
                          value={formMenu.icone}
                          onChange={e => setFormMenu(f => ({ ...f, icone: e.target.value }))}
                          className="frm-inp"
                        />
                      </div>
                    </>
                  )}
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

export default Parametrage;
