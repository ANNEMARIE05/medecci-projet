import type { Schema } from 'mongoose';

export function applyIdTransform(schema: Schema): void {
  schema.set('toJSON', {
    virtuals: true,
    flattenMaps: true,
    transform: (_doc, ret: Record<string, unknown>) => {
      ret.id = String(ret._id);
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  });
}
