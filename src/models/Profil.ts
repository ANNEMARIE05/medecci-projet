import mongoose, { Schema } from 'mongoose';
import { applyIdTransform } from '../lib/mongooseHelpers';

const HabilitationProfilSchema = new Schema(
  {
    menuId: { type: String, required: true },
    actions: { type: [String], default: [] },
  },
  { _id: false }
);

const ProfilSchema = new Schema({
  code: { type: String, required: true, unique: true },
  libelle: { type: String, required: true },
  description: { type: String, default: '' },
  habilitations: { type: [HabilitationProfilSchema], default: [] },
});

applyIdTransform(ProfilSchema);

export default mongoose.models.Profil || mongoose.model('Profil', ProfilSchema);
