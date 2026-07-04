import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import { requirePermission } from '../../../lib/permissions';
import { logAudit } from '../../../lib/audit';
import { handleApiError, ApiError } from '../../../lib/apiError';
import Caisse from '../../../models/Caisse';
import Membre from '../../../models/Membre';
import Transaction from '../../../models/Transaction';
import Notification from '../../../models/Notification';

function scaleNumber(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await requirePermission('CAISSES', 'CREER');
    const { idCaisse, idMembre, montant, commentaire, typeDon, modePaiement } = await req.json();

    const caisse = await Caisse.findById(idCaisse);
    if (!caisse) throw new ApiError('Caisse introuvable.', 404);
    if (caisse.archivee) throw new ApiError('Cette caisse est archivée, aucun versement n\'est autorisé.', 400);

    const valMontant = Number(montant);
    if (!valMontant || valMontant <= 0) throw new ApiError('Le montant doit être supérieur à 0.', 400);

    if (caisse.objectif > 0) {
      const soldeActuel = Array.from(caisse.cotisants.values() as Iterable<number>).reduce(
        (sum: number, val: number) => sum + val,
        0
      );
      const reste = caisse.objectif - soldeActuel;
      if (reste <= 0) {
        throw new ApiError('L\'objectif de cette caisse est déjà atteint. Aucun versement supplémentaire n\'est autorisé.', 400);
      }
      if (valMontant > reste) {
        throw new ApiError(`Ce versement dépasse l'objectif de la caisse. Le montant maximum autorisé est de ${reste} FCFA.`, 400);
      }
    }

    const transaction = await Transaction.create({
      idCaisse,
      idMembre,
      montant: valMontant,
      commentaire: commentaire ? String(commentaire).trim() : '',
      typeDon: typeDon || 'Don',
      modePaiement: modePaiement || 'Espèces',
    });

    const ancienMontant = caisse.cotisants.get(idMembre) || 0;
    caisse.cotisants.set(idMembre, scaleNumber(ancienMontant + valMontant));
    await caisse.save();

    const membre = await Membre.findById(idMembre);
    if (membre) {
      await Notification.create({
        message: `Nouveau versement de ${valMontant.toLocaleString('fr-FR')} FCFA par ${membre.prenom} ${membre.nom} pour la caisse ${caisse.nom}`,
      });
    }

    await logAudit(
      session,
      'CRÉATION',
      'Cotisation',
      `Versement de ${valMontant} FCFA enregistré sur la caisse "${caisse.nom}".`
    );

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
