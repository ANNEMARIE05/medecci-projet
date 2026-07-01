import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Search, Plus, Edit2, Trash2, Save, Mic, Video, Volume2, BookOpen } from 'lucide-react';
import sermonService from '../../services/sermonService';
import type { Sermon } from '../../stores/useDonneesStore';
import { formaterDate } from '../../utils/formateur';
import { motion, AnimatePresence } from 'framer-motion';

// Schéma de validation Zod
const schemaSermon = zod.object({
  titre: zod.string().min(5, 'Le titre doit comporter au moins 5 caractères'),
  predicateur: zod.string().min(2, 'Le nom du prédicateur doit faire au moins 2 caractères'),
  date: zod.string().nonempty('La date de prédication est obligatoire'),
  versetRef: zod.string().min(3, 'Le passage biblique de référence est obligatoire'),
  description: zod.string().min(10, 'La description doit comporter au moins 10 caractères'),
  lienYoutube: zod.string().url('L\'adresse vidéo YouTube doit être valide (ex: https://...)'),
  lienAudio: zod.string().url('L\'adresse audio du podcast doit être valide (ex: https://...)'),
});

type FormSermonInput = zod.infer<typeof schemaSermon>;

export const Sermons: React.FC = () => {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [recherche, setRecherche] = useState('');
  const [enChargement, setEnChargement] = useState(false);
  const [modaleOuverte, setModaleOuverte] = useState(false);
  const [sermonEnModification, setSermonEnModification] = useState<Sermon | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormSermonInput>({
    resolver: zodResolver(schemaSermon),
  });

  const chargerSermons = async () => {
    setEnChargement(true);
    try {
      const data = await sermonService.recupererSermons();
      setSermons(data);
    } catch (e) {
      console.error(e);
    } finally {
      setEnChargement(false);
    }
  };

  useEffect(() => {
    chargerSermons();
  }, []);

  const ouvrirAjout = () => {
    setSermonEnModification(null);
    reset({
      titre: '',
      predicateur: 'Pasteur Koffi Yao Emmanuel',
      date: new Date().toISOString().split('T')[0],
      versetRef: '',
      description: '',
      lienYoutube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      lienAudio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    });
    setModaleOuverte(true);
  };

  const ouvrirModification = (sermon: Sermon) => {
    setSermonEnModification(sermon);
    setValue('titre', sermon.titre);
    setValue('predicateur', sermon.predicateur);
    setValue('date', sermon.date);
    setValue('versetRef', sermon.versetRef);
    setValue('description', sermon.description);
    setValue('lienYoutube', sermon.lienYoutube);
    setValue('lienAudio', sermon.lienAudio);
    setModaleOuverte(true);
  };

  const handleSupprimer = async (id: string) => {
    if (window.confirm('Voulez-vous supprimer définitivement cette prédication ?')) {
      try {
        await sermonService.supprimerSermon(id);
        chargerSermons();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const onSubmit = async (donnees: FormSermonInput) => {
    try {
      if (sermonEnModification) {
        await sermonService.modifierSermon(sermonEnModification.id, donnees);
      } else {
        await sermonService.creerSermon(donnees);
      }
      setModaleOuverte(false);
      chargerSermons();
    } catch (e) {
      console.error(e);
    }
  };

  // Filtrage
  const sermonsFiltrés = sermons.filter((s) =>
    s.titre.toLowerCase().includes(recherche.toLowerCase()) ||
    s.predicateur.toLowerCase().includes(recherche.toLowerCase()) ||
    s.versetRef.toLowerCase().includes(recherche.toLowerCase())
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
              placeholder="Rechercher par titre, prédicateur, passage..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
            />
          </div>
        </div>
        <div className="flt-right">
          <button onClick={ouvrirAjout} className="btn-prim">
            <Plus className="h-4 w-4" />
            <span>Ajouter un Sermon</span>
          </button>
        </div>
      </div>

      {/* TABLEAU DES SERMONS */}
      <div className="tbl-card">
        {enChargement ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B4F8A]" />
          </div>
        ) : sermonsFiltrés.length === 0 ? (
          <div className="dtl-card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--color-dark-muted)' }}>Aucun sermon trouvé.</p>
          </div>
        ) : (
          <div className="tbl-scroll">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Titre & Prédicateur</th>
                  <th>Passage Biblique</th>
                  <th>Date de culte</th>
                  <th>Liens Média</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sermonsFiltrés.map((sermon) => (
                  <tr key={sermon.id}>
                    <td>
                      <div className="user-cell">
                        <div className="ava-sm">
                          <Mic className="h-4.5 w-4.5 text-[#1B4F8A]" />
                        </div>
                        <div>
                          <span className="user-name">{sermon.titre}</span>
                          <span className="user-sub">Par {sermon.predicateur}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary)', fontWeight: '600' }}>
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>{sermon.versetRef}</span>
                      </div>
                    </td>
                    <td className="col-muted">
                      {formaterDate(sermon.date)}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {sermon.lienYoutube && (
                          <a href={sermon.lienYoutube} target="_blank" rel="noreferrer" title="Vidéo" style={{ color: '#ef4444' }}>
                            <Video className="h-4.5 w-4.5" />
                          </a>
                        )}
                        {sermon.lienAudio && (
                          <a href={sermon.lienAudio} target="_blank" rel="noreferrer" title="Audio" style={{ color: 'var(--color-accent)' }}>
                            <Volume2 className="h-4.5 w-4.5" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="act-cell" style={{ justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => ouvrirModification(sermon)}
                          className="btn-edit"
                          title="Modifier"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          <span>Modifier</span>
                        </button>
                        <button
                          onClick={() => handleSupprimer(sermon.id)}
                          className="btn-del"
                          title="Supprimer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
                {sermonEnModification ? 'Modifier la Prédication' : 'Ajouter un Nouveau Sermon'}
              </h3>

              <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="frm-grid" style={{ gap: '12px' }}>
                  <div className="frm-grp frm-span2">
                    <label className="frm-lbl">Titre du sermon *</label>
                    <input
                      type="text"
                      {...register('titre')}
                      className="frm-inp"
                      required
                    />
                    {errors.titre && <span style={{ fontSize: '10px', color: 'var(--color-danger)' }}>{errors.titre.message}</span>}
                  </div>

                  <div className="frm-grp">
                    <label className="frm-lbl">Prédicateur *</label>
                    <input
                      type="text"
                      {...register('predicateur')}
                      className="frm-inp"
                      required
                    />
                    {errors.predicateur && <span style={{ fontSize: '10px', color: 'var(--color-danger)' }}>{errors.predicateur.message}</span>}
                  </div>

                  <div className="frm-grp">
                    <label className="frm-lbl">Date du Culte *</label>
                    <input
                      type="date"
                      {...register('date')}
                      className="frm-inp"
                      required
                    />
                    {errors.date && <span style={{ fontSize: '10px', color: 'var(--color-danger)' }}>{errors.date.message}</span>}
                  </div>

                  <div className="frm-grp frm-span2">
                    <label className="frm-lbl">Passage de référence (Verset) *</label>
                    <input
                      type="text"
                      {...register('versetRef')}
                      placeholder="Ex: Jean 3:16"
                      className="frm-inp"
                      required
                    />
                    {errors.versetRef && <span style={{ fontSize: '10px', color: 'var(--color-danger)' }}>{errors.versetRef.message}</span>}
                  </div>

                  <div className="frm-grp">
                    <label className="frm-lbl">Lien Vidéo YouTube</label>
                    <input
                      type="text"
                      {...register('lienYoutube')}
                      className="frm-inp"
                    />
                    {errors.lienYoutube && <span style={{ fontSize: '10px', color: 'var(--color-danger)' }}>{errors.lienYoutube.message}</span>}
                  </div>

                  <div className="frm-grp">
                    <label className="frm-lbl">Lien Audio Podcast</label>
                    <input
                      type="text"
                      {...register('lienAudio')}
                      className="frm-inp"
                    />
                    {errors.lienAudio && <span style={{ fontSize: '10px', color: 'var(--color-danger)' }}>{errors.lienAudio.message}</span>}
                  </div>

                  <div className="frm-grp frm-span2">
                    <label className="frm-lbl">Description / Résumé du sermon *</label>
                    <textarea
                      {...register('description')}
                      className="frm-inp frm-textarea"
                      style={{ height: '80px' }}
                      required
                    />
                    {errors.description && <span style={{ fontSize: '10px', color: 'var(--color-danger)' }}>{errors.description.message}</span>}
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={() => setModaleOuverte(false)} className="btn-sec">
                    Annuler
                  </button>
                  <button type="submit" className="btn-prim">
                    <Save className="h-4 w-4" />
                    <span>Enregistrer le sermon</span>
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

export default Sermons;
