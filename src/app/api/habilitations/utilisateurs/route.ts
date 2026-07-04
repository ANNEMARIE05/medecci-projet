import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '../../../../lib/mongodb';
import { requirePermission } from '../../../../lib/permissions';
import { logAudit } from '../../../../lib/audit';
import { handleApiError, ApiError } from '../../../../lib/apiError';
import UtilisateurDashboard from '../../../../models/UtilisateurDashboard';
import Profil from '../../../../models/Profil';

export async function GET() {
  try {
    await connectDB();
    await requirePermission('UTILISATEURS', 'VOIR');
    const utilisateurs = await UtilisateurDashboard.find().sort({ dateCreation: -1 });
    return NextResponse.json(utilisateurs);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await requirePermission('UTILISATEURS', 'CREER');
    const { nom, prenom, email, motDePasse, profilId, actif } = await req.json();

    if (!String(nom || '').trim() || !String(prenom || '').trim() || !String(email || '').trim()) {
      throw new ApiError('Nom, prénom et email requis.', 400);
    }
    if (!motDePasse || String(motDePasse).length < 6) {
      throw new ApiError('Le mot de passe doit comporter au moins 6 caractères.', 400);
    }
    const profil = await Profil.findById(profilId);
    if (!profil) throw new ApiError('Profil invalide.', 400);

    const passwordHash = await bcrypt.hash(String(motDePasse), 10);
    const utilisateur = await UtilisateurDashboard.create({
      nom,
      prenom,
      email: String(email).trim().toLowerCase(),
      passwordHash,
      profilId,
      actif: actif ?? true,
    });

    await logAudit(session, 'CRÉATION', 'Utilisateur', `Création du compte utilisateur "${prenom} ${nom}" (${email}).`);
    return NextResponse.json(utilisateur, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
