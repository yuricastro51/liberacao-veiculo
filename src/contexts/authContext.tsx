import { useContext, createContext, type PropsWithChildren } from 'react';
import { useStorageState } from '../hooks/useStorageState';
import { User } from '../entities/user';
import { useUserRepository } from '../repositories/userRepository';

type SessionType = {
  session: string | null;
  user: User | null;
};

const AuthContext = createContext<{
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  session?: SessionType | null;
  isLoading: boolean;
}>({
  signIn: async () => {},
  signOut: async () => {},
  isLoading: true,
  session: null,
});

export function useSession() {
  const value = useContext(AuthContext);
  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState<SessionType>('session');
  const { loginAsync } = useUserRepository();

  async function signIn(username: string, password: string) {
    const user = await loginAsync(username, password);
    if (!user) {
      throw new Error('Usuário ou senha inválidos');
    }
    setSession({ session: 'logged', user });
  }

  console.log('session', session);
  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut: async () => {
          setSession(null);
        },
        session,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
