import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Chat from './Chat/chat';
import Login from './Chat/Login';
import Loading from './Chat/Loading'; // Importamos el componente Loading

function App() {
  // Estado para manejar si el usuario está autenticado
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Nuevo estado para manejar la pantalla de carga

  // Simulación de carga para la transición entre Login y Chat
  const handleLogin = () => {
    setIsLoading(true); // Activar la pantalla de carga
    setTimeout(() => {
      setIsLoggedIn(true); // Simulamos la autenticación
      setIsLoading(false); // Desactivar la pantalla de carga
    }, 2000); // Esperar 2 segundos
  };

  return (
    <Router>
      <Routes>
        {/* Ruta para login */}
        <Route path="/login" element={
          isLoading ? <Loading /> : <LoginPage isLoggedIn={isLoggedIn} onLogin={handleLogin} />
        } />

        {/* Ruta para chat */}
        <Route path="/chat" element={
          isLoading ? <Loading /> : <ChatPage isLoggedIn={isLoggedIn} />
        } />

        {/* Redirigir la ruta raíz a /login */}
        <Route path="/" element={
          isLoading ? <Loading /> : <LoginPage isLoggedIn={isLoggedIn} onLogin={handleLogin} />
        } />
      </Routes>
    </Router>
  );
}

// Componente para manejar el login
const LoginPage = ({ isLoggedIn, onLogin }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Si el usuario ya está autenticado, redirige a /chat
    if (isLoggedIn) {
      navigate('/chat');
    }
  }, [isLoggedIn, navigate]);

  return <Login onLogin={onLogin} />;
};

// Componente para manejar el chat
const ChatPage = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Si el usuario no está autenticado, redirige a /login
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  return <Chat />;
};

export default App;
