import React, { useState, useEffect } from 'react';
import { Search, Trash2, Eye, Check, HelpCircle, Flame, Plus, Save } from 'lucide-react';
import priereService from '../../services/priereService';
import type { DemandePriere } from '../../types/models';
import { formaterDate, formaterTelephone } from '../../utils/formateur';
import { motion, AnimatePresence } from 'framer-motion';

export const Prieres: React.FC = () => {
  const [prieres, setPrieres] = useState<DemandePriere[]>([]);
  const [recherche, setRecherche] = useState('');
  const [statutFiltre, setStatutFiltre] = useState<'tous' | DemandePriere['statut']>('tous');
  const [enChargement, setEnChargement] = useState(false);
  const [detailPriere, setDetailPriere] = useState<DemandePriere | null>(null);

  // États pour l'ajout d'une prière
  const [showAjouterModal, setShowAjouterModal] = useState(false);
  const [nomInteresse, setNomInteresse] = useState('');
  const [telInteresse, setTelInteresse] = useState('');
  const [sujetPriere, setSujetPriere] = useState('');
  const [messagePriere, setMessagePriere] = useState('');
  const [ajouterError, setAjouterError] = useState('');
  const [ajouterSuccess, setAjouterSuccess] = useState('');

  const chargerPrieres = async () => {
    setEnChargement(true);
    try {
      const data = await priereService.recupererDemandesPriere();
      setPrieres(data);
    } catch (e) {
      console.error(e);
    } finally {
      setEnChargement(false);
    }
  };

  useEffect(() => {
    chargerPrieres();
  }, []);

  const handleModifierStatut = async (id: string, statut: DemandePriere['statut']) => {
    try {
      await priereService.modifierStatutPriere(id, statut);
      chargerPrieres();
      if (detailPriere && detailPriere.id === id) {
        setDetailPriere((prev) => (prev ? { ...prev, statut } : null));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSupprimer = async (id: string) => {
    if (window.confirm('Voulez-vous supprimer définitivement cette demande de prière ?')) {
      try {
        await priereService.supprimerDemandePriere(id);
        chargerPrieres();
        if (detailPriere && detailPriere.id === id) {
          setDetailPriere(null);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Action : Soumettre une requête
  const handleSoumettrePriere = async (e: React.FormEvent) => {
    e.preventDefault();
    setAjouterError('');
    setAjouterSuccess('');

    if (!nomInteresse.trim() || !sujetPriere.trim() || !messagePriere.trim()) {
      setAjouterError('Les champs Nom, Sujet et Message sont obligatoires.');
      return;
    }

    try {
      await priereService.soumettreDemandePriere({
        nom: nomInteresse.trim(),
        telephone: telInteresse.trim(),
        sujet: sujetPriere.trim(),
        message: messagePriere.trim()
      });

      setNomInteresse('');
      setTelInteresse('');
      setSujetPriere('');
      setMessagePriere('');
      setAjouterSuccess('La demande d\'intercession a été enregistrée avec succès.');
      
      setTimeout(() => {
        setAjouterSuccess('');
        setShowAjouterModal(false);
        chargerPrieres();
      }, 1000);
    } catch (e) {
      setAjouterError('Une erreur s\'est produite lors de l\'enregistrement.');
      console.error(e);
    }
  };

  // Filtrage
  const prieresFiltrées = prieres.filter((p) => {
    const correspondRecherche =
      p.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      p.sujet.toLowerCase().includes(recherche.toLowerCase()) ||
      p.message.toLowerCase().includes(recherche.toLowerCase());

    const correspondStatut = statutFiltre === 'tous' || p.statut === statutFiltre;

    return correspondRecherche && correspondStatut;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* BOÎTES DE SÉLECTION RAPIDE DE STATUT */}
      <div style={{ display: 'flex', flexWrap: 'wrap', background: 'rgba(27,79,138,0.06)', padding: '4px', borderRadius: '7px', width: 'fit-content', border: '1px solid var(--color-border)' }}>
        {(
          [
            { id: 'tous', libelle: 'Toutes les prières' },
            { id: 'A_TRAITER', libelle: 'À traiter' },
            { id: 'EN_PRIERE', libelle: 'En prière' },
            { id: 'EXAUCE', libelle: 'Témoignages / Exaucés' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatutFiltre(tab.id)}
            className="btn-sec"
            style={{
              border: 'none',
              padding: '6px 14px',
              fontSize: '12px',
              background: statutFiltre === tab.id ? 'var(--color-primary)' : 'transparent',
              color: statutFiltre === tab.id ? '#ffffff' : 'var(--color-dark-muted)'
            }}
          >
            {tab.libelle}
          </button>
        ))}
      </div>

      {/* Barre de Recherche et Bouton de Dépôt */}
      <div className="flt-bar" style={{ background: 'var(--color-bg-card)', borderRadius: 'var(--radius-md)', padding: '16px 20px', boxShadow: 'var(--shadow-sm)' }}>
        <div className="flt-left">
          <div className="s-wrap">
            <Search className="s-ico h-4.5 w-4.5" />
            <input
              type="text"
              placeholder="Rechercher par nom, sujet, contenu..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
            />
          </div>
        </div>
        <div className="flt-right">
          <button
            onClick={() => {
              setNomInteresse('');
              setTelInteresse('');
              setSujetPriere('');
              setMessagePriere('');
              setAjouterError('');
              setAjouterSuccess('');
              setShowAjouterModal(true);
            }}
            className="btn-prim"
          >
            <Plus className="h-4 w-4" />
            <span>Déposer une Requête</span>
          </button>
        </div>
      </div>

      {/* TABLEAU DES DEMANDES DE PRIÈRE */}
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
                  <th>Intéressé</th>
                  <th>Sujet de prière</th>
                  <th>Date de dépôt</th>
                  <th>Statut</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {prieresFiltrées.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="empty-td">
                      Aucune demande d'intercession trouvée.
                    </td>
                  </tr>
                ) : (
                  prieresFiltrées.map((priere) => (
                    <tr key={priere.id}>
                      <td>
                        <div className="user-cell">
                          <div className="ava-sm">
                            {priere.nom.split(' ').map(n=>n[0]).join('').substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="user-name">{priere.nom}</span>
                            <p className="user-sub">Ref: {priere.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="fw700" style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {priere.sujet}
                      </td>
                      <td className="col-muted">
                        {formaterDate(priere.date)}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            priere.statut === 'EXAUCE'
                              ? 'badge-confirmed'
                              : priere.statut === 'EN_PRIERE'
                              ? 'badge-partial'
                              : 'badge-pending'
                          }`}
                        >
                          {priere.statut === 'EXAUCE' ? 'Exaucé' : priere.statut === 'EN_PRIERE' ? 'En prière' : 'À traiter'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="act-cell" style={{ justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => setDetailPriere(priere)}
                            className="btn-detail"
                            title="Consulter"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>Consulter</span>
                          </button>
                          <button
                            onClick={() => handleSupprimer(priere.id)}
                            className="btn-del"
                            title="Supprimer"
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

      {/* MODALE D'AJOUT D'UNE REQUÊTE DE PRIÈRE */}
      <AnimatePresence>
        {showAjouterModal && (
          <div className="modal-overlay" onClick={() => setShowAjouterModal(false)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="modal"
              style={{ maxWidth: '520px', width: '90%' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="modal-title font-poppins font-bold">Déposer une demande d'intercession</h3>

              {ajouterError && <div className="frm-alert err">{ajouterError}</div>}
              {ajouterSuccess && <div className="frm-alert ok">{ajouterSuccess}</div>}

              <form onSubmit={handleSoumettrePriere} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="frm-grid" style={{ gap: '12px' }}>
                  <div className="frm-grp frm-span2">
                    <label className="frm-lbl">Nom complet du demandeur *</label>
                    <input
                      type="text"
                      value={nomInteresse}
                      onChange={(e) => setNomInteresse(e.target.value)}
                      placeholder="Ex: Frère Kouassi Jean"
                      className="frm-inp"
                      required
                    />
                  </div>

                  <div className="frm-grp frm-span2">
                    <label className="frm-lbl">Numéro de téléphone</label>
                    <input
                      type="text"
                      value={telInteresse}
                      onChange={(e) => setTelInteresse(e.target.value)}
                      placeholder="Ex: 0707894512"
                      className="frm-inp"
                    />
                  </div>

                  <div className="frm-grp frm-span2">
                    <label className="frm-lbl">Sujet de prière *</label>
                    <input
                      type="text"
                      value={sujetPriere}
                      onChange={(e) => setSujetPriere(e.target.value)}
                      placeholder="Ex: Guérison, Action de grâce..."
                      className="frm-inp"
                      required
                    />
                  </div>

                  <div className="frm-grp frm-span2">
                    <label className="frm-lbl">Message détaillé *</label>
                    <textarea
                      value={messagePriere}
                      onChange={(e) => setMessagePriere(e.target.value)}
                      placeholder="Détaillez vos intentions de prières..."
                      className="frm-inp frm-textarea"
                      style={{ height: '100px' }}
                      required
                    />
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={() => setShowAjouterModal(false)} className="btn-sec">Annuler</button>
                  <button type="submit" className="btn-prim">
                    <Save className="h-4 w-4" />
                    <span>Soumettre la demande</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODALE DÉTAIL DE LA DEMANDE + SUIVI */}
      <AnimatePresence>
        {detailPriere && (
          <div className="modal-overlay" onClick={() => setDetailPriere(null)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="modal"
              style={{ maxWidth: '540px', width: '90%' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="modal-title font-poppins font-bold">Fiche d'Intercession de Prière</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="dtl-grid" style={{ gap: '12px' }}>
                  <div className="dtl-row">
                    <span className="dtl-lbl">Date de Dépôt</span>
                    <span className="dtl-val">{formaterDate(detailPriere.date)}</span>
                  </div>
                  <div className="dtl-row">
                    <span className="dtl-lbl">Téléphone</span>
                    <span className="dtl-val">{formaterTelephone(detailPriere.telephone)}</span>
                  </div>
                  <div className="dtl-row dtl-span2">
                    <span className="dtl-lbl">Nom de l'intéressé</span>
                    <span className="dtl-val" style={{ fontWeight: '700' }}>{detailPriere.nom}</span>
                  </div>
                  <div className="dtl-row dtl-span2">
                    <span className="dtl-lbl">Sujet</span>
                    <span className="dtl-val" style={{ fontWeight: '750' }}>{detailPriere.sujet}</span>
                  </div>
                  <div className="dtl-row dtl-span2">
                    <span className="dtl-lbl">Contenu du message</span>
                    <p style={{ fontSize: '13px', background: 'var(--color-bg-input)', padding: '12px', border: '1px solid var(--color-border)', borderRadius: '7px', color: 'var(--color-dark)', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                      {detailPriere.message}
                    </p>
                  </div>
                </div>

                {/* MODIFIER LE STATUT */}
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span className="dtl-lbl">Modifier le statut de suivi</span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                    <button
                      onClick={() => handleModifierStatut(detailPriere.id, 'A_TRAITER')}
                      className="btn-sec"
                      style={{
                        justifyContent: 'center',
                        background: detailPriere.statut === 'A_TRAITER' ? 'var(--color-warning)' : 'transparent',
                        color: detailPriere.statut === 'A_TRAITER' ? 'white' : 'var(--color-dark)',
                        borderColor: detailPriere.statut === 'A_TRAITER' ? 'var(--color-warning)' : 'var(--color-border)',
                      }}
                    >
                      <HelpCircle className="h-4 w-4" />
                      <span style={{ fontSize: '11px', fontWeight: '700' }}>À traiter</span>
                    </button>
                    <button
                      onClick={() => handleModifierStatut(detailPriere.id, 'EN_PRIERE')}
                      className="btn-sec"
                      style={{
                        justifyContent: 'center',
                        background: detailPriere.statut === 'EN_PRIERE' ? 'var(--color-primary)' : 'transparent',
                        color: detailPriere.statut === 'EN_PRIERE' ? 'white' : 'var(--color-dark)',
                        borderColor: detailPriere.statut === 'EN_PRIERE' ? 'var(--color-primary)' : 'var(--color-border)',
                      }}
                    >
                      <Flame className="h-4 w-4" />
                      <span style={{ fontSize: '11px', fontWeight: '700' }}>En prière</span>
                    </button>
                    <button
                      onClick={() => handleModifierStatut(detailPriere.id, 'EXAUCE')}
                      className="btn-sec"
                      style={{
                        justifyContent: 'center',
                        background: detailPriere.statut === 'EXAUCE' ? 'var(--color-success)' : 'transparent',
                        color: detailPriere.statut === 'EXAUCE' ? 'white' : 'var(--color-dark)',
                        borderColor: detailPriere.statut === 'EXAUCE' ? 'var(--color-success)' : 'var(--color-border)',
                      }}
                    >
                      <Check className="h-4 w-4" />
                      <span style={{ fontSize: '11px', fontWeight: '700' }}>Exaucé</span>
                    </button>
                  </div>
                </div>

                <div className="modal-actions">
                  <button onClick={() => setDetailPriere(null)} className="btn-sec">Fermer</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Prieres;
