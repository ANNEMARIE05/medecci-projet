import client from '../api/client';

export const authService = {
  connexion: async (email: string, motDePasse: string) => {
    const response = await client.post('/auth/connexion', { email, password: motDePasse });
    return response.data;
  }
};
export default authService;
