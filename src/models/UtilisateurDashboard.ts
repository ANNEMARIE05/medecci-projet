import mongoose, { Schema } from 'mongoose';
import { applyIdTransform } from '../lib/mongooseHelpers';

const UtilisateurDashboardSchema = new Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  profilId: { type: String, required: true },
  actif: { type: Boolean, default: true },
  dateCreation: { type: Date, default: Date.now },
});

applyIdTransform(UtilisateurDashboardSchema);

UtilisateurDashboardSchema.set('toJSON', {
  ...UtilisateurDashboardSchema.get('toJSON'),
  transform: (doc: unknown, ret: Record<string, unknown>) => {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    delete ret.passwordHash;
    return ret;
  },
});

export default mongoose.models.UtilisateurDashboard || mongoose.model('UtilisateurDashboard', UtilisateurDashboardSchema);
