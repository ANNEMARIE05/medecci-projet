import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import { requirePermission } from '../../../../lib/permissions';
import { logAudit } from '../../../../lib/audit';
import { handleApiError, ApiError } from '../../../../lib/apiError';
import Menu from '../../../../models/Menu';

export async function GET() {
  try {
    await connectDB();
    await requirePermission('PROFILS', 'VOIR');
    const menus = await Menu.find().sort({ libelle: 1 });
    return NextResponse.json(menus);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await requirePermission('PROFILS', 'CREER');
    const { code, libelle, chemin, icone } = await req.json();
    const codePropre = String(code || '').trim().toUpperCase();
    if (!codePropre || !String(libelle || '').trim()) {
      throw new ApiError('Code et libellé requis.', 400);
    }

    const menu = await Menu.create({ code: codePropre, libelle, chemin, icone, actionsDisponibles: [] });
    await logAudit(session, 'CRÉATION', 'Menu', `Création du menu "${libelle}" [${codePropre}].`);
    return NextResponse.json(menu, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
