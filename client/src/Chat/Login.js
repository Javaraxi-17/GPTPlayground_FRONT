import React from 'react';

const Login = ({ onLogin }) => {

  const handleGoogleLogin = () => {
    // Redirigir a la URL externa antes de cualquier otra acción
    window.location.href = 'https://gpt-playground-932770499416.us-central1.run.app/auth/google';
  };

  return (
    <div className="relative flex h-screen bg-gradient-to-r from-[#08080d] to-[#383869]">
      <div className="w-1/2 flex justify-center items-center relative">
        {/* Cambiar a contornos más redondeados */}
        <div className="w-full max-w-md p-9 bg-[#0c0c15] text-white rounded-3xl shadow-lg h-[400px] flex flex-col justify-between">
          {/* Texto "NOVA" centrado en la parte superior del recuadro */}
          <h1 className="text-6xl font-bold text-center mb-4">NOVA</h1>
          <h2 className="text-5xl mt-0 text-center">Access with your Google account</h2>

          {/* Botón de inicio de sesión con bordes más redondeados */}
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center w-full bg-white hover:bg-gray-200 text-black font-bold py-5 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            <img src="https://raw.githubusercontent.com/Javaraxi-17/GPTPlayground_FRONT/main/client/public/google.png" alt="Google Logo" className="h-6 w-6 mr-2" />
            Sign in with Google
          </button>
        </div>
      </div>

      {/* Columna derecha: Imagen del logo de GPT */}
      <div className="w-1/2 flex justify-center items-center">
        <img
          src="https://raw.githubusercontent.com/Javaraxi-17/GPTPlayground_FRONT/main/client/public/gptlogo.png"
          alt="GPT Logo"
          className="max-w-full h-auto transition-transform duration-300 transform hover:scale-110"
        />
      </div>
    </div>
  );
};

export default Login;
