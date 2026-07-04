import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Coins, 
  HeartHandshake, 
  TrendingUp, 
  CalendarDays, 
  Plus, 
  Folder, 
  Search, 
  Edit2, 
  Receipt
} from 'lucide-react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import caisseService from '../../services/caisseService';
import membreService from '../../services/membreService';
import cotisationService from '../../services/cotisationService';
import donService from '../../services/donService';
import priereService from '../../services/priereService';
import evenementService from '../../services/evenementService';
import { usePermissions } from '../../hooks/usePermissions';
import { calculerTotalCaisse, calculerTotalGeneral } from '../../lib/caisseUtils';
import { formaterDevise, formaterDate } from '../../utils/formateur';
import Link from 'next/link';
import PaginationFooter from '../../components/UI/PaginationFooter';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

export const TableauBord: React.FC = () => {
  const { peut } = usePermissions();
  const peutFinance = peut('CAISSES', 'VOIR');
  const peutPlateforme = peut('ACTUALITES', 'VOIR') || peut('SERMONS', 'VOIR') || peut('DONS', 'VOIR');

  // Vue active (uniquement affichable si l'utilisateur a les deux accès)
  const [vueActive, setVueActive] = useState<'finance' | 'plateforme'>(
    peutFinance && !peutPlateforme ? 'finance' : 'plateforme'
  );

  useEffect(() => {
    if (peutFinance && !peutPlateforme) {
      setVueActive('finance');
    } else if (!peutFinance && peutPlateforme) {
      setVueActive('plateforme');
    }
  }, [peutFinance, peutPlateforme]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Sélecteur de vue si les deux univers sont accessibles */}
      {peutFinance && peutPlateforme && (
        <div style={{ display: 'flex', background: 'rgba(27,79,138,0.06)', padding: '4px', borderRadius: '7px', width: 'fit-content', border: '1px solid var(--color-border)' }}>
          <button
            onClick={() => setVueActive('plateforme')}
            className="btn-sec"
            style={{ 
              border: 'none',
              padding: '6px 14px', 
              fontSize: '12px', 
              background: vueActive === 'plateforme' ? 'var(--color-primary)' : 'transparent',
              color: vueActive === 'plateforme' ? '#ffffff' : 'var(--color-dark-muted)'
            }}
          >
            Vue Plateforme (Contenus)
          </button>
          <button
            onClick={() => setVueActive('finance')}
            className="btn-sec"
            style={{ 
              border: 'none',
              padding: '6px 14px', 
              fontSize: '12px', 
              background: vueActive === 'finance' ? 'var(--color-primary)' : 'transparent',
              color: vueActive === 'finance' ? '#ffffff' : 'var(--color-dark-muted)'
            }}
          >
            Vue Trésorerie (Finances)
          </button>
        </div>
      )}

      {vueActive === 'finance' ? (
        <DashboardFinance />
      ) : (
        <DashboardPlateforme />
      )}
    </div>
  );
};

// ────────────────────────────────────────────────────────
// 1. DASHBOARD FINANCIER (Vue Trésorier)
// ────────────────────────────────────────────────────────
const DashboardFinance: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: caisses = [] } = useQuery({ queryKey: ['caisses'], queryFn: caisseService.recupererCaisses });
  const { data: membres = [] } = useQuery({ queryKey: ['membres'], queryFn: membreService.recupererMembres });
  const { data: transactions = [] } = useQuery({ queryKey: ['transactions'], queryFn: cotisationService.recupererTransactions });

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

  // États versement rapide
  const [membreSelectionne, setMembreSelectionne] = useState('');
  const [caisseSelectionnee, setCaisseSelectionnee] = useState('');
  const [montant, setMontant] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // États filtrage et pagination
  const [rechercheMembre, setRechercheMembre] = useState('');
  const [filtreCaisse, setFiltreCaisse] = useState('');
  const [pageTx, setPageTx] = useState(1);
  const [taillePageTx, setTaillePageTx] = useState(5);

  // États modification versement (traçabilité)
  const [txAModifier, setTxAModifier] = useState<any>(null);
  const [nouveauMontantModif, setNouveauMontantModif] = useState('');
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  // Statistiques financières
  const totalGeneral = calculerTotalGeneral(caisses);
  const nombreCaisses = caisses.filter(c => !c.archivee).length;
  const nombreMembres = membres.length;
  const derniereTx = transactions[0];
  const dernierMontant = derniereTx ? derniereTx.montant : 0;

  const obtenirInfosMembre = (idMembre: string) => {
    const m = membres.find((x) => x.id === idMembre);
    return m ? `${m.prenom} ${m.nom}` : 'Membre inconnu';
  };

  const obtenirNomCaisse = (idCaisse: string) => {
    const c = caisses.find((x) => x.id === idCaisse);
    return c ? c.nom : 'Caisse inconnue';
  };

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
        setEditSuccess('Le versement a été modifié avec succès.');
        setTimeout(() => {
          setTxAModifier(null);
        }, 1000);
      },
      onError: (err: any) => setEditError(err.message || 'Erreur de modification'),
    });
  };

  const gererSoumissionCotisation = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!membreSelectionne) {
      setFormError('Veuillez sélectionner un membre.');
      return;
    }
    if (!caisseSelectionnee) {
      setFormError('Veuillez sélectionner une caisse.');
      return;
    }
    const montantNum = Number(montant);
    if (isNaN(montantNum) || montantNum <= 0) {
      setFormError('Veuillez saisir un montant valide supérieur à 0.');
      return;
    }

    const caisseActive = caisses.find(c => c.id === caisseSelectionnee);
    const soldeActuel = calculerTotalCaisse(caisseActive);
    const objectif = caisseActive?.objectif || 0;
    if (objectif > 0) {
      const reste = objectif - soldeActuel;
      if (reste <= 0) {
        setFormError("L'objectif de cette caisse est déjà atteint. Aucun versement supplémentaire n'est autorisé.");
        return;
      }
      if (montantNum > reste) {
        setFormError(`Ce versement dépasse l'objectif de la caisse. Le montant maximum autorisé est de ${formaterDevise(reste)}.`);
        return;
      }
    }

    setIsSubmitting(true);
    enregistrerCotisationMutation.mutate([caisseSelectionnee, membreSelectionne, montantNum, ''], {
      onSuccess: () => {
        setIsSubmitting(false);
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#1B4F8A', '#2563EB', '#2E9E6B', '#E8A020']
        });

        setFormSuccess(`Versement de ${formaterDevise(montantNum)} enregistré !`);
        setMontant('');
        setMembreSelectionne('');
        setCaisseSelectionnee('');

        setTimeout(() => setFormSuccess(''), 3000);
      },
      onError: (err: any) => {
        setIsSubmitting(false);
        setFormError(err.message || "Erreur lors de l'enregistrement");
      },
    });
  };

  // Filtrer les transactions
  const txFiltrees = transactions.filter((tx) => {
    const nomFidele = obtenirInfosMembre(tx.idMembre).toLowerCase();
    const matchRecherche = nomFidele.includes(rechercheMembre.toLowerCase());
    const matchCaisse = filtreCaisse ? tx.idCaisse === filtreCaisse : true;
    return matchRecherche && matchCaisse;
  });

  const totalTxs = txFiltrees.length;
  const totalPages = Math.ceil(totalTxs / taillePageTx) || 1;

  useEffect(() => {
    if (pageTx > totalPages) {
      setPageTx(1);
    }
  }, [totalTxs, totalPages, pageTx]);

  const indexDernier = pageTx * taillePageTx;
  const indexPremier = indexDernier - taillePageTx;
  const txsPaginees = txFiltrees.slice(indexPremier, indexDernier);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* 4 Cards KPI Financiers */}
      <div className="kpi-strip">
        <div className="stat-card" style={{ '--acc': 'var(--color-success)' } as React.CSSProperties}>
          <div className="stat-ico" style={{ backgroundColor: 'var(--color-success-light)', color: 'var(--color-success)' }}>
            <Coins className="h-5 w-5" />
          </div>
          <div>
            <p className="stat-lbl">Total Général Encaissé</p>
            <p className="stat-val">{formaterDevise(totalGeneral)}</p>
            <p className="stat-sub">Cumulé de toutes les caisses</p>
          </div>
        </div>

        <div className="stat-card" style={{ '--acc': 'var(--color-primary)' } as React.CSSProperties}>
          <div className="stat-ico" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
            <Folder className="h-5 w-5" />
          </div>
          <div>
            <p className="stat-lbl">Caisses Actives</p>
            <p className="stat-val">{nombreCaisses}</p>
            <p className="stat-sub">Comptes affectés distincts</p>
          </div>
        </div>

        <div className="stat-card" style={{ '--acc': 'var(--color-accent)' } as React.CSSProperties}>
          <div className="stat-ico" style={{ backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)' }}>
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="stat-lbl">Fidèles Inscrits</p>
            <p className="stat-val">{nombreMembres}</p>
            <p className="stat-sub">Membres et cotisants actifs</p>
          </div>
        </div>

        <div className="stat-card" style={{ '--acc': 'var(--color-warning)' } as React.CSSProperties}>
          <div className="stat-ico" style={{ backgroundColor: 'var(--color-warning-light)', color: 'var(--color-warning)' }}>
            <Receipt className="h-5 w-5" />
          </div>
          <div>
            <p className="stat-lbl">Dernier Versement</p>
            <p className="stat-val">{formaterDevise(dernierMontant)}</p>
            <p className="stat-sub">
              {derniereTx ? obtenirInfosMembre(derniereTx.idMembre) : 'Aucun versement enregistré'}
            </p>
          </div>
        </div>
      </div>

      {/* Grille : Formulaire versement rapide + volumes caisses */}
      <div className="dtl-grid" style={{ gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
        
        {/* Formulaire versement rapide */}
        <div className="frm-card">
          <div className="frm-section">Enregistrer un Versement Rapide</div>

          {formError && <div className="frm-alert err">{formError}</div>}
          {formSuccess && <div className="frm-alert ok">{formSuccess}</div>}

          <form onSubmit={gererSoumissionCotisation} className="frm-grid" style={{ gap: '12px' }}>
            <div className="frm-grp">
              <label className="frm-lbl">Fidèle cotisant <span className="req">*</span></label>
              <select
                value={membreSelectionne}
                onChange={(e) => setMembreSelectionne(e.target.value)}
                className="frm-inp"
                disabled={isSubmitting}
              >
                <option value="">-- Choisir un fidèle --</option>
                {membres.map((m) => (
                  <option key={m.id} value={m.id}>{m.prenom} {m.nom} ({m.telephone})</option>
                ))}
              </select>
            </div>

            <div className="frm-grp">
              <label className="frm-lbl">Caisse d'affectation <span className="req">*</span></label>
              <select
                value={caisseSelectionnee}
                onChange={(e) => setCaisseSelectionnee(e.target.value)}
                className="frm-inp"
                disabled={isSubmitting}
              >
                <option value="">-- Choisir la caisse --</option>
                {caisses.filter(c => !c.archivee).map((c) => (
                  <option key={c.id} value={c.id}>{c.nom}</option>
                ))}
              </select>
            </div>

            <div className="frm-grp frm-span2">
              <label className="frm-lbl">Montant versé (FCFA) <span className="req">*</span></label>
              <input
                type="number"
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
                placeholder="Ex: 50000"
                className="frm-inp"
                disabled={isSubmitting}
                min="1"
              />
            </div>

            <div className="frm-span2" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-prim"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <span>{isSubmitting ? 'Enregistrement...' : 'Valider le Versement'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Volume des caisses */}
        <div className="dtl-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="frm-section">
            Volume par Caisse
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '200px', overflowY: 'auto' }} className="no-scrollbar">
            {caisses.map((caisse) => {
              const totalCaisse = calculerTotalCaisse(caisse);
              const pourcentage = totalGeneral > 0 ? (totalCaisse / totalGeneral) * 100 : 0;
              
              let barColorClass = 'full';
              if (pourcentage < 15) barColorClass = 'low';
              else if (pourcentage < 40) barColorClass = 'mid';
              else if (pourcentage < 75) barColorClass = 'high';

              return (
                <div key={caisse.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ fontWeight: '600', color: 'var(--color-dark)' }}>{caisse.nom}</span>
                    <span style={{ fontWeight: '700', color: 'var(--color-primary)' }}>{formaterDevise(totalCaisse)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="prog-track" style={{ flex: 1, margin: 0, height: '6px' }}>
                      <span className={`prog-fill ${barColorClass}`} style={{ width: `${pourcentage}%`, height: '105%' }} />
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-dark-muted)', width: '32px', textAlign: 'right' }}>
                      {Math.round(pourcentage)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tableau d'Historique Global */}
      <div className="tbl-card">
        {/* Barre de Filtres */}
        <div className="flt-bar">
          <div className="flt-left">
            <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--color-dark)' }}>Flux Financier Global</span>
            <div className="s-wrap">
              <Search className="s-ico h-4.5 w-4.5" />
              <input
                type="text"
                placeholder="Rechercher fidèle..."
                value={rechercheMembre}
                onChange={(e) => { setRechercheMembre(e.target.value); setPageTx(1); }}
              />
            </div>
            <select
              value={filtreCaisse}
              onChange={(e) => { setFiltreCaisse(e.target.value); setPageTx(1); }}
              className="flt-sel"
            >
              <option value="">Toutes les caisses</option>
              {caisses.map((c) => (
                <option key={c.id} value={c.id}>{c.nom}</option>
              ))}
            </select>
          </div>
          <div className="flt-right">
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-dark-muted)' }}>
              Total : {totalTxs} versements
            </span>
          </div>
        </div>

        {/* Tableau */}
        <div className="tbl-scroll">
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ width: '44px' }}>#</th>
                <th>Fidèle</th>
                <th>Caisse d'affectation</th>
                <th>Montant</th>
                <th>Date / Heure</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {txsPaginees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-td">
                    Aucun versement enregistré correspondant aux filtres.
                  </td>
                </tr>
              ) : (
                txsPaginees.map((tx, idx) => (
                  <tr key={tx.id}>
                    <td className="col-num">{indexPremier + idx + 1}</td>
                    <td>
                      <div className="user-cell">
                        <div className="ava-sm">
                          {obtenirInfosMembre(tx.idMembre).split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase()}
                        </div>
                        <div>
                          <p className="user-name">{obtenirInfosMembre(tx.idMembre)}</p>
                          <p className="user-sub">Ref: {tx.idMembre}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="bdg-code bg-slate-100 px-2.5 py-1 rounded">
                        {obtenirNomCaisse(tx.idCaisse)}
                      </span>
                    </td>
                    <td className="fw700" style={{ color: 'var(--color-primary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{formaterDevise(tx.montant)}</span>
                        {tx.modifications && tx.modifications.length > 0 && (
                          <span style={{ fontSize: '10px', color: 'var(--color-warning)', fontWeight: 'normal' }}>
                            (Ajusté)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="col-muted">
                      {formaterDate(tx.date)}
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
                        <span>Modifier</span>
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
          page={pageTx}
          pageSize={taillePageTx}
          totalPages={totalPages}
          label="transactions"
          onPageChange={setPageTx}
          onPageSizeChange={(sz) => { setTaillePageTx(sz); setPageTx(1); }}
        />
      </div>

      {/* MODALE DE MODIFICATION DE COTISATION */}
      <AnimatePresence>
        {txAModifier && (
          <div className="modal-overlay" onClick={() => setTxAModifier(null)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="modal-title">Modifier le Versement (Traçabilité)</h3>

              {editError && <div className="frm-alert err">{editError}</div>}
              {editSuccess && <div className="frm-alert ok">{editSuccess}</div>}

              <form onSubmit={gererSoumissionModifTx} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="frm-grp">
                  <label className="frm-lbl">Fidèle</label>
                  <input
                    type="text"
                    value={obtenirInfosMembre(txAModifier.idMembre)}
                    className="frm-inp"
                    disabled
                    style={{ opacity: 0.7 }}
                  />
                </div>
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
                  <label className="frm-lbl">Nouveau montant (FCFA) *</label>
                  <input
                    type="number"
                    value={nouveauMontantModif}
                    onChange={(e) => setNouveauMontantModif(e.target.value)}
                    className="frm-inp"
                    min="1"
                    required
                  />
                </div>

                {/* Historique d'audit */}
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '10px' }}>
                  <label className="frm-lbl" style={{ display: 'block', marginBottom: '6px' }}>Historique d'Audit (Traçabilité)</label>
                  {txAModifier.modifications && txAModifier.modifications.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '100px', overflowY: 'auto' }} className="no-scrollbar">
                      {txAModifier.modifications.map((m: any, idx: number) => (
                        <div key={idx} style={{ fontSize: '11px', color: 'var(--color-dark-muted)', background: 'var(--color-bg-main)', padding: '6px 8px', borderRadius: '4px', borderLeft: '3px solid var(--color-warning)' }}>
                          Corrigé le : {new Date(m.date).toLocaleString('fr-FR')}<br />
                          Montant : {formaterDevise(m.ancienMontant)} &rarr; {formaterDevise(m.nouveauMontant)}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span style={{ fontSize: '12px', color: 'var(--color-dark-muted)', fontStyle: 'italic' }}>Aucun ajustement antérieur.</span>
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

// ────────────────────────────────────────────────────────
// 2. DASHBOARD DE LA PLATEFORME (Vue Pasteur / Admin)
// ────────────────────────────────────────────────────────
const DashboardPlateforme: React.FC = () => {
  const { data: membres = [] } = useQuery({ queryKey: ['membres'], queryFn: membreService.recupererMembres });
  const { data: dons = [] } = useQuery({ queryKey: ['dons'], queryFn: donService.recupererDons });
  const { data: demandesPriere = [] } = useQuery({ queryKey: ['prieres'], queryFn: priereService.recupererDemandesPriere });
  const { data: evenements = [] } = useQuery({ queryKey: ['evenements'], queryFn: evenementService.recupererEvenements });

  // Statistiques
  const totalMembres = membres.length;
  const totalDonsMontant = dons.reduce((sum, d) => sum + d.montant, 0);
  const prieresATraiter = demandesPriere.filter((p) => p.statut === 'A_TRAITER').length;
  const totalEvenements = evenements.length;

  const donMoyen = dons.length > 0 ? Math.round(totalDonsMontant / dons.length) : 0;
  const derniersDons = dons.slice(0, 5);
  const dernieresPrieres = demandesPriere.slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 4 Cards KPI */}
      <div className="kpi-strip">
        <div className="stat-card" style={{ '--acc': 'var(--color-primary)' } as React.CSSProperties}>
          <div className="stat-ico" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="stat-lbl">Total Fidèles</p>
            <p className="stat-val">{totalMembres}</p>
            <p className="stat-sub">Fidèles enregistrés</p>
          </div>
        </div>

        <div className="stat-card" style={{ '--acc': 'var(--color-success)' } as React.CSSProperties}>
          <div className="stat-ico" style={{ backgroundColor: 'var(--color-success-light)', color: 'var(--color-success)' }}>
            <Coins className="h-5 w-5" />
          </div>
          <div>
            <p className="stat-lbl">Offrandes Collectées</p>
            <p className="stat-val">{formaterDevise(totalDonsMontant)}</p>
            <p className="stat-sub">Flux financiers plateforme</p>
          </div>
        </div>

        <div className="stat-card" style={{ '--acc': 'var(--color-danger)' } as React.CSSProperties}>
          <div className="stat-ico" style={{ backgroundColor: 'var(--color-danger-light)', color: 'var(--color-danger)' }}>
            <HeartHandshake className="h-5 w-5" />
          </div>
          <div>
            <p className="stat-lbl">Requêtes de Prière</p>
            <p className="stat-val">{prieresATraiter}</p>
            <p className="stat-sub">À traiter / intercession</p>
          </div>
        </div>

        <div className="stat-card" style={{ '--acc': 'var(--color-warning)' } as React.CSSProperties}>
          <div className="stat-ico" style={{ backgroundColor: 'var(--color-warning-light)', color: 'var(--color-warning)' }}>
            <CalendarDays className="h-5 w-5" />
          </div>
          <div>
            <p className="stat-lbl">Événements Prévus</p>
            <p className="stat-val">{totalEvenements}</p>
            <p className="stat-sub">Célébrations & séminaires</p>
          </div>
        </div>
      </div>

      {/* Graphiques et actions rapides */}
      <div className="dtl-grid" style={{ gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
        {/* Graphique de répartition des dons de la plateforme */}
        <div className="dtl-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
            <span style={{ fontSize: '15px', fontWeight: '750', color: 'var(--color-dark)' }}>Analyse des Dons récents</span>
            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-dark-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <span>Don moyen : {formaterDevise(donMoyen)}</span>
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {(
              [
                { label: 'Dîmes', montant: dons.filter((d) => d.typeDon === 'Dîme').reduce((sum, d) => sum + d.montant, 0), max: totalDonsMontant, colorClass: 'low' },
                { label: 'Offrandes ordinaires', montant: dons.filter((d) => d.typeDon === 'Offrande').reduce((sum, d) => sum + d.montant, 0), max: totalDonsMontant, colorClass: 'mid' },
                { label: 'Projet Construction', montant: dons.filter((d) => d.typeDon === 'Construction').reduce((sum, d) => sum + d.montant, 0), max: totalDonsMontant, colorClass: 'high' },
                { label: 'Action Sociale', montant: dons.filter((d) => d.typeDon === 'Social').reduce((sum, d) => sum + d.montant, 0), max: totalDonsMontant, colorClass: 'full' },
              ] as const
            ).map((item, index) => {
              const pourcent = item.max > 0 ? Math.round((item.montant / item.max) * 100) : 0;
              return (
                <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ fontWeight: '600', color: 'var(--color-dark-muted)' }}>{item.label}</span>
                    <span style={{ fontWeight: '700', color: 'var(--color-dark)' }}>{formaterDevise(item.montant)} ({pourcent}%)</span>
                  </div>
                  <div className="prog-track" style={{ height: '8px' }}>
                    <div
                      className={`prog-fill ${item.colorClass}`}
                      style={{ width: `${pourcent}%`, height: '100%' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions rapides */}
        <div className="dtl-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '14px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '15px', fontWeight: '750', color: 'var(--color-dark)', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>Actions Rapides</span>
            <p style={{ color: 'var(--color-dark-muted)', fontSize: '12px', lineHeight: '1.45', marginTop: '6px' }}>
              Gérez les membres inscrits sur la plateforme ou publiez instantanément du contenu spirituel.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
            <Link
              href="/admin/membres"
              className="btn-sec"
              style={{ padding: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', borderRadius: '7px', textAlign: 'center' }}
            >
              <Users className="h-5 w-5 text-[#1B4F8A]" />
              <span style={{ fontSize: '11px', fontWeight: '700' }}>Fidèles Inscrits</span>
            </Link>
            <Link
              href="/admin/sermons"
              className="btn-sec"
              style={{ padding: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', borderRadius: '7px', textAlign: 'center' }}
            >
              <Plus className="h-5 w-5 text-amber-500" />
              <span style={{ fontSize: '11px', fontWeight: '700' }}>Ajouter Sermon</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Flux d'Historique Dons et Prières */}
      <div className="dtl-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Dons récents */}
        <div className="tbl-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: '750', color: 'var(--color-dark)' }}>Flux Financier Récent</span>
            <Link href="/admin/dons" style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: '700' }}>Voir tout &rarr;</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {derniersDons.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--color-dark-muted)', fontSize: '13px' }}>Aucun don enregistré</div>
            ) : (
              derniersDons.map((don) => (
                <div key={don.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(27,79,138,0.04)' }}>
                  <div>
                    <p style={{ fontWeight: '700', color: 'var(--color-dark)', margin: 0, fontSize: '13px' }}>{don.nomDonateur}</p>
                    <p style={{ fontSize: '11px', color: 'var(--color-dark-muted)', margin: 0 }}>{don.telephone}</p>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                    <span style={{ fontWeight: '700', color: 'var(--color-success)', fontSize: '13px' }}>{formaterDevise(don.montant)}</span>
                    <span className="badge badge-confirmed" style={{ fontSize: '9px', padding: '1px 6px' }}>{don.typeDon}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Requêtes de Prières */}
        <div className="tbl-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: '750', color: 'var(--color-dark)' }}>Intercessions Récentes</span>
            <Link href="/admin/prieres" style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: '700' }}>Voir tout &rarr;</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {dernieresPrieres.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--color-dark-muted)', fontSize: '13px' }}>Aucune demande de prière</div>
            ) : (
              dernieresPrieres.map((priere) => (
                <div key={priere.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(27,79,138,0.04)' }}>
                  <div>
                    <p style={{ fontWeight: '700', color: 'var(--color-dark)', margin: 0, fontSize: '13px' }}>{priere.sujet}</p>
                    <p style={{ fontSize: '11px', color: 'var(--color-dark-muted)', margin: 0 }}>Par {priere.nom}</p>
                  </div>
                  <div>
                    <span
                      className={`badge ${
                        priere.statut === 'EXAUCE'
                          ? 'badge-confirmed'
                          : priere.statut === 'EN_PRIERE'
                          ? 'badge-partial'
                          : 'badge-pending'
                      }`}
                      style={{ fontSize: '9px', padding: '2px 8px' }}
                    >
                      {priere.statut === 'EXAUCE' ? 'Exaucé' : priere.statut === 'EN_PRIERE' ? 'En prière' : 'À traiter'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableauBord;
