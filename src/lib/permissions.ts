import { auth } from '../auth';
import { connectDB } from './mongodb';
import Menu from './../models/Menu';
import Action from './../models/Action';
import Profil from './../models/Profil';
import { ApiError } from './apiError';
import type { Session } from 'next-auth';

export async function getSessionOrThrow(): Promise<Session> {
  const session = await auth();
  if (!session?.user) {
    throw new ApiError('Authentification requise.', 401);
  }
  return session;
}

export async function requirePermission(menuCode: string, actionCode: string): Promise<Session> {
  const session = await getSessionOrThrow();
  await connectDB();

  const [menu, action, profil] = await Promise.all([
    Menu.findOne({ code: menuCode }),
    Action.findOne({ code: actionCode }),
    Profil.findById(session.user.profilId),
  ]);

  if (!menu || !action) {
    throw new ApiError(`Menu ou action de référence inconnue (${menuCode}/${actionCode}).`, 500);
  }
  if (!profil) {
    throw new ApiError('Profil introuvable pour cet utilisateur.', 403);
  }

  const habilitation = profil.habilitations.find(
    (h: { menuId: string; actions: string[] }) => h.menuId === String(menu._id)
  );
  const autorise = habilitation?.actions.includes(String(action._id));

  if (!autorise) {
    throw new ApiError(`Action "${actionCode}" non autorisée sur le menu "${menuCode}".`, 403);
  }

  return session;
}

export async function requireAnyPermission(pairs: Array<[string, string]>): Promise<Session> {
  let lastError: unknown;
  for (const [menuCode, actionCode] of pairs) {
    try {
      return await requirePermission(menuCode, actionCode);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}
