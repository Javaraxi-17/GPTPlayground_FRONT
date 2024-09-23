import React from 'react';

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-[#08080d] to-[#383869]">
      <img
        src="/gptlogo.png"
        alt="Loading..."
        className="h-32 w-32 animate-spin-scale" // Aplica la animación de carga
      />
    </div>
  );
};

export default Loading;
