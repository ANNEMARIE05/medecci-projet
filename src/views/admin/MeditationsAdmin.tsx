import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit, Trash2, Calendar, User, X, CheckCircle2, AlertCircle } from 'lucide-react';
import meditationService from '../../services/meditationService';
import type { Meditation } from '../../stores/useDonneesStore';
import { formaterDate } from '../../utils/formateur';

const schemaFormMed = zod.object({
  titre: zod.string().min(4, 'Le titre doit faire au moins 4 caractères'),
  versetRef: zod.string().min(3, 'Le verset de référence doit faire au moins 3 caractères (ex: Luc 18:1)'),
  versetTexte: zod.string().min(5, 'Le texte du verset doit faire au moins 5 caractères'),
  contenu: zod.string().min(10, 'Le contenu de la méditation doit faire au moins 10 caractères'),
  auteur: zod.string().min(3, 'Le nom de l\'auteur doit faire au moins 3 caractères'),
});

type FormMedInput = zod.infer<typeof schemaFormMed>;

export const MeditationsAdmin: React.FC = () => {
  const [meditations, setMeditations] = useState<Meditation[]>([]);
  const [recherche, setRecherche] = useState('');
  const [enChargement, setEnChargement] = useState(false);
  const [modalOuvert, setModalOuvert] = useState(false);
  const [selection, setSelection] = useState<Meditation | null>(null);
  const [actionSucces, setActionSucces] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormMedInput>({
    resolver: zodResolver(schemaFormMed)
  });

  const chargerMeditations = async () => {
    setEnChargement(true);
    try {
      const data = await meditationService.recupererMeditations();
      setMeditations(data);
    } catch (e) {
      console.error(e);
    } finally {
      setEnChargement(false);
    }
  };

  useEffect(() => {
    chargerMeditations();
  }, []);

  const ouvrirAjout = () => {
    setSelection(null);
    reset({
      titre: '',
      versetRef: '',
      versetTexte: '',
      contenu: '',
      auteur: 'Prophète ASSANDE Jacques'
    });
    setModalOuvert(true);
  };

  const ouvrirModification = (med: Meditation) => {
    setSelection(med);
    reset({
      titre: med.titre,
      versetRef: med.versetRef,
      versetTexte: med.versetTexte,
      contenu: med.contenu,
      auteur: med.auteur
    });
    setModalOuvert(true);
  };

  const handleSupprimer = async (id: string) => {
    if (window.confirm('Voulez-vous supprimer définitivement cette méditation ?')) {
      try {
        await meditationService.supprimerMeditation(id);
        setActionSucces('Méditation supprimée avec succès.');
        chargerMeditations();
        setTimeout(() => setActionSucces(''), 4000);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const onSubmit = async (donnees: FormMedInput) => {
    try {
      if (selection) {
        await meditationService.modifierMeditation(selection.id, donnees);
        setActionSucces('Méditation modifiée avec succès.');
      } else {
        await meditationService.ajouterMeditation(donnees);
        setActionSucces('Nouvelle méditation publiée avec succès.');
      }
      setModalOuvert(false);
      chargerMeditations();
      setTimeout(() => setActionSucces(''), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  const medsFiltrés = meditations.filter((m) =>
    m.titre.toLowerCase().includes(recherche.toLowerCase()) ||
    m.versetRef.toLowerCase().includes(recherche.toLowerCase()) ||
    m.auteur.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header section with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-poppins font-black text-[#0B3C91] text-xl sm:text-2xl text-left">Méditations Quotidiennes</h2>
          <p className="text-slate-400 text-[10px] font-light text-left mt-0.5">Rédigez et publiez le pain quotidien pour la communauté.</p>
        </div>
        <button
          onClick={ouvrirAjout}
          className="flex items-center justify-center space-x-2 bg-medecci-bleuRoyal hover:bg-medecci-bleuClair text-white px-5 py-3 rounded-xl text-xs font-bold shadow-md cursor-pointer transition-colors"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Rédiger une Méditation</span>
        </button>
      </div>

      {actionSucces && (
        <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl flex items-center space-x-2.5 text-xs text-left">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span className="font-bold">{actionSucces}</span>
        </div>
      )}

      {/* SEARCH AND FILTERS */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par titre, référence ou auteur..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-medecci-bleuClair text-xs font-medium"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-left">
        {enChargement ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0B3C91]" />
          </div>
        ) : medsFiltrés.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-xs font-light">Aucune méditation répertoriée.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Date de publication</th>
                  <th className="px-6 py-4">Titre</th>
                  <th className="px-6 py-4">Référence</th>
                  <th className="px-6 py-4">Auteur</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {medsFiltrés.map((med) => (
                  <tr key={med.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                      <div className="flex items-center space-x-1.5 font-medium">
                        <Calendar className="h-4 w-4" />
                        <span>{formaterDate(med.date)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">
                      {med.titre}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-1 rounded bg-blue-50 text-[#1E88E5] font-extrabold uppercase text-[9px] border border-blue-100/50">
                        {med.versetRef}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-semibold whitespace-nowrap">
                      <div className="flex items-center space-x-1.5">
                        <User className="h-3.5 w-3.5" />
                        <span>{med.auteur}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => ouvrirModification(med)}
                          className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-800 transition-colors"
                          title="Modifier"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleSupprimer(med.id)}
                          className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 transition-colors"
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

      {/* FORM DIALOG MODAL */}
      <AnimatePresence>
        {modalOuvert && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOuvert(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-2xl max-w-xl w-full shadow-2xl relative z-10 border border-slate-200 overflow-hidden text-left"
            >
              <div className="bg-[#0B3C91] p-6 text-white flex items-center justify-between">
                <div>
                  <h3 className="font-poppins font-black text-base sm:text-lg">
                    {selection ? 'Modifier la Méditation' : 'Rédiger une Méditation'}
                  </h3>
                  <p className="text-blue-100 text-[10px] font-light mt-0.5">Alimentez la foi de la communauté.</p>
                </div>
                <button
                  onClick={() => setModalOuvert(false)}
                  className="p-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                {/* Titre */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Titre de la méditation *</label>
                  <input
                    type="text"
                    {...register('titre')}
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:border-medecci-bleuClair text-xs font-medium"
                  />
                  {errors.titre && (
                    <span className="text-[9px] text-red-500 flex items-center space-x-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.titre.message}</span>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Référence biblique */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Verset de référence *</label>
                    <input
                      type="text"
                      placeholder="ex: Luc 18:1"
                      {...register('versetRef')}
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:border-medecci-bleuClair text-xs font-medium"
                    />
                    {errors.versetRef && (
                      <span className="text-[9px] text-red-500 flex items-center space-x-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>{errors.versetRef.message}</span>
                      </span>
                    )}
                  </div>

                  {/* Auteur */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Auteur de la méditation *</label>
                    <input
                      type="text"
                      {...register('auteur')}
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:border-medecci-bleuClair text-xs font-medium"
                    />
                    {errors.auteur && (
                      <span className="text-[9px] text-red-500 flex items-center space-x-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>{errors.auteur.message}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Verset Texte */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Texte intégral du Verset *</label>
                  <textarea
                    rows={2}
                    {...register('versetTexte')}
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:border-medecci-bleuClair text-xs resize-none"
                  />
                  {errors.versetTexte && (
                    <span className="text-[9px] text-red-500 flex items-center space-x-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.versetTexte.message}</span>
                    </span>
                  )}
                </div>

                {/* Contenu */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Corps de la méditation *</label>
                  <textarea
                    rows={7}
                    placeholder="Écrivez le message ici..."
                    {...register('contenu')}
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:border-medecci-bleuClair text-xs resize-none font-light"
                  />
                  {errors.contenu && (
                    <span className="text-[9px] text-red-500 flex items-center space-x-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.contenu.message}</span>
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-slate-100 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setModalOuvert(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-[#0B3C91] hover:bg-[#1E88E5] text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50 flex items-center justify-center cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent mr-2" />
                    ) : null}
                    <span>{selection ? 'Enregistrer' : 'Publier'}</span>
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

export default MeditationsAdmin;
