import { useSyncExternalStore } from 'react';

export interface Utilisateur {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: 'ADMIN' | 'PASTEUR' | 'TRESORIER';
  photoUrl?: string;
  telephone?: string;
}

export interface AuthState {
  utilisateur: Utilisateur | null;
  jeton: string | null;
  estConnecte: boolean;
}

const STORAGE_KEY = 'medecci-auth-store';

const actionTypes = {
  CONNEXION: 'CONNEXION',
  DECONNEXION: 'DECONNEXION',
} as const;

type AuthAction =
  | { type: typeof actionTypes.CONNEXION; payload: { utilisateur: Utilisateur; jeton: string } }
  | { type: typeof actionTypes.DECONNEXION };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case actionTypes.CONNEXION:
      return {
        ...state,
        utilisateur: action.payload.utilisateur,
        jeton: action.payload.jeton,
        estConnecte: true,
      };
    case actionTypes.DECONNEXION:
      return {
        ...state,
        utilisateur: null,
        jeton: null,
        estConnecte: false,
      };
    default:
      return state;
  }
}

const getInitialState = (): AuthState => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.state) return parsed.state;
        return parsed;
      }
    } catch (e) {
      console.error(e);
    }
  }
  return {
    utilisateur: null,
    jeton: null,
    estConnecte: false,
  };
};

let state = getInitialState();
const listeners = new Set<() => void>();

const store = {
  getState() {
    return state;
  },
  dispatch(action: AuthAction) {
    state = authReducer(state, action);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ state }));
    }
    listeners.forEach((listener) => listener());
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  connexion(utilisateur: Utilisateur, jeton: string) {
    store.dispatch({ type: actionTypes.CONNEXION, payload: { utilisateur, jeton } });
  },
  deconnexion() {
    store.dispatch({ type: actionTypes.DECONNEXION });
  }
};

export function useAuthStore<T>(
  selector?: (state: AuthState & { connexion: typeof store.connexion; deconnexion: typeof store.deconnexion }) => T
): T {
  const currentStoreState = useSyncExternalStore(
    store.subscribe,
    store.getState,
    () => getInitialState()
  );

  const fullState = {
    ...currentStoreState,
    connexion: store.connexion,
    deconnexion: store.deconnexion,
  };

  return selector ? selector(fullState) : (fullState as any);
}

useAuthStore.getState = () => ({
  ...store.getState(),
  connexion: store.connexion,
  deconnexion: store.deconnexion,
});
