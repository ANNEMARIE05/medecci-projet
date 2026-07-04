import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { connectDB } from './lib/mongodb';
import UtilisateurDashboard from './models/UtilisateurDashboard';
import { authConfig } from './auth.config';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      nom: string;
      prenom: string;
      email: string;
      profilId: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    nom?: string;
    prenom?: string;
    profilId?: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const email = String(credentials?.email || '').trim().toLowerCase();
        const password = String(credentials?.password || '');
        if (!email || !password) return null;

        await connectDB();
        const utilisateur = await UtilisateurDashboard.findOne({ email });
        if (!utilisateur || !utilisateur.actif) return null;

        const motDePasseValide = await bcrypt.compare(password, utilisateur.passwordHash);
        if (!motDePasseValide) return null;

        return {
          id: String(utilisateur._id),
          nom: utilisateur.nom,
          prenom: utilisateur.prenom,
          email: utilisateur.email,
          profilId: String(utilisateur.profilId),
        };
      },
    }),
  ],
});
