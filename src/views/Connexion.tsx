import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { ShieldCheck, Mail, Lock, AlertCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { signIn } from 'next-auth/react';
const logo = '/logo.jpg';
import { motion, AnimatePresence } from 'framer-motion';

// Schéma de validation Zod
const schemaConnexion = zod.object({
  email: zod.string().email('Adresse e-mail invalide'),
  motDePasse: zod.string().min(6, 'Le mot de passe doit faire au moins 6 caractères'),
});

type FormConnexionInput = zod.infer<typeof schemaConnexion>;

export const Connexion: React.FC = () => {
  const [enCours, setEnCours] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState<'idle' | 'loading' | 'success'>('idle');
  const [loadingLabel, setLoadingLabel] = useState('Authentification...');
  const [erreur, setErreur] = useState<string | null>(null);
  const [showPwd, setShowPwd] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormConnexionInput>({
    resolver: zodResolver(schemaConnexion),
    defaultValues: {
      email: 'admin@medec-ci.org', // Remplissage par défaut
      motDePasse: 'admin123',
    }
  });

  const onSubmit = async (donnees: FormConnexionInput) => {
    setEnCours(true);
    setLoadingPhase('loading');
    setLoadingLabel('Recherche de session...');
    setErreur(null);

    const result = await signIn('credentials', {
      email: donnees.email,
      password: donnees.motDePasse,
      redirect: false,
    });

    if (result?.error) {
      setEnCours(false);
      setLoadingPhase('idle');
      setErreur('Identifiants de connexion incorrects.');
      return;
    }

    setLoadingLabel('Validation des accès...');
    await new Promise((resolve) => setTimeout(resolve, 800));

    setLoadingPhase('success');
    setLoadingLabel('Connexion réussie !');
    await new Promise((resolve) => setTimeout(resolve, 600));

    setEnCours(false);
    router.push('/admin');
  };

  return (
    <div className="login-container">
      {/* Styles locaux pour adapter la mise en page au tableau de bord */}
      <style>{`
        .login-container {
          display: flex;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          background-color: var(--color-bg-main);
          position: relative;
          font-family: 'Inter', sans-serif;
          justify-content: center;
          align-items: center;
          padding: 16px;
        }

        .login-card {
          width: 100%;
          max-width: 440px;
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-top: 4px solid var(--color-primary);
          border-radius: var(--radius-md);
          padding: 36px 40px;
          box-shadow: var(--shadow-lg);
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 10;
        }

        .brand-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 24px;
        }

        .logo-wrapper {
          width: 54px; height: 54px;
          border-radius: 50%;
          background: #FFFFFF;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          border: 2px solid var(--color-primary);
          margin-bottom: 12px;
        }

        .logo-img { width: 100%; height: 100%; object-fit: cover; }

        .brand-name { font-size: 20px; font-weight: 850; color: var(--color-primary); margin: 0; }
        .brand-sub  { font-size: 11px; font-weight: 700; color: var(--color-dark-muted); text-transform: uppercase; letter-spacing: 0.8px; margin-top: 2px; }

        .form-title { font-size: 22px; font-weight: 800; color: var(--color-dark); margin-bottom: 4px; font-family: 'Poppins', sans-serif; }
        .subtitle { font-size: 13px; color: var(--color-dark-muted); margin-bottom: 20px; line-height: 1.45; }

        .error-alert {
          display: flex; align-items: center; gap: 8px;
          background: var(--color-danger-light); color: var(--color-danger);
          padding: 10px 14px; border-radius: var(--radius-sm);
          font-size: 12.5px; font-weight: 600; margin-bottom: 16px;
          border: 1px solid rgba(217, 64, 64, 0.15);
        }

        .form { display: flex; flex-direction: column; gap: 16px; width: 100%; }
        .input-group { display: flex; flex-direction: column; gap: 7px; }
        .label { font-size: 13px; font-weight: 600; color: var(--color-dark-muted); }

        .input-wrap { position: relative; display: flex; align-items: center; }
        .input-ico { position: absolute; left: 13px; color: var(--color-dark-muted); opacity: 0.5; pointer-events: none; }
        
        .auth-input {
          width: 100%;
          padding: 11px 14px 11px 38px;
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-sm);
          font-size: 13.5px;
          color: var(--color-dark);
          background: var(--color-bg-input);
          outline: none;
          transition: all 0.15s ease;
        }
        .auth-input:focus {
          border-color: var(--color-primary);
          background: #FFFFFF;
          box-shadow: 0 0 0 3px var(--color-primary-light);
        }

        .toggle-pwd {
          position: absolute;
          right: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          padding: 4px;
          cursor: pointer;
          color: var(--color-dark-muted);
          border-radius: var(--radius-xs);
          transition: all 0.15s ease;
        }
        .toggle-pwd:hover { color: var(--color-primary); }

        .submit-btn {
          background-color: var(--color-primary); color: white;
          font-weight: 600; padding: 11px;
          border-radius: var(--radius-sm); margin-top: 10px;
          display: flex; justify-content: center; align-items: center; gap: 8px;
          cursor: pointer; font-size: 14px; border: none; width: 100%;
          transition: all 0.15s ease;
          box-shadow: var(--shadow-sm);
        }
        .submit-btn:hover { background-color: var(--color-primary-hover); box-shadow: var(--shadow-md); }

        /* Overlays */
        .login-overlay {
          position: fixed; inset: 0; z-index: 1000;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(6px);
        }

        .login-overlay-card {
          display: flex; flex-direction: column; align-items: center; gap: 20px;
          padding: 40px 48px; background: #fff; border-radius: var(--radius-xl);
          box-shadow: 0 24px 64px rgba(27, 79, 138, 0.18);
          min-width: 290px;
          border: 1px solid rgba(27, 79, 138, 0.1);
        }

        .login-overlay-logo {
          width: 64px; height: 64px; border-radius: 50%;
          background: rgba(27, 79, 138, 0.10);
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
          border: 2px solid white;
          box-shadow: 0 4px 12px rgba(27, 79, 138, 0.08);
        }
        .login-overlay-logo-img { width: 100%; height: 100%; object-fit: cover; }

        .login-overlay-spinner { position: relative; width: 56px; height: 56px; }
        .login-overlay-ring {
          position: absolute; inset: 0; border-radius: 50%;
          border: 3px solid rgba(27, 79, 138, 0.1);
          border-top-color: var(--color-primary);
          animation: spin 0.9s linear infinite;
        }
        .login-overlay-ring--inner {
          inset: 10px; border-width: 2px;
          border-top-color: var(--color-accent);
          animation: spin-reverse 1.2s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes spin-reverse { to { transform: rotate(-360deg); } }

        .login-overlay-check {
          width: 48px; height: 48px; border-radius: 50%;
          background: var(--color-success); color: #fff;
          font-size: 22px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
        }
        
        .login-overlay-msg {
          font-size: 13.5px;
          font-weight: 600;
          color: var(--color-primary);
        }
      `}</style>

      {/* Overlay de chargement/succès de connexion */}
      <AnimatePresence>
        {enCours && (
          <motion.div 
            className="login-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="login-overlay-card"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            >
              <div className="login-overlay-logo">
                <img src={logo} alt="MEDEC-CI" className="login-overlay-logo-img" />
              </div>

              {loadingPhase === 'loading' && (
                <div className="login-overlay-spinner">
                  <div className="login-overlay-ring"></div>
                  <div className="login-overlay-ring login-overlay-ring--inner"></div>
                </div>
              )}

              {loadingPhase === 'success' && (
                <motion.div 
                  className="login-overlay-check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 10, stiffness: 200 }}
                >
                  ✓
                </motion.div>
              )}

              <p className="login-overlay-msg">{loadingLabel}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Carte de Connexion Unique et Centrée */}
      <div className="login-card">
        {/* En-tête de la marque */}
        <div className="brand-header">
          <div className="logo-wrapper">
            <img src={logo} alt="MEDEC-CI" className="logo-img" />
          </div>
          <h1 className="brand-name">MEDEC-CI</h1>
          <span className="brand-sub">Portail d'Administration</span>
        </div>

        {/* Retour au site public */}
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center space-x-1 text-slate-400 hover:text-slate-600 transition-colors text-xs font-semibold"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Retour au site public</span>
          </Link>
        </div>

        <h2 className="form-title">Connexion</h2>
        <p className="subtitle">Identifiez-vous pour gérer les ressources de la paroisse.</p>

        {erreur && (
          <motion.div 
            className="error-alert"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{erreur}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="input-group">
            <label className="label">Adresse e-mail</label>
            <div className="input-wrap">
              <input
                type="email"
                className="auth-input"
                placeholder="admin@medecci.org"
                disabled={enCours}
                {...register('email')}
              />
              <Mail className="input-ico h-4 w-4" />
            </div>
            {errors.email && <span className="text-[10px] text-red-500">{errors.email.message}</span>}
          </div>

          <div className="input-group">
            <label className="label">Mot de passe</label>
            <div className="input-wrap">
              <input
                type={showPwd ? 'text' : 'password'}
                className="auth-input"
                placeholder="••••••••"
                disabled={enCours}
                {...register('motDePasse')}
              />
              <Lock className="input-ico h-4 w-4" />
              <button 
                type="button" 
                className="toggle-pwd" 
                onClick={() => setShowPwd(!showPwd)} 
                disabled={enCours}
              >
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.motDePasse && <span className="text-[10px] text-red-500">{errors.motDePasse.message}</span>}
          </div>

          <button type="submit" className="submit-btn" disabled={enCours}>
            <ShieldCheck className="h-4.5 w-4.5" />
            <span>Se connecter</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Connexion;
