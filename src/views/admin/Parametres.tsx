import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Building2, Save, UserCog } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { INFOS_CONTACT } from '../../constants';
import { usePermissions } from '../../hooks/usePermissions';

// Schéma de validation Zod
const schemaParametres = zod.object({
  nomEglise: zod.string().min(5, 'Le nom de l\'église doit faire au moins 5 caractères'),
  siege: zod.string().min(10, 'L\'adresse de localisation doit faire au moins 10 caractères'),
  telephone: zod.string().min(8, 'Le numéro de téléphone doit faire au moins 8 chiffres'),
  email: zod.string().email('Adresse e-mail officielle invalide'),
  pasteurPrincipal: zod.string().min(5, 'Le nom du pasteur principal is requis'),
});

type FormParametresInput = zod.infer<typeof schemaParametres>;

export const Parametres: React.FC = () => {
  const [soumis, setSoumis] = useState(false);
  const [enCours, setEnCours] = useState(false);
  const { data: session } = useSession();
  const { profilLibelle } = usePermissions();
  const utilisateur = session?.user;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormParametresInput>({
    resolver: zodResolver(schemaParametres),
    defaultValues: {
      nomEglise: INFOS_CONTACT.nomEglise,
      siege: INFOS_CONTACT.siege,
      telephone: INFOS_CONTACT.telephone,
      email: INFOS_CONTACT.email,
      pasteurPrincipal: INFOS_CONTACT.pasteurPrincipal,
    },
  });

  const onSubmit = async (_donnees: FormParametresInput) => {
    setEnCours(true);
    // Simuler la modification des paramètres systèmes
    await new Promise((resolve) => setTimeout(resolve, 800));
    setEnCours(false);
    setSoumis(true);
    setTimeout(() => setSoumis(false), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="dtl-grid" style={{ gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
        
        {/* SIDEBAR PROFIL DETAILS */}
        <div className="dtl-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: 'fit-content' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
            <div className="ava-sm" style={{ width: '70px', height: '70px', fontSize: '22px', fontWeight: 'bold' }}>
              {utilisateur?.prenom.charAt(0)}
              {utilisateur?.nom.charAt(0)}
            </div>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: '750', color: 'var(--color-dark)', margin: 0 }}>
                {utilisateur?.prenom} {utilisateur?.nom}
              </h4>
              <span className="badge badge-partial" style={{ fontSize: '10px', marginTop: '4px' }}>
                {profilLibelle}
              </span>
            </div>
          </div>

          {/* DÉTAILS COMPTE */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h4 style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-dark-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <UserCog className="h-4 w-4" />
              <span>Détails de Session</span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-dark-muted)' }}>Identifiant :</span>
                <span style={{ fontWeight: '600', color: 'var(--color-dark)' }}>{utilisateur?.id}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-dark-muted)' }}>E-mail de connexion :</span>
                <span style={{ fontWeight: '600', color: 'var(--color-dark)' }}>{utilisateur?.email}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-dark-muted)' }}>Niveau d'accès :</span>
                <span style={{ fontWeight: '700', color: 'var(--color-success)' }}>Accès Total</span>
              </div>
            </div>
          </div>
        </div>

        {/* PARAMS GÉNÉRAUX FORM */}
        <div className="frm-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
            <Building2 className="h-5 w-5 text-[#1B4F8A]" />
            <h3 style={{ fontSize: '16px', fontWeight: '750', color: 'var(--color-dark)', margin: 0 }}>
              Informations Générales du Temple
            </h3>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {soumis && (
              <div className="frm-alert ok">
                Les paramètres généraux ont été mis à jour avec succès !
              </div>
            )}

            <div className="frm-grid" style={{ gap: '12px' }}>
              {/* Nom Église */}
              <div className="frm-grp frm-span2">
                <label className="frm-lbl">Nom officiel de la Mission / Temple *</label>
                <input
                  type="text"
                  {...register('nomEglise')}
                  className="frm-inp"
                  required
                />
                {errors.nomEglise && <span style={{ fontSize: '10px', color: 'var(--color-danger)' }}>{errors.nomEglise.message}</span>}
              </div>

              {/* Pasteur Principal */}
              <div className="frm-grp frm-span2">
                <label className="frm-lbl">Pasteur Principal de la Mission *</label>
                <input
                  type="text"
                  {...register('pasteurPrincipal')}
                  className="frm-inp"
                  required
                />
                {errors.pasteurPrincipal && <span style={{ fontSize: '10px', color: 'var(--color-danger)' }}>{errors.pasteurPrincipal.message}</span>}
              </div>

              {/* Localisation Siège */}
              <div className="frm-grp frm-span2">
                <label className="frm-lbl">Adresse de Localisation (Siège) *</label>
                <input
                  type="text"
                  {...register('siege')}
                  className="frm-inp"
                  required
                />
                {errors.siege && <span style={{ fontSize: '10px', color: 'var(--color-danger)' }}>{errors.siege.message}</span>}
              </div>

              {/* Téléphone Secrétariat */}
              <div className="frm-grp">
                <label className="frm-lbl">Téléphone Secrétariat *</label>
                <input
                  type="text"
                  {...register('telephone')}
                  className="frm-inp"
                  required
                />
                {errors.telephone && <span style={{ fontSize: '10px', color: 'var(--color-danger)' }}>{errors.telephone.message}</span>}
              </div>

              {/* Email officiel */}
              <div className="frm-grp">
                <label className="frm-lbl">E-mail Officiel de contact *</label>
                <input
                  type="email"
                  {...register('email')}
                  className="frm-inp"
                  required
                />
                {errors.email && <span style={{ fontSize: '10px', color: 'var(--color-danger)' }}>{errors.email.message}</span>}
              </div>
            </div>

            {/* Bouton Enregistrer */}
            <div className="frm-footer" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '14px', marginTop: '10px' }}>
              <button
                type="submit"
                disabled={enCours}
                className="btn-prim"
              >
                <Save className="h-4 w-4" />
                <span>{enCours ? 'Enregistrement...' : 'Sauvegarder les modifications'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Parametres;
