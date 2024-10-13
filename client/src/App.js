// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Chat from './Chat/chat';
import Login from './Chat/Login';
import Loading from './Chat/Loading'; // Importar el componente Loading

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true); // Cambia el estado a logueado cuando inicia sesión
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // Cambia el estado a no logueado cuando cierra sesión
  };

  return (
    <Router>
      <Routes>
        {/* Ruta para login */}
        <Route path="/login" element={
          <LoginPage isLoggedIn={isLoggedIn} onLogin={handleLogin} />
        } />

        {/* Ruta para loading */}
        <Route path="/auth/google/callback" element={<LoadingPage onLogin={handleLogin} />} />

        {/* Ruta para chat */}
        <Route path="/chat" element={<Chat onLogout={handleLogout} />} />

        {/* Redirigir la ruta raíz a /login */}
        <Route path="/" element={
          <LoginPage isLoggedIn={isLoggedIn} onLogin={handleLogin} />
        } />
      </Routes>
    </Router>
  );
}

// Componente para manejar el login
const LoginPage = ({ isLoggedIn, onLogin }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/auth/google/callback'); // Redirigir a la pantalla de carga si ya está autenticado
    }
  }, [isLoggedIn, navigate]);

  return <Login onLogin={onLogin} />;
};

// Componente para manejar la pantalla de carga
const LoadingPage = ({ onLogin }) => {
  const navigate = useNavigate();

  useEffect(() => {
    onLogin(); // Marcar al usuario como loggeado

    // Simular un pequeño retraso de carga, luego redirigir al chat
    const timer = setTimeout(() => {
      navigate('/chat'); // Redirigir al chat después de la animación
    }, 2000);

    return () => clearTimeout(timer); // Limpiar el timeout si se desmonta
  }, [onLogin, navigate]);

  return <Loading />;
};

export default App;
