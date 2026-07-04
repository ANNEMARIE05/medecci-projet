import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../../lib/mongodb';
import { requirePermission } from '../../../../../lib/permissions';
import { logAudit } from '../../../../../lib/audit';
import { handleApiError } from '../../../../../lib/apiError';
import Caisse from '../../../../../models/Caisse';

export async function PUT(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const session = await requirePermission('CAISSES', 'MODIFIER');
    const { id } = await params;
    const caisse = await Caisse.findByIdAndUpdate(id, { archivee: true }, { new: true });
    if (!caisse) return NextResponse.json({ message: 'Caisse introuvable.' }, { status: 404 });
    await logAudit(session, 'COMMUTATION STATUT', 'Caisse', `Archivage de la caisse "${caisse.nom}" [${caisse.code}].`);
    return NextResponse.json(caisse);
  } catch (error) {
    return handleApiError(error);
  }
}
