import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import { requirePermission } from '../../../../lib/permissions';
import { logAudit } from '../../../../lib/audit';
import { handleApiError } from '../../../../lib/apiError';
import DemandePriere from '../../../../models/DemandePriere';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const session = await requirePermission('PRIERES', 'MODIFIER');
    const { id } = await params;
    const { statut } = await req.json();
    const demande = await DemandePriere.findByIdAndUpdate(id, { statut }, { new: true });
    if (!demande) return NextResponse.json({ message: 'Introuvable.' }, { status: 404 });
    await logAudit(session, 'MODIFICATION', 'Demande de prière', `Statut de la demande de "${demande.nom}" -> ${statut}.`);
    return NextResponse.json(demande);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const session = await requirePermission('PRIERES', 'SUPPRIMER');
    const { id } = await params;
    const demande = await DemandePriere.findByIdAndDelete(id);
    if (!demande) return NextResponse.json({ message: 'Introuvable.' }, { status: 404 });
    await logAudit(session, 'SUPPRESSION', 'Demande de prière', `Suppression de la demande de "${demande.nom}".`);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
