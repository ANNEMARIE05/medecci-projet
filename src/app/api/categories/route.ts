import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import { requirePermission } from '../../../lib/permissions';
import { logAudit } from '../../../lib/audit';
import { handleApiError, ApiError } from '../../../lib/apiError';
import Categorie from '../../../models/Categorie';

export async function GET() {
  try {
    await connectDB();
    await requirePermission('PARAMETRAGE', 'VOIR');
    const categories = await Categorie.find().sort({ nom: 1 });
    return NextResponse.json(categories);
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
    if (!nomPropre) throw new ApiError('Le nom de la catégorie ne peut pas être vide.', 400);

    const categorie = await Categorie.create({ nom: nomPropre });
    await logAudit(session, 'CRÉATION', 'Catégorie', `Création de la catégorie "${nomPropre}".`);
    return NextResponse.json(categorie, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
