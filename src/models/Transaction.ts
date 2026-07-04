import mongoose, { Schema } from 'mongoose';
import { applyIdTransform } from '../lib/mongooseHelpers';

const ModificationTxSchema = new Schema(
  {
    date: { type: Date, default: Date.now },
    ancienMontant: { type: Number, required: true },
    nouveauMontant: { type: Number, required: true },
  },
  { _id: false }
);

const TransactionSchema = new Schema({
  idCaisse: { type: String, required: true },
  idMembre: { type: String, required: true },
  montant: { type: Number, required: true },
  commentaire: { type: String, default: '' },
  date: { type: Date, default: Date.now },
  modifications: { type: [ModificationTxSchema], default: [] },
  typeDon: { type: String },
  modePaiement: { type: String },
});

applyIdTransform(TransactionSchema);

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
