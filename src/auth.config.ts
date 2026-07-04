import type { NextAuthConfig } from 'next-auth';

export const authConfig: NextAuthConfig = {
  pages: { signIn: '/connexion' },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.nom = (user as { nom?: string }).nom;
        token.prenom = (user as { prenom?: string }).prenom;
        token.profilId = (user as { profilId?: string }).profilId;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.nom = token.nom as string;
      session.user.prenom = token.prenom as string;
      session.user.profilId = token.profilId as string;
      return session;
    },
  },
};

export default authConfig;
