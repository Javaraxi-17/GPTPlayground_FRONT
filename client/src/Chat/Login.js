import React, { useState } from 'react';

const Login = ({ onLogin, onSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Aquí iría tu lógica de autenticación
    onLogin(true); // Simulamos que el login fue exitoso
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-[#08080d] to-[#383869]">
      <div className="w-full max-w-md p-8 bg-[#0c0c15] text-white rounded-lg shadow-md">
        <h2 className="text-3xl mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded bg-[#1a1a2e] text-white"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-bold" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 rounded bg-[#1a1a2e] text-white"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Login
            </button>
          </div>
        </form>
        <div className="mt-6 text-center">
          <p>Don't have an account?</p>
          <button
            onClick={onSignup}
            className="text-blue-400 hover:text-blue-500 mt-2"
          >
            Sign up here
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
