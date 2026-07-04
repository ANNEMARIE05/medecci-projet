import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../../lib/mongodb';
import { requirePermission } from '../../../../../lib/permissions';
import { logAudit } from '../../../../../lib/audit';
import { handleApiError, ApiError } from '../../../../../lib/apiError';
import Action from '../../../../../models/Action';
import Menu from '../../../../../models/Menu';

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const session = await requirePermission('PROFILS', 'MODIFIER');
    const { id } = await params;
    const body = await req.json();
    if (body.code) body.code = String(body.code).trim().toUpperCase();

    const action = await Action.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!action) throw new ApiError('Action introuvable.', 404);

    await logAudit(session, 'MODIFICATION', 'Action', `Modification de l'action "${action.libelle}".`);
    return NextResponse.json(action);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const session = await requirePermission('PROFILS', 'SUPPRIMER');
    const { id } = await params;

    const utiliseeDansMenu = await Menu.exists({ actionsDisponibles: id });
    if (utiliseeDansMenu) {
      throw new ApiError('Cette action est assignée à un ou plusieurs menus. Retirez-la d\'abord.', 409);
    }

    const action = await Action.findByIdAndDelete(id);
    if (!action) throw new ApiError('Action introuvable.', 404);

    await logAudit(session, 'SUPPRESSION', 'Action', `Suppression de l'action "${action.libelle}" [${action.code}].`);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
