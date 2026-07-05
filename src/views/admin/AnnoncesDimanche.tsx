'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, ChevronDown, ChevronUp, Mic2, Calendar,
  ClipboardList, DollarSign, Bookmark, FileText, CheckCircle2,
  Archive, Edit3, Eye, X, Save, Printer, Copy, Clock,
  AlertCircle,
} from 'lucide-react';
import annonceFinanceService from '../../services/annonceFinanceService';
import caisseService from '../../services/caisseService';
import evenementService from '../../services/evenementService';
import type {
  AnnonceFinance, PaiementAnnonce, EvenementAnnonce,
  AutrePoint, StatutAnnonce,
} from '../../types/models';
import { formaterDate, formaterDevise } from '../../utils/formateur';

// ─── Helpers ────────────────────────────────────────────────────────────────

const COULEURS_STATUT: Record<StatutAnnonce, { bg: string; text: string; label: string }> = {
  BROUILLON:  { bg: 'var(--color-warning-light)',  text: 'var(--color-warning)',  label: 'Brouillon'  },
  PRESENTEE:  { bg: 'var(--color-success-light)',  text: 'var(--color-success)',  label: 'Présentée'  },
  ARCHIVEE:   { bg: 'var(--color-border)',         text: 'var(--color-dark-muted)', label: 'Archivée' },
};

function prochainDimanche(): string {
  const now = new Date();
  const jour = now.getDay(); // 0 = dimanche
  const diff = jour === 0 ? 0 : 7 - jour;
  now.setDate(now.getDate() + diff);
  return now.toISOString().split('T')[0];
}

function titreParDefaut(date: string): string {
  if (!date) return '';
  return `Culte du ${new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`;
}

const ANNONCE_VIDE = (): Omit<AnnonceFinance, 'id' | 'dateCreation' | 'dateModification'> => ({
  dateDimanche: prochainDimanche(),
  statut: 'BROUILLON',
  titreSession: titreParDefaut(prochainDimanche()),
  paiementsAnnonces: [],
  evenementsAVenir: [],
  notesLibres: '',
  autresPoints: [],
  creePar: '',
});

// ─── Composant principal ────────────────────────────────────────────────────

export const AnnoncesDimanche: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: annonces = [], isLoading } = useQuery({
    queryKey: ['annonces-finances'],
    queryFn: annonceFinanceService.recupererAnnonces,
  });
  const { data: caisses = [] } = useQuery({
    queryKey: ['caisses'],
    queryFn: caisseService.recupererCaisses,
  });
  const { data: evenements = [] } = useQuery({
    queryKey: ['evenements'],
    queryFn: evenementService.recupererEvenements,
  });

  const invalider = () => queryClient.invalidateQueries({ queryKey: ['annonces-finances'] });

  const creerMutation   = useMutation({ mutationFn: annonceFinanceService.creerAnnonce,   onSuccess: invalider });
  const modifierMutation = useMutation({ mutationFn: ({ id, data }: { id: string; data: Partial<AnnonceFinance> }) => annonceFinanceService.modifierAnnonce(id, data), onSuccess: invalider });
  const supprimerMutation = useMutation({ mutationFn: annonceFinanceService.supprimerAnnonce, onSuccess: invalider });

  // ── States ──────────────────────────────────────────────────────────────
  const [annonceSelectId, setAnnonceSelectId] = useState<string | null>(null);
  const [modeCreer, setModeCreer] = useState(false);
  const [modeApercu, setModeApercu] = useState(false);
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState('');

  // Formulaire
  const [formData, setFormData] = useState<Omit<AnnonceFinance, 'id' | 'dateCreation' | 'dateModification'>>(ANNONCE_VIDE());

  // Sections ouvertes/fermées
  const [sectionsOuvertes, setSectionsOuvertes] = useState({
    paiements: true,
    evenements: false,
    notes: false,
    autres: false,
  });

  const toggleSection = (key: keyof typeof sectionsOuvertes) =>
    setSectionsOuvertes((s) => ({ ...s, [key]: !s[key] }));

  // ── Charger une annonce existante ──────────────────────────────────────
  const annonceActive = annonces.find((a) => a.id === annonceSelectId);

  useEffect(() => {
    if (annonceActive) {
      setFormData({
        dateDimanche: annonceActive.dateDimanche?.split('T')[0] ?? '',
        statut: annonceActive.statut,
        titreSession: annonceActive.titreSession,
        paiementsAnnonces: annonceActive.paiementsAnnonces ?? [],
        evenementsAVenir: annonceActive.evenementsAVenir ?? [],
        notesLibres: annonceActive.notesLibres ?? '',
        autresPoints: annonceActive.autresPoints ?? [],
        creePar: annonceActive.creePar ?? '',
      });
      setModeCreer(false);
      setModeApercu(false);
    }
  }, [annonceSelectId, annonces]);

  // ── Sauvegarder ───────────────────────────────────────────────────────
  const sauvegarder = async () => {
    setErreur('');
    if (!formData.titreSession.trim()) {
      setErreur('Le titre de la session est obligatoire.');
      return;
    }
    try {
      if (modeCreer) {
        const nouvelle = await creerMutation.mutateAsync(formData);
        setAnnonceSelectId(nouvelle.id);
        setModeCreer(false);
      } else if (annonceSelectId) {
        await modifierMutation.mutateAsync({ id: annonceSelectId, data: formData });
      }
      setSucces('Sauvegardé avec succès !');
      setTimeout(() => setSucces(''), 2000);
    } catch (e: unknown) {
      setErreur((e as Error).message || 'Erreur de sauvegarde.');
    }
  };

  const changerStatut = async (statut: StatutAnnonce) => {
    if (!annonceSelectId) return;
    await modifierMutation.mutateAsync({ id: annonceSelectId, data: { statut } });
    setFormData((f) => ({ ...f, statut }));
  };

  const dupliquerPourSemaineSuivante = () => {
    const prochaine = new Date(formData.dateDimanche);
    prochaine.setDate(prochaine.getDate() + 7);
    const dateStr = prochaine.toISOString().split('T')[0];
    setFormData({
      ...formData,
      dateDimanche: dateStr,
      titreSession: titreParDefaut(dateStr),
      statut: 'BROUILLON',
      paiementsAnnonces: [],
      evenementsAVenir: [],
      notesLibres: '',
      autresPoints: [],
    });
    setAnnonceSelectId(null);
    setModeCreer(true);
    setModeApercu(false);
  };

  // ── Helpers de listes dynamiques ───────────────────────────────────────
  const ajouterPaiement = () =>
    setFormData((f) => ({ ...f, paiementsAnnonces: [...f.paiementsAnnonces, { libelle: '', montant: 0 }] }));

  const modifierPaiement = (i: number, champ: keyof PaiementAnnonce, val: string | number) =>
    setFormData((f) => {
      const arr = [...f.paiementsAnnonces];
      arr[i] = { ...arr[i], [champ]: val };
      return { ...f, paiementsAnnonces: arr };
    });

  const supprimerPaiement = (i: number) =>
    setFormData((f) => ({ ...f, paiementsAnnonces: f.paiementsAnnonces.filter((_, idx) => idx !== i) }));

  const ajouterEvenement = () =>
    setFormData((f) => ({ ...f, evenementsAVenir: [...f.evenementsAVenir, { titre: '', date: '' }] }));

  const modifierEvenement = (i: number, champ: keyof EvenementAnnonce, val: string) =>
    setFormData((f) => {
      const arr = [...f.evenementsAVenir];
      arr[i] = { ...arr[i], [champ]: val };
      return { ...f, evenementsAVenir: arr };
    });

  const supprimerEvenement = (i: number) =>
    setFormData((f) => ({ ...f, evenementsAVenir: f.evenementsAVenir.filter((_, idx) => idx !== i) }));

  const importerEvenements = () => {
    const prochains = evenements.slice(0, 3).map((ev) => ({
      titre: ev.titre,
      date: ev.dateDebut,
      lieu: ev.lieu || '',
      details: ev.description || '',
    }));
    setFormData((f) => ({ ...f, evenementsAVenir: [...f.evenementsAVenir, ...prochains] }));
  };

  const ajouterAutrePoint = () =>
    setFormData((f) => ({ ...f, autresPoints: [...f.autresPoints, { sujet: '', details: '' }] }));

  const modifierAutrePoint = (i: number, champ: keyof AutrePoint, val: string) =>
    setFormData((f) => {
      const arr = [...f.autresPoints];
      arr[i] = { ...arr[i], [champ]: val };
      return { ...f, autresPoints: arr };
    });

  const supprimerAutrePoint = (i: number) =>
    setFormData((f) => ({ ...f, autresPoints: f.autresPoints.filter((_, idx) => idx !== i) }));

  const totalPaiements = formData.paiementsAnnonces.reduce((s, p) => s + (Number(p.montant) || 0), 0);

  // ─── Rendu ────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', gap: '16px', minHeight: '80vh', alignItems: 'flex-start' }}>

      {/* ═══════════════════ PANNEAU GAUCHE — Historique ═══════════════════ */}
      <aside style={{ width: '260px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button
          className="btn-prim"
          style={{ justifyContent: 'center', fontSize: '13px' }}
          onClick={() => {
            setFormData(ANNONCE_VIDE());
            setAnnonceSelectId(null);
            setModeCreer(true);
            setModeApercu(false);
            setErreur('');
          }}
        >
          <Plus className="h-4 w-4" />
          Nouvelle Annonce
        </button>

        <div className="tbl-card" style={{ flex: 1, padding: '6px 0', overflowY: 'auto', maxHeight: 'calc(80vh - 60px)' }}>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '24px' }}>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1B4F8A] mx-auto" />
            </div>
          ) : annonces.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-dark-muted)', fontSize: '12px' }}>
              Aucune annonce enregistrée.
            </div>
          ) : (
            annonces.map((a) => {
              const statut = COULEURS_STATUT[a.statut] ?? COULEURS_STATUT.BROUILLON;
              const actif = a.id === annonceSelectId;
              return (
                <div
                  key={a.id}
                  onClick={() => { setAnnonceSelectId(a.id); setErreur(''); }}
                  style={{
                    padding: '10px 14px',
                    cursor: 'pointer',
                    borderLeft: actif ? '3px solid var(--color-primary)' : '3px solid transparent',
                    background: actif ? 'var(--color-primary-soft)' : 'transparent',
                    transition: 'all 0.15s',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--color-dark)', lineHeight: 1.3 }}>
                    {a.titreSession}
                  </span>
                  <span style={{ fontSize: '10.5px', color: 'var(--color-dark-muted)' }}>
                    {formaterDate(a.dateDimanche)}
                  </span>
                  <span style={{ display: 'inline-block', marginTop: '2px', fontSize: '9.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', padding: '2px 7px', borderRadius: '99px', background: statut.bg, color: statut.text }}>
                    {statut.label}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </aside>

      {/* ═══════════════════ PANNEAU CENTRAL — Éditeur ═══════════════════ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px', minWidth: 0 }}>

        {(!annonceSelectId && !modeCreer) ? (
          <div className="dtl-card" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--color-dark-muted)' }}>
            <Mic2 className="h-10 w-10 mx-auto mb-4" style={{ opacity: 0.3 }} />
            <p style={{ fontSize: '14px' }}>Sélectionnez une annonce dans l'historique ou créez-en une nouvelle.</p>
          </div>
        ) : (
          <>
            {/* Barre d'outils */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 750, color: 'var(--color-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mic2 className="h-5 w-5 text-[#1B4F8A]" />
                {modeCreer ? 'Nouvelle Annonce' : formData.titreSession}
              </h2>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {!modeCreer && annonceSelectId && (
                  <>
                    <button
                      className="btn-sec"
                      style={{ fontSize: '11.5px', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                      onClick={() => setModeApercu(!modeApercu)}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Aperçu
                    </button>
                    <button
                      className="btn-sec"
                      style={{ fontSize: '11.5px', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                      onClick={() => window.print()}
                    >
                      <Printer className="h-3.5 w-3.5" />
                      Imprimer
                    </button>
                    <button
                      className="btn-sec"
                      style={{ fontSize: '11.5px', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                      onClick={dupliquerPourSemaineSuivante}
                    >
                      <Copy className="h-3.5 w-3.5" />
                      Dupliquer
                    </button>
                    {formData.statut === 'BROUILLON' && (
                      <button
                        className="btn-prim"
                        style={{ fontSize: '11.5px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--color-success)' }}
                        onClick={() => changerStatut('PRESENTEE')}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Marquer Présentée
                      </button>
                    )}
                    {formData.statut !== 'ARCHIVEE' && (
                      <button
                        className="btn-sec"
                        style={{ fontSize: '11.5px', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '4px', borderColor: 'var(--color-warning)', color: 'var(--color-warning)' }}
                        onClick={() => changerStatut('ARCHIVEE')}
                      >
                        <Archive className="h-3.5 w-3.5" />
                        Archiver
                      </button>
                    )}
                  </>
                )}
                <button
                  className="btn-prim"
                  style={{ fontSize: '11.5px', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  onClick={sauvegarder}
                  disabled={creerMutation.isPending || modifierMutation.isPending}
                >
                  <Save className="h-3.5 w-3.5" />
                  Sauvegarder
                </button>
              </div>
            </div>

            {/* Alertes */}
            {erreur && <div className="frm-alert err">{erreur}</div>}
            {succes && <div className="frm-alert ok">{succes}</div>}

            {/* Mode Aperçu */}
            <AnimatePresence>
              {modeApercu && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <ApercuAnnonce annonce={formData} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Section : Entête ── */}
            <div className="dtl-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <SectionTitre icone={<Calendar className="h-4 w-4" />} titre="Entête de l'Annonce" />
              <div className="frm-grid" style={{ gap: '10px' }}>
                <div className="frm-grp">
                  <label className="frm-lbl">Date du Dimanche *</label>
                  <input
                    type="date"
                    className="frm-inp"
                    value={formData.dateDimanche?.split('T')[0] ?? ''}
                    onChange={(e) => setFormData((f) => ({
                      ...f,
                      dateDimanche: e.target.value,
                      titreSession: f.titreSession === titreParDefaut(f.dateDimanche?.split('T')[0] ?? '')
                        ? titreParDefaut(e.target.value)
                        : f.titreSession,
                    }))}
                  />
                </div>
                <div className="frm-grp frm-span2" style={{ gridColumn: 'span 1' }}>
                  <label className="frm-lbl">Titre de la session *</label>
                  <input
                    type="text"
                    className="frm-inp"
                    value={formData.titreSession}
                    onChange={(e) => setFormData((f) => ({ ...f, titreSession: e.target.value }))}
                    placeholder="Ex: Culte du 06 juillet 2025"
                  />
                </div>
              </div>
              {!modeCreer && annonceActive && (
                <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: 'var(--color-dark-muted)', paddingTop: '4px', borderTop: '1px solid var(--color-border)', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock className="h-3 w-3" />
                    Créée le {formaterDate(annonceActive.dateCreation, true)}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Edit3 className="h-3 w-3" />
                    Modifiée le {formaterDate(annonceActive.dateModification, true)}
                  </span>
                </div>
              )}
            </div>

            {/* ── Section : Paiements Annoncés ── */}
            <div className="dtl-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => toggleSection('paiements')}
              >
                <SectionTitre icone={<DollarSign className="h-4 w-4" />} titre={`Paiements Annoncés (${formData.paiementsAnnonces.length})`} />
                {sectionsOuvertes.paiements ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
              </div>
              {sectionsOuvertes.paiements && (
                <>
                  {formData.paiementsAnnonces.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {formData.paiementsAnnonces.map((p, i) => (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 140px 160px auto', gap: '8px', alignItems: 'end' }}>
                          <div className="frm-grp" style={{ margin: 0 }}>
                            {i === 0 && <label className="frm-lbl">Libellé *</label>}
                            <input type="text" className="frm-inp" value={p.libelle}
                              onChange={(e) => modifierPaiement(i, 'libelle', e.target.value)}
                              placeholder="Ex: Dîmes de juin" />
                          </div>
                          <div className="frm-grp" style={{ margin: 0 }}>
                            {i === 0 && <label className="frm-lbl">Montant (FCFA)</label>}
                            <input type="number" className="frm-inp" value={p.montant}
                              onChange={(e) => modifierPaiement(i, 'montant', Number(e.target.value))}
                              min={0} placeholder="0" />
                          </div>
                          <div className="frm-grp" style={{ margin: 0 }}>
                            {i === 0 && <label className="frm-lbl">Caisse concernée</label>}
                            <select className="frm-inp" value={p.caisse ?? ''}
                              onChange={(e) => modifierPaiement(i, 'caisse', e.target.value)}>
                              <option value="">-- Optionnel --</option>
                              {caisses.map((c) => <option key={c.id} value={c.nom}>{c.nom}</option>)}
                            </select>
                          </div>
                          <button onClick={() => supprimerPaiement(i)} style={{ padding: '6px', background: 'none', border: '1px solid var(--color-border)', borderRadius: '6px', cursor: 'pointer', color: 'var(--color-danger)', marginTop: i === 0 ? '18px' : 0 }}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                      <div style={{ textAlign: 'right', fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)' }}>
                        Total annoncé : {formaterDevise(totalPaiements)}
                      </div>
                    </div>
                  )}
                  <button className="btn-sec" style={{ fontSize: '12px', alignSelf: 'flex-start' }} onClick={ajouterPaiement}>
                    <Plus className="h-3.5 w-3.5" /> Ajouter un paiement
                  </button>
                </>
              )}
            </div>

            {/* ── Section : Événements à venir ── */}
            <div className="dtl-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => toggleSection('evenements')}
              >
                <SectionTitre icone={<Calendar className="h-4 w-4" />} titre={`Événements à Venir (${formData.evenementsAVenir.length})`} />
                {sectionsOuvertes.evenements ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
              </div>
              {sectionsOuvertes.evenements && (
                <>
                  {formData.evenementsAVenir.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {formData.evenementsAVenir.map((ev, i) => (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto', gap: '8px', alignItems: 'end' }}>
                          <div className="frm-grp" style={{ margin: 0 }}>
                            {i === 0 && <label className="frm-lbl">Titre de l'événement *</label>}
                            <input type="text" className="frm-inp" value={ev.titre}
                              onChange={(e) => modifierEvenement(i, 'titre', e.target.value)}
                              placeholder="Ex: Convention nationale" />
                          </div>
                          <div className="frm-grp" style={{ margin: 0 }}>
                            {i === 0 && <label className="frm-lbl">Date</label>}
                            <input type="date" className="frm-inp" value={ev.date?.split('T')[0] ?? ''}
                              onChange={(e) => modifierEvenement(i, 'date', e.target.value)} />
                          </div>
                          <div className="frm-grp" style={{ margin: 0 }}>
                            {i === 0 && <label className="frm-lbl">Lieu</label>}
                            <input type="text" className="frm-inp" value={ev.lieu ?? ''}
                              onChange={(e) => modifierEvenement(i, 'lieu', e.target.value)}
                              placeholder="Ex: Temple principal" />
                          </div>
                          <button onClick={() => supprimerEvenement(i)} style={{ padding: '6px', background: 'none', border: '1px solid var(--color-border)', borderRadius: '6px', cursor: 'pointer', color: 'var(--color-danger)', marginTop: i === 0 ? '18px' : 0 }}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button className="btn-sec" style={{ fontSize: '12px' }} onClick={ajouterEvenement}>
                      <Plus className="h-3.5 w-3.5" /> Ajouter manuellement
                    </button>
                    {evenements.length > 0 && (
                      <button className="btn-sec" style={{ fontSize: '12px', borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }} onClick={importerEvenements}>
                        <ClipboardList className="h-3.5 w-3.5" /> Importer depuis le calendrier
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* ── Section : Notes Libres ── */}
            <div className="dtl-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => toggleSection('notes')}
              >
                <SectionTitre icone={<FileText className="h-4 w-4" />} titre="Notes Libres" />
                {sectionsOuvertes.notes ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
              </div>
              {sectionsOuvertes.notes && (
                <textarea
                  className="frm-inp frm-textarea"
                  value={formData.notesLibres}
                  onChange={(e) => setFormData((f) => ({ ...f, notesLibres: e.target.value }))}
                  placeholder="Toutes les notes importantes, rappels, messages spéciaux à communiquer à l'assemblée..."
                  style={{ minHeight: '120px', resize: 'vertical' }}
                />
              )}
            </div>

            {/* ── Section : Autres Points ── */}
            <div className="dtl-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => toggleSection('autres')}
              >
                <SectionTitre icone={<Bookmark className="h-4 w-4" />} titre={`Autres Points à Aborder (${formData.autresPoints.length})`} />
                {sectionsOuvertes.autres ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
              </div>
              {sectionsOuvertes.autres && (
                <>
                  {formData.autresPoints.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {formData.autresPoints.map((pt, i) => (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '8px', alignItems: 'end' }}>
                          <div className="frm-grp" style={{ margin: 0 }}>
                            {i === 0 && <label className="frm-lbl">Sujet *</label>}
                            <input type="text" className="frm-inp" value={pt.sujet}
                              onChange={(e) => modifierAutrePoint(i, 'sujet', e.target.value)}
                              placeholder="Sujet à aborder" />
                          </div>
                          <div className="frm-grp" style={{ margin: 0 }}>
                            {i === 0 && <label className="frm-lbl">Détails / Explications</label>}
                            <input type="text" className="frm-inp" value={pt.details ?? ''}
                              onChange={(e) => modifierAutrePoint(i, 'details', e.target.value)}
                              placeholder="Détails ou note complémentaire" />
                          </div>
                          <button onClick={() => supprimerAutrePoint(i)} style={{ padding: '6px', background: 'none', border: '1px solid var(--color-border)', borderRadius: '6px', cursor: 'pointer', color: 'var(--color-danger)', marginTop: i === 0 ? '18px' : 0 }}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <button className="btn-sec" style={{ fontSize: '12px', alignSelf: 'flex-start' }} onClick={ajouterAutrePoint}>
                    <Plus className="h-3.5 w-3.5" /> Ajouter un point
                  </button>
                </>
              )}
            </div>

            {/* Bouton Supprimer */}
            {!modeCreer && annonceSelectId && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  className="btn-sec"
                  style={{ fontSize: '11.5px', color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
                  onClick={async () => {
                    if (!confirm('Supprimer définitivement cette annonce ?')) return;
                    await supprimerMutation.mutateAsync(annonceSelectId);
                    setAnnonceSelectId(null);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Supprimer cette annonce
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// ─── Sous-composants ────────────────────────────────────────────────────────

function SectionTitre({ icone, titre }: { icone: React.ReactNode; titre: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
      <span style={{ color: 'var(--color-primary)' }}>{icone}</span>
      <h3 style={{ fontSize: '14px', fontWeight: 750, color: 'var(--color-dark)', margin: 0 }}>{titre}</h3>
    </div>
  );
}

function ApercuAnnonce({ annonce }: { annonce: Omit<AnnonceFinance, 'id' | 'dateCreation' | 'dateModification'> }) {
  const totalPaiements = annonce.paiementsAnnonces.reduce((s, p) => s + (Number(p.montant) || 0), 0);
  return (
    <div className="dtl-card print:block" style={{ background: 'var(--color-primary-soft)', border: '1px solid var(--color-primary)', borderRadius: '10px', padding: '20px', marginBottom: '4px' }}>
      <h3 style={{ textAlign: 'center', color: 'var(--color-primary)', fontWeight: 800, fontSize: '16px', marginBottom: '16px', paddingBottom: '10px', borderBottom: '2px solid var(--color-primary)' }}>
        📢 {annonce.titreSession}
      </h3>
      <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--color-dark-muted)', marginBottom: '16px' }}>
        {annonce.dateDimanche ? formaterDate(annonce.dateDimanche) : ''}
      </p>

      {annonce.paiementsAnnonces.length > 0 && (
        <div style={{ marginBottom: '14px' }}>
          <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '8px' }}>💰 Finances</h4>
          {annonce.paiementsAnnonces.map((p, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', padding: '4px 0', borderBottom: '1px dashed var(--color-border)' }}>
              <span>{p.libelle}{p.caisse ? ` (${p.caisse})` : ''}</span>
              <strong style={{ color: 'var(--color-primary)' }}>{formaterDevise(p.montant)}</strong>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 800, padding: '6px 0 0', color: 'var(--color-primary)' }}>
            <span>TOTAL</span>
            <span>{formaterDevise(totalPaiements)}</span>
          </div>
        </div>
      )}

      {annonce.evenementsAVenir.length > 0 && (
        <div style={{ marginBottom: '14px' }}>
          <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '8px' }}>📅 Événements à Venir</h4>
          {annonce.evenementsAVenir.map((ev, i) => (
            <div key={i} style={{ fontSize: '12.5px', padding: '4px 0', borderBottom: '1px dashed var(--color-border)' }}>
              <strong>{ev.titre}</strong>
              {ev.date && <span style={{ color: 'var(--color-dark-muted)' }}> — {formaterDate(ev.date)}</span>}
              {ev.lieu && <span style={{ color: 'var(--color-dark-muted)' }}> @ {ev.lieu}</span>}
            </div>
          ))}
        </div>
      )}

      {annonce.notesLibres && (
        <div style={{ marginBottom: '14px' }}>
          <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '6px' }}>📝 Notes</h4>
          <p style={{ fontSize: '12.5px', color: 'var(--color-dark-muted)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{annonce.notesLibres}</p>
        </div>
      )}

      {annonce.autresPoints.length > 0 && (
        <div>
          <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '8px' }}>📌 Autres Points</h4>
          {annonce.autresPoints.map((pt, i) => (
            <div key={i} style={{ fontSize: '12.5px', padding: '4px 0', borderBottom: '1px dashed var(--color-border)' }}>
              <strong>{pt.sujet}</strong>{pt.details ? ` : ${pt.details}` : ''}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AnnoncesDimanche;
