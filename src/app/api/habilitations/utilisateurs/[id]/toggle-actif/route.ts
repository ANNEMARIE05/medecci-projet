import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../../../lib/mongodb';
import { requirePermission } from '../../../../../../lib/permissions';
import { logAudit } from '../../../../../../lib/audit';
import { handleApiError, ApiError } from '../../../../../../lib/apiError';
import UtilisateurDashboard from '../../../../../../models/UtilisateurDashboard';

export async function PUT(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const session = await requirePermission('UTILISATEURS', 'MODIFIER');
    const { id } = await params;

    const utilisateur = await UtilisateurDashboard.findById(id);
    if (!utilisateur) throw new ApiError('Utilisateur introuvable.', 404);

    utilisateur.actif = !utilisateur.actif;
    await utilisateur.save();

    await logAudit(
      session,
      'COMMUTATION STATUT',
      'Utilisateur',
      `Modification de l'état d'activité pour "${utilisateur.prenom} ${utilisateur.nom}" -> ${utilisateur.actif ? 'ACTIF' : 'INACTIF'}.`
    );
    return NextResponse.json(utilisateur);
  } catch (error) {
    return handleApiError(error);
  }
}
