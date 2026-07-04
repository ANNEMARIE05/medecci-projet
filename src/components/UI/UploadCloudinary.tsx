'use client';

import React, { useRef, useState } from 'react';
import { UploadCloud, Loader2, ImageOff } from 'lucide-react';

interface UploadCloudinaryProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export const UploadCloudinary: React.FC<UploadCloudinaryProps> = ({ value, onChange, label = 'Image' }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState('');

  const handleFile = async (file: File) => {
    setErreur('');
    setEnCours(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Échec de l'upload.");
      }
      const data = await res.json();
      onChange(data.url);
    } catch (e: any) {
      setErreur(e.message || "Erreur lors de l'upload.");
    } finally {
      setEnCours(false);
    }
  };

  return (
    <div className="frm-grp">
      <label className="frm-lbl">{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '8px',
            border: '1px solid var(--color-border)',
            background: 'var(--color-bg-input)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Aperçu" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <ImageOff className="h-5 w-5 text-slate-300" />
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="btn-sec"
            disabled={enCours}
            style={{ justifyContent: 'center' }}
          >
            {enCours ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
            <span>{enCours ? 'Envoi en cours...' : value ? "Changer l'image" : 'Choisir une image'}</span>
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = '';
            }}
          />
          {erreur && <span style={{ fontSize: '10px', color: 'var(--color-danger)' }}>{erreur}</span>}
        </div>
      </div>
    </div>
  );
};

export default UploadCloudinary;
