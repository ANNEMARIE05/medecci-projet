import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import { requirePermission } from '../../../../lib/permissions';
import { logAudit } from '../../../../lib/audit';
import { handleApiError, ApiError } from '../../../../lib/apiError';
import Categorie from '../../../../models/Categorie';
import Caisse from '../../../../models/Caisse';

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const session = await requirePermission('PARAMETRAGE', 'MODIFIER');
    const { id } = await params;
    const { nom } = await req.json();
    const nouveauNom = String(nom || '').trim();
    if (!nouveauNom) throw new ApiError('Le nom de la catégorie ne peut pas être vide.', 400);

    const categorie = await Categorie.findById(id);
    if (!categorie) throw new ApiError('Catégorie introuvable.', 404);

    const ancienNom = categorie.nom;
    categorie.nom = nouveauNom;
    await categorie.save();

    if (ancienNom !== nouveauNom) {
      await Caisse.updateMany({ categorie: ancienNom }, { categorie: nouveauNom });
    }

    await logAudit(session, 'MODIFICATION', 'Catégorie', `Renommage de "${ancienNom}" en "${nouveauNom}".`);
    return NextResponse.json(categorie);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const session = await requirePermission('PARAMETRAGE', 'SUPPRIMER');
    const { id } = await params;

    const categorie = await Categorie.findByIdAndDelete(id);
    if (!categorie) throw new ApiError('Catégorie introuvable.', 404);

    await Caisse.updateMany({ categorie: categorie.nom }, { categorie: 'Général' });
    await logAudit(session, 'SUPPRESSION', 'Catégorie', `Suppression de la catégorie "${categorie.nom}".`);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
