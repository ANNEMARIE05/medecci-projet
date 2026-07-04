import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import { requirePermission } from '../../../../lib/permissions';
import { handleApiError } from '../../../../lib/apiError';
import AuditTrace from '../../../../models/AuditTrace';

export async function GET() {
  try {
    await connectDB();
    await requirePermission('PROFILS', 'VOIR');
    const traces = await AuditTrace.find().sort({ date: -1 }).limit(1000);
    return NextResponse.json(traces);
  } catch (error) {
    return handleApiError(error);
  }
}
