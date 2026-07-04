import mongoose, { Schema } from 'mongoose';
import { applyIdTransform } from '../lib/mongooseHelpers';

const MeditationSchema = new Schema({
  titre: { type: String, required: true },
  versetRef: { type: String, required: true },
  versetTexte: { type: String, required: true },
  contenu: { type: String, required: true },
  date: { type: Date, default: Date.now },
  auteur: { type: String, required: true },
});

applyIdTransform(MeditationSchema);

export default mongoose.models.Meditation || mongoose.model('Meditation', MeditationSchema);
