import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Search, Plus, Edit2, Trash2, Save, User, ArrowLeft, Coins } from 'lucide-react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import membreService from '../../services/membreService';
import caisseService from '../../services/caisseService';
import cotisationService from '../../services/cotisationService';
import statutService from '../../services/statutService';
import type { Membre } from '../../types/models';
import { calculerTotalCaisse, obtenirCotisationsMembre, obtenirSoldeMembreParCaisse } from '../../lib/caisseUtils';
import { formaterDate, formaterTelephone, formaterDevise } from '../../utils/formateur';
import PaginationFooter from '../../components/UI/PaginationFooter';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

// Schéma de validation Zod pour l'ajout/modification de membre
const schemaMembre = zod.object({
  nom: zod.string().min(2, 'Le nom doit comporter au moins 2 lettres'),
  prenom: zod.string().min(2, 'Le prénom doit comporter au moins 2 lettres'),
  telephone: zod.string().min(8, 'Le numéro de téléphone doit comporter au moins 8 chiffres'),
  email: zod.string().email('Adresse e-mail invalide'),
  statut: zod.string().min(1, 'Le statut est obligatoire'),
});

type FormMembreInput = zod.infer<typeof schemaMembre>;

export const Membres: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: caisses = [] } = useQuery({ queryKey: ['caisses'], queryFn: caisseService.recupererCaisses });
  const { data: transactions = [] } = useQuery({ queryKey: ['transactions'], queryFn: cotisationService.recupererTransactions });
  const { data: statuts = [] } = useQuery({ queryKey: ['statuts'], queryFn: statutService.recupererStatuts });

  const invalidateCaisses = () => {
    queryClient.invalidateQueries({ queryKey: ['caisses'] });
    queryClient.invalidateQueries({ queryKey: ['transactions'] });
  };
  const enregistrerCotisationMutation = useMutation({
    mutationFn: (vars: Parameters<typeof cotisationService.enregistrerCotisation>) =>
      cotisationService.enregistrerCotisation(...vars),
    onSuccess: invalidateCaisses,
  });
  const modifierCotisationMutation = useMutation({
    mutationFn: (vars: { idTx: string; montant: number }) => cotisationService.modifierCotisation(vars.idTx, vars.montant),
    onSuccess: invalidateCaisses,
  });

  // États pour l'annuaire
  const [membres, setMembres] = useState<Membre[]>([]);
  const [recherche, setRecherche] = useState('');
  const [enChargement, setEnChargement] = useState(false);
  const [modaleOuverte, setModaleOuverte] = useState(false);
  const [membreEnModification, setMembreEnModification] = useState<Membre | null>(null);

  // État pour la fiche individuelle du fidèle (Vue Détail)
  const [membreDetailId, setMembreDetailId] = useState<string | null>(null);

  // États pour versement direct (dans la fiche détail)
  const [caisseCible, setCaisseCible] = useState('');
  const [montantDirect, setMontantDirect] = useState('');
  const [directError, setDirectError] = useState('');
  const [directSuccess, setDirectSuccess] = useState('');
  const [pageTxMembre, setPageTxMembre] = useState(1);
  const [taillePageTxMembre, setTaillePageTxMembre] = useState(5);

  // États pour la modification d'un versement (traçabilité)
  const [txAModifier, setTxAModifier] = useState<any>(null);
  const [nouveauMontantModif, setNouveauMontantModif] = useState('');
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormMembreInput>({
    resolver: zodResolver(schemaMembre),
  });

  const chargerMembres = async () => {
    setEnChargement(true);
    try {
      const data = await membreService.recupererMembres();
      setMembres(data);
    } catch (e) {
      console.error(e);
    } finally {
      setEnChargement(false);
    }
  };

  useEffect(() => {
    chargerMembres();
  }, []);

  // Réinitialiser les erreurs lors du changement de fiche
  useEffect(() => {
    setDirectError('');
    setDirectSuccess('');
    setCaisseCible('');
    setMontantDirect('');
    setTxAModifier(null);
    setNouveauMontantModif('');
    setEditError('');
    setEditSuccess('');
  }, [membreDetailId]);

  const ouvrirAjout = () => {
    setMembreEnModification(null);
    reset({
      nom: '',
      prenom: '',
      telephone: '',
      email: '',
      statut: statuts[0]?.nom || 'Fidèle',
    });
    setModaleOuverte(true);
  };

  const ouvrirModification = (membre: Membre) => {
    setMembreEnModification(membre);
    setValue('nom', membre.nom);
    setValue('prenom', membre.prenom);
    setValue('telephone', membre.telephone);
    setValue('email', membre.email);
    setValue('statut', membre.statut);
    setModaleOuverte(true);
  };

  const handleSupprimer = async (id: string) => {
    if (window.confirm('Voulez-vous vraiment retirer ce fidèle de la base de données ?')) {
      try {
        await membreService.supprimerMembre(id);
        if (membreDetailId === id) {
          setMembreDetailId(null);
        }
        chargerMembres();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const onSubmit = async (donnees: FormMembreInput) => {
    try {
      if (membreEnModification) {
        await membreService.modifierMembre(membreEnModification.id, donnees);
      } else {
        await membreService.creerMembre(donnees);
      }
      setModaleOuverte(false);
      chargerMembres();
    } catch (e) {
      console.error(e);
    }
  };

  // Filtrage liste globale
  const membresFiltrés = membres.filter((m) =>
    `${m.nom} ${m.prenom}`.toLowerCase().includes(recherche.toLowerCase()) ||
    m.telephone.includes(recherche) ||
    m.email.toLowerCase().includes(recherche.toLowerCase()) ||
    m.statut.toLowerCase().includes(recherche.toLowerCase())
  );

  // Fiche active
  const membreActuel = membres.find(m => m.id === membreDetailId);

  // Calculs pour la fiche individuelle
  let cotisationsParCaisse: ReturnType<typeof obtenirSoldeMembreParCaisse> = [];
  let historiqueTransactions: typeof transactions = [];
  if (membreActuel) {
    cotisationsParCaisse = obtenirSoldeMembreParCaisse(caisses, membreActuel.id);
    historiqueTransactions = obtenirCotisationsMembre(transactions, membreActuel.id);
  }

  const totalCotiseParMembre = cotisationsParCaisse.reduce((sum, item) => sum + item.montant, 0);
  const caissesActives = caisses.filter(c => !c.archivee);

  // Pagination pour les transactions individuelles
  const totalTxs = historiqueTransactions.length;
  const totalPagesTxs = Math.ceil(totalTxs / taillePageTxMembre) || 1;
  const indexDernierTx = pageTxMembre * taillePageTxMembre;
  const indexPremierTx = indexDernierTx - taillePageTxMembre;
  const txsPaginees = historiqueTransactions.slice(indexPremierTx, indexDernierTx);

  const obtenirNomCaisse = (idCaisse: string) => {
    const c = caisses.find((x) => x.id === idCaisse);
    return c ? c.nom : 'Caisse inconnue';
  };

  // Gérer versement direct
  const gererCotisationDirecte = (e: React.FormEvent) => {
    e.preventDefault();
    setDirectError('');
    setDirectSuccess('');

    if (!caisseCible) {
      setDirectError('Veuillez sélectionner la caisse d\'affectation.');
      return;
    }
    const valMontant = Number(montantDirect);
    if (isNaN(valMontant) || valMontant <= 0) {
      setDirectError('Veuillez saisir un montant supérieur à 0.');
      return;
    }

    const caisseActive = caisses.find(c => c.id === caisseCible);
    const soldeActuel = calculerTotalCaisse(caisseActive);
    const objectif = caisseActive?.objectif || 0;
    if (objectif > 0) {
      const reste = objectif - soldeActuel;
      if (reste <= 0) {
        setDirectError("L'objectif de cette caisse est déjà atteint. Aucun versement supplémentaire n'est autorisé.");
        return;
      }
      if (valMontant > reste) {
        setDirectError(`Ce versement dépasse l'objectif de la caisse. Le montant maximum autorisé est de ${formaterDevise(reste)}.`);
        return;
      }
    }

    if (membreDetailId) {
      enregistrerCotisationMutation.mutate([caisseCible, membreDetailId, valMontant, ''], {
        onSuccess: () => {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#1B4F8A', '#2563EB', '#2E9E6B']
          });

          setDirectSuccess(`Versement de ${formaterDevise(valMontant)} enregistré avec succès !`);
          setMontantDirect('');
          setCaisseCible('');
          setTimeout(() => setDirectSuccess(''), 3000);
        },
        onError: (err: any) => setDirectError(err.message || 'Erreur de versement'),
      });
    }
  };

  // Gérer modification versement
  const gererSoumissionModifTx = (e: React.FormEvent) => {
    e.preventDefault();
    setEditError('');
    setEditSuccess('');

    const valMontant = Number(nouveauMontantModif);
    if (isNaN(valMontant) || valMontant <= 0) {
      setEditError('Veuillez saisir un montant valide.');
      return;
    }

    const caisse = caisses.find(c => c.id === txAModifier.idCaisse);
    if (caisse && caisse.objectif > 0) {
      const soldeActuel = calculerTotalCaisse(caisse);
      const resteAutorise = caisse.objectif - (soldeActuel - txAModifier.montant);
      if (valMontant > resteAutorise) {
        setEditError(`Ce montant dépasse l'objectif de la caisse. Le montant maximum autorisé est de ${formaterDevise(resteAutorise)}.`);
        return;
      }
    }

    modifierCotisationMutation.mutate({ idTx: txAModifier.id, montant: valMontant }, {
      onSuccess: () => {
        setEditSuccess('Le versement a été modifié.');
        setTimeout(() => {
          setTxAModifier(null);
        }, 1000);
      },
      onError: (err: any) => setEditError(err.message || 'Erreur de versement'),
    });
  };

  // RENDER FICHE DÉTAILLÉE D'UN MEMBRE (Fiche Individuelle)
  if (membreDetailId && membreActuel) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Barre d'outils et de retour */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => setMembreDetailId(null)} className="btn-sec">
            <ArrowLeft className="h-4 w-4" />
            <span>Retour à la liste</span>
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => ouvrirModification(membreActuel)} className="btn-prim">
              <Edit2 className="h-3.5 w-3.5" />
              <span>Modifier Coordonnées</span>
            </button>
            <button onClick={() => handleSupprimer(membreActuel.id)} className="btn-del">
              <Trash2 className="h-3.5 w-3.5" />
              <span>Retirer la fiche</span>
            </button>
          </div>
        </div>

        {/* Fiche Technique du Fidèle */}
        <div className="dtl-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
            <div className="ava-sm" style={{ width: '48px', height: '48px', fontSize: '16px' }}>
              {membreActuel.prenom.charAt(0)}{membreActuel.nom.charAt(0)}
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '750', color: 'var(--color-dark)', margin: 0 }}>
                {membreActuel.prenom} {membreActuel.nom}
              </h2>
              <p style={{ fontSize: '11px', color: 'var(--color-dark-muted)', margin: '2px 0 0' }}>ID Fidèle : {membreActuel.id}</p>
            </div>
          </div>

          <div className="dtl-grid">
            <div className="dtl-row">
              <span className="dtl-lbl">Adresse E-mail</span>
              <span className="dtl-val" style={{ fontWeight: '700' }}>{membreActuel.email}</span>
            </div>
            <div className="dtl-row">
              <span className="dtl-lbl">Numéro de Téléphone</span>
              <span className="dtl-val" style={{ fontWeight: '700' }}>{formaterTelephone(membreActuel.telephone)}</span>
            </div>
            <div className="dtl-row">
              <span className="dtl-lbl">Date d'Inscription</span>
              <span className="dtl-val">{formaterDate(membreActuel.dateInscription)}</span>
            </div>
            <div className="dtl-row">
              <span className="dtl-lbl">Rôle / Statut Paroisse</span>
              <div>
                <span className="badge badge-confirmed">
                  {membreActuel.statut}
                </span>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span className="dtl-lbl">Cumul Global des Cotisations</span>
            <div style={{ fontSize: '28px', fontWeight: '850', color: 'var(--color-success)' }}>
              {formaterDevise(totalCotiseParMembre)}
            </div>
          </div>
        </div>

        {/* Grille : Bilans des caisses + Enregistrement direct */}
        <div className="dtl-grid" style={{ gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
          
          {/* Liste des cotisations accumulées */}
          <div className="tbl-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="frm-section" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Coins className="h-4.5 w-4.5 text-[#1B4F8A]" />
              <span>Bilan de ses Cotisations par Caisse</span>
            </div>

            {cotisationsParCaisse.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--color-dark-muted)', fontSize: '13px', fontStyle: 'italic' }}>
                Ce fidèle n'a encore enregistré aucun versement dans aucune caisse.
              </p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {cotisationsParCaisse.map((item) => (
                  <div 
                    key={item.idCaisse} 
                    className="dtl-card" 
                    style={{ padding: '14px', background: 'var(--color-bg-input)', border: '1px solid var(--color-border)', opacity: item.archivee ? 0.6 : 1 }}
                  >
                    <span className="dtl-lbl" style={{ fontSize: '10px' }}>
                      {item.nomCaisse} {item.archivee && '(Archivée)'}
                    </span>
                    <p style={{ fontSize: '16px', fontWeight: '750', color: 'var(--color-dark)', margin: '8px 0 0' }}>
                      {formaterDevise(item.montant)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Formulaire versement direct */}
          <div className="frm-card" style={{ height: 'fit-content' }}>
            <div className="frm-section">Ajouter un versement</div>

            {directError && <div className="frm-alert err">{directError}</div>}
            {directSuccess && <div className="frm-alert ok">{directSuccess}</div>}

            <form onSubmit={gererCotisationDirecte} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="frm-grp">
                <label className="frm-lbl">Caisse d'affectation *</label>
                <select
                  value={caisseCible}
                  onChange={(e) => setCaisseCible(e.target.value)}
                  className="frm-inp"
                >
                  <option value="">-- Choisir la caisse --</option>
                  {caissesActives.map((c) => (
                    <option key={c.id} value={c.id}>{c.nom}</option>
                  ))}
                </select>
              </div>

              <div className="frm-grp">
                <label className="frm-lbl">Montant versé (FCFA) *</label>
                <input
                  type="number"
                  value={montantDirect}
                  onChange={(e) => setMontantDirect(e.target.value)}
                  placeholder="Ex: 10000"
                  className="frm-inp"
                  min="1"
                />
              </div>

              <button type="submit" className="btn-prim" style={{ justifyContent: 'center' }}>
                <Plus className="h-4 w-4" />
                <span>Valider le versement</span>
              </button>
            </form>
          </div>
        </div>

        {/* Historique individuel des transactions */}
        <div className="tbl-card">
          <div className="flt-bar" style={{ background: 'var(--color-bg-main)', borderBottom: '1px solid var(--color-border)' }}>
            <div className="flt-left">
              <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-dark)' }}>Historique Individuel des Versements</span>
            </div>
          </div>

          <div className="tbl-scroll">
            <table className="tbl">
              <thead>
                <tr>
                  <th style={{ width: '44px' }}>#</th>
                  <th>Caisse</th>
                  <th>Montant</th>
                  <th>Date / Heure</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {txsPaginees.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="empty-td">
                      Aucun versement historique.
                    </td>
                  </tr>
                ) : (
                  txsPaginees.map((tx, idx) => (
                    <tr key={tx.id}>
                      <td className="col-num">{indexPremierTx + idx + 1}</td>
                      <td>
                        <span className="fw700">{obtenirNomCaisse(tx.idCaisse)}</span>
                      </td>
                      <td className="fw700" style={{ color: 'var(--color-primary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>{formaterDevise(tx.montant)}</span>
                          {tx.modifications && tx.modifications.length > 0 && (
                            <span style={{ fontSize: '10px', color: 'var(--color-warning)', fontWeight: 'normal' }}>
                              (Corrigé)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="col-muted">{formaterDate(tx.date)}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => {
                            setTxAModifier(tx);
                            setNouveauMontantModif(tx.montant.toString());
                            setEditError('');
                            setEditSuccess('');
                          }}
                          className="btn-edit"
                          title="Corriger"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
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
            page={pageTxMembre}
            pageSize={taillePageTxMembre}
            totalPages={totalPagesTxs}
            label="transactions"
            onPageChange={setPageTxMembre}
            onPageSizeChange={(sz) => { setTaillePageTxMembre(sz); setPageTxMembre(1); }}
          />
        </div>

        {/* MODALE DE CORRECTION VERSEMENT */}
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
                <h3 className="modal-title">Ajuster le versement</h3>

                {editError && <div className="frm-alert err">{editError}</div>}
                {editSuccess && <div className="frm-alert ok">{editSuccess}</div>}

                <form onSubmit={gererSoumissionModifTx} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div className="frm-grp">
                    <label className="frm-lbl">Caisse d'affectation</label>
                    <input
                      type="text"
                      value={obtenirNomCaisse(txAModifier.idCaisse)}
                      className="frm-inp"
                      disabled
                      style={{ opacity: 0.7 }}
                    />
                  </div>
                  <div className="frm-grp">
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

                  <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '10px' }}>
                    <label className="frm-lbl" style={{ display: 'block', marginBottom: '6px' }}>Historique des corrections</label>
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
  }

  // RENDER LISTE GLOBALE DE L'ANNUAIRE
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* HEADER ACTIONS */}
      <div className="flt-bar" style={{ background: 'var(--color-bg-card)', borderRadius: 'var(--radius-md)', padding: '16px 20px', boxShadow: 'var(--shadow-sm)' }}>
        <div className="flt-left">
          <div className="s-wrap">
            <Search className="s-ico h-4.5 w-4.5" />
            <input
              type="text"
              placeholder="Rechercher fidèle..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
            />
          </div>
        </div>
        <div className="flt-right">
          <button onClick={ouvrirAjout} className="btn-prim">
            <Plus className="h-4 w-4" />
            <span>Inscrire un Fidèle</span>
          </button>
        </div>
      </div>

      {/* TABLEAU DES MEMBRES */}
      <div className="tbl-card">
        {enChargement ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B4F8A]" />
          </div>
        ) : (
          <div className="tbl-scroll">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Nom & Prénom</th>
                  <th>Téléphone / E-mail</th>
                  <th>Statut / Rôle</th>
                  <th>Date d'inscription</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {membresFiltrés.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="empty-td">
                      Aucun membre ne correspond à votre recherche.
                    </td>
                  </tr>
                ) : (
                  membresFiltrés.map((membre) => (
                    <tr key={membre.id}>
                      <td>
                        <div className="user-cell">
                          <div className="ava-sm">
                            {membre.nom.charAt(0)}{membre.prenom.charAt(0)}
                          </div>
                          <div>
                            <button
                              onClick={() => setMembreDetailId(membre.id)}
                              className="user-name"
                              style={{ border: 'none', background: 'transparent', padding: 0, color: 'var(--color-primary)', textDecoration: 'underline', textAlign: 'left' }}
                            >
                              {membre.nom} {membre.prenom}
                            </button>
                            <p className="user-sub">Ref: {membre.id}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontWeight: '700' }}>{formaterTelephone(membre.telephone)}</span>
                          <span style={{ fontSize: '11px', color: 'var(--color-dark-muted)' }}>{membre.email}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-confirmed">
                          {membre.statut}
                        </span>
                      </td>
                      <td className="col-muted">
                        {formaterDate(membre.dateInscription)}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="act-cell" style={{ justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => setMembreDetailId(membre.id)}
                            className="btn-detail"
                            title="Fiche Profil & Bilan"
                          >
                            <User className="h-3.5 w-3.5" />
                            <span>Bilan</span>
                          </button>
                          <button
                            onClick={() => ouvrirModification(membre)}
                            className="btn-edit"
                            title="Modifier"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleSupprimer(membre.id)}
                            className="btn-del"
                            title="Retirer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODALE CRUD AJOUT/MODIFICATION MEMBRE */}
      <AnimatePresence>
        {modaleOuverte && (
          <div className="modal-overlay" onClick={() => setModaleOuverte(false)}>
            <div className="modal" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
              <h3 className="modal-title">
                {membreEnModification ? 'Modifier la Fiche du Fidèle' : 'Inscrire un Nouveau Fidèle'}
              </h3>

              <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="frm-grid" style={{ gap: '12px' }}>
                  <div className="frm-grp">
                    <label className="frm-lbl">Nom *</label>
                    <input
                      type="text"
                      {...register('nom')}
                      className="frm-inp"
                    />
                    {errors.nom && <span style={{ fontSize: '10px', color: 'var(--color-danger)' }}>{errors.nom.message}</span>}
                  </div>

                  <div className="frm-grp">
                    <label className="frm-lbl">Prénom *</label>
                    <input
                      type="text"
                      {...register('prenom')}
                      className="frm-inp"
                    />
                    {errors.prenom && <span style={{ fontSize: '10px', color: 'var(--color-danger)' }}>{errors.prenom.message}</span>}
                  </div>

                  <div className="frm-grp">
                    <label className="frm-lbl">Téléphone *</label>
                    <input
                      type="text"
                      placeholder="ex: 0707894512"
                      {...register('telephone')}
                      className="frm-inp"
                    />
                    {errors.telephone && <span style={{ fontSize: '10px', color: 'var(--color-danger)' }}>{errors.telephone.message}</span>}
                  </div>

                  <div className="frm-grp">
                    <label className="frm-lbl">E-mail *</label>
                    <input
                      type="email"
                      {...register('email')}
                      className="frm-inp"
                    />
                    {errors.email && <span style={{ fontSize: '10px', color: 'var(--color-danger)' }}>{errors.email.message}</span>}
                  </div>
                </div>

                <div className="frm-grp">
                  <label className="frm-lbl">Rôle / Statut au sein du temple *</label>
                  <select
                    {...register('statut')}
                    className="frm-inp"
                  >
                    {statuts.map((s) => (
                      <option key={s.id} value={s.nom}>{s.nom}</option>
                    ))}
                  </select>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    onClick={() => setModaleOuverte(false)}
                    className="btn-sec"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="btn-prim"
                  >
                    <Save className="h-4 w-4" />
                    <span>Enregistrer</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Membres;
