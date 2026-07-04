import mongoose, { Schema } from 'mongoose';
import { applyIdTransform } from '../lib/mongooseHelpers';

const CaisseSchema = new Schema({
  nom: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  responsable: { type: String, required: true },
  objectif: { type: Number, default: 0 },
  categorie: { type: String, required: true },
  description: { type: String, default: '' },
  dateCreation: { type: Date, default: Date.now },
  cotisants: { type: Map, of: Number, default: {} },
  archivee: { type: Boolean, default: false },
});

applyIdTransform(CaisseSchema);

export default mongoose.models.Caisse || mongoose.model('Caisse', CaisseSchema);
