import mongoose, { Schema } from 'mongoose';
import { applyIdTransform } from '../lib/mongooseHelpers';

const DemandePriereSchema = new Schema({
  nom: { type: String, required: true },
  telephone: { type: String, required: true },
  sujet: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
  statut: {
    type: String,
    enum: ['A_TRAITER', 'EN_PRIERE', 'EXAUCE'],
    default: 'A_TRAITER',
  },
});

applyIdTransform(DemandePriereSchema);

export default mongoose.models.DemandePriere || mongoose.model('DemandePriere', DemandePriereSchema);
