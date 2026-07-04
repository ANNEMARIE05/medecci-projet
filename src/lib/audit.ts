import { connectDB } from './mongodb';
import AuditTrace from '../models/AuditTrace';
import type { Session } from 'next-auth';

export async function logAudit(
  session: Session,
  action: string,
  entite: string,
  details: string
): Promise<void> {
  await connectDB();
  await AuditTrace.create({
    utilisateur: `${session.user.prenom} ${session.user.nom} (${session.user.email})`,
    action,
    entite,
    details,
  });
}
