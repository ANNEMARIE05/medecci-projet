import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import { requirePermission } from '../../../lib/permissions';
import { handleApiError } from '../../../lib/apiError';
import DemandePriere from '../../../models/DemandePriere';
import Notification from '../../../models/Notification';

export async function GET() {
  try {
    await connectDB();
    await requirePermission('PRIERES', 'VOIR');
    const demandes = await DemandePriere.find().sort({ date: -1 });
    return NextResponse.json(demandes);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const demande = await DemandePriere.create(body);
    await Notification.create({
      message: `Nouvelle demande de prière de ${demande.nom} : "${demande.sujet}"`,
    });
    return NextResponse.json(demande, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
