import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../../lib/mongodb';
import { requirePermission } from '../../../../../lib/permissions';
import { logAudit } from '../../../../../lib/audit';
import { handleApiError, ApiError } from '../../../../../lib/apiError';
import Profil from '../../../../../models/Profil';
import UtilisateurDashboard from '../../../../../models/UtilisateurDashboard';

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const session = await requirePermission('PROFILS', 'MODIFIER');
    const { id } = await params;
    const body = await req.json();
    if (body.code) body.code = String(body.code).trim().toUpperCase();

    const profil = await Profil.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!profil) throw new ApiError('Profil introuvable.', 404);

    await logAudit(session, 'MODIFICATION', 'Profil', `Modification du profil "${profil.libelle}".`);
    return NextResponse.json(profil);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const session = await requirePermission('PROFILS', 'SUPPRIMER');
    const { id } = await params;

    const utilise = await UtilisateurDashboard.exists({ profilId: id });
    if (utilise) {
      throw new ApiError('Ce profil est assigné à un ou plusieurs utilisateurs.', 409);
    }

    const profil = await Profil.findByIdAndDelete(id);
    if (!profil) throw new ApiError('Profil introuvable.', 404);

    await logAudit(session, 'SUPPRESSION', 'Profil', `Suppression du profil "${profil.libelle}" [${profil.code}].`);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
