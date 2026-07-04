import mongoose, { Schema } from 'mongoose';
import { applyIdTransform } from '../lib/mongooseHelpers';

const SermonSchema = new Schema({
  titre: { type: String, required: true },
  predicateur: { type: String, required: true },
  date: { type: Date, required: true },
  versetRef: { type: String, required: true },
  description: { type: String, default: '' },
  lienYoutube: { type: String, default: '' },
  lienAudio: { type: String, default: '' },
});

applyIdTransform(SermonSchema);

export default mongoose.models.Sermon || mongoose.model('Sermon', SermonSchema);
