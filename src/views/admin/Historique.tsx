import React, { useState, useEffect } from 'react';
import { useDonneesStore } from '../../stores/useDonneesStore';
import { formaterDevise, formaterDate } from '../../utils/formateur';
import PaginationFooter from '../../components/UI/PaginationFooter';
import { Search, User, Edit2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export const Historique: React.FC = () => {
  const store = useDonneesStore();
  const { caisses, membres, transactions } = store;
  const router = useRouter();

  // États locaux de filtrage et de pagination
  const [recherche, setRecherche] = useState('');
  const [filtreCaisse, setFiltreCaisse] = useState('');
  const [page, setPage] = useState(1);
  const [taillePage, setTaillePage] = useState(10);

  // États pour correction versement (traçabilité)
  const [txAModifier, setTxAModifier] = useState<any>(null);
  const [nouveauMontantModif, setNouveauMontantModif] = useState('');
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

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

  const totalItems = transactionsFiltrees.length;
  const totalPages = Math.ceil(totalItems / taillePage) || 1;

  useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [totalItems, totalPages, page]);

  const indexDernier = page * taillePage;
  const indexPremier = indexDernier - taillePage;
  const itemsPaginees = transactionsFiltrees.slice(indexPremier, indexDernier);

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
      const soldeActuel = store.calculerTotalCaisse(txAModifier.idCaisse);
      const resteAutorise = caisse.objectif - (soldeActuel - txAModifier.montant);
      if (valMontant > resteAutorise) {
        setEditError(`Ce montant dépasse l'objectif de la caisse. Le montant maximum autorisé est de ${formaterDevise(resteAutorise)}.`);
        return;
      }
    }

    const res = store.modifierCotisation(txAModifier.id, valMontant);
    if (res.success) {
      setEditSuccess('Le versement a été modifié avec succès.');
      setTimeout(() => {
        setTxAModifier(null);
      }, 1000);
    } else {
      setEditError(res.error || "Erreur de modification");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Barre de Recherche et Filtres */}
      <div className="flt-bar" style={{ background: 'var(--color-bg-card)', borderRadius: 'var(--radius-md)', padding: '16px 20px', boxShadow: 'var(--shadow-sm)' }}>
        <div className="flt-left">
          <div className="s-wrap">
            <Search className="s-ico h-4.5 w-4.5" />
            <input
              type="text"
              placeholder="Rechercher par fidèle..."
              value={recherche}
              onChange={(e) => { setRecherche(e.target.value); setPage(1); }}
            />
          </div>
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
        </div>
        <div className="flt-right">
          <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-dark-muted)' }}>
            Total : {totalItems} transactions
          </span>
        </div>
      </div>

      {/* Tableau d'Historique Global */}
      <div className="tbl-card">
        <div className="tbl-scroll">
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ width: '44px' }}>#</th>
                <th>Fidèle Cotisant</th>
                <th>Caisse d'affectation</th>
                <th>Montant Versé</th>
                <th>Date / Heure</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {itemsPaginees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-td">
                    Aucun flux de versement enregistré dans l'historique.
                  </td>
                </tr>
              ) : (
                itemsPaginees.map((tx, idx) => (
                  <tr key={tx.id}>
                    <td className="col-num">{indexPremier + idx + 1}</td>
                    <td>
                      <div className="user-cell">
                        <div className="ava-sm">
                          {obtenirNomMembre(tx.idMembre).split(' ').map(n=>n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="user-name">{obtenirNomMembre(tx.idMembre)}</span>
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
                    <td className="col-muted">{formaterDate(tx.date)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="act-cell" style={{ justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => {
                            setTxAModifier(tx);
                            setNouveauMontantModif(tx.montant.toString());
                            setEditError('');
                            setEditSuccess('');
                          }}
                          className="btn-edit"
                          title="Ajuster"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => router.push(`/admin/membres`)}
                          className="btn-detail"
                          title="Fiche Fidèle"
                        >
                          <User className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <PaginationFooter
          total={totalItems}
          page={page}
          pageSize={taillePage}
          totalPages={totalPages}
          label="transactions"
          onPageChange={setPage}
          onPageSizeChange={(sz) => { setTaillePage(sz); setPage(1); }}
        />
      </div>

      {/* MODALE DE TRAÇABILITÉ / MODIFICATION DE COTISATION */}
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
              <h3 className="modal-title font-poppins font-bold">Ajuster le Versement (Traçabilité)</h3>

              {editError && <div className="frm-alert err">{editError}</div>}
              {editSuccess && <div className="frm-alert ok">{editSuccess}</div>}

              <form onSubmit={gererSoumissionModifTx} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="frm-grp">
                  <span className="frm-lbl">Fidèle</span>
                  <p style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--color-dark)', margin: 0 }}>{obtenirNomMembre(txAModifier.idMembre)}</p>
                </div>
                <div className="frm-grp">
                  <span className="frm-lbl">Caisse d'affectation</span>
                  <p style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--color-dark)', margin: 0 }}>{obtenirNomCaisse(txAModifier.idCaisse)}</p>
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
                  <span className="frm-lbl" style={{ display: 'block', marginBottom: '6px' }}>Historique d'Audit (Corrections)</span>
                  {txAModifier.modifications && txAModifier.modifications.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '100px', overflowY: 'auto' }} className="no-scrollbar">
                      {txAModifier.modifications.map((m: any, index: number) => (
                        <div key={index} style={{ fontSize: '11px', color: 'var(--color-dark-muted)', background: 'var(--color-bg-main)', padding: '6px 8px', borderRadius: '4px', borderLeft: '3px solid var(--color-warning)' }}>
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

export default Historique;
