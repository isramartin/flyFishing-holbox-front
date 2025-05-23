import { createContext, useState, useEffect, useCallback } from 'react';
import { auth } from '../firebase/firebase.config';
import { onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { loginWithEmail, loginWithGoogle as apiLoginWithGoogle } from '../service/Auth.service';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    role: null, // Rol específico separado
    loading: true,
    error: null
  });

  // Función para actualizar el estado
  const setAuthData = (data) => {
    setAuthState(prev => ({ ...prev, ...data }));
  };

  // Login con email/password
  const login = async (email, password) => {
  try {
    setAuthData({ loading: true, error: null });
    
    const userData = await loginWithEmail(email, password);
    const token = userData.token; // Asume que el token viene en la respuesta
    const role = userData.user.rol; // Obtiene el rol directamente de userData
    console.log("rol desde contexto:", role)

    setAuthData({
      isAuthenticated: true,
      user: userData,
      role: role, // Usamos role para mantener consistencia
      loading: false
    });

    localStorage.setItem('auth', JSON.stringify({
      user: userData,
      role: role,
      token
    }));
    
    return { ...userData, role };
  } catch (error) {
    setAuthData({ error: error.message, loading: false });
    throw error;
  }
};

  // Login con Google
  const loginWithGoogle = async () => {
  try {
    setAuthData({ loading: true, error: null });
    
    // Verificar si los popups están bloqueados
    if (window.innerWidth <= 768) { // Dispositivos móviles
      const isPopupBlocked = window.open('', '_blank') === null;
      if (isPopupBlocked) {
        throw new Error(
          'Los popups están bloqueados. Por favor, habilita los popups para este sitio.'
        );
      }
    }

    // Opción 1: Intentar con popup primero
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = result.user;
      const token = await user.getIdToken();
      
      const response = await apiLoginWithGoogle(token);
      
      setAuthData({
        isAuthenticated: true,
        user: response.user,
        userRole: response.user.rol,
        loading: false
      });

      localStorage.setItem('auth', JSON.stringify({ 
        user: response.user,
        userRole: response.user.rol,
        token: response.token,
        firebaseUser: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName
        }
      }));
      
      return response;
    } catch (popupError) {
      // Si falla el popup, intentar con redirección
      if (popupError.code === 'auth/popup-blocked' || popupError.code === 'auth/popup-closed-by-user') {
        console.log('Popup bloqueado, intentando con redirección...');
        const provider = new GoogleAuthProvider();
        await signInWithRedirect(auth, provider);
        // El resultado se manejará en el onAuthStateChanged
        return { pendingRedirect: true };
      }
      throw popupError;
    }
  } catch (error) {
    let errorMessage = 'Error al iniciar sesión con Google';
    if (error.code === 'auth/popup-blocked') {
      errorMessage = 'El navegador bloqueó la ventana emergente. Por favor, permite popups para este sitio.';
    } else if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Cerraste la ventana de autenticación demasiado pronto.';
    }
    setAuthData({ error: errorMessage, loading: false });
    throw error;
  }
};

  // Logout
  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      setAuthData({
        isAuthenticated: false,
        user: null,
        role: null,
        error: null,
        loading: false
      });
      localStorage.removeItem('auth');
    } catch (error) {
      setAuthData({ error: error.message });
      console.error('Logout error:', error);
    }
  }, []);

  // Verificar estado al cargar
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const savedAuth = JSON.parse(localStorage.getItem('auth'));
          
          if (savedAuth) {
            // Verificar si el token sigue siendo válido
            const currentTime = Date.now() / 1000;
            const tokenData = jwt_decode(savedAuth.token);
            
            if (tokenData.exp < currentTime) {
              console.log('Token expirado, haciendo logout');
              await logout();
              return;
            }

            setAuthData({
              isAuthenticated: true,
              user: savedAuth.user,
              role: savedAuth.role,
              loading: false
            });
          } else {
            await logout();
          }
        } else {
          await logout();
        }
      } catch (error) {
        console.error('Error en verificación de estado:', error);
        await logout();
        setAuthData({ loading: false, error: error.message });
      }
    });

    return () => unsubscribe();
  }, [logout]);

  return (
    <AuthContext.Provider value={{
      isAuthenticated: authState.isAuthenticated,
      user: authState.user,
      role: authState.role, // Proveemos el rol específicamente
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