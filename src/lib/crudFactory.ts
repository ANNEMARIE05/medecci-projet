import { NextRequest, NextResponse } from 'next/server';
import type { Model } from 'mongoose';
import { connectDB } from './mongodb';
import { requirePermission } from './permissions';
import { logAudit } from './audit';
import { handleApiError } from './apiError';

interface CrudOptions {
  menuCode: string;
  entiteLabel: string;
  sort?: Record<string, 1 | -1>;
  libelleDe?: (doc: Record<string, unknown>) => string;
  /** GET est accessible sans session (contenu public : actualités, sermons, événements...). */
  publicRead?: boolean;
}

type RouteParams = { params: Promise<{ id: string }> };

export function createCrudListRoutes(model: Model<unknown>, options: CrudOptions) {
  const { menuCode, entiteLabel, sort = { _id: -1 }, libelleDe, publicRead } = options;

  async function GET() {
    try {
      await connectDB();
      if (!publicRead) {
        await requirePermission(menuCode, 'VOIR');
      }
      const docs = await model.find().sort(sort);
      return NextResponse.json(docs);
    } catch (error) {
      return handleApiError(error);
    }
  }

  async function POST(req: NextRequest) {
    try {
      await connectDB();
      const session = await requirePermission(menuCode, 'CREER');
      const body = await req.json();
      const doc = await model.create(body);
      const label = libelleDe ? libelleDe(doc.toObject()) : String(doc._id);
      await logAudit(session, 'CRÉATION', entiteLabel, `Création : "${label}".`);
      return NextResponse.json(doc, { status: 201 });
    } catch (error) {
      return handleApiError(error);
    }
  }

  return { GET, POST };
}

export function createCrudDetailRoutes(model: Model<unknown>, options: CrudOptions) {
  const { menuCode, entiteLabel, libelleDe, publicRead } = options;

  async function GET(_req: NextRequest, { params }: RouteParams) {
    try {
      await connectDB();
      if (!publicRead) {
        await requirePermission(menuCode, 'VOIR');
      }
      const { id } = await params;
      const doc = await model.findById(id);
      if (!doc) return NextResponse.json({ message: 'Introuvable.' }, { status: 404 });
      return NextResponse.json(doc);
    } catch (error) {
      return handleApiError(error);
    }
  }

  async function PUT(req: NextRequest, { params }: RouteParams) {
    try {
      await connectDB();
      const session = await requirePermission(menuCode, 'MODIFIER');
      const { id } = await params;
      const body = await req.json();
      const doc = await model.findByIdAndUpdate(id, body, { new: true, runValidators: true });
      if (!doc) return NextResponse.json({ message: 'Introuvable.' }, { status: 404 });
      const label = libelleDe ? libelleDe(doc.toObject()) : String(doc._id);
      await logAudit(session, 'MODIFICATION', entiteLabel, `Modification : "${label}".`);
      return NextResponse.json(doc);
    } catch (error) {
      return handleApiError(error);
    }
  }

  async function DELETE(_req: NextRequest, { params }: RouteParams) {
    try {
      await connectDB();
      const session = await requirePermission(menuCode, 'SUPPRIMER');
      const { id } = await params;
      const doc = await model.findByIdAndDelete(id);
      if (!doc) return NextResponse.json({ message: 'Introuvable.' }, { status: 404 });
      const label = libelleDe ? libelleDe(doc.toObject()) : String(doc._id);
      await logAudit(session, 'SUPPRESSION', entiteLabel, `Suppression : "${label}".`);
      return NextResponse.json({ success: true });
    } catch (error) {
      return handleApiError(error);
    }
  }

  return { GET, PUT, DELETE };
}
