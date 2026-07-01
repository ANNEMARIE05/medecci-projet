import React, { useState, useEffect } from 'react';
import { Search, Trash2, Coins, Calendar, ShieldCheck, Heart } from 'lucide-react';
import donService from '../../services/donService';
import type { Don } from '../../stores/useDonneesStore';
import { formaterDevise, formaterDate, formaterTelephone } from '../../utils/formateur';

export const DonsAdmin: React.FC = () => {
  const [dons, setDons] = useState<Don[]>([]);
  const [recherche, setRecherche] = useState('');
  const [typeFiltre, setTypeFiltre] = useState('tous');
  const [enChargement, setEnChargement] = useState(false);

  const chargerDons = async () => {
    setEnChargement(true);
    try {
      const data = await donService.recupererDons();
      setDons(data);
    } catch (e) {
      console.error(e);
    } finally {
      setEnChargement(false);
    }
  };

  useEffect(() => {
    chargerDons();
  }, []);

  const handleSupprimer = async (id: string) => {
    if (window.confirm('Voulez-vous supprimer définitivement ce don de l\'historique ?')) {
      try {
        await donService.supprimerDon(id);
        chargerDons();
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Filtrage
  const donsFiltrés = dons.filter((d) => {
    const correspondRecherche = d.nomDonateur.toLowerCase().includes(recherche.toLowerCase()) || d.telephone.includes(recherche);
    const correspondType = typeFiltre === 'tous' || d.typeDon === typeFiltre;
    return correspondRecherche && correspondType;
  });

  // Totaux des dons filtrés
  const totalFiltre = donsFiltrés.reduce((sum, d) => sum + d.montant, 0);

  return (
    <div className="space-y-6">
      {/* STATS DU FLUX DE TRÉSORERIE */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400">Total Flux Don</span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 font-poppins">
              {formaterDevise(dons.reduce((sum, d) => sum + d.montant, 0))}
            </h3>
          </div>
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0">
            <Coins className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400">Nombre de Dons</span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 font-poppins">{dons.length}</h3>
          </div>
          <div className="p-4 bg-medecci-bleuRoyal/10 text-medecci-bleuRoyal rounded-2xl shrink-0">
            <Heart className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400">Total Affiché (Filtré)</span>
            <h3 className="text-xl sm:text-2xl font-bold text-medecci-bleuRoyal font-poppins">{formaterDevise(totalFiltre)}</h3>
          </div>
          <div className="p-4 bg-medecci-or/10 text-medecci-or rounded-2xl shrink-0">
            <ShieldCheck className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* FILTRES & RECHERCHE */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        {/* Recherche donateur */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par nom de donateur ou numéro de téléphone..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-medecci-bleuClair text-xs"
          />
        </div>

        {/* Filtre type de don */}
        <div className="w-full md:w-56">
          <select
            value={typeFiltre}
            onChange={(e) => setTypeFiltre(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-medecci-bleuClair text-xs text-slate-700"
          >
            <option value="tous">Tous les types de dons</option>
            <option value="Offrande">Offrande ordinaire</option>
            <option value="Dîme">Dîme</option>
            <option value="Construction">Construction du Temple</option>
            <option value="Social">Action Sociale & Entraide</option>
            <option value="Mission">Mission & Évangélisation</option>
          </select>
        </div>
      </div>

      {/* TABLEAU DES DONS LOG */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {enChargement ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medecci-bleuRoyal" />
          </div>
        ) : donsFiltrés.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-xs">Aucune transaction correspondante.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Donateur</th>
                  <th className="px-6 py-4">Téléphone</th>
                  <th className="px-6 py-4">Type de Don</th>
                  <th className="px-6 py-4">Méthode de paiement</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Montant</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {donsFiltrés.map((don) => (
                  <tr key={don.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-bold text-slate-800">
                      {don.nomDonateur}
                    </td>
                    <td className="px-6 py-4 text-slate-650">
                      {formaterTelephone(don.telephone)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                        {don.typeDon}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium">
                      {don.modePaiement}
                    </td>
                    <td className="px-6 py-4 text-slate-400 flex items-center space-x-1 mt-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{formaterDate(don.date, true)}</span>
                    </td>
                    <td className="px-6 py-4 text-right font-extrabold text-emerald-600">
                      {formaterDevise(don.montant)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleSupprimer(don.id)}
                        className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 transition-colors"
                        title="Effacer de l'historique"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonsAdmin;
