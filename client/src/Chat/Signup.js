import React, { useState } from 'react';

const Signup = ({ onSignup, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica de validación o llamada a una API
    onSignup(); // Simulamos la función de registro
    onLogin(); // Al completar el registro, redirigimos al Login
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-[#08080d] to-[#383869]">
      <div className="bg-[#1a1a2e] p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl text-white mb-6">Sign Up</h2>
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label className="block text-white mb-2">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded-lg bg-gray-700 text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded-lg bg-gray-700 text-white"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700"
          >
            Sign up
          </button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-white">Already have an account?</span>{' '}
          <button
            className="text-blue-400 hover:underline"
            onClick={onLogin}
          >
            Log in here
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
