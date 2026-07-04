import mongoose, { Schema } from 'mongoose';
import { applyIdTransform } from '../lib/mongooseHelpers';

const EvenementSchema = new Schema({
  titre: { type: String, required: true },
  description: { type: String, default: '' },
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date, required: true },
  lieu: { type: String, required: true },
  image: { type: String, default: '' },
  categorie: { type: String, required: true },
});

applyIdTransform(EvenementSchema);

export default mongoose.models.Evenement || mongoose.model('Evenement', EvenementSchema);
