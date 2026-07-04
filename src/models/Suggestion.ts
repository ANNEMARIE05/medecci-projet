import mongoose, { Schema } from 'mongoose';
import { applyIdTransform } from '../lib/mongooseHelpers';

const SuggestionSchema = new Schema({
  nom: { type: String, required: true },
  telephone: { type: String, required: true },
  sujet: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

applyIdTransform(SuggestionSchema);

export default mongoose.models.Suggestion || mongoose.model('Suggestion', SuggestionSchema);
