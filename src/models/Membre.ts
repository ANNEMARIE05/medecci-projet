import mongoose, { Schema } from 'mongoose';
import { applyIdTransform } from '../lib/mongooseHelpers';

const MembreSchema = new Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  telephone: { type: String, required: true },
  email: { type: String, required: true },
  dateInscription: { type: Date, default: Date.now },
  statut: { type: String, required: true },
});

applyIdTransform(MembreSchema);

export default mongoose.models.Membre || mongoose.model('Membre', MembreSchema);
