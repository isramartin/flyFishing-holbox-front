import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";
import { Mail, KeyRound, User } from "lucide-react";
import { auth, googleProvider } from '../firebase/firebase.config';
import { signInWithPopup } from 'firebase/auth';
import logoGoogle from "../assets/logoGoogle.svg";


const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("Todos los campos son obligatorios");
      return;
    }

    console.log("Registrando usuario:", { name, email, password });
    navigate("/login");
  };

  const handleGoogleRegister = async () => {
    try {
      setGoogleLoading(true);
      setError("");
      
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      console.log("Usuario registrado con Google:", {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL
      });

      // Aquí puedes enviar los datos a tu backend o manejarlos como necesites
      // Por ahora solo redirigimos
      navigate("/login");
      
    } catch (error) {
      console.error("Error en registro con Google:", error);
      setError(error.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Regístrate</h2>
        
        <form className="login-form" onSubmit={handleSubmit}>
         {/* Campo de Nombre */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              <User className="icon-style" />
              Nombre
            </label>
            <input
              type="text"
              id="name"
              className="form-control"
              placeholder="Ingresa tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
            />
          </div>

          {/* Campo de Contraseña */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <KeyRound className="icon-style" />
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
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
            onClick={handleGoogleRegister}
            className="btn-google"
            disabled={googleLoading}
          >
            {googleLoading ? (
              <span>Registrando con Google...</span>
            ) : (
              <>
           
                <div className="google-btn-content">
                  <img src={logoGoogle} alt="Google" className="google-icon" />
                  <span>Regístrate con Google</span>
               </div>
              
              </>
            )}
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