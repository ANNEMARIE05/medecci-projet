import mongoose, { Schema } from 'mongoose';
import { applyIdTransform } from '../lib/mongooseHelpers';

const MenuSchema = new Schema({
  code: { type: String, required: true, unique: true },
  libelle: { type: String, required: true },
  chemin: { type: String, required: true },
  icone: { type: String, default: '' },
  actionsDisponibles: { type: [String], default: [] },
});

applyIdTransform(MenuSchema);

export default mongoose.models.Menu || mongoose.model('Menu', MenuSchema);
