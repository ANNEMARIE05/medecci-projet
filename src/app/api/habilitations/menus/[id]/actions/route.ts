import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../../../lib/mongodb';
import { requirePermission } from '../../../../../../lib/permissions';
import { logAudit } from '../../../../../../lib/audit';
import { handleApiError, ApiError } from '../../../../../../lib/apiError';
import Menu from '../../../../../../models/Menu';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const session = await requirePermission('PROFILS', 'MODIFIER');
    const { id } = await params;
    const { actionIds } = await req.json();

    const menu = await Menu.findByIdAndUpdate(id, { actionsDisponibles: actionIds || [] }, { new: true });
    if (!menu) throw new ApiError('Menu introuvable.', 404);

    await logAudit(
      session,
      'AUTORISATION',
      'Menu',
      `Changement des actions associées au menu "${menu.libelle}" (${(actionIds || []).length} actions associées).`
    );
    return NextResponse.json(menu);
  } catch (error) {
    return handleApiError(error);
  }
}
