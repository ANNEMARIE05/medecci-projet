import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import { requirePermission } from '../../../lib/permissions';
import { handleApiError } from '../../../lib/apiError';
import Don from '../../../models/Don';
import Notification from '../../../models/Notification';

export async function GET() {
  try {
    await connectDB();
    await requirePermission('DONS', 'VOIR');
    const dons = await Don.find().sort({ date: -1 });
    return NextResponse.json(dons);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const don = await Don.create(body);
    await Notification.create({
      message: `Nouveau don enregistré : ${Number(don.montant).toLocaleString('fr-FR')} FCFA par ${don.nomDonateur}`,
    });
    return NextResponse.json(don, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
