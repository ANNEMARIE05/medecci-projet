import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import { requirePermission, requireAnyPermission } from '../../../../lib/permissions';
import { logAudit } from '../../../../lib/audit';
import { handleApiError } from '../../../../lib/apiError';
import Caisse from '../../../../models/Caisse';
import Transaction from '../../../../models/Transaction';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    await requireAnyPermission([
      ['CAISSES', 'VOIR'],
      ['ARCHIVES', 'VOIR'],
    ]);
    const { id } = await params;
    const caisse = await Caisse.findById(id);
    if (!caisse) return NextResponse.json({ message: 'Caisse introuvable.' }, { status: 404 });
    return NextResponse.json(caisse);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const session = await requirePermission('CAISSES', 'MODIFIER');
    const { id } = await params;
    const { nom, description, code, responsable, objectif, categorie } = await req.json();

    const caisse = await Caisse.findByIdAndUpdate(
      id,
      {
        nom: String(nom).trim(),
        description: description ? String(description).trim() : '',
        code: code ? String(code).trim().toUpperCase() : 'C-GEN',
        responsable: responsable ? String(responsable).trim() : 'Non spécifié',
        objectif: objectif ? Number(objectif) : 0,
        categorie: categorie ? String(categorie).trim() : 'Général',
      },
      { new: true, runValidators: true }
    );

    if (!caisse) return NextResponse.json({ message: 'Caisse introuvable.' }, { status: 404 });
    await logAudit(session, 'MODIFICATION', 'Caisse', `Modification de la caisse "${caisse.nom}" [${caisse.code}].`);
    return NextResponse.json(caisse);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;

    const caisseExistante = await Caisse.findById(id);
    if (!caisseExistante) return NextResponse.json({ message: 'Caisse introuvable.' }, { status: 404 });

    const session = await requirePermission(caisseExistante.archivee ? 'ARCHIVES' : 'CAISSES', 'SUPPRIMER');

    await Caisse.findByIdAndDelete(id);
    await Transaction.deleteMany({ idCaisse: id });

    await logAudit(session, 'SUPPRESSION', 'Caisse', `Suppression de la caisse "${caisseExistante.nom}" [${caisseExistante.code}].`);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
