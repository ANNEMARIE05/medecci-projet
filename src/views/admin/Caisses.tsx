import React, { useState, useEffect } from 'react';
import {
  Folder,
  Search,
  Plus,
  Edit2,
  Archive,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import caisseService from '../../services/caisseService';
import cotisationService from '../../services/cotisationService';
import membreService from '../../services/membreService';
import categorieService from '../../services/categorieService';
import type { Caisse } from '../../types/models';
import { calculerTotalCaisse } from '../../lib/caisseUtils';
import { formaterDevise, formaterDate } from '../../utils/formateur';
import PaginationFooter from '../../components/UI/PaginationFooter';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

const responsablesOptions = [
  "Pasteur Koffi",
  "Diacre Yao",
  "Mme. Amenan Marie",
  "Sœur Grâce",
  "Pasteur Emmanuel",
  "Diacre Jean-Pierre"
];

export const Caisses: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: caisses = [] } = useQuery({ queryKey: ['caisses'], queryFn: caisseService.recupererCaisses });
  const { data: membres = [] } = useQuery({ queryKey: ['membres'], queryFn: membreService.recupererMembres });
  const { data: transactions = [] } = useQuery({ queryKey: ['transactions'], queryFn: cotisationService.recupererTransactions });
  const { data: categoriesData = [] } = useQuery({ queryKey: ['categories'], queryFn: categorieService.recupererCategories });
  const categories = categoriesData.map((c) => c.nom);

  const invalidateCaisses = () => {
    queryClient.invalidateQueries({ queryKey: ['caisses'] });
    queryClient.invalidateQueries({ queryKey: ['transactions'] });
  };

  const creerCaisseMutation = useMutation({ mutationFn: caisseService.creerCaisse, onSuccess: invalidateCaisses });
  const modifierCaisseMutation = useMutation({
    mutationFn: (vars: { id: string; data: Parameters<typeof caisseService.modifierCaisse>[1] }) =>
      caisseService.modifierCaisse(vars.id, vars.data),
    onSuccess: invalidateCaisses,
  });
  const archiverMutation = useMutation({ mutationFn: caisseService.archiverCaisse, onSuccess: invalidateCaisses });
  const enregistrerCotisationMutation = useMutation({
    mutationFn: (vars: Parameters<typeof cotisationService.enregistrerCotisation>) =>
      cotisationService.enregistrerCotisation(...vars),
    onSuccess: invalidateCaisses,
  });
  const modifierCotisationMutation = useMutation({
    mutationFn: (vars: { idTx: string; montant: number }) => cotisationService.modifierCotisation(vars.idTx, vars.montant),
    onSuccess: invalidateCaisses,
  });

  // Navigation locale
  const [caisseDetailId, setCaisseDetailId] = useState<string | null>(null);

  // ── ÉTATS POUR LA VUE LISTE ──
  const [rechercheCaisse, setRechercheCaisse] = useState('');
  const [pageCaisse, setPageCaisse] = useState(1);
  const [taillePageCaisse, setTaillePageCaisse] = useState(6);

  // ── ÉTATS POUR LA CRÉATION ──
  const [creerNom, setCreerNom] = useState('');
  const [creerCode, setCreerCode] = useState('');
  const [creerResponsable, setCreerResponsable] = useState('');
  const [creerObjectif, setCreerObjectif] = useState('');
  const [creerCategorie, setCreerCategorie] = useState('');
  const [creerDesc, setCreerDesc] = useState('');
  const [creerError, setCreerError] = useState('');
  const [creerSuccess, setCreerSuccess] = useState('');
  const [showCreerModal, setShowCreerModal] = useState(false);

  // ── ÉTATS POUR LA MODIFICATION ──
  const [modifNom, setModifNom] = useState('');
  const [modifCode, setModifCode] = useState('');
  const [modifResponsable, setModifResponsable] = useState('');
  const [modifObjectif, setModifObjectif] = useState('');
  const [modifCategorie, setModifCategorie] = useState('');
  const [modifDesc, setModifDesc] = useState('');
  const [modifError, setModifError] = useState('');
  const [modifSuccess, setModifSuccess] = useState('');
  const [showModifierModal, setShowModifierModal] = useState(false);

  // ── ÉTATS DE CONFIRMATION (MODALS) ──
  const [caisseAArchiver, setCaisseAArchiver] = useState<Caisse | null>(null);

  // ── ÉTATS POUR LES DÉTAILS DE LA CAISSE ──
  const [rechercheCotisant, setRechercheCotisant] = useState('');
  const [pageCaisseTx, setPageCaisseTx] = useState(1);
  const [taillePageCaisseTx, setTaillePageCaisseTx] = useState(10);

  // Modale pour enregistrer un versement
  const [showEnregistrerModal, setShowEnregistrerModal] = useState(false);
  const [membreCotisant, setMembreCotisant] = useState('');
  const [montantCotise, setMontantCotise] = useState('');
  const [commentaireCotise, setCommentaireCotise] = useState('');
  const [cotiseError, setCotiseError] = useState('');
  const [cotiseSuccess, setCotiseSuccess] = useState('');

  // États pour la modification d'un versement (traçabilité)
  const [txAModifier, setTxAModifier] = useState<any>(null);
  const [nouveauMontantModif, setNouveauMontantModif] = useState('');
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  const caisseActive = caisses.find(c => c.id === caisseDetailId);

  // Réinitialiser les états
  useEffect(() => {
    setCotiseError('');
    setCotiseSuccess('');
    setMembreCotisant('');
    setMontantCotise('');
    setCommentaireCotise('');
    setTxAModifier(null);
    setNouveauMontantModif('');
    setEditError('');
    setEditSuccess('');
  }, [caisseDetailId]);

  const obtenirNomMembre = (idMembre: string) => {
    const m = membres.find((x) => x.id === idMembre);
    return m ? `${m.prenom} ${m.nom}` : 'Membre inconnu';
  };

  const obtenirTelephoneMembre = (idMembre: string) => {
    const m = membres.find((x) => x.id === idMembre);
    return m ? m.telephone : '—';
  };

  // Action : Créer caisse
  const gererSoumissionCreation = (e: React.FormEvent) => {
    e.preventDefault();
    setCreerError('');
    setCreerSuccess('');

    if (!creerNom.trim()) {
      setCreerError('Le nom de la caisse est obligatoire.');
      return;
    }

    creerCaisseMutation.mutate(
      {
        nom: creerNom,
        description: creerDesc,
        code: creerCode,
        responsable: creerResponsable,
        objectif: Number(creerObjectif),
        categorie: creerCategorie,
      },
      {
        onSuccess: () => {
          setCreerNom('');
          setCreerCode('');
          setCreerResponsable('');
          setCreerObjectif('');
          setCreerCategorie('');
          setCreerDesc('');
          setCreerSuccess('La caisse a été créée avec succès.');
          setTimeout(() => {
            setCreerSuccess('');
            setShowCreerModal(false);
          }, 1000);
        },
        onError: (err: any) => setCreerError(err.message || 'Erreur de création'),
      }
    );
  };

  // Action : Modifier caisse
  const gererSoumissionModification = (e: React.FormEvent) => {
    e.preventDefault();
    setModifError('');
    setModifSuccess('');

    if (!caisseDetailId) return;

    if (!modifNom.trim()) {
      setModifError('Le nom de la caisse est obligatoire.');
      return;
    }

    modifierCaisseMutation.mutate(
      {
        id: caisseDetailId,
        data: {
          nom: modifNom,
          description: modifDesc,
          code: modifCode,
          responsable: modifResponsable,
          objectif: Number(modifObjectif),
          categorie: modifCategorie,
        },
      },
      {
        onSuccess: () => {
          setModifSuccess('La caisse a été modifiée avec succès.');
          setTimeout(() => {
            setModifSuccess('');
            setShowModifierModal(false);
          }, 1000);
        },
        onError: (err: any) => setModifError(err.message || 'Erreur de modification'),
      }
    );
  };

  // Action : Archiver caisse
  const executerArchivage = () => {
    if (!caisseAArchiver) return;
    archiverMutation.mutate(caisseAArchiver.id, {
      onSuccess: () => {
        setCaisseAArchiver(null);
        setCaisseDetailId(null);
      },
    });
  };

  // Action : Enregistrer cotisation (versement)
  const gererEnregistrerCotisation = (e: React.FormEvent) => {
    e.preventDefault();
    setCotiseError('');
    setCotiseSuccess('');

    if (!caisseActive) return;

    if (!membreCotisant) {
      setCotiseError('Veuillez choisir un fidèle.');
      return;
    }
    const valMontant = Number(montantCotise);
    if (isNaN(valMontant) || valMontant <= 0) {
      setCotiseError('Veuillez saisir un montant supérieur à 0.');
      return;
    }

    enregistrerCotisationMutation.mutate(
      [caisseActive.id, membreCotisant, valMontant, commentaireCotise],
      {
        onSuccess: () => {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#1B4F8A', '#2563EB', '#2E9E6B']
          });

          setCotiseSuccess(`Versement de ${formaterDevise(valMontant)} enregistré avec succès !`);
          setMontantCotise('');
          setMembreCotisant('');
          setCommentaireCotise('');

          setTimeout(() => {
            setCotiseSuccess('');
            setShowEnregistrerModal(false);
          }, 1000);
        },
        onError: (err: any) => setCotiseError(err.message || 'Erreur de versement'),
      }
    );
  };

  const gererSoumissionModifTx = (e: React.FormEvent) => {
    e.preventDefault();
    setEditError('');
    setEditSuccess('');

    if (!caisseActive) return;

    const valMontant = Number(nouveauMontantModif);
    if (isNaN(valMontant) || valMontant <= 0) {
      setEditError('Veuillez saisir un montant valide.');
      return;
    }

    modifierCotisationMutation.mutate(
      { idTx: txAModifier.id, montant: valMontant },
      {
        onSuccess: () => {
          setEditSuccess('Le versement a été modifié.');
          setTimeout(() => {
            setTxAModifier(null);
          }, 1000);
        },
        onError: (err: any) => setEditError(err.message || 'Erreur de versement'),
      }
    );
  };

  // ────────── FILTRAGE ET PAGINATION ──────────

  // 1. Liste des caisses actives
  const caissesFiltrees = caisses.filter(c =>
    c.archivee !== true &&
    (c.nom.toLowerCase().includes(rechercheCaisse.toLowerCase()) ||
     c.description.toLowerCase().includes(rechercheCaisse.toLowerCase()) ||
     (c.code && c.code.toLowerCase().includes(rechercheCaisse.toLowerCase())))
  );
  const totalItems = caissesFiltrees.length;
  const totalPages = Math.ceil(totalItems / taillePageCaisse) || 1;

  useEffect(() => {
    if (pageCaisse > totalPages) {
      setPageCaisse(1);
    }
  }, [totalItems, totalPages, pageCaisse]);

  const indexDernier = pageCaisse * taillePageCaisse;
  const indexPremier = indexDernier - taillePageCaisse;
  const caissesPaginees = caissesFiltrees.slice(indexPremier, indexDernier);

  // 2. Transactions d'une caisse
  let transactionsCaisse: typeof transactions = [];
  if (caisseActive) {
    transactionsCaisse = transactions.filter(t =>
      t.idCaisse === caisseDetailId &&
      obtenirNomMembre(t.idMembre).toLowerCase().includes(rechercheCotisant.toLowerCase())
    );
  }
  const totalTxs = transactionsCaisse.length;
  const totalPagesTxs = Math.ceil(totalTxs / taillePageCaisseTx) || 1;

  useEffect(() => {
    if (pageCaisseTx > totalPagesTxs) {
      setPageCaisseTx(1);
    }
  }, [totalTxs, totalPagesTxs, pageCaisseTx]);

  const indexDernierTx = pageCaisseTx * taillePageCaisseTx;
  const indexPremierTx = indexDernierTx - taillePageCaisseTx;
  const txsPaginees = transactionsCaisse.slice(indexPremierTx, indexDernierTx);

  // VUE ACTIVE LISTE DES CAISSES
  if (!caisseDetailId) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Barre d'outils et recherche */}
        <div className="flt-bar" style={{ background: 'var(--color-bg-card)', borderRadius: 'var(--radius-md)', padding: '16px 20px', boxShadow: 'var(--shadow-sm)' }}>
          <div className="flt-left">
            <div className="s-wrap">
              <Search className="s-ico h-4.5 w-4.5" />
              <input
                type="text"
                value={rechercheCaisse}
                onChange={(e) => { setRechercheCaisse(e.target.value); setPageCaisse(1); }}
                placeholder="Rechercher par nom, code..."
              />
            </div>
          </div>
          <div className="flt-right">
            <button
              onClick={() => {
                setCreerNom('');
                setCreerCode('');
                setCreerResponsable('');
                setCreerObjectif('');
                setCreerCategorie(categories[0] || 'Général');
                setCreerDesc('');
                setCreerError('');
                setCreerSuccess('');
                setShowCreerModal(true);
              }}
              className="btn-prim"
            >
              <Plus className="h-4 w-4" />
              <span>Créer une Caisse</span>
            </button>
          </div>
        </div>

        {/* Grille des caisses actives */}
        <div className="caisse-grid">
          {caissesPaginees.length === 0 ? (
            <div className="dtl-card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>
              <p style={{ color: 'var(--color-dark-muted)' }}>Aucune caisse active trouvée.</p>
            </div>
          ) : (
            caissesPaginees.map((c) => {
              const total = calculerTotalCaisse(c);
              return (
                <div key={c.id} className="caisse-card">
                  <div className="caisse-title-row">
                    <div>
                      <span className="caisse-name">{c.nom}</span>
                    </div>
                    <button
                      className="btn-edit"
                      title="Modifier la caisse"
                      style={{ padding: '4px 6px' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCaisseDetailId(c.id);
                        setModifNom(c.nom);
                        setModifCode(c.code || '');
                        setModifResponsable(c.responsable || '');
                        setModifObjectif(c.objectif ? c.objectif.toString() : '');
                        setModifCategorie(c.categorie || 'Général');
                        setModifDesc(c.description || '');
                        setModifError('');
                        setModifSuccess('');
                        setShowModifierModal(true);
                      }}
                    >
                      <Edit2 className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="caisse-desc">{c.description || 'Aucune description disponible.'}</p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--color-dark-muted)', fontWeight: '600' }}>Solde Collecté</span>
                    <p className="caisse-sum" style={{ margin: 0 }}>{formaterDevise(total)}</p>
                  </div>

                  <div className="caisse-meta">
                    <span>Resp : {c.responsable}</span>
                    <span>Création : {new Date(c.dateCreation).toLocaleDateString('fr-FR')}</span>
                  </div>

                  <button
                    onClick={() => setCaisseDetailId(c.id)}
                    className="btn-prim"
                    style={{ justifyContent: 'center', marginTop: '6px' }}
                  >
                    <Search className="h-3.5 w-3.5" />
                    <span>Détails & Versements</span>
                  </button>
                </div>
              );
            })
          )}
        </div>

        <PaginationFooter
          total={totalItems}
          page={pageCaisse}
          pageSize={taillePageCaisse}
          totalPages={totalPages}
          label="caisses"
          onPageChange={setPageCaisse}
          onPageSizeChange={(sz) => { setTaillePageCaisse(sz); setPageCaisse(1); }}
        />

        {/* MODALE DE CRÉATION DE CAISSE */}
        <AnimatePresence>
          {showCreerModal && (
            <div className="modal-overlay" onClick={() => setShowCreerModal(false)}>
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="modal"
                style={{ maxWidth: '600px', width: '90%' }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="modal-title font-poppins font-bold">
                  Créer une Nouvelle Caisse de Cotisation
                </h3>

                {creerError && <div className="frm-alert err">{creerError}</div>}
                {creerSuccess && <div className="frm-alert ok">{creerSuccess}</div>}

                <form onSubmit={gererSoumissionCreation} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div className="frm-grid" style={{ gap: '12px' }}>
                    <div className="frm-grp frm-span2">
                      <label className="frm-lbl">Nom de la caisse *</label>
                      <input
                        type="text"
                        value={creerNom}
                        onChange={(e) => setCreerNom(e.target.value)}
                        placeholder="Ex: Construction Temple, Dîmes..."
                        className="frm-inp"
                        required
                      />
                    </div>

                    <div className="frm-grp">
                      <label className="frm-lbl">Code Identifiant</label>
                      <input
                        type="text"
                        value={creerCode}
                        onChange={(e) => setCreerCode(e.target.value)}
                        placeholder="Ex: CST-TMP"
                        className="frm-inp"
                        style={{ textTransform: 'uppercase' }}
                      />
                    </div>

                    <div className="frm-grp">
                      <label className="frm-lbl">Catégorie</label>
                      <select
                        value={creerCategorie}
                        onChange={(e) => setCreerCategorie(e.target.value)}
                        className="frm-inp"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="frm-grp">
                      <label className="frm-lbl">Objectif Financier (FCFA)</label>
                      <input
                        type="number"
                        value={creerObjectif}
                        onChange={(e) => setCreerObjectif(e.target.value)}
                        placeholder="ex: 15000000"
                        className="frm-inp"
                      />
                    </div>

                    <div className="frm-grp">
                      <label className="frm-lbl">Responsable de Caisse</label>
                      <select
                        value={creerResponsable}
                        onChange={(e) => setCreerResponsable(e.target.value)}
                        className="frm-inp"
                      >
                        <option value="">-- Choisir le responsable --</option>
                        {responsablesOptions.map((resp) => (
                          <option key={resp} value={resp}>{resp}</option>
                        ))}
                      </select>
                    </div>

                    <div className="frm-grp frm-span2">
                      <label className="frm-lbl">Description / But</label>
                      <textarea
                        value={creerDesc}
                        onChange={(e) => setCreerDesc(e.target.value)}
                        placeholder="Buts et finalités des cotisations..."
                        className="frm-inp frm-textarea"
                        style={{ height: '80px' }}
                      />
                    </div>
                  </div>

                  <div className="modal-actions">
                    <button type="button" onClick={() => setShowCreerModal(false)} className="btn-sec">Annuler</button>
                    <button type="submit" className="btn-prim">Créer la caisse</button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // VUE DÉTAILLÉE D'UNE CAISSE SPECIFIQUE
  if (!caisseActive) return null;

  const soldeActuel = calculerTotalCaisse(caisseActive);
  const objectif = caisseActive.objectif || 0;
  const progressPourcent = objectif > 0 ? Math.min(100, Math.round((soldeActuel / objectif) * 100)) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Barre d'outils detail */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => setCaisseDetailId(null)} className="btn-sec">
          <ArrowLeft className="h-4 w-4" />
          <span>Retour aux caisses</span>
        </button>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => {
              setMembreCotisant('');
              setMontantCotise('');
              setCommentaireCotise('');
              setCotiseError('');
              setCotiseSuccess('');
              setShowEnregistrerModal(true);
            }}
            className="btn-prim"
          >
            <Plus className="h-4 w-4" />
            <span>Enregistrer un versement</span>
          </button>
          <button
            onClick={() => {
              setModifNom(caisseActive.nom);
              setModifCode(caisseActive.code || '');
              setModifResponsable(caisseActive.responsable || '');
              setModifObjectif(caisseActive.objectif ? caisseActive.objectif.toString() : '');
              setModifCategorie(caisseActive.categorie || 'Général');
              setModifDesc(caisseActive.description || '');
              setModifError('');
              setModifSuccess('');
              setShowModifierModal(true);
            }}
            className="btn-sec"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>Modifier la caisse</span>
          </button>
          <button
            onClick={() => setCaisseAArchiver(caisseActive)}
            className="btn-sec"
            style={{ borderColor: 'var(--color-warning)', color: 'var(--color-warning)' }}
          >
            <Archive className="h-3.5 w-3.5" />
            <span>Archiver</span>
          </button>
        </div>
      </div>

      {/* Fiche Technique Detail */}
      <div className="dtl-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
          <div className="ava-sm" style={{ width: '48px', height: '48px', fontSize: '16px' }}>
            <Folder className="h-5 w-5" />
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '750', color: 'var(--color-dark)', margin: 0 }}>
              {caisseActive.nom}
            </h2>
            <p style={{ fontSize: '11px', color: 'var(--color-dark-muted)', margin: '2px 0 0' }}>Code caisse : {caisseActive.code}</p>
          </div>
        </div>

        <div className="dtl-grid">
          <div className="dtl-row">
            <span className="dtl-lbl">Catégorie</span>
            <span className="dtl-val" style={{ fontWeight: '700' }}>{caisseActive.categorie}</span>
          </div>
          <div className="dtl-row">
            <span className="dtl-lbl">Responsable de Caisse</span>
            <span className="dtl-val">{caisseActive.responsable}</span>
          </div>
          <div className="dtl-row">
            <span className="dtl-lbl">Solde Encaissé</span>
            <span className="dtl-val" style={{ fontSize: '20px', fontWeight: '800', color: 'var(--color-success)' }}>{formaterDevise(soldeActuel)}</span>
          </div>
          <div className="dtl-row">
            <span className="dtl-lbl">Objectif Financier</span>
            <span className="dtl-val" style={{ fontSize: '20px', fontWeight: '800', color: 'var(--color-primary)' }}>
              {objectif > 0 ? formaterDevise(objectif) : 'Aucun objectif'}
            </span>
          </div>
        </div>

        {caisseActive.description && (
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
            <span className="dtl-lbl">Description / Finalité</span>
            <p style={{ fontSize: '13px', color: 'var(--color-dark-muted)', lineHeight: '1.5', marginTop: '6px' }}>{caisseActive.description}</p>
          </div>
        )}

        {/* Progression Objectif */}
        {caisseActive.objectif > 0 && (
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px' }} className="dtl-row">
            <span className="dtl-lbl">Progression Objectif ({formaterDevise(objectif)})</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
              <div className="prog-track" style={{ flex: 1, height: '10px', margin: 0 }}>
                <span className="prog-fill full" style={{ width: `${progressPourcent}%`, height: '100%' }} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-dark)', minWidth: '36px', textAlign: 'right' }}>
                {progressPourcent}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Tableau des Fidèles Donateurs - Bien grand, pleine largeur */}
      <div className="tbl-card">
        <div className="flt-bar">
          <div className="flt-left">
            <span style={{ fontSize: '15px', fontWeight: '750', color: 'var(--color-dark)' }}>Fidèles Donateurs & Flux des Versements</span>
            <div className="s-wrap">
              <Search className="s-ico h-4.5 w-4.5" />
              <input
                type="text"
                placeholder="Filtrer par donateur..."
                value={rechercheCotisant}
                onChange={(e) => { setRechercheCotisant(e.target.value); setPageCaisseTx(1); }}
              />
            </div>
          </div>
          <div className="flt-right">
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-dark-muted)' }}>
              Total : {totalTxs} transactions
            </span>
          </div>
        </div>

        <div className="tbl-scroll">
          <table className="tbl">
            <thead>
              <tr>
                <th>Donateur</th>
                <th>Téléphone</th>
                <th>Date</th>
                <th>Montant</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {txsPaginees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="empty-td">
                    Aucun versement enregistré correspondant aux filtres.
                  </td>
                </tr>
              ) : (
                txsPaginees.map((tx) => (
                  <tr key={tx.id}>
                    <td>
                      <div className="user-cell">
                        <div className="ava-sm">
                          {obtenirNomMembre(tx.idMembre).split(' ').map(n=>n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="user-name">{obtenirNomMembre(tx.idMembre)}</p>
                          <p className="user-sub">Ref: {tx.idMembre}</p>
                        </div>
                      </div>
                    </td>
                    <td className="col-muted">{obtenirTelephoneMembre(tx.idMembre)}</td>
                    <td className="col-muted">
                      {formaterDate(tx.date)}
                    </td>
                    <td className="fw700" style={{ color: 'var(--color-primary)' }}>
                      {formaterDevise(tx.montant)}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => {
                          setTxAModifier(tx);
                          setNouveauMontantModif(tx.montant.toString());
                          setEditError('');
                          setEditSuccess('');
                        }}
                        className="btn-edit"
                        title="Modifier"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        <span>Ajuster</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <PaginationFooter
          total={totalTxs}
          page={pageCaisseTx}
          pageSize={taillePageCaisseTx}
          totalPages={totalPagesTxs}
          label="transactions"
          onPageChange={setPageCaisseTx}
          onPageSizeChange={(sz) => { setTaillePageCaisseTx(sz); setPageCaisseTx(1); }}
        />
      </div>

      {/* MODALE D'ENREGISTREMENT D'UN VERSEMENT */}
      <AnimatePresence>
        {showEnregistrerModal && (
          <div className="modal-overlay" onClick={() => setShowEnregistrerModal(false)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="modal"
              style={{ maxWidth: '560px', width: '90%' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="modal-title font-poppins font-bold">
                Enregistrer un versement dans la caisse
              </h3>

              {cotiseError && <div className="frm-alert err">{cotiseError}</div>}
              {cotiseSuccess && <div className="frm-alert ok">{cotiseSuccess}</div>}

              <form onSubmit={gererEnregistrerCotisation} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="frm-grid" style={{ gap: '12px' }}>
                  <div className="frm-grp frm-span2">
                    <label className="frm-lbl">Sélectionner le fidèle *</label>
                    <select
                      value={membreCotisant}
                      onChange={(e) => setMembreCotisant(e.target.value)}
                      className="frm-inp"
                      required
                    >
                      <option value="">-- Choisir le cotisant --</option>
                      {membres.map((m) => (
                        <option key={m.id} value={m.id}>{m.prenom} {m.nom} ({m.telephone})</option>
                      ))}
                    </select>
                  </div>

                  <div className="frm-grp frm-span2">
                    <label className="frm-lbl">Montant versé (FCFA) *</label>
                    <input
                      type="number"
                      value={montantCotise}
                      onChange={(e) => setMontantCotise(e.target.value)}
                      placeholder="Ex: 25000"
                      className="frm-inp"
                      min="1"
                      required
                    />
                  </div>

                  <div className="frm-grp frm-span2">
                    <label className="frm-lbl">Commentaire / Notes</label>
                    <input
                      type="text"
                      value={commentaireCotise}
                      onChange={(e) => setCommentaireCotise(e.target.value)}
                      placeholder="Ex: Cotisation mensuelle..."
                      className="frm-inp"
                    />
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={() => setShowEnregistrerModal(false)} className="btn-sec">Annuler</button>
                  <button type="submit" className="btn-prim">Valider le versement</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODALE DE MODIFICATION DE CAISSE */}
      <AnimatePresence>
        {showModifierModal && (
          <div className="modal-overlay" onClick={() => setShowModifierModal(false)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="modal"
              style={{ maxWidth: '600px', width: '90%' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="modal-title font-poppins font-bold">
                Modifier la Caisse
              </h3>

              {modifError && <div className="frm-alert err">{modifError}</div>}
              {modifSuccess && <div className="frm-alert ok">{modifSuccess}</div>}

              <form onSubmit={gererSoumissionModification} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="frm-grid" style={{ gap: '12px' }}>
                  <div className="frm-grp frm-span2">
                    <label className="frm-lbl">Nom de la caisse *</label>
                    <input
                      type="text"
                      value={modifNom}
                      onChange={(e) => setModifNom(e.target.value)}
                      className="frm-inp"
                      required
                    />
                  </div>

                  <div className="frm-grp">
                    <label className="frm-lbl">Code Identifiant</label>
                    <input
                      type="text"
                      value={modifCode}
                      onChange={(e) => setModifCode(e.target.value)}
                      className="frm-inp"
                      style={{ textTransform: 'uppercase' }}
                    />
                  </div>

                  <div className="frm-grp">
                    <label className="frm-lbl">Catégorie</label>
                    <select
                      value={modifCategorie}
                      onChange={(e) => setModifCategorie(e.target.value)}
                      className="frm-inp"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="frm-grp">
                    <label className="frm-lbl">Objectif Financier (FCFA)</label>
                    <input
                      type="number"
                      value={modifObjectif}
                      onChange={(e) => setModifObjectif(e.target.value)}
                      className="frm-inp"
                    />
                  </div>

                  <div className="frm-grp">
                    <label className="frm-lbl">Responsable de Caisse</label>
                    <select
                      value={modifResponsable}
                      onChange={(e) => setModifResponsable(e.target.value)}
                      className="frm-inp"
                    >
                      <option value="">-- Choisir le responsable --</option>
                      {responsablesOptions.map((resp) => (
                        <option key={resp} value={resp}>{resp}</option>
                      ))}
                    </select>
                  </div>

                  <div className="frm-grp frm-span2">
                    <label className="frm-lbl">Description / But</label>
                    <textarea
                      value={modifDesc}
                      onChange={(e) => setModifDesc(e.target.value)}
                      className="frm-inp frm-textarea"
                      style={{ height: '80px' }}
                    />
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={() => setShowModifierModal(false)} className="btn-sec">Annuler</button>
                  <button type="submit" className="btn-prim">Enregistrer</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODALE D'ARCHIVAGE */}
      <AnimatePresence>
        {caisseAArchiver && (
          <div className="modal-overlay" onClick={() => setCaisseAArchiver(null)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="modal"
              style={{ textAlign: 'center' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-warning-light)', color: 'var(--color-warning)', margin: '0 auto 14px' }}>
                <AlertCircle className="h-6 w-6" />
              </div>
              <h3 className="modal-title font-poppins font-bold" style={{ textAlign: 'center', marginBottom: '6px' }}>Archiver la caisse ?</h3>
              <p style={{ fontSize: '13px', color: 'var(--color-dark-muted)', marginBottom: '22px', lineHeight: '1.45' }}>
                Archiver <strong>"{caisseAArchiver.nom}"</strong> la rendra invisible dans les choix de versement direct, mais préservera ses bilans.
              </p>
              <div className="modal-actions" style={{ justifyContent: 'center' }}>
                <button onClick={() => setCaisseAArchiver(null)} className="btn-sec">Annuler</button>
                <button onClick={executerArchivage} className="btn-prim" style={{ background: 'var(--color-warning)' }}>Archiver</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODALE DE MODIFICATION DE TRANSACTION */}
      <AnimatePresence>
        {txAModifier && (
          <div className="modal-overlay" onClick={() => setTxAModifier(null)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="modal-title">Modifier le Versement (Traçabilité)</h3>

              {editError && <div className="frm-alert err">{editError}</div>}
              {editSuccess && <div className="frm-alert ok">{editSuccess}</div>}

              <form onSubmit={gererSoumissionModifTx} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="frm-grid" style={{ gap: '12px' }}>
                  <div className="frm-grp frm-span2">
                    <span className="frm-lbl">Fidèle</span>
                    <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-dark)', margin: 0 }}>{obtenirNomMembre(txAModifier.idMembre)}</p>
                  </div>

                  <div className="frm-grp frm-span2">
                    <label className="frm-lbl">Montant du versement (FCFA) *</label>
                    <input
                      type="number"
                      value={nouveauMontantModif}
                      onChange={(e) => setNouveauMontantModif(e.target.value)}
                      className="frm-inp"
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '10px' }}>
                  <span className="frm-lbl" style={{ display: 'block', marginBottom: '6px' }}>Historique des corrections</span>
                  {txAModifier.modifications && txAModifier.modifications.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '100px', overflowY: 'auto' }} className="no-scrollbar">
                      {txAModifier.modifications.map((m: any, index: number) => (
                        <div key={index} style={{ fontSize: '11px', color: 'var(--color-dark-muted)', background: 'var(--color-bg-main)', padding: '6px 8px', borderRadius: '4px', borderLeft: '3px solid var(--color-warning)' }}>
                          Ajusté le : {new Date(m.date).toLocaleString('fr-FR')}<br />
                          Montant : {formaterDevise(m.ancienMontant)} &rarr; {formaterDevise(m.nouveauMontant)}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span style={{ fontSize: '12px', color: 'var(--color-dark-muted)', fontStyle: 'italic' }}>Aucune correction enregistrée.</span>
                  )}
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={() => setTxAModifier(null)} className="btn-sec">Annuler</button>
                  <button type="submit" className="btn-prim">Enregistrer</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Caisses;
