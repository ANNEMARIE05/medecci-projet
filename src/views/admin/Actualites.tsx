import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Search, Plus, Edit2, Trash2, Save } from 'lucide-react';
import actualiteService from '../../services/actualiteService';
import type { Actualite } from '../../stores/useDonneesStore';
import { formaterDate } from '../../utils/formateur';
import { motion, AnimatePresence } from 'framer-motion';

// Schéma de validation Zod
const schemaActu = zod.object({
  titre: zod.string().min(5, 'Le titre doit comporter au moins 5 caractères'),
  description: zod.string().min(10, 'La description doit comporter au moins 10 caractères'),
  contenu: zod.string().min(20, 'Le contenu doit faire au moins 20 caractères'),
  image: zod.string().url('L\'URL de l\'image doit être valide (ex: https://...)'),
  auteur: zod.string().min(2, 'Le nom de l\'auteur doit faire au moins 2 caractères'),
});

type FormActuInput = zod.infer<typeof schemaActu>;

export const Actualites: React.FC = () => {
  const [actus, setActus] = useState<Actualite[]>([]);
  const [recherche, setRecherche] = useState('');
  const [enChargement, setEnChargement] = useState(false);
  const [modaleOuverte, setModaleOuverte] = useState(false);
  const [actuEnModification, setActuEnModification] = useState<Actualite | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormActuInput>({
    resolver: zodResolver(schemaActu),
  });

  const chargerActus = async () => {
    setEnChargement(true);
    try {
      const data = await actualiteService.recupererActualites();
      setActus(data);
    } catch (e) {
      console.error(e);
    } finally {
      setEnChargement(false);
    }
  };

  useEffect(() => {
    chargerActus();
  }, []);

  const ouvrirAjout = () => {
    setActuEnModification(null);
    reset({
      titre: '',
      description: '',
      contenu: '',
      image: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&q=80&w=800',
      auteur: 'Secrétariat Général',
    });
    setModaleOuverte(true);
  };

  const ouvrirModification = (actu: Actualite) => {
    setActuEnModification(actu);
    setValue('titre', actu.titre);
    setValue('description', actu.description);
    setValue('contenu', actu.contenu);
    setValue('image', actu.image);
    setValue('auteur', actu.auteur);
    setModaleOuverte(true);
  };

  const handleSupprimer = async (id: string) => {
    if (window.confirm('Voulez-vous supprimer définitivement cet article ?')) {
      try {
        await actualiteService.supprimerActualite(id);
        chargerActus();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const onSubmit = async (donnees: FormActuInput) => {
    try {
      if (actuEnModification) {
        await actualiteService.modifierActualite(actuEnModification.id, donnees);
      } else {
        await actualiteService.creerActualite(donnees);
      }
      setModaleOuverte(false);
      chargerActus();
    } catch (e) {
      console.error(e);
    }
  };

  // Filtrage
  const actusFiltrées = actus.filter((a) =>
    a.titre.toLowerCase().includes(recherche.toLowerCase()) ||
    a.auteur.toLowerCase().includes(recherche.toLowerCase()) ||
    a.description.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* HEADER ACTIONS */}
      <div className="flt-bar" style={{ background: 'var(--color-bg-card)', borderRadius: 'var(--radius-md)', padding: '16px 20px', boxShadow: 'var(--shadow-sm)' }}>
        <div className="flt-left">
          <div className="s-wrap">
            <Search className="s-ico h-4.5 w-4.5" />
            <input
              type="text"
              placeholder="Rechercher actualité..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
            />
          </div>
        </div>
        <div className="flt-right">
          <button onClick={ouvrirAjout} className="btn-prim">
            <Plus className="h-4 w-4" />
            <span>Publier un Article</span>
          </button>
        </div>
      </div>

      {/* GRILLE D'ARTICLES */}
      {enChargement ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B4F8A]" />
        </div>
      ) : actusFiltrées.length === 0 ? (
        <div className="dtl-card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'var(--color-dark-muted)' }}>Aucun article publié pour le moment.</p>
        </div>
      ) : (
        <div className="caisse-grid">
          {actusFiltrées.map((actu) => (
            <div key={actu.id} className="caisse-card" style={{ gap: '10px' }}>
              <div style={{ height: '140px', width: '100%', overflow: 'hidden', borderRadius: '4px', background: '#e2e8f0' }}>
                <img src={actu.image} alt={actu.titre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontWeight: 'bold', color: 'var(--color-dark-muted)', textTransform: 'uppercase' }}>
                  <span>{formaterDate(actu.datePublication)}</span>
                  <span>Par {actu.auteur}</span>
                </div>
                <h4 style={{ fontSize: '13.5px', fontWeight: '750', color: 'var(--color-dark)', margin: 0, height: '36px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {actu.titre}
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--color-dark-muted)', lineHeight: '1.4', margin: 0, height: '50px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                  {actu.description}
                </p>
              </div>

              <div style={{ borderTop: '1px solid rgba(27,79,138,0.06)', paddingTop: '10px', display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: 'auto' }}>
                <button
                  onClick={() => ouvrirModification(actu)}
                  className="btn-edit"
                  style={{ padding: '6px 10px', fontSize: '11px' }}
                >
                  <Edit2 className="h-3 w-3" />
                  <span>Modifier</span>
                </button>
                <button
                  onClick={() => handleSupprimer(actu.id)}
                  className="btn-del"
                  style={{ padding: '6px 10px', fontSize: '11px' }}
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Retirer</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODALE AJOUT/MODIF */}
      <AnimatePresence>
        {modaleOuverte && (
          <div className="modal-overlay" onClick={() => setModaleOuverte(false)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="modal"
              style={{ maxWidth: '580px', width: '90%' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="modal-title font-poppins font-bold">
                {actuEnModification ? 'Modifier l\'Article' : 'Publier une Nouvelle Actualité'}
              </h3>

              <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="frm-grid" style={{ gap: '12px' }}>
                  <div className="frm-grp frm-span2">
                    <label className="frm-lbl">Titre de l'actualité *</label>
                    <input
                      type="text"
                      {...register('titre')}
                      className="frm-inp"
                      required
                    />
                    {errors.titre && <span style={{ fontSize: '10px', color: 'var(--color-danger)' }}>{errors.titre.message}</span>}
                  </div>

                  <div className="frm-grp">
                    <label className="frm-lbl">Auteur *</label>
                    <input
                      type="text"
                      {...register('auteur')}
                      className="frm-inp"
                      required
                    />
                    {errors.auteur && <span style={{ fontSize: '10px', color: 'var(--color-danger)' }}>{errors.auteur.message}</span>}
                  </div>

                  <div className="frm-grp">
                    <label className="frm-lbl">URL de l'image *</label>
                    <input
                      type="text"
                      {...register('image')}
                      className="frm-inp"
                      required
                    />
                    {errors.image && <span style={{ fontSize: '10px', color: 'var(--color-danger)' }}>{errors.image.message}</span>}
                  </div>

                  <div className="frm-grp frm-span2">
                    <label className="frm-lbl">Brève description d'accroche *</label>
                    <input
                      type="text"
                      {...register('description')}
                      className="frm-inp"
                      required
                    />
                    {errors.description && <span style={{ fontSize: '10px', color: 'var(--color-danger)' }}>{errors.description.message}</span>}
                  </div>

                  <div className="frm-grp frm-span2">
                    <label className="frm-lbl">Contenu complet de l'article *</label>
                    <textarea
                      {...register('contenu')}
                      className="frm-inp frm-textarea"
                      style={{ height: '120px' }}
                      required
                    />
                    {errors.contenu && <span style={{ fontSize: '10px', color: 'var(--color-danger)' }}>{errors.contenu.message}</span>}
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={() => setModaleOuverte(false)} className="btn-sec">
                    Annuler
                  </button>
                  <button type="submit" className="btn-prim">
                    <Save className="h-4 w-4" />
                    <span>Enregistrer l'article</span>
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

export default Actualites;
