import mongoose, { Schema } from 'mongoose';
import { applyIdTransform } from '../lib/mongooseHelpers';

const PaiementAnnonceSchema = new Schema({
  libelle: { type: String, required: true },
  montant: { type: Number, required: true, min: 0 },
  caisse: { type: String, default: '' },
  details: { type: String, default: '' },
}, { _id: false });

const EvenementAnnonceSchema = new Schema({
  titre: { type: String, required: true },
  date: { type: String, required: true },
  lieu: { type: String, default: '' },
  details: { type: String, default: '' },
}, { _id: false });

const AutrePointSchema = new Schema({
  sujet: { type: String, required: true },
  details: { type: String, default: '' },
}, { _id: false });

const AnnonceFinanceSchema = new Schema({
  dateDimanche: { type: Date, required: true },
  statut: {
    type: String,
    enum: ['BROUILLON', 'PRESENTEE', 'ARCHIVEE'],
    default: 'BROUILLON',
  },
  titreSession: { type: String, required: true },

  paiementsAnnonces: { type: [PaiementAnnonceSchema], default: [] },
  evenementsAVenir: { type: [EvenementAnnonceSchema], default: [] },
  notesLibres: { type: String, default: '' },
  autresPoints: { type: [AutrePointSchema], default: [] },

  creePar: { type: String, default: '' },
  dateCreation: { type: Date, default: Date.now },
  dateModification: { type: Date, default: Date.now },
});

AnnonceFinanceSchema.pre('save', function (next) {
  this.dateModification = new Date();
  next();
});

AnnonceFinanceSchema.pre('findOneAndUpdate', function (next) {
  this.set({ dateModification: new Date() });
  next();
});

applyIdTransform(AnnonceFinanceSchema);

export default mongoose.models.AnnonceFinance ||
  mongoose.model('AnnonceFinance', AnnonceFinanceSchema);
