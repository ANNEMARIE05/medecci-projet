import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import { requirePermission } from '../../../lib/permissions';
import { handleApiError } from '../../../lib/apiError';
import Transaction from '../../../models/Transaction';

export async function GET() {
  try {
    await connectDB();
    await requirePermission('HISTORIQUE', 'VOIR');
    const transactions = await Transaction.find().sort({ date: -1 });
    return NextResponse.json(transactions);
  } catch (error) {
    return handleApiError(error);
  }
}
