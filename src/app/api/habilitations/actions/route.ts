import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import { requirePermission } from '../../../../lib/permissions';
import { logAudit } from '../../../../lib/audit';
import { handleApiError, ApiError } from '../../../../lib/apiError';
import Action from '../../../../models/Action';

export async function GET() {
  try {
    await connectDB();
    await requirePermission('PROFILS', 'VOIR');
    const actions = await Action.find().sort({ libelle: 1 });
    return NextResponse.json(actions);
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

    const action = await Action.create({ code: codePropre, libelle, description: description || '' });
    await logAudit(session, 'CRÉATION', 'Action', `Création de l'action "${libelle}" [${codePropre}].`);
    return NextResponse.json(action, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
