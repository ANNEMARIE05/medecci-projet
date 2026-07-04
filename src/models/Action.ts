import mongoose, { Schema } from 'mongoose';
import { applyIdTransform } from '../lib/mongooseHelpers';

const ActionSchema = new Schema({
  code: { type: String, required: true, unique: true },
  libelle: { type: String, required: true },
  description: { type: String, default: '' },
});

applyIdTransform(ActionSchema);

export default mongoose.models.Action || mongoose.model('Action', ActionSchema);
