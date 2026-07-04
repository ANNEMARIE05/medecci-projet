import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../../lib/mongodb';
import { requirePermission } from '../../../../../lib/permissions';
import { logAudit } from '../../../../../lib/audit';
import { handleApiError, ApiError } from '../../../../../lib/apiError';
import Menu from '../../../../../models/Menu';
import Profil from '../../../../../models/Profil';

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const session = await requirePermission('PROFILS', 'MODIFIER');
    const { id } = await params;
    const body = await req.json();
    if (body.code) body.code = String(body.code).trim().toUpperCase();

    const menu = await Menu.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!menu) throw new ApiError('Menu introuvable.', 404);

    await logAudit(session, 'MODIFICATION', 'Menu', `Modification du menu "${menu.libelle}".`);
    return NextResponse.json(menu);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const session = await requirePermission('PROFILS', 'SUPPRIMER');
    const { id } = await params;

    const utilise = await Profil.exists({ 'habilitations.menuId': id });
    if (utilise) {
      throw new ApiError('Ce menu est utilisé dans un ou plusieurs profils.', 409);
    }

    const menu = await Menu.findByIdAndDelete(id);
    if (!menu) throw new ApiError('Menu introuvable.', 404);

    await logAudit(session, 'SUPPRESSION', 'Menu', `Suppression du menu "${menu.libelle}" [${menu.code}].`);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
