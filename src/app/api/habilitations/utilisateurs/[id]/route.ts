import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '../../../../../lib/mongodb';
import { requirePermission } from '../../../../../lib/permissions';
import { logAudit } from '../../../../../lib/audit';
import { handleApiError, ApiError } from '../../../../../lib/apiError';
import UtilisateurDashboard from '../../../../../models/UtilisateurDashboard';

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const session = await requirePermission('UTILISATEURS', 'MODIFIER');
    const { id } = await params;
    const { nom, prenom, email, motDePasse, profilId, actif } = await req.json();

    const updates: Record<string, unknown> = {};
    if (nom !== undefined) updates.nom = nom;
    if (prenom !== undefined) updates.prenom = prenom;
    if (email !== undefined) updates.email = String(email).trim().toLowerCase();
    if (profilId !== undefined) updates.profilId = profilId;
    if (actif !== undefined) updates.actif = actif;
    if (motDePasse) {
      if (String(motDePasse).length < 6) {
        throw new ApiError('Le mot de passe doit comporter au moins 6 caractères.', 400);
      }
      updates.passwordHash = await bcrypt.hash(String(motDePasse), 10);
    }

    const utilisateur = await UtilisateurDashboard.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!utilisateur) throw new ApiError('Utilisateur introuvable.', 404);

    await logAudit(session, 'MODIFICATION', 'Utilisateur', `Modification du compte utilisateur "${utilisateur.prenom} ${utilisateur.nom}".`);
    return NextResponse.json(utilisateur);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const session = await requirePermission('UTILISATEURS', 'SUPPRIMER');
    const { id } = await params;

    const utilisateur = await UtilisateurDashboard.findByIdAndDelete(id);
    if (!utilisateur) throw new ApiError('Utilisateur introuvable.', 404);

    await logAudit(session, 'SUPPRESSION', 'Utilisateur', `Suppression du compte utilisateur "${utilisateur.prenom} ${utilisateur.nom}".`);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
