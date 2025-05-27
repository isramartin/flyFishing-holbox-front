import { createContext, useState, useEffect, useCallback } from 'react';
import { auth } from '../firebase/firebase.config';
import { getAuth, onAuthStateChanged, signOut, GoogleAuthProvider, browserLocalPersistence ,signInWithPopup } from 'firebase/auth';
import { loginWithEmail, loginWithGoogle as apiLoginWithGoogle } from '../service/Auth.service';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    role: null,
    loading: true,
    error: null
  });

  const setAuthData = useCallback((data) => {
    setAuthState(prev => ({ ...prev, ...data }));
  }, []);

  // Login con email/password (manteniendo tu implementación original)
  const login = async (email, password) => {
    try {
      setAuthData({ loading: true, error: null });
      
      const userData = await loginWithEmail(email, password);
  
      const authData = {
        isAuthenticated: true,
        user: userData.user,
        role: userData.user.rol,
        token: userData.token,
        firebaseUid: userData.user.uid
      };

      setAuthData(authData);
      localStorage.setItem('auth', JSON.stringify(authData));
      
      return userData;
    } catch (error) {
      setAuthData({ error: error.message, loading: false });
      throw error;
    }
  };

  // Login con Google (versión corregida pero manteniendo estructura)
const loginWithGoogle = async () => {
  try {
    setAuthData({ loading: true, error: null });

    const authInstance = getAuth();
    const provider = new GoogleAuthProvider();

    // 🔥 Asegurar persistencia
    await authInstance.setPersistence(browserLocalPersistence);

    const result = await signInWithPopup(authInstance, provider);
    const firebaseToken = await result.user.getIdToken();

    const backendResponse = await apiLoginWithGoogle(firebaseToken);

    console.log("token", backendResponse.jwtToken);
    

    const authData = {
      isAuthenticated: true,
      user: {
        ...backendResponse.user,
        firebaseUid: result.user.uid
      },
      role: backendResponse.user.rol,
      token: backendResponse.jwtToken,
      firebaseToken: firebaseToken
    };

    setAuthData(authData);
    localStorage.setItem('auth', JSON.stringify(authData));

    return backendResponse;
  } catch (error) {
    setAuthData({ error: error.message, loading: false });
    throw error;
  }
};


  // Logout (versión mejorada pero manteniendo nombre)
  const logout = useCallback(async () => {
  try {
    const authInstance = getAuth();
    await signOut(authInstance);
    
    // Limpieza completa
    localStorage.removeItem('auth');
    sessionStorage.removeItem('firebaseAuth');
    
    setAuthData({
      isAuthenticated: false,
      user: null,
      role: null,
      error: null,
      loading: false
    });
  } catch (error) {
    console.error('Logout error:', error);
    // Forzar limpieza en caso de error
    localStorage.removeItem('auth');
    setAuthData({
      isAuthenticated: false,
      user: null,
      role: null,
      error: null,
      loading: false
    });
  }
}, []);

  useEffect(() => {
  let isMounted = true;
  const authInstance = getAuth();

  const handleAuthState = async (firebaseUser) => {
    try {
      const savedAuth = JSON.parse(localStorage.getItem('auth')) || null;
      
      console.log('[Auth Debug] Firebase User:', firebaseUser?.uid);
      console.log('[Auth Debug] Saved Auth:', savedAuth);
      
      // 1. No hay sesión guardada
      if (!savedAuth) {
        await logout();
        return;
      }

      // 2. Validar token JWT (para ambos métodos)
      if (!savedAuth.token || savedAuth.token.split('.').length !== 3) {
        console.log('[Auth Debug] Invalid JWT token - logging out');
        await logout();
        return;
      }

      // 3. Restaurar sesión (sin depender de Firebase para la validación)
      if (isMounted) {
        console.log('[Auth Debug] Restoring session for:', savedAuth.user?.email);
        setAuthData({
          isAuthenticated: true,
          user: savedAuth.user,
          role: savedAuth.role,
          loading: false
        });
        
        // 4. Sincronizar Firebase en segundo plano si es necesario
        if (!firebaseUser && savedAuth.firebaseToken) {
          try {
            await signInWithCustomToken(authInstance, savedAuth.firebaseToken);
            console.log('[Auth Debug] Firebase session restored in background');
          } catch (error) {
            console.log('[Auth Debug] Firebase background sync failed (non-critical)');
          }
        }
      }
    } catch (error) {
      console.error('[Auth Error] State change error:', error);
      if (isMounted) await logout();
    }
  };

  const unsubscribe = onAuthStateChanged(authInstance, handleAuthState);
  handleAuthState(authInstance.currentUser);

  return () => {
    isMounted = false;
    unsubscribe();
  };
}, [logout]);

  return (
    <AuthContext.Provider value={{
      isAuthenticated: authState.isAuthenticated,
      user: authState.user,
      role: authState.role,
      loading: authState.loading,
      error: authState.error,
      login,
      loginWithGoogle,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};