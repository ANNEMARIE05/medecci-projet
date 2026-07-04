import mongoose, { Schema } from 'mongoose';
import { applyIdTransform } from '../lib/mongooseHelpers';

const ActualiteSchema = new Schema({
  titre: { type: String, required: true },
  description: { type: String, required: true },
  contenu: { type: String, required: true },
  datePublication: { type: Date, default: Date.now },
  image: { type: String, default: '' },
  auteur: { type: String, required: true },
});

applyIdTransform(ActualiteSchema);

export default mongoose.models.Actualite || mongoose.model('Actualite', ActualiteSchema);
