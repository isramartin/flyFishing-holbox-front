import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom"; // Importa useNavigate
import "../styles/login.css"; // Archivo CSS personalizado
import { AuthContext } from "../context/AuthContext"; // Importa el contexto
import mockData from "../assets/mockdata/mockdata.json"; // Importa el JSON directamente
import { Mail, KeyRound, Eye, EyeOff  } from "lucide-react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login: authLogin } = useContext(AuthContext); // Usa la función login del contexto
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // Hook para redireccionar

  const handleSubmit = (e) => {
    e.preventDefault();

    // Buscar el usuario en el JSON
    const user = mockData.users.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      console.log("Usuario encontrado:", user); // Debug: Verificar que se encontró el usuario
      authLogin(user.role); // Llama a la función login del contexto
      setError(""); // Limpiar el mensaje de error
      navigate("/admin/reservaciones"); // Redirigir a /admin/reservaciones
    } else {
      console.log("Credenciales incorrectas"); // Debug: Verificar que las credenciales son incorrectas
      setError("Correo electrónico o contraseña incorrectos");
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
            <label htmlFor="email" className="form-label"> <Mail className='icon-style' />
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
            <label htmlFor="password" className="form-label"> <KeyRound className='icon-style'/>
              Contraseña
            </label>
            <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="form-control"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle-button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

          {/* Mostrar mensaje de error si existe */}
          {error && <p className="error-message">{error}</p>}

          {/* Botón de Iniciar Sesión */}
          <button type="submit" className="btn btn-primary login-button">
            Iniciar Sesión
          </button>

          {/* Enlace para recuperar contraseña */}
          <p className="forgot-password">
            ¿Olvidaste tu contraseña? <a href="/recover">Recupérala aquí</a>
          </p>
          
        </form>
      </div>
    </div>
  );
};

export default LoginForm;