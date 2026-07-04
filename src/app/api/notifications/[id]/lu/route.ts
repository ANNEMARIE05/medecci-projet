import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../../lib/mongodb';
import { getSessionOrThrow } from '../../../../../lib/permissions';
import { handleApiError } from '../../../../../lib/apiError';
import Notification from '../../../../../models/Notification';

export async function PUT(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    await getSessionOrThrow();
    const { id } = await params;
    await Notification.findByIdAndUpdate(id, { lu: true });
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
