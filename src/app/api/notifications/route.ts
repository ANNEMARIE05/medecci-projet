import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import { getSessionOrThrow } from '../../../lib/permissions';
import { handleApiError } from '../../../lib/apiError';
import Notification from '../../../models/Notification';

export async function GET() {
  try {
    await connectDB();
    await getSessionOrThrow();
    const notifications = await Notification.find().sort({ date: -1 }).limit(50);
    return NextResponse.json(notifications);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE() {
  try {
    await connectDB();
    await getSessionOrThrow();
    await Notification.deleteMany({});
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
