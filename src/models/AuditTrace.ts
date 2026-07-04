import mongoose, { Schema } from 'mongoose';
import { applyIdTransform } from '../lib/mongooseHelpers';

const AuditTraceSchema = new Schema({
  date: { type: Date, default: Date.now },
  utilisateur: { type: String, required: true },
  action: { type: String, required: true },
  entite: { type: String, required: true },
  details: { type: String, required: true },
});

applyIdTransform(AuditTraceSchema);

export default mongoose.models.AuditTrace || mongoose.model('AuditTrace', AuditTraceSchema);
