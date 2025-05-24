import { createContext, useState, useEffect, useCallback } from 'react';
import { auth } from '../firebase/firebase.config';
import {getAuth, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { loginWithEmail, loginWithGoogle as apiLoginWithGoogle } from '../service/Auth.service';


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
   const setAuthData = useCallback((data) => {
    setAuthState(prev => ({ ...prev, ...data }));
  }, []);
  
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
    
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    
    // Solo esta llamada a signInWithPopup
    const result = await signInWithPopup(auth, provider);
    console.log("Firebase User:", result.user);

    const idToken = await result.user.getIdToken();
     console.log("Firebase ID Token:", idToken); // ¿Es un string largo?
    
    
    // Enviar token al backend
    const response = await apiLoginWithGoogle(idToken);
    console.log("Backend Response:", response);

    setAuthData({
      isAuthenticated: true,
      user: response.user,
      role: response.user.rol,
      loading: false
    });

    localStorage.setItem('auth', JSON.stringify({
      user: response.user,
      role: response.user.rol,
      token: response.token,
      firebaseUser: {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName
      }
    }));
    
    return response;
  } catch (error) {
     console.error("Error completo:", error);
    setAuthData({ error: error.message, loading: false });
    throw error;
  }
};

// Manejo de login exitoso
const handleSuccessfulLogin = async (result) => {
  const user = result.user;
  const idToken = await user.getIdToken();
  const response = await apiLoginWithGoogle(idToken);

  setAuthData({
    isAuthenticated: true,
    user: response.user,
    userRole: response.user.rol,
    loading: false,
    error: null
  });

  localStorage.setItem('auth', JSON.stringify({
    user: response.user,
    userRole: response.user.rol,
    token: response.token,
    firebaseUser: user.providerData[0]
  }));

  return response;
};

// Manejo de popups bloqueados
const handlePopupBlockedError = async (auth, provider) => {
  // Opción 1: Guiar al usuario para permitir popups
  const popupInstructions = `
    Para iniciar sesión, por favor:
    1. Haz click en el ícono de bloqueo (🔒 o 🚫) en la barra de direcciones
    2. Selecciona "Permitir ventanas emergentes"
    3. Vuelve a intentar
  `;

  // Opción 2: Ofrecer autenticación por redirección como alternativa
  const useRedirect = window.confirm(
    `${popupInstructions}\n\n¿Prefieres continuar con redirección?`
  );

  if (useRedirect) {
    window.location.href = `https://${auth.config.authDomain}/__/auth/handler?apiKey=${
      auth.config.apiKey
    }&authType=signInWithPopup&provider=google.com&redirectUrl=${
      encodeURIComponent(window.location.href)
    }`;
    return { pending: true };
  }

  throw new Error('popup-blocked');
};

// Manejo de errores
const handleAuthError = (error) => {
  const errorMap = {
    'auth/popup-blocked': 'Popups bloqueados. Por favor permite ventanas emergentes.',
    'auth/popup-closed-by-user': 'Ventana cerrada demasiado pronto.',
    'auth/cancelled-popup-request': 'Solicitud cancelada.',
    'auth/network-request-failed': 'Error de conexión.'
  };

  setAuthData({
    error: errorMap[error.code] || 'Error al iniciar sesión',
    loading: false
  });
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