import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import caisseService from '../../services/caisseService';
import membreService from '../../services/membreService';
import cotisationService from '../../services/cotisationService';
import habilitationService from '../../services/habilitationService';
import type { AuditTrace } from '../../types/models';
import { formaterDevise, formaterDate } from '../../utils/formateur';
import PaginationFooter from '../../components/UI/PaginationFooter';
import { Search, User, History, ShieldAlert, Eye, X, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Historique: React.FC = () => {
  const { data: caisses = [] } = useQuery({ queryKey: ['caisses'], queryFn: caisseService.recupererCaisses });
  const { data: membres = [] } = useQuery({ queryKey: ['membres'], queryFn: membreService.recupererMembres });
  const { data: transactions = [] } = useQuery({ queryKey: ['transactions'], queryFn: cotisationService.recupererTransactions });
  const { data: tracesAudit = [] } = useQuery({ queryKey: ['audit'], queryFn: habilitationService.recupererAudit });

  // Gestion des onglets
  const [ongletActif, setOngletActif] = useState<'versements' | 'audit'>('versements');

  // États locaux de filtrage, pagination et loaders
  const [recherche, setRecherche] = useState('');
  const [filtreCaisse, setFiltreCaisse] = useState('');
  const [page, setPage] = useState(1);
  const [taillePage, setTaillePage] = useState(10);
  const [enChargement, setEnChargement] = useState(false);

  // Modal lecture seule pour voir les détails d'une transaction
  const [txDetail, setTxDetail] = useState<any>(null);

  // Reset pagination et simulation loader
  useEffect(() => {
    setRecherche('');
    setPage(1);
    setEnChargement(true);
    const timer = setTimeout(() => setEnChargement(false), 450);
    return () => clearTimeout(timer);
  }, [ongletActif]);

  // Loader lors de la recherche
  useEffect(() => {
    setEnChargement(true);
    const timer = setTimeout(() => setEnChargement(false), 300);
    return () => clearTimeout(timer);
  }, [recherche, filtreCaisse]);

  const obtenirNomMembre = (idMembre: string) => {
    const m = membres.find((x) => x.id === idMembre);
    return m ? `${m.prenom} ${m.nom}` : 'Membre inconnu';
  };

  const obtenirNomCaisse = (idCaisse: string) => {
    const c = caisses.find((x) => x.id === idCaisse);
    return c ? c.nom : 'Caisse inconnue';
  };

  // Filtrer les transactions
  const transactionsFiltrees = transactions.filter((tx) => {
    const nomFidele = obtenirNomMembre(tx.idMembre).toLowerCase();
    const matchRecherche = nomFidele.includes(recherche.toLowerCase());
    const matchCaisse = filtreCaisse ? tx.idCaisse === filtreCaisse : true;
    return matchRecherche && matchCaisse;
  });

  // Filtrer les traces d'audit
  const tracesFiltrees = tracesAudit.filter((trace) => {
    return (
      trace.utilisateur.toLowerCase().includes(recherche.toLowerCase()) ||
      trace.action.toLowerCase().includes(recherche.toLowerCase()) ||
      trace.entite.toLowerCase().includes(recherche.toLowerCase()) ||
      trace.details.toLowerCase().includes(recherche.toLowerCase())
    );
  });

  const getBadgeColorAction = (action: string) => {
    const act = action.toUpperCase();
    if (act.includes('CRÉATION') || act.includes('CREATION') || act.includes('AUTORISATION')) return 'badge-success';
    if (act.includes('SUPPRESSION') || act.includes('INACTIF')) return 'badge-danger';
    return 'badge-partial';
  };

  // Pagination calculs
  const totalItems = ongletActif === 'versements' ? transactionsFiltrees.length : tracesFiltrees.length;
  const totalPages = Math.ceil(totalItems / taillePage) || 1;

  const indexDernier = page * taillePage;
  const indexPremier = indexDernier - taillePage;

  const transactionsPaginees = transactionsFiltrees.slice(indexPremier, indexDernier);
  const tracesPaginees = tracesFiltrees.slice(indexPremier, indexDernier);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Barre d'onglets premium */}
      <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
        <button
          onClick={() => setOngletActif('versements')}
          className={ongletActif === 'versements' ? 'btn-prim' : 'btn-sec'}
          style={{ padding: '8px 18px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s ease', fontWeight: 600 }}
        >
          <History className="h-4 w-4" />
          <span>Historique des Versements</span>
        </button>
        <button
          onClick={() => setOngletActif('audit')}
          className={ongletActif === 'audit' ? 'btn-prim' : 'btn-sec'}
          style={{ padding: '8px 18px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s ease', fontWeight: 600 }}
        >
          <ShieldAlert className="h-4 w-4" />
          <span>Audit &amp; Traçabilité Générale</span>
        </button>
      </div>

      {/* Barre de Recherche et Filtres */}
      <div className="flt-bar" style={{ background: 'var(--color-bg-card)', borderRadius: 'var(--radius-md)', padding: '16px 20px', boxShadow: 'var(--shadow-sm)' }}>
        <div className="flt-left">
          <div className="s-wrap">
            <Search className="s-ico h-4.5 w-4.5" />
            <input
              type="text"
              placeholder={ongletActif === 'versements' ? "Rechercher par fidèle..." : "Rechercher par utilisateur, action, entité..."}
              value={recherche}
              onChange={(e) => { setRecherche(e.target.value); setPage(1); }}
            />
          </div>
          {ongletActif === 'versements' && (
            <select
              value={filtreCaisse}
              onChange={(e) => { setFiltreCaisse(e.target.value); setPage(1); }}
              className="flt-sel"
            >
              <option value="">Toutes les caisses</option>
              {caisses.map((c) => (
                <option key={c.id} value={c.id}>{c.nom} {c.archivee && '(Archivée)'}</option>
              ))}
            </select>
          )}
        </div>
        <div className="flt-right">
          <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-dark-muted)' }}>
            Total : {totalItems} ligne{totalItems !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Tableau Principal */}
      <div className="tbl-card">
        {enChargement ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B4F8A]" />
          </div>
        ) : (
          <>
            <div className="tbl-scroll">
              <table className="tbl">
                {ongletActif === 'versements' ? (
                  <>
                    <thead>
                      <tr>
                        <th style={{ width: '44px' }}>#</th>
                        <th>Fidèle Cotisant</th>
                        <th>Caisse d'affectation</th>
                        <th>Montant Versé</th>
                        <th>Date / Heure</th>
                        <th style={{ textAlign: 'right' }}>Détails</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactionsPaginees.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="empty-td">
                            Aucun flux de versement enregistré dans l'historique.
                          </td>
                        </tr>
                      ) : (
                        transactionsPaginees.map((tx, idx) => (
                          <tr key={tx.id}>
                            <td className="col-num">{indexPremier + idx + 1}</td>
                            <td>
                              <div className="user-cell">
                                <div className="ava-sm">
                                  {obtenirNomMembre(tx.idMembre).split(' ').map(n=>n[0]).join('').substring(0, 2).toUpperCase()}
                                </div>
                                <div className="info">
                                  <span className="name">{obtenirNomMembre(tx.idMembre)}</span>
                                  <span className="sub">{tx.idMembre}</span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span className="fw600" style={{ color: 'var(--color-dark)', fontSize: '13px' }}>
                                  {obtenirNomCaisse(tx.idCaisse)}
                                </span>
                                {tx.typeDon && (
                                  <span style={{ fontSize: '10.5px', color: 'var(--color-dark-muted)' }}>
                                    Type : {tx.typeDon}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td>
                              <span className="fw700 text-[#0B3C91]">{formaterDevise(tx.montant)}</span>
                            </td>
                            <td style={{ fontSize: '12px', color: 'var(--color-dark-muted)' }}>
                              {formaterDate(tx.date, true)}
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <button
                                onClick={() => setTxDetail(tx)}
                                className="btn-edit"
                                title="Voir les détails"
                                style={{ padding: '6px 10px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                              >
                                <Eye className="h-3.5 w-3.5" />
                                <span style={{ fontSize: '11px' }}>Détails</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </>
                ) : (
                  // Onglet Audit
                  <>
                    <thead>
                      <tr>
                        <th style={{ width: '44px' }}>#</th>
                        <th>Date &amp; Heure</th>
                        <th>Utilisateur</th>
                        <th>Action</th>
                        <th>Entité</th>
                        <th>Détails de l'action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tracesPaginees.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="empty-td">
                            Aucune trace d'audit enregistrée dans le journal.
                          </td>
                        </tr>
                      ) : (
                        tracesPaginees.map((trace: AuditTrace, idx) => (
                          <tr key={trace.id}>
                            <td className="col-num">{indexPremier + idx + 1}</td>
                            <td style={{ fontSize: '12px', color: 'var(--color-dark-muted)', whiteSpace: 'nowrap' }}>
                              {formaterDate(trace.date, true)}
                            </td>
                            <td>
                              <div className="user-cell">
                                <div className="ava-sm" style={{ background: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}>
                                  <User className="h-3 w-3" />
                                </div>
                                <span className="name" style={{ fontSize: '12.5px' }}>{trace.utilisateur}</span>
                              </div>
                            </td>
                            <td>
                              <span className={`badge ${getBadgeColorAction(trace.action)}`} style={{ fontSize: '10px', fontWeight: '800' }}>
                                {trace.action}
                              </span>
                            </td>
                            <td>
                              <span className="badge badge-partial" style={{ fontSize: '10.5px' }}>
                                {trace.entite}
                              </span>
                            </td>
                            <td style={{ fontSize: '12.5px', color: 'var(--color-dark-muted)', maxWidth: '350px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {trace.details}
                            </td>
                          </tr>
                        ))
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

      {/* MODAL LECTURE SEULE — DÉTAILS DU VERSEMENT */}
      <AnimatePresence>
        {txDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
            >
              {/* En-tête */}
              <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--color-border)', background: 'var(--color-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText className="h-5 w-5 text-white" />
                  <h3 style={{ fontSize: '15px', fontWeight: '850', color: 'white', margin: 0 }}>
                    Détails du Versement
                  </h3>
                </div>
                <button
                  onClick={() => setTxDetail(null)}
                  style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Corps — Lecture seule */}
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

                {/* Infos principales */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'var(--color-primary-soft)', padding: '16px', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11.5px', color: 'var(--color-dark-muted)', fontWeight: 600 }}>Fidèle</span>
                    <strong style={{ fontSize: '13px', color: 'var(--color-dark)' }}>{obtenirNomMembre(txDetail.idMembre)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11.5px', color: 'var(--color-dark-muted)', fontWeight: 600 }}>Caisse</span>
                    <strong style={{ fontSize: '13px', color: 'var(--color-dark)' }}>{obtenirNomCaisse(txDetail.idCaisse)}</strong>
                  </div>
                  {txDetail.typeDon && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11.5px', color: 'var(--color-dark-muted)', fontWeight: 600 }}>Type</span>
                      <span style={{ fontSize: '13px', color: 'var(--color-dark)' }}>{txDetail.typeDon}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11.5px', color: 'var(--color-dark-muted)', fontWeight: 600 }}>Montant Versé</span>
                    <strong style={{ fontSize: '18px', color: 'var(--color-primary)', fontWeight: 800 }}>{formaterDevise(txDetail.montant)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11.5px', color: 'var(--color-dark-muted)', fontWeight: 600 }}>Date originale</span>
                    <span style={{ fontSize: '13px', color: 'var(--color-dark)' }}>{formaterDate(txDetail.date, true)}</span>
                  </div>
                  {txDetail.commentaire && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingTop: '8px', borderTop: '1px solid var(--color-border)' }}>
                      <span style={{ fontSize: '11.5px', color: 'var(--color-dark-muted)', fontWeight: 600 }}>Commentaire</span>
                      <span style={{ fontSize: '12.5px', color: 'var(--color-dark)', fontStyle: 'italic' }}>{txDetail.commentaire}</span>
                    </div>
                  )}
                </div>

                {/* Historique des corrections (lecture seule) */}
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-dark-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
                    Historique des corrections
                  </span>
                  {txDetail.modifications && txDetail.modifications.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '140px', overflowY: 'auto' }} className="no-scrollbar">
                      {txDetail.modifications.map((m: any, index: number) => (
                        <div key={index} style={{ fontSize: '11.5px', color: 'var(--color-dark-muted)', background: 'var(--color-bg-main)', padding: '8px 10px', borderRadius: '6px', borderLeft: '3px solid var(--color-warning)', lineHeight: 1.5 }}>
                          <strong style={{ display: 'block', marginBottom: '2px' }}>Correction du {new Date(m.date).toLocaleString('fr-FR')}</strong>
                          {formaterDevise(m.ancienMontant)} &rarr; {formaterDevise(m.nouveauMontant)}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: '12px', color: 'var(--color-dark-muted)', fontStyle: 'italic', margin: 0 }}>
                      Aucune correction enregistrée sur ce versement.
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--color-border)', paddingTop: '14px', marginTop: '4px' }}>
                  <button className="btn-prim" onClick={() => setTxDetail(null)}>
                    Fermer
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Historique;
