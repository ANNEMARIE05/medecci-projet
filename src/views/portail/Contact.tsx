import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, MapPin, Send, CheckCircle2, AlertCircle, Clock, Award } from 'lucide-react';
import { INFOS_CONTACT } from '../../constants';
import { PHOTOS } from '../../constants/photos';
import suggestionService from '../../services/suggestionService';

// Schéma de validation Zod pour Contact
const schemaContact = zod.object({
  nomComplet: zod.string().min(3, 'Le nom complet doit faire au moins 3 caractères'),
  email: zod.string().email('Adresse email invalide'),
  telephone: zod.string().min(8, 'Le numéro de téléphone doit faire au moins 8 chiffres'),
  sujet: zod.string().min(4, 'Le sujet doit faire au moins 4 caractères'),
  message: zod.string().min(10, 'Le message doit faire au moins 10 caractères'),
});

type FormContactInput = zod.infer<typeof schemaContact>;

// Schéma de validation Zod pour Suggestions
const schemaSuggestion = zod.object({
  sugNom: zod.string().min(3, 'Le nom doit faire au moins 3 caractères (ou "Anonyme")'),
  sugTelephone: zod.string().min(8, 'Le numéro de téléphone doit faire au moins 8 chiffres'),
  sugSujet: zod.string().min(4, 'Le sujet doit faire au moins 4 caractères'),
  sugMessage: zod.string().min(10, 'Le message doit faire au moins 10 caractères'),
});

type FormSuggestionInput = zod.infer<typeof schemaSuggestion>;

export const Contact: React.FC = () => {
  const [soumis, setSoumis] = useState(false);
  const [enCours, setEnCours] = useState(false);
  const [ongletActif, setOngletActif] = useState<'contact' | 'suggestion'>('contact');
  const [sugSoumis, setSugSoumis] = useState(false);
  const [sugEnCours, setSugEnCours] = useState(false);

  const {
    register: registerSug,
    handleSubmit: handleSubmitSug,
    reset: resetSug,
    formState: { errors: errorsSug },
  } = useForm<FormSuggestionInput>({
    resolver: zodResolver(schemaSuggestion),
  });

  const onSubmitSug = async (donnees: FormSuggestionInput) => {
    setSugEnCours(true);
    try {
      await suggestionService.soumettreSuggestion({
        nom: donnees.sugNom,
        telephone: donnees.sugTelephone,
        sujet: donnees.sugSujet,
        message: donnees.sugMessage,
      });
      setSugSoumis(true);
      resetSug();
      setTimeout(() => setSugSoumis(false), 5000);
    } catch (e) {
      console.error(e);
    } finally {
      setSugEnCours(false);
    }
  };

  const getPhoto = (index: number, fallback: string) => {
    return PHOTOS && PHOTOS.length > index ? PHOTOS[index] : fallback;
  };

  const temples = [
    {
      id: 'temple-siege',
      nom: 'Temple MEDEC-CI Siège (Koumassi)',
      zone: 'Abidjan',
      adresse: 'Koumassi Quartier 32, derrière la station Petro-Ivoire, Abidjan',
      pasteur: 'Pasteur MORIBA Komon Joseph & Pasteur NAHOUNOU Éric',
      contact: '07 58 52 67 66 / 07 57 49 75 32',
      horaires: 'Jeudi : 19h00 - 20h30 | Dimanche : 08h30 - 11h00',
      x: '48%', y: '58%',
      estSiege: true
    },
    {
      id: 'temple-adjouffou',
      nom: 'Temple MEDEC-CI Adjouffou',
      zone: 'Abidjan',
      adresse: 'Port-Bouët, prolongement du mur de l\'aéroport international Félix Houphouët Boigny',
      pasteur: 'Apôtre FALLE Zébo Ambroise',
      contact: '07 47 06 48 89',
      horaires: 'Jeudi : 19h00 - 20h30 | Dimanche : 08h30 - 11h00',
      x: '53%', y: '65%'
    },
    {
      id: 'temple-gens-benis',
      nom: 'Temple MEDEC-CI Gens Bénis (Jean Folly)',
      zone: 'Abidjan',
      adresse: 'Port-Bouët, Quartier Jean Folly',
      pasteur: 'Pasteur AKE Brigitte (épouse AYE)',
      contact: '07 57 49 75 32',
      horaires: 'Jeudi : 19h00 - 20h30 | Dimanche : 08h30 - 11h00',
      x: '58%', y: '68%'
    },
    {
      id: 'temple-yopougon',
      nom: 'Temple MEDEC-CI Yopougon Gesco',
      zone: 'Abidjan',
      adresse: 'Yopougon Gesco, Abidjan',
      pasteur: 'Pasteur MAHI Chantal (épouse BIEDRO)',
      contact: '07 87 97 81 38',
      horaires: 'Jeudi : 19h00 - 20h30 | Dimanche : 08h30 - 11h00',
      x: '35%', y: '50%'
    },
    {
      id: 'temple-lakota',
      nom: 'Temple MEDEC-CI Lakota Centre',
      zone: 'Lakota',
      adresse: 'Lakota Centre, Lakota',
      pasteur: 'Apôtre NOUDE Hubert Tia',
      contact: '07 57 49 75 32',
      horaires: 'Jeudi : 19h00 - 20h30 | Dimanche : 08h30 - 11h00',
      x: '20%', y: '78%'
    },
    {
      id: 'temple-cocody',
      nom: 'Temple MEDEC-CI Cocody Angré',
      zone: 'Abidjan',
      adresse: 'Cocody Angré, Abidjan',
      pasteur: 'Pasteur AHOLIA Aimé',
      contact: '07 58 52 67 66',
      horaires: 'Jeudi : 19h00 - 20h30 | Dimanche : 08h30 - 11h00',
      x: '48%', y: '45%'
    },
    {
      id: 'temple-adjahui',
      nom: 'Temple MEDEC-CI Adjahui',
      zone: 'Abidjan',
      adresse: 'Adjahui Coupole, Port-Bouët',
      pasteur: 'Missionnaire responsable',
      contact: '07 58 52 67 66',
      horaires: 'Dimanche : 08h30 - 11h00',
      x: '52%', y: '61%'
    },
    {
      id: 'temple-adzope',
      nom: 'Temple MEDEC-CI Adzopé',
      zone: 'Abidjan',
      adresse: 'Adzopé Ville',
      pasteur: 'Pasteur responsable',
      contact: '07 58 52 67 66',
      horaires: 'Dimanche : 08h30 - 11h00',
      x: '75%', y: '25%'
    },
    {
      id: 'temple-abobo',
      nom: 'Temple MEDEC-CI Abobo',
      zone: 'Abidjan',
      adresse: 'Abobo, Abidjan',
      pasteur: 'Pasteur responsable',
      contact: '07 58 52 67 66',
      horaires: 'Dimanche : 08h30 - 11h00',
      x: '45%', y: '38%'
    }
  ];

  const [templeSelectionne, setTempleSelectionne] = useState(temples[0]);
  const [zoneFiltre, setZoneFiltre] = useState('Tous');

  const templesFiltres = temples.filter(
    (t) => zoneFiltre === 'Tous' || t.zone === zoneFiltre
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormContactInput>({
    resolver: zodResolver(schemaContact),
  });

  const onSubmit = async (_donnees: FormContactInput) => {
    setEnCours(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setEnCours(false);
    setSoumis(true);
    reset();
    setTimeout(() => setSoumis(false), 5000);
  };

  return (
    <div className="bg-[#F8FAFC] pb-20 space-y-16 font-outfit">
      
      {/* HEADER SECTION */}
      <section className="relative bg-slate-950 text-white py-24 text-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url('${getPhoto(28, 'https://images.unsplash.com/photo-1544717277-994b96273b24?auto=format&fit=crop&q=80&w=1200')}')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/90" />
        <div className="relative max-w-4xl mx-auto px-4 space-y-4 z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-medecci-or bg-white/10 px-4 py-2 rounded-full border border-white/10">
            RELATION CLIENT & FRATERNITÉ
          </span>
          <h1 className="font-cormorant italic font-bold text-4xl sm:text-7xl leading-tight">Contactez-Nous</h1>
          <p className="text-slate-350 text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed">
            Vous souhaitez des informations pastorales, déposer une intention de prière chrétienne ou localiser l'un de nos temples locaux ? Écrivez-nous.
          </p>
        </div>
      </section>

      {/* FORMULAIRE & CARTES CONTACT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* COORDONNÉES */}
          <div className="space-y-6">
            <h3 className="font-poppins font-black text-[#0B3C91] text-xl sm:text-2xl">Nos Coordonnées</h3>
            <p className="text-slate-500 text-xs sm:text-sm font-light">
              Voici les canaux officiels du secrétariat général national pour échanger avec notre assemblée.
            </p>

            <div className="space-y-4 pt-4 border-t border-[#E2E8F0]">
              {/* Téléphone */}
              <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm flex items-start space-x-4">
                <div className="p-3 bg-[#0B3C91]/5 text-[#0B3C91] rounded-xl shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-xs sm:text-sm">Téléphones</h4>
                  <p className="text-slate-500 text-xs leading-relaxed font-light">{INFOS_CONTACT.telephone}</p>
                </div>
              </div>

              {/* Email */}
              <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm flex items-start space-x-4">
                <div className="p-3 bg-medecci-or/10 text-medecci-or rounded-xl shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-xs sm:text-sm">Adresse e-mail</h4>
                  <p className="text-slate-500 text-xs leading-relaxed font-light">{INFOS_CONTACT.email}</p>
                </div>
              </div>

              {/* Siège */}
              <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm flex items-start space-x-4">
                <div className="p-3 bg-blue-50 text-[#1E88E5] rounded-xl shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-xs sm:text-sm">Siège National</h4>
                  <p className="text-slate-500 text-xs leading-relaxed font-light">{INFOS_CONTACT.siege}</p>
                </div>
              </div>
            </div>
          </div>

          {/* FORMULAIRE DE CONTACT AVEC ONGLETS */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-6">
              
              {/* Sélecteur d'onglets */}
              <div className="flex border-b border-[#E2E8F0] pb-2 space-x-6">
                <button
                  type="button"
                  onClick={() => setOngletActif('contact')}
                  className={`pb-3 font-poppins font-black text-sm relative transition-all cursor-pointer ${
                    ongletActif === 'contact'
                      ? 'text-[#0B3C91] after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#0B3C91]'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Envoyer un Message
                </button>
                <button
                  type="button"
                  onClick={() => setOngletActif('suggestion')}
                  className={`pb-3 font-poppins font-black text-sm relative transition-all cursor-pointer ${
                    ongletActif === 'suggestion'
                      ? 'text-[#0B3C91] after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#0B3C91]'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Boîte à suggestions
                </button>
              </div>

              {ongletActif === 'contact' ? (

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {soumis && (
                  <div className="p-4 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg flex items-center space-x-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <span className="text-xs font-bold">Votre message a été transmis avec succès. Le secrétariat vous répondra rapidement.</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nom */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Nom complet *</label>
                    <input
                      type="text"
                      {...register('nomComplet')}
                      className={`w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border ${
                        errors.nomComplet ? 'border-red-400 focus:border-red-400' : 'border-[#E2E8F0] focus:border-[#1E88E5]'
                      } focus:outline-none text-xs`}
                    />
                    {errors.nomComplet && (
                      <span className="text-[10px] text-red-500 flex items-center space-x-1">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        <span>{errors.nomComplet.message}</span>
                      </span>
                    )}
                  </div>

                  {/* Téléphone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Numéro de téléphone *</label>
                    <input
                      type="text"
                      placeholder="ex: 0707894512"
                      {...register('telephone')}
                      className={`w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border ${
                        errors.telephone ? 'border-red-400 focus:border-red-400' : 'border-[#E2E8F0] focus:border-[#1E88E5]'
                      } focus:outline-none text-xs`}
                    />
                    {errors.telephone && (
                      <span className="text-[10px] text-red-500 flex items-center space-x-1">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        <span>{errors.telephone.message}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Adresse e-mail *</label>
                    <input
                      type="email"
                      {...register('email')}
                      className={`w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border ${
                        errors.email ? 'border-red-400 focus:border-red-400' : 'border-[#E2E8F0] focus:border-[#1E88E5]'
                      } focus:outline-none text-xs`}
                    />
                    {errors.email && (
                      <span className="text-[10px] text-red-500 flex items-center space-x-1">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        <span>{errors.email.message}</span>
                      </span>
                    )}
                  </div>

                  {/* Sujet */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Sujet *</label>
                    <input
                      type="text"
                      {...register('sujet')}
                      className={`w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border ${
                        errors.sujet ? 'border-red-400 focus:border-red-400' : 'border-[#E2E8F0] focus:border-[#1E88E5]'
                      } focus:outline-none text-xs`}
                    />
                    {errors.sujet && (
                      <span className="text-[10px] text-red-500 flex items-center space-x-1">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        <span>{errors.sujet.message}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Votre message *</label>
                  <textarea
                    rows={5}
                    {...register('message')}
                    className={`w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border ${
                      errors.message ? 'border-red-400 focus:border-red-400' : 'border-[#E2E8F0] focus:border-[#1E88E5]'
                    } focus:outline-none text-xs resize-none`}
                  />
                  {errors.message && (
                    <span className="text-[10px] text-red-500 flex items-center space-x-1">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{errors.message.message}</span>
                    </span>
                  )}
                </div>

                {/* Bouton envoi */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={enCours}
                    className="w-full flex items-center justify-center bg-gradient-to-r from-medecci-bleuRoyal to-medecci-bleuClair text-white py-3.5 rounded-xl font-bold shadow-md hover:opacity-95 transition-all duration-300 disabled:opacity-50 cursor-pointer"
                  >
                    {enCours ? (
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    <span>{enCours ? 'Transmission en cours...' : 'Envoyer le message'}</span>
                  </button>
                </div>
              </form>
              ) : (
              <form onSubmit={handleSubmitSug(onSubmitSug)} className="space-y-4">
                {sugSoumis && (
                  <div className="p-4 bg-emerald-50 text-emerald-805 border border-emerald-100 rounded-lg flex items-center space-x-3 text-left">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-800">Votre suggestion a été enregistrée avec succès. Merci pour votre contribution !</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nom */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-bold text-slate-700">Votre nom / Anonyme *</label>
                    <input
                      type="text"
                      placeholder="Nom complet ou 'Anonyme'"
                      {...registerSug('sugNom')}
                      className={`w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border ${
                        errorsSug.sugNom ? 'border-red-400 focus:border-red-400' : 'border-[#E2E8F0] focus:border-[#1E88E5]'
                      } focus:outline-none text-xs`}
                    />
                    {errorsSug.sugNom && (
                      <span className="text-[10px] text-red-500 flex items-center space-x-1">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        <span>{errorsSug.sugNom.message}</span>
                      </span>
                    )}
                  </div>

                  {/* Téléphone */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-bold text-slate-700">Numéro de téléphone *</label>
                    <input
                      type="text"
                      placeholder="ex: 0758526766"
                      {...registerSug('sugTelephone')}
                      className={`w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border ${
                        errorsSug.sugTelephone ? 'border-red-400 focus:border-red-400' : 'border-[#E2E8F0] focus:border-[#1E88E5]'
                      } focus:outline-none text-xs`}
                    />
                    {errorsSug.sugTelephone && (
                      <span className="text-[10px] text-red-500 flex items-center space-x-1">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        <span>{errorsSug.sugTelephone.message}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Sujet */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-slate-700">Sujet de la suggestion *</label>
                  <input
                    type="text"
                    placeholder="De quoi s'agit-il ?"
                    {...registerSug('sugSujet')}
                    className={`w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border ${
                      errorsSug.sugSujet ? 'border-red-400 focus:border-red-400' : 'border-[#E2E8F0] focus:border-[#1E88E5]'
                    } focus:outline-none text-xs`}
                  />
                  {errorsSug.sugSujet && (
                    <span className="text-[10px] text-red-500 flex items-center space-x-1">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{errorsSug.sugSujet.message}</span>
                    </span>
                  )}
                </div>

                {/* Message */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-slate-700">Détails de votre suggestion *</label>
                  <textarea
                    rows={5}
                    placeholder="Écrivez votre suggestion ici..."
                    {...registerSug('sugMessage')}
                    className={`w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border ${
                      errorsSug.sugMessage ? 'border-red-400 focus:border-red-400' : 'border-[#E2E8F0] focus:border-[#1E88E5]'
                    } focus:outline-none text-xs resize-none`}
                  />
                  {errorsSug.sugMessage && (
                    <span className="text-[10px] text-red-500 flex items-center space-x-1">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{errorsSug.sugMessage.message}</span>
                    </span>
                  )}
                </div>

                {/* Bouton envoi */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={sugEnCours}
                    className="w-full flex items-center justify-center bg-gradient-to-r from-medecci-bleuRoyal to-medecci-bleuClair text-white py-3.5 rounded-xl font-bold shadow-md hover:opacity-95 transition-all duration-300 disabled:opacity-50 cursor-pointer"
                  >
                    {sugEnCours ? (
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    <span>{sugEnCours ? 'Transmission...' : 'Soumettre la suggestion'}</span>
                  </button>
                </div>
              </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* TEMPLES CARTE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center md:text-left space-y-2">
          <h3 className="font-poppins font-black text-[#0B3C91] text-xl sm:text-2xl">Carte des Temples & Diocèses</h3>
          <p className="text-slate-500 text-xs sm:text-sm font-light">
            Découvrez nos assemblées chrétiennes de quartier en sélectionnant un temple ou en naviguant sur la carte interactive.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 bg-white border border-[#E2E8F0] rounded-3xl overflow-hidden shadow-sm">
          {/* Liste des Temples */}
          <div className="p-6 border-b lg:border-b-0 lg:border-r border-[#E2E8F0] flex flex-col h-[500px] bg-[#F8FAFC]/20">
            {/* Filtre de zone */}
            <div className="flex gap-2 mb-4 shrink-0">
              {['Tous', 'Abidjan', 'Lakota'].map((zone) => (
                <button
                  key={zone}
                  type="button"
                  onClick={() => setZoneFiltre(zone)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    zoneFiltre === zone
                      ? 'bg-[#0B3C91] text-white shadow-sm'
                      : 'bg-white text-slate-655 border border-[#E2E8F0] hover:bg-slate-50'
                  }`}
                >
                  {zone === 'Tous' ? 'Toutes' : zone}
                </button>
              ))}
            </div>

            {/* Liste déroulante */}
            <div className="overflow-y-auto flex-1 pr-1 space-y-3 no-scrollbar">
              {templesFiltres.map((temple) => (
                <button
                  key={temple.id}
                  type="button"
                  onClick={() => setTempleSelectionne(temple)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex flex-col space-y-1.5 ${
                    templeSelectionne.id === temple.id
                      ? 'border-[#0B3C91] bg-[#0B3C91]/5 ring-1 ring-[#0B3C91]'
                      : 'border-[#E2E8F0] hover:border-slate-350 hover:bg-white bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 leading-tight">{temple.nom}</span>
                    {temple.estSiege && (
                      <span className="text-[8px] bg-medecci-or/20 text-medecci-or px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        Siège
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{temple.zone}</span>
                  <span className="text-[10px] text-slate-500 truncate leading-relaxed font-light">{temple.adresse}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Carte Visuelle et Détails */}
          <div className="lg:col-span-2 flex flex-col md:flex-row h-[500px]">
            {/* La Carte */}
            <div className="flex-1 bg-slate-950 relative overflow-hidden border-b md:border-b-0 md:border-r border-[#E2E8F0] h-64 md:h-full">
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-15"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800')`,
                }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px]" />
              
              {/* Pins */}
              {templesFiltres.map((temple) => (
                <button
                  key={temple.id}
                  type="button"
                  onClick={() => setTempleSelectionne(temple)}
                  style={{ left: temple.x, top: temple.y }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none z-10"
                >
                  <div className="relative flex items-center justify-center">
                    <span className={`absolute inline-flex h-7 w-7 rounded-full opacity-75 animate-ping ${
                      templeSelectionne.id === temple.id ? 'bg-medecci-or' : 'bg-[#1E88E5]/40'
                    }`} />
                    <div className={`h-8.5 w-8.5 rounded-full flex items-center justify-center border-2 border-slate-950 transition-all ${
                      templeSelectionne.id === temple.id
                        ? 'bg-medecci-or text-slate-950 scale-110 shadow-lg'
                        : 'bg-[#0B3C91] text-white hover:bg-[#1E88E5]'
                    }`}>
                      <MapPin className="h-4.5 w-4.5 fill-current" />
                    </div>
                    <div className="absolute bottom-full mb-2 bg-slate-900/90 text-white text-[9px] font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md border border-slate-800">
                      {temple.nom}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Fiche Détails */}
            <div className="w-full md:w-80 p-6 flex flex-col justify-between h-56 md:h-full bg-slate-50">
              <AnimatePresence mode="wait">
                <motion.div
                  key={templeSelectionne.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    {templeSelectionne.estSiege && (
                      <span className="inline-block bg-medecci-or/15 text-medecci-or text-[8px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Siège National
                      </span>
                    )}
                    <h4 className="font-poppins font-bold text-slate-800 text-sm sm:text-base leading-snug">
                      {templeSelectionne.nom}
                    </h4>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{templeSelectionne.zone}</p>
                  </div>

                  <hr className="border-slate-200" />

                  <div className="space-y-3.5 text-xs text-slate-600">
                    <div className="flex items-start space-x-2.5">
                      <MapPin className="h-4.5 w-4.5 text-[#0B3C91] shrink-0 mt-0.5" />
                      <span className="leading-relaxed font-light">{templeSelectionne.adresse}</span>
                    </div>

                    <div className="flex items-start space-x-2.5">
                      <Award className="h-4.5 w-4.5 text-[#0B3C91] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-800 text-[10px] uppercase tracking-wider">Dirigeant / Pasteur</p>
                        <p className="font-light text-slate-550 mt-0.5 leading-snug">{templeSelectionne.pasteur}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2.5">
                      <Clock className="h-4.5 w-4.5 text-[#0B3C91] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-800 text-[10px] uppercase tracking-wider">Horaires de Culte</p>
                        <p className="font-light mt-0.5 leading-snug">{templeSelectionne.horaires}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                <span className="text-slate-400">CONTACT</span>
                <a href={`tel:${templeSelectionne.contact.split('/')[0].trim()}`} className="text-[#0B3C91] hover:underline">
                  {templeSelectionne.contact.split('/')[0]}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Contact;
