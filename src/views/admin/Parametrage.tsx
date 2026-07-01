import React, { useState } from 'react';
import { useDonneesStore } from '../../stores/useDonneesStore';
import { Plus, Edit2, Trash2, Check, Tags, ShieldAlert } from 'lucide-react';

export const Parametrage: React.FC = () => {
  const store = useDonneesStore();
  const { categories, statuts } = store;

  // Gestion des onglets
  const [ongletActif, setOngletActif] = useState<'categories' | 'statuts'>('categories');

  // États locaux de gestion des catégories
  const [nouvelleCategorie, setNouvelleCategorie] = useState('');
  const [catEnModification, setCatEnModification] = useState<string | null>(null);
  const [nomCatModifie, setNomCatModifie] = useState('');

  // États locaux de gestion des statuts
  const [nouveauStatut, setNouveauStatut] = useState('');
  const [statutEnModification, setStatutEnModification] = useState<string | null>(null);
  const [nomStatutModifie, setNomStatutModifie] = useState('');

  // États d'alertes partagés
  const [errorText, setErrorText] = useState('');
  const [successText, setSuccessText] = useState('');

  // Action : Ajouter catégorie
  const gererAjoutCat = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');
    setSuccessText('');

    const nomClean = nouvelleCategorie.trim();
    if (!nomClean) {
      setErrorText('Le nom de la catégorie ne peut pas être vide.');
      return;
    }

    const res = store.ajouterCategorie(nomClean);
    if (res.success) {
      setSuccessText(`La catégorie "${nomClean}" a été ajoutée.`);
      setNouvelleCategorie('');
      setTimeout(() => setSuccessText(''), 2000);
    } else {
      setErrorText(res.error || 'Erreur lors de l\'ajout.');
    }
  };

  // Action : Modifier catégorie
  const gererModificationCat = (ancienneCat: string) => {
    setErrorText('');
    setSuccessText('');

    const nomClean = nomCatModifie.trim();
    if (!nomClean) {
      setErrorText('Le nom modifié ne peut pas être vide.');
      return;
    }

    const res = store.modifierCategorie(ancienneCat, nomClean);
    if (res.success) {
      setSuccessText(`La catégorie a été renommée en "${nomClean}".`);
      setCatEnModification(null);
      setNomCatModifie('');
      setTimeout(() => setSuccessText(''), 2000);
    } else {
      setErrorText(res.error || 'Erreur de modification.');
    }
  };

  // Action : Supprimer catégorie
  const gererSuppressionCat = (cat: string) => {
    setErrorText('');
    setSuccessText('');

    if (window.confirm(`Voulez-vous vraiment supprimer la catégorie "${cat}" ?`)) {
      const res = store.supprimerCategorie(cat);
      if (res.success) {
        setSuccessText(`La catégorie "${cat}" a été supprimée.`);
        setTimeout(() => setSuccessText(''), 2000);
      } else {
        setErrorText(res.error || 'Erreur de suppression.');
      }
    }
  };

  // Action : Ajouter statut
  const gererAjoutStatut = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');
    setSuccessText('');

    const nomClean = nouveauStatut.trim();
    if (!nomClean) {
      setErrorText('Le nom du statut ne peut pas être vide.');
      return;
    }

    const res = store.ajouterStatut(nomClean);
    if (res.success) {
      setSuccessText(`Le statut "${nomClean}" a été ajouté.`);
      setNouveauStatut('');
      setTimeout(() => setSuccessText(''), 2000);
    } else {
      setErrorText(res.error || 'Erreur lors de l\'ajout.');
    }
  };

  // Action : Modifier statut
  const gererModificationStatut = (ancienStatut: string) => {
    setErrorText('');
    setSuccessText('');

    const nomClean = nomStatutModifie.trim();
    if (!nomClean) {
      setErrorText('Le nom modifié ne peut pas être vide.');
      return;
    }

    const res = store.modifierStatut(ancienStatut, nomClean);
    if (res.success) {
      setSuccessText(`Le statut a été renommé en "${nomClean}".`);
      setStatutEnModification(null);
      setNomStatutModifie('');
      setTimeout(() => setSuccessText(''), 2000);
    } else {
      setErrorText(res.error || 'Erreur de modification.');
    }
  };

  // Action : Supprimer statut
  const gererSuppressionStatut = (statut: string) => {
    setErrorText('');
    setSuccessText('');

    if (window.confirm(`Voulez-vous vraiment supprimer le statut "${statut}" ?\nLes membres ayant ce statut seront réaffectés par défaut.`)) {
      const res = store.supprimerStatut(statut);
      if (res.success) {
        setSuccessText(`Le statut "${statut}" a été supprimé.`);
        setTimeout(() => setSuccessText(''), 2000);
      } else {
        setErrorText(res.error || 'Erreur de suppression.');
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Barre d'onglets premium */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
        <button
          onClick={() => {
            setOngletActif('categories');
            setErrorText('');
            setSuccessText('');
          }}
          className={ongletActif === 'categories' ? 'btn-prim' : 'btn-sec'}
          style={{ 
            padding: '8px 18px', 
            borderRadius: '8px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontWeight: 600
          }}
        >
          <Tags className="h-4 w-4" />
          <span>Catégories Financières</span>
        </button>
        <button
          onClick={() => {
            setOngletActif('statuts');
            setErrorText('');
            setSuccessText('');
          }}
          className={ongletActif === 'statuts' ? 'btn-prim' : 'btn-sec'}
          style={{ 
            padding: '8px 18px', 
            borderRadius: '8px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontWeight: 600
          }}
        >
          <ShieldAlert className="h-4 w-4" />
          <span>Statuts des Membres</span>
        </button>
      </div>

      {/* ZONE : ONGLETS */}
      {ongletActif === 'categories' ? (
        <div className="dtl-grid" style={{ gridTemplateColumns: '0.8fr 1.2fr', gap: '20px' }}>
          {/* Formulaire ajout catégorie */}
          <div className="frm-card" style={{ height: 'fit-content' }}>
            <div className="frm-section">Nouvelle Catégorie</div>

            {errorText && <div className="frm-alert err">{errorText}</div>}
            {successText && <div className="frm-alert ok">{successText}</div>}

            <form onSubmit={gererAjoutCat} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="frm-grp">
                <label className="frm-lbl">Nom de la catégorie *</label>
                <input
                  type="text"
                  placeholder="Ex: Projet Spécial, Mission, Dîme..."
                  value={nouvelleCategorie}
                  onChange={(e) => setNouvelleCategorie(e.target.value)}
                  className="frm-inp"
                  required
                />
              </div>

              <button type="submit" className="btn-prim" style={{ justifyContent: 'center' }}>
                <Plus className="h-4 w-4" />
                <span>Ajouter la catégorie</span>
              </button>
            </form>
          </div>

          {/* Liste catégories */}
          <div className="tbl-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="frm-section">Catégories Enregistrées</div>

            <div className="tbl-scroll">
              <table className="tbl">
                <thead>
                  <tr>
                    <th style={{ width: '44px' }}>#</th>
                    <th>Nom de la catégorie</th>
                    <th style={{ textAlign: 'right', width: '120px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="empty-td">
                        Aucune catégorie paramétrée.
                      </td>
                    </tr>
                  ) : (
                    categories.map((cat, idx) => (
                      <tr key={cat}>
                        <td className="col-num">{idx + 1}</td>
                        <td>
                          {catEnModification === cat ? (
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <input
                                type="text"
                                value={nomCatModifie}
                                onChange={(e) => setNomCatModifie(e.target.value)}
                                className="frm-inp"
                                style={{ height: '32px', padding: '4px 10px' }}
                                autoFocus
                              />
                              <button
                                onClick={() => gererModificationCat(cat)}
                                className="btn-prim"
                                style={{ padding: '4px 8px', borderRadius: '5px' }}
                                title="Valider"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <span className="fw700">{cat}</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {catEnModification === cat ? (
                            <button
                              onClick={() => {
                                setCatEnModification(null);
                                setNomCatModifie('');
                              }}
                              className="btn-sec"
                              style={{ padding: '4px 8px', borderRadius: '5px', fontSize: '11px' }}
                            >
                              Annuler
                            </button>
                          ) : (
                            <div className="act-cell" style={{ justifyContent: 'flex-end' }}>
                              <button
                                onClick={() => {
                                  setCatEnModification(cat);
                                  setNomCatModifie(cat);
                                }}
                                className="btn-edit"
                                title="Modifier"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => gererSuppressionCat(cat)}
                                className="btn-del"
                                title="Supprimer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="dtl-grid" style={{ gridTemplateColumns: '0.8fr 1.2fr', gap: '20px' }}>
          {/* Formulaire ajout statut */}
          <div className="frm-card" style={{ height: 'fit-content' }}>
            <div className="frm-section">Nouveau Statut de Membre</div>

            {errorText && <div className="frm-alert err">{errorText}</div>}
            {successText && <div className="frm-alert ok">{successText}</div>}

            <form onSubmit={gererAjoutStatut} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="frm-grp">
                <label className="frm-lbl">Nom du statut *</label>
                <input
                  type="text"
                  placeholder="Ex: Ancien d'église, Membre d'honneur..."
                  value={nouveauStatut}
                  onChange={(e) => setNouveauStatut(e.target.value)}
                  className="frm-inp"
                  required
                />
              </div>

              <button type="submit" className="btn-prim" style={{ justifyContent: 'center' }}>
                <Plus className="h-4 w-4" />
                <span>Ajouter le statut</span>
              </button>
            </form>
          </div>

          {/* Liste statuts */}
          <div className="tbl-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="frm-section">Statuts Enregistrés</div>

            <div className="tbl-scroll">
              <table className="tbl">
                <thead>
                  <tr>
                    <th style={{ width: '44px' }}>#</th>
                    <th>Nom du statut</th>
                    <th style={{ textAlign: 'right', width: '120px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {statuts.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="empty-td">
                        Aucun statut paramétré.
                      </td>
                    </tr>
                  ) : (
                    statuts.map((st, idx) => (
                      <tr key={st}>
                        <td className="col-num">{idx + 1}</td>
                        <td>
                          {statutEnModification === st ? (
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <input
                                type="text"
                                value={nomStatutModifie}
                                onChange={(e) => setNomStatutModifie(e.target.value)}
                                className="frm-inp"
                                style={{ height: '32px', padding: '4px 10px' }}
                                autoFocus
                              />
                              <button
                                onClick={() => gererModificationStatut(st)}
                                className="btn-prim"
                                style={{ padding: '4px 8px', borderRadius: '5px' }}
                                title="Valider"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <span className="fw700">{st}</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {statutEnModification === st ? (
                            <button
                              onClick={() => {
                                setStatutEnModification(null);
                                setNomStatutModifie('');
                              }}
                              className="btn-sec"
                              style={{ padding: '4px 8px', borderRadius: '5px', fontSize: '11px' }}
                            >
                              Annuler
                            </button>
                          ) : (
                            <div className="act-cell" style={{ justifyContent: 'flex-end' }}>
                              <button
                                onClick={() => {
                                  setStatutEnModification(st);
                                  setNomStatutModifie(st);
                                }}
                                className="btn-edit"
                                title="Modifier"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => gererSuppressionStatut(st)}
                                className="btn-del"
                                title="Supprimer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Parametrage;
