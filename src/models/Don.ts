import mongoose, { Schema } from 'mongoose';
import { applyIdTransform } from '../lib/mongooseHelpers';

const DonSchema = new Schema({
  nomDonateur: { type: String, required: true },
  telephone: { type: String, required: true },
  montant: { type: Number, required: true },
  typeDon: {
    type: String,
    enum: ['Dîme', 'Offrande', 'Construction', 'Social', 'Mission'],
    required: true,
  },
  modePaiement: {
    type: String,
    enum: ['Wave', 'Orange Money', 'MTN MoMo', 'Moov Money', 'Carte Bancaire'],
    required: true,
  },
  date: { type: Date, default: Date.now },
  commentaire: { type: String, default: '' },
});

applyIdTransform(DonSchema);

export default mongoose.models.Don || mongoose.model('Don', DonSchema);
