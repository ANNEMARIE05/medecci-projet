import mongoose, { Schema } from 'mongoose';
import { applyIdTransform } from '../lib/mongooseHelpers';

const StatutSchema = new Schema({
  nom: { type: String, required: true, unique: true },
});

applyIdTransform(StatutSchema);

export default mongoose.models.Statut || mongoose.model('Statut', StatutSchema);
