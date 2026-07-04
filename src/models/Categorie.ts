import mongoose, { Schema } from 'mongoose';
import { applyIdTransform } from '../lib/mongooseHelpers';

const CategorieSchema = new Schema({
  nom: { type: String, required: true, unique: true },
});

applyIdTransform(CategorieSchema);

export default mongoose.models.Categorie || mongoose.model('Categorie', CategorieSchema);
