import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css"; // Reutiliza el mismo archivo CSS
import { Mail, KeyRound, User } from "lucide-react";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación básica
    if (!name || !email || !password) {
      setError("Todos los campos son obligatorios");
      return;
    }

    // Aquí puedes agregar la lógica para registrar al usuario
    console.log("Registrando usuario:", { name, email, password });

    // Redirigir al login después del registro
    navigate("/login");
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

          {/* Botón de Registro */}
          <button type="submit" className="btn btn-primary login-button">
            Registrarse
          </button>

          {/* Enlace para iniciar sesión */}
          <p className="forgot-password">
            ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;