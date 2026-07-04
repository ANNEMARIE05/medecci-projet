import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import { requirePermission } from '../../../../lib/permissions';
import { logAudit } from '../../../../lib/audit';
import { handleApiError } from '../../../../lib/apiError';
import Suggestion from '../../../../models/Suggestion';

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const session = await requirePermission('SUGGESTIONS', 'SUPPRIMER');
    const { id } = await params;
    const suggestion = await Suggestion.findByIdAndDelete(id);
    if (!suggestion) return NextResponse.json({ message: 'Introuvable.' }, { status: 404 });
    await logAudit(session, 'SUPPRESSION', 'Suggestion', `Suppression de la suggestion de "${suggestion.nom}".`);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
