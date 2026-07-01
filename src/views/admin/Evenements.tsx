import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Search, Plus, Edit2, Trash2, Save, Calendar, MapPin, Tag } from 'lucide-react';
import evenementService from '../../services/evenementService';
import type { Evenement } from '../../stores/useDonneesStore';
import { formaterDate } from '../../utils/formateur';
import { motion, AnimatePresence } from 'framer-motion';

// Schéma de validation Zod
const schemaEvenement = zod.object({
  titre: zod.string().min(5, 'Le titre doit comporter au moins 5 caractères'),
  description: zod.string().min(10, 'La description doit comporter au moins 10 caractères'),
  dateDebut: zod.string().nonempty('La date de début est obligatoire'),
  dateFin: zod.string().nonempty('La date de fin est obligatoire'),
  lieu: zod.string().min(3, 'Le lieu de l\'événement est obligatoire'),
  image: zod.string().url('L\'URL de l\'image doit être valide (ex: https://...)'),
  categorie: zod.string().min(2, 'La catégorie est obligatoire (ex: Prière, Jeunesse...)'),
});

type FormEvenementInput = zod.infer<typeof schemaEvenement>;

export const Evenements: React.FC = () => {
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [recherche, setRecherche] = useState('');
  const [enChargement, setEnChargement] = useState(false);
  const [modaleOuverte, setModaleOuverte] = useState(false);
  const [evenementEnModification, setEvenementEnModification] = useState<Evenement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormEvenementInput>({
    resolver: zodResolver(schemaEvenement),
  });

  const chargerEvenements = async () => {
    setEnChargement(true);
    try {
      const data = await evenementService.recupererEvenements();
      setEvenements(data);
    } catch (e) {
      console.error(e);
    } finally {
      setEnChargement(false);
    }
  };

  useEffect(() => {
    chargerEvenements();
  }, []);

  const ouvrirAjout = () => {
    setEvenementEnModification(null);
    reset({
      titre: '',
      description: '',
      dateDebut: new Date().toISOString().slice(0, 16), // datetime-local format
      dateFin: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
      lieu: 'Siège National, Koumassi',
      image: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&q=80&w=800',
      categorie: 'Prière',
    });
    setModaleOuverte(true);
  };

  const ouvrirModification = (ev: Evenement) => {
    setEvenementEnModification(ev);
    setValue('titre', ev.titre);
    setValue('description', ev.description);
    setValue('dateDebut', new Date(ev.dateDebut).toISOString().slice(0, 16));
    setValue('dateFin', new Date(ev.dateFin).toISOString().slice(0, 16));
    setValue('lieu', ev.lieu);
    setValue('image', ev.image);
    setValue('categorie', ev.categorie);
    setModaleOuverte(true);
  };

  const handleSupprimer = async (id: string) => {
    if (window.confirm('Voulez-vous supprimer définitivement cet événement ?')) {
      try {
        await evenementService.supprimerEvenement(id);
        chargerEvenements();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const onSubmit = async (donnees: FormEvenementInput) => {
    const dateDebutISO = new Date(donnees.dateDebut).toISOString();
    const dateFinISO = new Date(donnees.dateFin).toISOString();

    const payload = {
      ...donnees,
      dateDebut: dateDebutISO,
      dateFin: dateFinISO,
    };

    try {
      if (evenementEnModification) {
        await evenementService.modifierEvenement(evenementEnModification.id, payload);
      } else {
        await evenementService.creerEvenement(payload);
      }
      setModaleOuverte(false);
      chargerEvenements();
    } catch (e) {
      console.error(e);
    }
  };

  // Filtrage
  const evsFiltrés = evenements.filter((e) =>
    e.titre.toLowerCase().includes(recherche.toLowerCase()) ||
    e.lieu.toLowerCase().includes(recherche.toLowerCase()) ||
    e.categorie.toLowerCase().includes(recherche.toLowerCase())
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
              placeholder="Rechercher par titre, lieu, catégorie..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
            />
          </div>
        </div>
        <div className="flt-right">
          <button onClick={ouvrirAjout} className="btn-prim">
            <Plus className="h-4 w-4" />
            <span>Planifier un Événement</span>
          </button>
        </div>
      </div>

      {/* LISTE DES ÉVÉNEMENTS */}
      {enChargement ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B4F8A]" />
        </div>
      ) : evsFiltrés.length === 0 ? (
        <div className="dtl-card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'var(--color-dark-muted)' }}>Aucun événement planifié pour le moment.</p>
        </div>
      ) : (
        <div className="caisse-grid">
          {evsFiltrés.map((ev) => (
            <div key={ev.id} className="caisse-card" style={{ gap: '10px' }}>
              <div style={{ height: '140px', width: '100%', overflow: 'hidden', borderRadius: '4px', position: 'relative', background: '#e2e8f0' }}>
                <img src={ev.image} alt={ev.titre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{ position: 'absolute', top: '8px', left: '8px', background: 'var(--color-primary)', color: 'white', fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag className="h-3 w-3" />
                  <span>{ev.categorie}</span>
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                <h4 style={{ fontSize: '13.5px', fontWeight: '750', color: 'var(--color-dark)', margin: 0, height: '20px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {ev.titre}
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--color-dark-muted)', lineHeight: '1.4', margin: 0, height: '36px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {ev.description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px', fontSize: '11px', color: 'var(--color-dark-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar className="h-3.5 w-3.5" style={{ color: 'var(--color-primary)' }} />
                    <span>Du {formaterDate(ev.dateDebut)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin className="h-3.5 w-3.5" />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.lieu}</span>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(27,79,138,0.06)', paddingTop: '10px', display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: 'auto' }}>
                <button
                  onClick={() => ouvrirModification(ev)}
                  className="btn-edit"
                  style={{ padding: '6px 10px', fontSize: '11px' }}
                >
                  <Edit2 className="h-3 w-3" />
                  <span>Modifier</span>
                </button>
                <button
                  onClick={() => handleSupprimer(ev.id)}
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
                {evenementEnModification ? 'Modifier l\'Événement' : 'Planifier un Nouvel Événement'}
              </h3>

              <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="frm-grid" style={{ gap: '12px' }}>
                  <div className="frm-grp frm-span2">
                    <label className="frm-lbl">Titre de l'événement *</label>
                    <input
                      type="text"
                      {...register('titre')}
                      className="frm-inp"
                      required
                    />
                    {errors.titre && <span style={{ fontSize: '10px', color: 'var(--color-danger)' }}>{errors.titre.message}</span>}
                  </div>

                  <div className="frm-grp">
                    <label className="frm-lbl">Catégorie *</label>
                    <input
                      type="text"
                      {...register('categorie')}
                      placeholder="Prière, Fête, Jeunesse..."
                      className="frm-inp"
                      required
                    />
                    {errors.categorie && <span style={{ fontSize: '10px', color: 'var(--color-danger)' }}>{errors.categorie.message}</span>}
                  </div>

                  <div className="frm-grp">
                    <label className="frm-lbl">Lieu de l'événement *</label>
                    <input
                      type="text"
                      {...register('lieu')}
                      className="frm-inp"
                      required
                    />
                    {errors.lieu && <span style={{ fontSize: '10px', color: 'var(--color-danger)' }}>{errors.lieu.message}</span>}
                  </div>

                  <div className="frm-grp">
                    <label className="frm-lbl">Date & Heure de début *</label>
                    <input
                      type="datetime-local"
                      {...register('dateDebut')}
                      className="frm-inp"
                      required
                    />
                    {errors.dateDebut && <span style={{ fontSize: '10px', color: 'var(--color-danger)' }}>{errors.dateDebut.message}</span>}
                  </div>

                  <div className="frm-grp">
                    <label className="frm-lbl">Date & Heure de fin *</label>
                    <input
                      type="datetime-local"
                      {...register('dateFin')}
                      className="frm-inp"
                      required
                    />
                    {errors.dateFin && <span style={{ fontSize: '10px', color: 'var(--color-danger)' }}>{errors.dateFin.message}</span>}
                  </div>

                  <div className="frm-grp frm-span2">
                    <label className="frm-lbl">Adresse URL de l'image *</label>
                    <input
                      type="text"
                      {...register('image')}
                      className="frm-inp"
                      required
                    />
                    {errors.image && <span style={{ fontSize: '10px', color: 'var(--color-danger)' }}>{errors.image.message}</span>}
                  </div>

                  <div className="frm-grp frm-span2">
                    <label className="frm-lbl">Description / Programme détaillé *</label>
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
                    <span>Planifier l'événement</span>
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

export default Evenements;
