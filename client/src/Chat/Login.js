import React from 'react';

const Login = ({ onLogin }) => {
  // Función para manejar el inicio de sesión simulado con Google
  const handleGoogleLogin = () => {
    // Simula el inicio de sesión con Google y ejecuta onLogin para permitir el acceso al chat
    onLogin();
  };

  return (
    <div className="relative flex h-screen bg-gradient-to-r from-[#08080d] to-[#383869]">
      <div className="w-1/2 flex justify-center items-center relative">
        {/* Columna izquierda: Formulario de login */}
        <div className="w-full max-w-md p-9 bg-[#0c0c15] text-white rounded-lg shadow-lg h-[400px] flex flex-col justify-between">
          
          {/* Texto "NOVA" centrado en la parte superior del recuadro */}
          <h1 className="text-6xl font-bold text-center mb-4">NOVA</h1>

          <h2 className="text-5xl mt-0 text-center">Access with your Google account</h2>

          {/* Botón de inicio de sesión con la imagen de Google */}
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center w-full bg-white hover:bg-gray-200 text-white font-bold py-5 px-4 rounded mb-8"
          >
            <img src="/google.png" alt="Google Logo" className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Columna derecha: Imagen del logo de GPT */}
      <div className="w-1/2 flex justify-center items-center">
        <img
          src="/gptlogo.png"
          alt="GPT Logo"
          className="max-w-full h-auto transition-transform duration-300 transform hover:scale-110" // Efecto de hover
        />
      </div>
    </div>
  );
};

export default Login;
