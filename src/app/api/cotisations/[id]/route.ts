import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import { requirePermission } from '../../../../lib/permissions';
import { logAudit } from '../../../../lib/audit';
import { handleApiError, ApiError } from '../../../../lib/apiError';
import Caisse from '../../../../models/Caisse';
import Transaction from '../../../../models/Transaction';

function scaleNumber(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const session = await requirePermission('CAISSES', 'MODIFIER');
    const { id } = await params;
    const { montant } = await req.json();

    const transaction = await Transaction.findById(id);
    if (!transaction) throw new ApiError('Versement introuvable.', 404);

    const valMontant = Number(montant);
    if (!valMontant || valMontant <= 0) throw new ApiError('Veuillez saisir un montant valide.', 400);

    const caisse = await Caisse.findById(transaction.idCaisse);
    if (!caisse) throw new ApiError('Caisse introuvable.', 404);

    if (caisse.objectif > 0) {
      const soldeActuel = Array.from(caisse.cotisants.values() as Iterable<number>).reduce(
        (sum: number, val: number) => sum + val,
        0
      );
      const resteAutorise = caisse.objectif - (soldeActuel - transaction.montant);
      if (valMontant > resteAutorise) {
        throw new ApiError(`Ce montant dépasse l'objectif de la caisse. Le montant maximum autorisé est de ${resteAutorise} FCFA.`, 400);
      }
    }

    const diff = scaleNumber(valMontant - transaction.montant);
    transaction.modifications = [
      ...(transaction.modifications || []),
      { date: new Date(), ancienMontant: transaction.montant, nouveauMontant: valMontant },
    ];
    transaction.montant = valMontant;
    await transaction.save();

    const ancienCumul = caisse.cotisants.get(transaction.idMembre) || 0;
    caisse.cotisants.set(transaction.idMembre, scaleNumber(ancienCumul + diff));
    await caisse.save();

    await logAudit(session, 'MODIFICATION', 'Cotisation', `Correction d'un versement sur la caisse "${caisse.nom}".`);

    return NextResponse.json(transaction);
  } catch (error) {
    return handleApiError(error);
  }
}
