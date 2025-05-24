import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";
import { AuthContext } from "../context/AuthContext";
import { Mail, KeyRound, User } from "lucide-react";
import { auth, googleProvider } from '../firebase/firebase.config';
import { signInWithPopup } from 'firebase/auth';
import { registerWithEmail } from "../service/Auth.service";
import logoGoogle from "../assets/logoGoogle.svg";


const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [loading, setLoading] = useState(false);
    
   const { isAuthenticated, loginWithGoogle, loading: authLoading, error: authError } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
    edad: "",
    sexo: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

   // Sincronizar errores del contexto
    useEffect(() => {
      if (authError) {
        setError(authError);
      }
    }, [authError]);
  
    // Redirección cuando está autenticado
    useEffect(() => {
      if (isAuthenticated) {
        navigate("/home");
      }
    }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validaciones básicas
      if (!formData.nombre || !formData.email || !formData.password || !formData.confirmPassword) {
        throw new Error("Todos los campos obligatorios deben estar completos");
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error("Las contraseñas no coinciden");
      }

      if (formData.password.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres");
      }

      // Convertir edad a número entero (o null si está vacío)
      const edadInt = formData.edad ? parseInt(formData.edad) : null;

      // Llamada al servicio de registro
      await registerWithEmail({
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        edad: edadInt,  // Envía como número entero o null
        sexo: formData.sexo || null
      });

      // Redirección después de registro exitoso
      navigate("/login", {
        state: {
          registrationSuccess: true,
          registeredEmail: formData.email
        }
      });

    } catch (error) {
      console.error("Error en registro:", error);
      setError(error.message || "Error al registrar el usuario");
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
    setError(error.message || "Error al iniciar con Google");
  } finally {
    setGoogleLoading(false);
  }
};


  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Regístrate</h2>
        
        <form className="login-form" onSubmit={handleSubmit}>
          {/* Campo Nombre */}
          <div className="form-group">
            <label htmlFor="nombre" className="form-label">
              <User className="icon-style" />
              Nombre Completo
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              className="form-control"
              placeholder="Ingresa tu nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          {/* Campo Email */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <Mail className="icon-style" />
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              placeholder="Ingresa tu correo"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Campo Contraseña */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <KeyRound className="icon-style" />
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              placeholder="Mínimo 6 caracteres"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          {/* Campo Confirmar Contraseña */}
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              <KeyRound className="icon-style" />
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="form-control"
              placeholder="Confirma tu contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          {/* Campo Edad (opcional) */}
          <div className="form-group">
            <label htmlFor="edad" className="form-label">
              <User className="icon-style" />
              Edad
            </label>
            <input
              type="number"
              id="edad"
              name="edad"
              className="form-control"
              placeholder="Ingresa tu edad"
              value={formData.edad}
              onChange={handleChange}
              min="1"
              max="120"
            />
          </div>

          {/* Campo Sexo (opcional) */}
          <div className="form-group">
            <label htmlFor="sexo" className="form-label">
              <User className="icon-style" />
              Sexo
            </label>
            <select
              id="sexo"
              name="sexo"
              className="form-control"
              value={formData.sexo}
              onChange={handleChange}
            >
              <option value="">Selecciona una opción</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="otro">Otro</option>
              <option value="prefiero-no-decir">Prefiero no decir</option>
            </select>
          </div>

          {/* Mostrar mensaje de error si existe */}
          {error && <p className="error-message">{error}</p>}

          
          <button type="submit" className="btn btn-primary login-button">
            Registrarse
          </button>

          {/* Divider */}
          <div className="divider">
            <span className="divider-line"></span>
            <span className="divider-text">o</span>
            <span className="divider-line"></span>
          </div>

          {/* Botón de Google */}
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
            ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;