import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import { requirePermission } from '../../../lib/permissions';
import { handleApiError } from '../../../lib/apiError';
import Suggestion from '../../../models/Suggestion';
import Notification from '../../../models/Notification';

export async function GET() {
  try {
    await connectDB();
    await requirePermission('SUGGESTIONS', 'VOIR');
    const suggestions = await Suggestion.find().sort({ date: -1 });
    return NextResponse.json(suggestions);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const suggestion = await Suggestion.create(body);
    await Notification.create({
      message: `Nouvelle suggestion de ${suggestion.nom} : "${suggestion.sujet}"`,
    });
    return NextResponse.json(suggestion, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
