// Loading.js
import React from 'react';

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-[#08080d] to-[#383869]">
      <img
        src="https://raw.githubusercontent.com/Javaraxi-17/GPTPlayground_FRONT/main/client/public/gptlogo.png"
        alt="Loading..."
        className="h-32 w-32 animate-spin-scale"
      />
    </div>
  );
};

export default Loading;
