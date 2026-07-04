import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import { requirePermission } from '../../../lib/permissions';
import { logAudit } from '../../../lib/audit';
import { handleApiError, ApiError } from '../../../lib/apiError';
import Statut from '../../../models/Statut';

export async function GET() {
  try {
    await connectDB();
    await requirePermission('PARAMETRAGE', 'VOIR');
    const statuts = await Statut.find().sort({ nom: 1 });
    return NextResponse.json(statuts);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await requirePermission('PARAMETRAGE', 'CREER');
    const { nom } = await req.json();
    const nomPropre = String(nom || '').trim();
    if (!nomPropre) throw new ApiError('Le nom du statut ne peut pas être vide.', 400);

    const statut = await Statut.create({ nom: nomPropre });
    await logAudit(session, 'CRÉATION', 'Statut', `Création du statut "${nomPropre}".`);
    return NextResponse.json(statut, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
