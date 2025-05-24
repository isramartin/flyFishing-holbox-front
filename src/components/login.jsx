import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";
import { AuthContext } from "../context/AuthContext";
import { Mail, KeyRound, Eye, EyeOff } from "lucide-react";
import { auth, googleProvider } from "../firebase/firebase.config";
import logoGoogle from "../assets/logoGoogle.svg";
import { signInWithPopup } from "firebase/auth";
import { useAlert } from "./AlertManager";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [loading, setLoading] = useState(false);
   const { addAlert } = useAlert();
  const { isAuthenticated, login, loginWithGoogle, loading: authLoading, error: authError } = useContext(AuthContext);
  const navigate = useNavigate();

  // Sincronizar errores del contexto
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  // Redirección cuando está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      addAlert("Sesión iniciada correctamente", "success");
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
    } catch (error) {
      // El error ya está manejado en el AuthContext
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
  try {
    setGoogleLoading(true);
    setError("");
    
    // Solo llamar al método del contexto
    await loginWithGoogle();
    
  } catch (error) {
    console.error("Google Sign-In error:", error);
     addAlert(error.message || "Error al iniciar con Google", "error");
    setError(error.message || "Error al iniciar con Google");
  } finally {
    setGoogleLoading(false);
  }
};

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Iniciar Sesión</h2>
        <p className="forgot-password">
          ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          {/* Campo de Email */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <Mail className="icon-style" />
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Ingresa tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading || googleLoading || authLoading}
            />
          </div>

          {/* Campo de Contraseña */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <KeyRound className="icon-style" />
              Contraseña
            </label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="form-control"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading || googleLoading || authLoading}
              />
              <button
                type="button"
                className="password-toggle-button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading || googleLoading || authLoading}
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                {showPassword ? (
                  <EyeOff size={18} className="password-toggle-icon" />
                ) : (
                  <Eye size={18} className="password-toggle-icon" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary login-button"
            disabled={loading || googleLoading || authLoading}
          >
            {loading || authLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>

          <div className="divider">
            <span className="divider-line"></span>
            <span className="divider-text">o</span>
            <span className="divider-line"></span>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="btn-google"
            disabled={loading || googleLoading || authLoading}
          >
            <div className="google-btn-content">
              <img src={logoGoogle} alt="Google" className="google-icon" />
              <span>
                {googleLoading ? "Procesando..." : "Continuar con Google"}
              </span>
            </div>
          </button>

          <p className="forgot-password">
            ¿Olvidaste tu contraseña? <a href="/recover">Recupérala aquí</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;