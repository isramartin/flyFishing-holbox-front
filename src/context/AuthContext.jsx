import { createContext, useState, useEffect, useCallback } from 'react';
import { auth } from '../firebase/firebase.config';
import { getAuth, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
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
      const token = userData.token;
      const role = userData.user.rol;

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
    const result = await signInWithPopup(authInstance, provider);
    const firebaseToken = await result.user.getIdToken();
    
    console.log('[Auth Debug] Firebase auth successful:', result.user.uid);
    
    const backendResponse = await apiLoginWithGoogle(firebaseToken);
    console.log('[Auth Debug] Backend response:', backendResponse);

    const authData = {
      isAuthenticated: true,
      user: {
        ...backendResponse.user,
        firebaseUid: result.user.uid,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL
      },
      role: backendResponse.user.rol,
      token: backendResponse.token,
      firebaseToken: firebaseToken,
      provider: 'google',
      lastLogin: Date.now()
    };

    console.log('[Auth Debug] Saving auth data:', authData);
    setAuthData(authData);
    localStorage.setItem('auth', JSON.stringify(authData));
    
    return backendResponse;
  } catch (error) {
    console.error("[Auth Error] Google login failed:", error);
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

  // Efecto único para manejar estado de autenticación
 useEffect(() => {
  let isMounted = true;
  const authInstance = getAuth();

  const handleAuthState = async (firebaseUser) => {
    try {
      const savedAuth = JSON.parse(localStorage.getItem('auth')) || null;
      
      // Debug: Verificar estado actual
      console.log('[Auth Debug] Firebase User:', firebaseUser?.uid);
      console.log('[Auth Debug] Saved Auth:', savedAuth);
      
      if (!savedAuth) {
        console.log('[Auth Debug] No saved auth - logging out');
        await logout();
        return;
      }

      // Verificación básica del token
      if (!savedAuth.token || savedAuth.token.split('.').length !== 3) {
        console.log('[Auth Debug] Invalid token format - logging out');
        await logout();
        return;
      }

      // Caso especial para Google
      if (savedAuth.provider === 'google') {
        if (!firebaseUser) {
          console.log('[Auth Debug] Google auth - attempting reconnect');
          try {
            const credential = GoogleAuthProvider.credential(savedAuth.firebaseToken);
            await signInWithCredential(authInstance, credential);
            firebaseUser = authInstance.currentUser;
            console.log('[Auth Debug] Reconnect successful:', firebaseUser?.uid);
          } catch (error) {
            console.error('[Auth Error] Google reconnect failed:', error);
            await logout();
            return;
          }
        }

        // Verificar coincidencia de tokens
        const currentToken = await firebaseUser.getIdToken();
        if (currentToken !== savedAuth.firebaseToken) {
          console.log('[Auth Debug] Token mismatch - logging out');
          await logout();
          return;
        }
      }

      // Restaurar sesión
      if (isMounted) {
        console.log('[Auth Debug] Restoring session for:', savedAuth.user?.email);
        setAuthData({
          isAuthenticated: true,
          user: savedAuth.user,
          role: savedAuth.role,
          loading: false
        });
      }
    } catch (error) {
      console.error('[Auth Error] State change error:', error);
      if (isMounted) await logout();
    }
  };

  const unsubscribe = onAuthStateChanged(authInstance, handleAuthState);

  // Verificación inicial forzada
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