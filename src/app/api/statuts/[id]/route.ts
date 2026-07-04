import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import { requirePermission } from '../../../../lib/permissions';
import { logAudit } from '../../../../lib/audit';
import { handleApiError, ApiError } from '../../../../lib/apiError';
import Statut from '../../../../models/Statut';
import Membre from '../../../../models/Membre';

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const session = await requirePermission('PARAMETRAGE', 'MODIFIER');
    const { id } = await params;
    const { nom } = await req.json();
    const nouveauNom = String(nom || '').trim();
    if (!nouveauNom) throw new ApiError('Le nom du statut ne peut pas être vide.', 400);

    const statut = await Statut.findById(id);
    if (!statut) throw new ApiError('Statut introuvable.', 404);

    const ancienNom = statut.nom;
    statut.nom = nouveauNom;
    await statut.save();

    if (ancienNom !== nouveauNom) {
      await Membre.updateMany({ statut: ancienNom }, { statut: nouveauNom });
    }

    await logAudit(session, 'MODIFICATION', 'Statut', `Renommage de "${ancienNom}" en "${nouveauNom}".`);
    return NextResponse.json(statut);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const session = await requirePermission('PARAMETRAGE', 'SUPPRIMER');
    const { id } = await params;

    const statut = await Statut.findByIdAndDelete(id);
    if (!statut) throw new ApiError('Statut introuvable.', 404);

    await Membre.updateMany({ statut: statut.nom }, { statut: 'Fidèle' });
    await logAudit(session, 'SUPPRESSION', 'Statut', `Suppression du statut "${statut.nom}".`);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
