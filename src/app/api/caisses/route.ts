import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import { requirePermission, requireAnyPermission } from '../../../lib/permissions';
import { logAudit } from '../../../lib/audit';
import { handleApiError } from '../../../lib/apiError';
import Caisse from '../../../models/Caisse';

function genererCode(nom: string): string {
  const cleanNom = nom.replace(/[^a-zA-Z0-9 ]/g, '').toUpperCase();
  const words = cleanNom.split(' ').filter((w) => w.length > 0);
  if (words.length >= 2) {
    return words.slice(0, 3).map((w) => w.slice(0, 3)).join('-');
  }
  if (words.length === 1) {
    return words[0].slice(0, 6);
  }
  return `C-${Date.now().toString().slice(-4)}`;
}

export async function GET() {
  try {
    await connectDB();
    await requireAnyPermission([
      ['CAISSES', 'VOIR'],
      ['ARCHIVES', 'VOIR'],
    ]);
    const caisses = await Caisse.find().sort({ dateCreation: -1 });
    return NextResponse.json(caisses);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await requirePermission('CAISSES', 'CREER');
    const { nom, description, code, responsable, objectif, categorie } = await req.json();

    const caisse = await Caisse.create({
      nom: String(nom).trim(),
      description: description ? String(description).trim() : '',
      code: (code && String(code).trim() ? String(code).trim() : genererCode(nom)).toUpperCase(),
      responsable: responsable ? String(responsable).trim() : 'Non spécifié',
      objectif: objectif ? Number(objectif) : 0,
      categorie: categorie ? String(categorie).trim() : 'Général',
      cotisants: {},
      archivee: false,
    });

    await logAudit(session, 'CRÉATION', 'Caisse', `Création de la caisse "${caisse.nom}" [${caisse.code}].`);
    return NextResponse.json(caisse, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
