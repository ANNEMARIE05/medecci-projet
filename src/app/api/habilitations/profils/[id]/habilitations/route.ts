import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../../../lib/mongodb';
import { requirePermission } from '../../../../../../lib/permissions';
import { logAudit } from '../../../../../../lib/audit';
import { handleApiError, ApiError } from '../../../../../../lib/apiError';
import Profil from '../../../../../../models/Profil';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const session = await requirePermission('PROFILS', 'MODIFIER');
    const { id } = await params;
    const { habilitations } = await req.json();

    const profil = await Profil.findByIdAndUpdate(id, { habilitations: habilitations || [] }, { new: true });
    if (!profil) throw new ApiError('Profil introuvable.', 404);

    await logAudit(
      session,
      'AUTORISATION',
      'Habilitations',
      `Mise à jour des habilitations du profil "${profil.libelle}" (${(habilitations || []).length} menus assignés).`
    );
    return NextResponse.json(profil);
  } catch (error) {
    return handleApiError(error);
  }
}
