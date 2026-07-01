import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Coins, ShieldCheck, CheckCircle2, AlertCircle, Phone, Wallet, Landmark } from 'lucide-react';
import donService from '../../services/donService';
import { PHOTOS } from '../../constants/photos';

// Schéma de validation Zod
const schemaDon = zod.object({
  nomDonateur: zod.string().min(3, 'Le nom doit contenir au moins 3 caractères (ou "Anonyme")'),
  telephone: zod.string().min(8, 'Le numéro de téléphone doit contenir au moins 8 chiffres'),
  montant: zod.number().min(500, 'Le montant minimum est de 500 FCFA'),
  typeDon: zod.enum(['Dîme', 'Offrande', 'Construction', 'Social', 'Mission']),
  modePaiement: zod.enum(['Wave', 'Orange Money', 'MTN MoMo', 'Moov Money', 'Carte Bancaire']),
  commentaire: zod.string().optional(),
});

type FormDonInput = zod.infer<typeof schemaDon>;

export const Dons: React.FC = () => {
  const [enCours, setEnCours] = useState(false);
  const [succes, setSucces] = useState(false);
  const [montantSaisi, setMontantSaisi] = useState<number | null>(null);

  const getPhoto = (index: number, fallback: string) => {
    return PHOTOS && PHOTOS.length > index ? PHOTOS[index] : fallback;
  };

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormDonInput>({
    resolver: zodResolver(schemaDon),
    defaultValues: {
      nomDonateur: '',
      telephone: '',
      typeDon: 'Offrande',
      modePaiement: 'Wave',
      commentaire: '',
    },
  });

  const selectionnerMontant = (valeur: number) => {
    setValue('montant', valeur);
    setMontantSaisi(valeur);
  };

  const onSubmit = async (donnees: FormDonInput) => {
    setEnCours(true);
    try {
      await donService.enregistrerDon(donnees);
      setSucces(true);
      reset();
      setMontantSaisi(null);
    } catch (error) {
      console.error(error);
    } finally {
      setEnCours(false);
    }
  };

  const montantsPredefinis = [2000, 5000, 10000, 25000, 50000, 100000];

  return (
    <div className="bg-[#F8FAFC] pb-20 space-y-16 font-outfit">
      
      {/* HEADER SECTION */}
      <section className="relative bg-slate-950 text-white py-14 sm:py-24 text-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url('${getPhoto(15, 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&q=80&w=1200')}')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/90" />
        <div className="relative max-w-4xl mx-auto px-4 space-y-4 z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-medecci-or bg-white/10 px-4 py-2 rounded-full border border-white/10">
            SOUTIEN FINANCIER
          </span>
          <h1 className="font-cormorant italic font-bold text-3xl sm:text-6xl lg:text-7xl leading-tight">Dons & Offrandes</h1>
          <p className="text-slate-350 text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed">
            Exprimez votre obéissance et votre amour à Dieu à travers vos dîmes, offrandes de grâce et soutiens aux œuvres d'évangélisation et de construction.
          </p>
        </div>
      </section>

      {/* FORMULAIRE DE DON & GARANTIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">
          
          {/* EXPLICATION / SÉCURITÉ */}
          <div className="space-y-6 lg:border-r lg:border-[#E2E8F0] lg:pr-8">
            <h3 className="font-poppins font-black text-[#0B3C91] text-xl sm:text-2xl">L'importance des Offrandes</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-light">
              Donner est un acte de louange. À la MEDECCI, chaque centime récolté sert au développement spirituel, à l'entretien de la maison de Dieu, aux campagnes d'évangélisation et à l'assistance sociale apportée aux fidèles nécessiteux.
            </p>

            <div className="space-y-5 pt-6 border-t border-[#E2E8F0]">
              <div className="flex items-start space-x-3.5">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0 border border-blue-100">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800">Canaux Sécurisés</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed font-light">Vos versements par Wave, Orange, MTN, Moov et Carte Bancaire s'effectuent via un protocole crypté.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3.5">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0 border border-blue-100">
                  <Coins className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800">Gestion Transparente</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed font-light">Un comité de trésorerie interne rend compte régulièrement des dépenses afin de garantir l'affectation exacte des dons.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3.5">
                <div className="p-3 bg-[#F8FAFC] text-[#0B3C91] rounded-xl shrink-0 border border-[#E2E8F0]">
                  <Landmark className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800">Projets prioritaires</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed font-light">Le grand projet actuel est la réhabilitation du temple de Koumassi pour un meilleur accueil dominical.</p>
                </div>
              </div>
            </div>
          </div>

          {/* FORMULAIRE INTERACTIF */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E2E8F0] shadow-sm relative overflow-hidden">
              <AnimatePresence>
                {succes && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center p-6 text-center space-y-6"
                  >
                    <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center border border-blue-200">
                      <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-poppins font-black text-2xl text-[#0B3C91]">Merci de soutenir l'œuvre de Dieu !</h3>
                      <p className="text-slate-500 text-xs sm:text-sm max-w-md font-light leading-relaxed">
                        Votre contribution volontaire a été enregistrée avec succès. Que l'Éternel répande sa bénédiction sur votre vie et votre maison en retour.
                      </p>
                    </div>
                    <button
                      onClick={() => setSucces(false)}
                      className="bg-[#0B3C91] hover:bg-[#1E88E5] text-white font-bold px-8 py-3 rounded-xl text-xs transition-colors shadow-md"
                    >
                      Faire une nouvelle offrande
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                
                {/* Section 1 : Objet & Montant */}
                <div className="space-y-4">
                  <h3 className="font-poppins font-black text-[#0B3C91] text-sm border-b border-[#E2E8F0] pb-3 flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-medecci-or fill-medecci-or" />
                    <span>Sélection du Don / Offrande</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Type de Don */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Nature du versement *</label>
                      <select
                        {...register('typeDon')}
                        className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:outline-none focus:border-[#1E88E5] text-xs font-bold text-slate-800"
                      >
                        <option value="Offrande">Offrande de reconnaissance</option>
                        <option value="Dîme">Dîme prophétique (10%)</option>
                        <option value="Construction">Projet Construction du Temple</option>
                        <option value="Social">Action Sociale (Veuves & Orphelins)</option>
                        <option value="Mission">Missions & Évangélisation nationale</option>
                      </select>
                    </div>

                    {/* Saisie Montant */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Montant libre (FCFA) *</label>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="Saisissez le montant"
                          {...register('montant', { valueAsNumber: true })}
                          className={`w-full pl-4 pr-12 py-3 rounded-xl bg-[#F8FAFC] border ${
                            errors.montant ? 'border-red-400 focus:border-red-400' : 'border-[#E2E8F0] focus:border-[#1E88E5]'
                          } focus:outline-none text-xs font-bold`}
                        />
                        <span className="absolute right-4 top-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">FCFA</span>
                      </div>
                      {errors.montant && (
                        <span className="text-[10px] text-red-500 flex items-center space-x-1">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                          <span>{errors.montant.message}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Boutons Montants Prédéfinis */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400">Montants suggérés (FCFA) :</label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {montantsPredefinis.map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => selectionnerMontant(val)}
                          className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                            montantSaisi === val
                              ? 'bg-[#0B3C91] text-white border-[#0B3C91]'
                              : 'bg-[#F8FAFC] text-slate-700 border-[#E2E8F0] hover:bg-slate-100'
                          }`}
                        >
                          {val.toLocaleString('fr-FR')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section 2 : Identité & Paiement */}
                <div className="space-y-4">
                  <h3 className="font-poppins font-black text-[#0B3C91] text-sm border-b border-[#E2E8F0] pb-3 flex items-center space-x-2">
                    <Wallet className="h-5 w-5 text-medecci-or" />
                    <span>Identité & Mode de Paiement</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Nom */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Nom & Prénom (ou "Anonyme") *</label>
                      <input
                        type="text"
                        placeholder="Yao Koffi, Christian..."
                        {...register('nomDonateur')}
                        className={`w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border ${
                          errors.nomDonateur ? 'border-red-400 focus:border-red-400' : 'border-[#E2E8F0] focus:border-[#1E88E5]'
                        } focus:outline-none text-xs`}
                      />
                      {errors.nomDonateur && (
                        <span className="text-[10px] text-red-500 flex items-center space-x-1">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                          <span>{errors.nomDonateur.message}</span>
                        </span>
                      )}
                    </div>

                    {/* Téléphone */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Numéro Mobile Money *</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="07 08 09 10 11..."
                          {...register('telephone')}
                          className={`w-full pl-10 pr-4 py-3 rounded-xl bg-[#F8FAFC] border ${
                            errors.telephone ? 'border-red-400 focus:border-red-400' : 'border-[#E2E8F0] focus:border-[#1E88E5]'
                          } focus:outline-none text-xs`}
                        />
                      </div>
                      {errors.telephone && (
                        <span className="text-[10px] text-red-500 flex items-center space-x-1">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                          <span>{errors.telephone.message}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Moyen de Paiement */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Opérateur de Paiement *</label>
                      <select
                        {...register('modePaiement')}
                        className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:outline-none focus:border-[#1E88E5] text-xs font-bold text-slate-800"
                      >
                        <option value="Wave">Wave Côte d'Ivoire</option>
                        <option value="Orange Money">Orange Money CI</option>
                        <option value="MTN MoMo">MTN Mobile Money CI</option>
                        <option value="Moov Money">Moov Money CI</option>
                        <option value="Carte Bancaire">Carte Visa / Mastercard</option>
                      </select>
                    </div>

                    {/* Commentaire */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Intention de prière (optionnel)</label>
                      <input
                        type="text"
                        placeholder="Action de grâce, en mémoire de..."
                        {...register('commentaire')}
                        className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:outline-none focus:border-[#1E88E5] text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Bouton validation */}
                <div className="pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={enCours}
                    className="w-full flex items-center justify-center bg-gradient-to-r from-medecci-bleuRoyal to-medecci-bleuClair text-white py-4 rounded-2xl font-bold shadow-lg hover:opacity-95 transition-all duration-300 disabled:opacity-50 text-sm cursor-pointer"
                  >
                    {enCours ? (
                      <span className="animate-spin rounded-full h-4.5 w-4.5 border-2 border-white border-t-transparent mr-2" />
                    ) : (
                      <Heart className="h-4.5 w-4.5 fill-white" />
                    )}
                    <span>{enCours ? 'Traitement en cours...' : 'Confirmer mon Offrande'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Dons;
