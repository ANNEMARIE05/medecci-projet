import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import { requirePermission } from '../../../../lib/permissions';
import { logAudit } from '../../../../lib/audit';
import { handleApiError, ApiError } from '../../../../lib/apiError';
import Profil from '../../../../models/Profil';

export async function GET() {
  try {
    await connectDB();
    await requirePermission('PROFILS', 'VOIR');
    const profils = await Profil.find().sort({ libelle: 1 });
    return NextResponse.json(profils);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await requirePermission('PROFILS', 'CREER');
    const { code, libelle, description } = await req.json();
    const codePropre = String(code || '').trim().toUpperCase();
    if (!codePropre || !String(libelle || '').trim()) {
      throw new ApiError('Code et libellé requis.', 400);
    }

    const profil = await Profil.create({ code: codePropre, libelle, description: description || '', habilitations: [] });
    await logAudit(session, 'CRÉATION', 'Profil', `Création du profil "${libelle}" [${codePropre}].`);
    return NextResponse.json(profil, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
