import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import { getSessionOrThrow } from '../../../../lib/permissions';
import { handleApiError } from '../../../../lib/apiError';
import Profil from '../../../../models/Profil';
import Menu from '../../../../models/Menu';
import Action from '../../../../models/Action';

export async function GET() {
  try {
    await connectDB();
    const session = await getSessionOrThrow();

    const [profil, menus, actions] = await Promise.all([
      Profil.findById(session.user.profilId),
      Menu.find(),
      Action.find(),
    ]);

    if (!profil) {
      return NextResponse.json({ profilId: null, menus: [], permissions: {} });
    }

    const menuById = new Map(menus.map((m) => [String(m._id), m]));
    const actionById = new Map(actions.map((a) => [String(a._id), a.code]));

    const permissions: Record<string, string[]> = {};
    const menusAutorises: Array<{ code: string; libelle: string; chemin: string; icone: string }> = [];

    for (const habilitation of profil.habilitations) {
      const menu = menuById.get(habilitation.menuId);
      if (!menu) continue;
      const actionCodes = habilitation.actions
        .map((actionId: string) => actionById.get(actionId))
        .filter(Boolean) as string[];

      if (actionCodes.length > 0) {
        permissions[menu.code] = actionCodes;
        menusAutorises.push({ code: menu.code, libelle: menu.libelle, chemin: menu.chemin, icone: menu.icone });
      }
    }

    return NextResponse.json({
      profilId: String(profil._id),
      profilLibelle: profil.libelle,
      menus: menusAutorises,
      permissions,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
