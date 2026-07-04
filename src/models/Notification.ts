import mongoose, { Schema } from 'mongoose';
import { applyIdTransform } from '../lib/mongooseHelpers';

const NotificationSchema = new Schema({
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
  lu: { type: Boolean, default: false },
});

applyIdTransform(NotificationSchema);

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
