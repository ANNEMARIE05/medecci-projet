import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import caisseService from '../../services/caisseService';
import type { Caisse } from '../../types/models';
import { calculerTotalCaisse } from '../../lib/caisseUtils';
import { formaterDevise } from '../../utils/formateur';
import PaginationFooter from '../../components/UI/PaginationFooter';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, Search, RefreshCw } from 'lucide-react';

export const Archives: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: caisses = [] } = useQuery({ queryKey: ['caisses'], queryFn: caisseService.recupererCaisses });

  const desarchiverMutation = useMutation({
    mutationFn: caisseService.desarchiverCaisse,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['caisses'] }),
  });

  // États locaux
  const [recherche, setRecherche] = useState('');
  const [page, setPage] = useState(1);
  const [taillePage, setTaillePage] = useState(6);

  // Modal confirmation
  const [caisseADesarchiver, setCaisseADesarchiver] = useState<Caisse | null>(null);

  // Filtrage caisses archivées uniquement
  const caissesArchivees = caisses.filter(c =>
    c.archivee === true &&
    (c.nom.toLowerCase().includes(recherche.toLowerCase()) ||
     c.description.toLowerCase().includes(recherche.toLowerCase()) ||
     (c.code && c.code.toLowerCase().includes(recherche.toLowerCase())))
  );

  const totalItems = caissesArchivees.length;
  const totalPages = Math.ceil(totalItems / taillePage) || 1;

  useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [totalItems, totalPages, page]);

  const indexDernier = page * taillePage;
  const indexPremier = indexDernier - taillePage;
  const itemsPaginees = caissesArchivees.slice(indexPremier, indexDernier);

  const handleDesarchiver = () => {
    if (!caisseADesarchiver) return;
    desarchiverMutation.mutate(caisseADesarchiver.id, {
      onSuccess: () => setCaisseADesarchiver(null),
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Barre de Recherche / Filtre */}
      <div className="flt-bar" style={{ background: 'var(--color-bg-card)', borderRadius: 'var(--radius-md)', padding: '16px 20px', boxShadow: 'var(--shadow-sm)' }}>
        <div className="flt-left">
          <div className="s-wrap">
            <Search className="s-ico h-4.5 w-4.5" />
            <input
              type="text"
              placeholder="Rechercher caisse archivée..."
              value={recherche}
              onChange={(e) => { setRecherche(e.target.value); setPage(1); }}
            />
          </div>
        </div>
        <div className="flt-right">
          <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-dark-muted)' }}>
            Total archivées : {totalItems}
          </span>
        </div>
      </div>

      {/* Grille des Caisses Archivées */}
      <div className="caisse-grid">
        {itemsPaginees.length === 0 ? (
          <div className="dtl-card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px' }}>
            <Folder className="h-10 w-10 text-slate-300" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--color-dark)' }}>Aucune caisse archivée</h3>
            <p style={{ color: 'var(--color-dark-muted)', fontSize: '12px', marginTop: '4px' }}>
              Les comptes financiers archivés apparaîtront dans cette section.
            </p>
          </div>
        ) : (
          itemsPaginees.map((c) => {
            const solde = calculerTotalCaisse(c);
            return (
              <div key={c.id} className="caisse-card" style={{ opacity: 0.85 }}>
                <div className="caisse-title-row">
                  <span className="caisse-name" style={{ color: 'var(--color-dark-muted)' }}>
                    {c.nom} (Archivée)
                  </span>
                </div>
                <p className="caisse-desc">{c.description || 'Aucune description disponible.'}</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-dark-muted)', fontWeight: '600' }}>Solde Préservé</span>
                  <p className="caisse-sum" style={{ color: 'var(--color-dark-muted)' }}>{formaterDevise(solde)}</p>
                </div>

                <div className="caisse-meta">
                  <span>Resp : {c.responsable}</span>
                  <span>Code : {c.code}</span>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <button
                    onClick={() => setCaisseADesarchiver(c)}
                    className="btn-prim"
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Désarchiver</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <PaginationFooter
        total={totalItems}
        page={page}
        pageSize={taillePage}
        totalPages={totalPages}
        label="caisses"
        onPageChange={setPage}
        onPageSizeChange={(sz) => { setTaillePage(sz); setPage(1); }}
      />

      {/* MODALE DE DESARCHIVAGE */}
      <AnimatePresence>
        {caisseADesarchiver && (
          <div className="modal-overlay" onClick={() => setCaisseADesarchiver(null)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="modal"
              style={{ textAlign: 'center' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-success-light)', color: 'var(--color-success)', margin: '0 auto 14px' }}>
                <RefreshCw className="h-6 w-6" />
              </div>
              <h3 className="modal-title font-poppins font-bold" style={{ textAlign: 'center', marginBottom: '6px' }}>Restaurer la caisse ?</h3>
              <p style={{ fontSize: '13px', color: 'var(--color-dark-muted)', marginBottom: '22px', lineHeight: '1.45' }}>
                Désarchiver la caisse <strong>"{caisseADesarchiver.nom}"</strong> la rendra à nouveau disponible pour de futurs versements.
              </p>
              <div className="modal-actions" style={{ justifyContent: 'center' }}>
                <button onClick={() => setCaisseADesarchiver(null)} className="btn-sec">Annuler</button>
                <button onClick={handleDesarchiver} className="btn-prim">Désarchiver</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Archives;
