import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import { requirePermission } from '../../../../lib/permissions';
import { logAudit } from '../../../../lib/audit';
import { handleApiError } from '../../../../lib/apiError';
import Don from '../../../../models/Don';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const session = await requirePermission('DONS', 'MODIFIER');
    const { id } = await params;
    const body = await req.json();
    const don = await Don.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!don) return NextResponse.json({ message: 'Introuvable.' }, { status: 404 });
    await logAudit(session, 'MODIFICATION', 'Don', `Modification du don de "${don.nomDonateur}" (${don.montant} FCFA).`);
    return NextResponse.json(don);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const session = await requirePermission('DONS', 'SUPPRIMER');
    const { id } = await params;
    const don = await Don.findByIdAndDelete(id);
    if (!don) return NextResponse.json({ message: 'Introuvable.' }, { status: 404 });
    await logAudit(session, 'SUPPRESSION', 'Don', `Suppression du don de "${don.nomDonateur}" (${don.montant} FCFA).`);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
