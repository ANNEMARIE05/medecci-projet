import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Inbox, CheckCircle2, AlertCircle, Send, User, Phone, Edit, MessageSquare } from 'lucide-react';
import suggestionService from '../../services/suggestionService';
import { PHOTOS } from '../../constants/photos';

const schemaSuggestion = zod.object({
  nom: zod.string().min(3, 'Le nom doit faire au moins 3 caractères (ou "Anonyme")'),
  telephone: zod.string().min(8, 'Le numéro de téléphone doit faire au moins 8 chiffres'),
  sujet: zod.string().min(4, 'Le sujet doit faire au moins 4 caractères'),
  message: zod.string().min(10, 'Le message doit faire au moins 10 caractères'),
});

type FormSuggestionInput = zod.infer<typeof schemaSuggestion>;

export const Suggestions: React.FC = () => {
  const [enCours, setEnCours] = useState(false);
  const [succes, setSucces] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormSuggestionInput>({
    resolver: zodResolver(schemaSuggestion),
    defaultValues: {
      nom: '',
      telephone: '',
      sujet: '',
      message: '',
    }
  });

  const getPhoto = (index: number, fallback: string) => {
    return PHOTOS && PHOTOS.length > index ? PHOTOS[index] : fallback;
  };

  const onSubmit = async (donnees: FormSuggestionInput) => {
    setEnCours(true);
    try {
      await suggestionService.soumettreSuggestion(donnees);
      setSucces(true);
      reset();
      setTimeout(() => setSucces(false), 6000);
    } catch (error) {
      console.error("Erreur lors de la soumission de la suggestion", error);
    } finally {
      setEnCours(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] pb-20 space-y-16 font-outfit">
      
      {/* HEADER SECTION */}
      <section className="relative bg-slate-950 text-white py-24 text-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{
            backgroundImage: `url('${getPhoto(12, 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1200')}')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/95" />
        <div className="relative max-w-4xl mx-auto px-4 space-y-4 z-10">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-medecci-or bg-white/10 px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm">
            BOÎTE À SUGGESTIONS ECLESIASTIQUE
          </span>
          <h1 className="font-cormorant italic font-bold text-4xl sm:text-7xl leading-tight tracking-tight">
            Suggestions & Avis
          </h1>
          <p className="text-slate-350 text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed">
            Votre avis compte pour faire grandir l'œuvre du Seigneur. Partagez vos idées constructives pour l'amélioration de la vie communautaire et de nos services.
          </p>
        </div>
      </section>

      {/* FORM SECTION */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E2E8F0] shadow-sm space-y-8 text-left">
          
          <div className="flex items-center space-x-3.5 pb-4 border-b border-slate-100">
            <div className="p-2.5 bg-[#0B3C91]/5 text-[#0B3C91] rounded-xl">
              <Inbox className="h-5.5 w-5.5" />
            </div>
            <div>
              <h3 className="font-poppins font-black text-slate-800 text-base">Soumettre une suggestion</h3>
              <p className="text-slate-400 text-[10px] font-light mt-0.5">Vos propositions seront lues avec attention par le conseil pastoral.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {succes && (
              <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl flex items-start space-x-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold">Suggestion enregistrée !</p>
                  <p className="font-light mt-0.5 text-emerald-700">Merci pour votre contribution spirituelle et constructive. Que Dieu vous bénisse abondamment.</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Nom */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Votre nom complet / Anonyme *</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 h-4 w-4 text-slate-450" />
                  <input
                    type="text"
                    placeholder="Saisissez votre nom ou 'Anonyme'"
                    {...register('nom')}
                    className={`w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border ${
                      errors.nom ? 'border-red-400 focus:border-red-400' : 'border-[#E2E8F0] focus:border-[#1E88E5]'
                    } focus:outline-none text-xs font-medium text-slate-800`}
                  />
                </div>
                {errors.nom && (
                  <span className="text-[10px] text-red-500 flex items-center space-x-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>{errors.nom.message}</span>
                  </span>
                )}
              </div>

              {/* Téléphone */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Numéro de téléphone *</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-3.5 h-4 w-4 text-slate-450" />
                  <input
                    type="text"
                    placeholder="ex: 0758526766"
                    {...register('telephone')}
                    className={`w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border ${
                      errors.telephone ? 'border-red-400 focus:border-red-400' : 'border-[#E2E8F0] focus:border-[#1E88E5]'
                    } focus:outline-none text-xs font-medium text-slate-800`}
                  />
                </div>
                {errors.telephone && (
                  <span className="text-[10px] text-red-500 flex items-center space-x-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>{errors.telephone.message}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Sujet */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Sujet de votre proposition *</label>
              <div className="relative">
                <Edit className="absolute left-4 top-3.5 h-4 w-4 text-slate-455" />
                <input
                  type="text"
                  placeholder="De quoi s'agit-il ? (ex: Amélioration de la sonorisation)"
                  {...register('sujet')}
                  className={`w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border ${
                    errors.sujet ? 'border-red-400 focus:border-red-400' : 'border-[#E2E8F0] focus:border-[#1E88E5]'
                  } focus:outline-none text-xs font-medium text-slate-800`}
                />
              </div>
              {errors.sujet && (
                <span className="text-[10px] text-red-500 flex items-center space-x-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>{errors.sujet.message}</span>
                </span>
              )}
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Détaillez votre suggestion *</label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-3.5 h-4 w-4 text-slate-455" />
                <textarea
                  rows={6}
                  placeholder="Décrivez votre idée, conseil ou suggestion de manière constructive..."
                  {...register('message')}
                  className={`w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border ${
                    errors.message ? 'border-red-400 focus:border-red-400' : 'border-[#E2E8F0] focus:border-[#1E88E5]'
                  } focus:outline-none text-xs resize-none font-medium text-slate-800`}
                />
              </div>
              {errors.message && (
                <span className="text-[10px] text-red-500 flex items-center space-x-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>{errors.message.message}</span>
                </span>
              )}
            </div>

            {/* Submit button with spinner loader */}
            <div className="pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={enCours}
                className="w-full flex items-center justify-center bg-gradient-to-r from-medecci-bleuRoyal to-medecci-bleuClair text-white py-4 rounded-xl font-bold shadow-lg hover:opacity-95 transition-all duration-300 disabled:opacity-50 text-xs cursor-pointer"
              >
                {enCours ? (
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span>{enCours ? 'Soumission en cours...' : 'Envoyer ma suggestion'}</span>
              </button>
            </div>

          </form>
        </div>
      </section>

    </div>
  );
};

export default Suggestions;
