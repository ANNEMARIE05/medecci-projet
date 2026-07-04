import React, { useState, useEffect } from 'react';
import { Search, Trash2, Calendar, Phone, X, AlertCircle, Inbox, Eye } from 'lucide-react';
import suggestionService from '../../services/suggestionService';
import type { Suggestion } from '../../types/models';
import { formaterDate, formaterTelephone } from '../../utils/formateur';

export const SuggestionsAdmin: React.FC = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [recherche, setRecherche] = useState('');
  const [enChargement, setEnChargement] = useState(false);
  const [selection, setSelection] = useState<Suggestion | null>(null);
  const [actionSucces, setActionSucces] = useState('');

  const chargerSuggestions = async () => {
    setEnChargement(true);
    try {
      const data = await suggestionService.recupererSuggestions();
      setSuggestions(data);
    } catch (e) {
      console.error(e);
    } finally {
      setEnChargement(false);
    }
  };

  useEffect(() => {
    chargerSuggestions();
  }, []);

  const handleSupprimer = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid opening the details modal
    if (window.confirm('Voulez-vous supprimer définitivement cette suggestion ?')) {
      try {
        await suggestionService.supprimerSuggestion(id);
        setActionSucces('Suggestion supprimée avec succès.');
        chargerSuggestions();
        if (selection?.id === id) setSelection(null);
        setTimeout(() => setActionSucces(''), 4000);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const sugsFiltrés = suggestions.filter((s) =>
    s.nom.toLowerCase().includes(recherche.toLowerCase()) ||
    s.sujet.toLowerCase().includes(recherche.toLowerCase()) ||
    s.message.toLowerCase().includes(recherche.toLowerCase()) ||
    s.telephone.includes(recherche)
  );

  return (
    <div className="space-y-6">
      
      {/* Header section */}
      <div>
        <h2 className="font-poppins font-black text-[#0B3C91] text-xl sm:text-2xl text-left">Suggestions des Fidèles</h2>
        <p className="text-slate-400 text-[10px] font-light text-left mt-0.5">Consultez les suggestions et avis constructifs émis depuis le portail public.</p>
      </div>

      {actionSucces && (
        <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl flex items-center space-x-2.5 text-xs text-left">
          <AlertCircle className="h-5 w-5 text-emerald-600 shrink-0" />
          <span className="font-bold">{actionSucces}</span>
        </div>
      )}

      {/* SEARCH AND FILTERS */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, téléphone, sujet ou contenu..."
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
        ) : sugsFiltrés.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-xs font-light">Aucune suggestion reçue pour le moment.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Nom</th>
                  <th className="px-6 py-4">Téléphone</th>
                  <th className="px-6 py-4">Sujet</th>
                  <th className="px-6 py-4">Aperçu du message</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {sugsFiltrés.map((sug) => (
                  <tr
                    key={sug.id}
                    onClick={() => setSelection(sug)}
                    className="hover:bg-slate-50/50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                      <div className="flex items-center space-x-1.5 font-medium">
                        <Calendar className="h-4 w-4" />
                        <span>{formaterDate(sug.date, true)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800 whitespace-nowrap">
                      {sug.nom}
                    </td>
                    <td className="px-6 py-4 text-slate-650 font-semibold whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        <span>{formaterTelephone(sug.telephone)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-850 whitespace-nowrap max-w-[150px] truncate">
                      {sug.sujet}
                    </td>
                    <td className="px-6 py-4 text-slate-400 max-w-[200px] truncate font-light">
                      {sug.message}
                    </td>
                     <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelection(sug);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0B3C91] font-bold text-[10px] transition-colors flex items-center space-x-1 border border-blue-100/50 cursor-pointer"
                          title="Consulter les détails"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Détails</span>
                        </button>
                        <button
                          onClick={(e) => handleSupprimer(sug.id, e)}
                          className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                          title="Supprimer la suggestion"
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

      {/* DETAIL VIEW MODAL */}
      {selection && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            onClick={() => setSelection(null)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl relative z-10 border border-slate-200 overflow-hidden text-left">
            <div className="bg-[#0B3C91] p-6 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Inbox className="h-5 w-5 text-white shrink-0" />
                <h3 className="font-poppins font-black text-base sm:text-lg">Détails de la suggestion</h3>
              </div>
              <button
                onClick={() => setSelection(null)}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Date d'envoi</span>
                  <span className="font-bold text-slate-700">{formaterDate(selection.date, true)}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Donateur / Nom</span>
                  <span className="font-bold text-slate-700">{selection.nom}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Téléphone</span>
                  <span className="font-bold text-[#0B3C91]">{formaterTelephone(selection.telephone)}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Sujet</span>
                  <span className="font-bold text-slate-800">{selection.sujet}</span>
                </div>
              </div>

              <hr className="border-slate-100" />

              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Message / Proposition</span>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs sm:text-sm text-slate-650 leading-relaxed font-light whitespace-pre-line max-h-48 overflow-y-auto">
                  {selection.message}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelection(null)}
                  className="px-5 py-2.5 bg-slate-150 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SuggestionsAdmin;
