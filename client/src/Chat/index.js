import React, { useState, useEffect, useRef } from 'react';
import Login from './Login'; // Importamos el componente Login
import Signup from './Signup'; // Importamos el componente Signup

const examples = [
  'How to use Tailwind CSS',
  'How to use Tailwind CSS with React',
  'How to use Tailwind CSS',
  'How to use Tailwind CSS with React',
  'How to use Tailwind CSS',
  'How to use Tailwind CSS with React',
];

const themes = {
  dark: {
    chatBg: 'bg-gradient-to-r from-[#08080d] to-[#383869]',
    sidebarBg: 'bg-[#0c0c15]',
    inputBg: 'bg-[#1a1a2e]', // Fondo oscuro para el cuadro de entrada de texto
    userMessageBg: 'bg-[#2a2a4e]', // Fondo del mensaje del usuario en tema oscuro
    assistantMessageBg: 'bg-[#1e1e38]', // Fondo del mensaje del asistente en tema oscuro
    exitBtnBg: 'bg-[#1A1A2E] hover:bg-[#0C0C15]', // Botón exit en tema oscuro
    buttonContainerBg: 'bg-[#1a1a2e]', // Color del contenedor de botones en tema oscuro
    warningText: 'text-[#cdcdf7]', // Texto de advertencia en tema oscuro (naranja/rojo)
  },
  light: {
    chatBg: 'bg-gradient-to-r from-[#b8b8e6] to-[#5353ad]',
    sidebarBg: 'bg-[#aaaae6]',
    inputBg: 'bg-[#6060A5]', // Fondo claro para el cuadro de entrada de texto
    userMessageBg: 'bg-[#6060A5]', // Fondo del mensaje del usuario en tema claro
    assistantMessageBg: 'bg-[#a1a1bb]', // Fondo del mensaje del asistente en tema claro
    exitBtnBg: 'bg-[#6060A5] hover:bg-[#AAAAE6]', // Botón exit en tema claro
    buttonContainerBg: 'bg-[#AAAAE6]', // Color del contenedor de botones en tema claro
    warningText: 'text-[#A4A4DF]', // Texto de advertencia en tema claro
  },
  blue: {
    chatBg: 'bg-gradient-to-r from-[#002045] to-[#0073D7]',
    sidebarBg: 'bg-[#012e59]',
    inputBg: 'bg-[#014c8e]', // Fondo azul para el cuadro de entrada de texto
    userMessageBg: 'bg-[#014C8E]', // Fondo del mensaje del usuario en tema azul
    assistantMessageBg: 'bg-[#013b6b]', // Fondo del mensaje del asistente en tema azul
    exitBtnBg: 'bg-[#014C8E] hover:bg-[#012E59]', // Botón exit en tema azul
    buttonContainerBg: 'bg-[#012e59]', // Color del contenedor de botones en tema azul
    warningText: 'text-[#041b30]', // Texto de advertencia en tema azul
  },
};

const Chat = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado de autenticación
  const [isRegistering, setIsRegistering] = useState(false); // Estado para mostrar el signup
  const [chat, setChat] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [title, setTitle] = useState('');
  const [input, setInput] = useState('');
  const [theme, setTheme] = useState(themes.dark); // Default theme
  const [showThemeSelector, setShowThemeSelector] = useState(false); // Control para mostrar el selector de tema

  // Referencia al contenedor del chat para el desplazamiento automático
  const chatContainerRef = useRef(null);

  // Función para manejar el envío del mensaje
  const handleSend = async () => {
    if (input.trim()) {
      setChat([...chat, { role: 'user', content: input }]);
      setInput('');
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            ...chat,
            { role: 'user', content: input },
          ],
        }),
      });

      const aiRes = await response.text(); // Modificación para manejar la respuesta como texto
      setChat([...chat, { role: 'user', content: input }, { role: 'assistant', content: aiRes }]);

      if (!title) {
        const createTitle = await fetch('http://localhost:8000/api/title', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: input,
          }),
        });

        const title = await createTitle.json();
        setTitle(title?.title);
        setChatHistory([...chatHistory, title]);
      }
    }
  };

  // Función para manejar el evento "Enter" y "Shift + Enter"
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        setInput(input + '\n');
      } else {
        e.preventDefault();
        handleSend();
      }
    }
  };

  // Efecto para desplazarse automáticamente hacia abajo cuando se agregue un nuevo mensaje
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat]);

  // Si el usuario no está logueado, mostramos la pantalla de Login o Signup según corresponda
  if (!isLoggedIn) {
    if (isRegistering) {
      return (
        <Signup
          onSignup={() => setIsRegistering(false)} // Después del registro, mostramos el login
          onLogin={() => setIsRegistering(false)}  // Volver al login
        />
      );
    }
    return <Login onLogin={() => setIsLoggedIn(true)} onSignup={() => setIsRegistering(true)} />;
  }

  return (
    <div className={`h-screen w-screen flex ${theme.chatBg}`}>
      {/* Panel izquierdo con color dinámico basado en el tema */}
      <div className={`w-[20%] h-screen ${theme.sidebarBg} text-white p-4 flex flex-col justify-between`}>
        <div>
          <div className='h-[5%]'>
            <button className='w-full h-[50px] border rounded hover:bg-slate-600' onClick={() => {
              setChat([]);
              setTitle('');
            }}>+ New Chat</button>
          </div>
          <div className='h-[70%] overflow-scroll shadow-lg hide-scroll-bar mb-4'>
            {
              chatHistory.map((item, index) => (
                <div key={index} className='py-3 text-center rounded mt-4 text-lg font-light flex items-center px-8 hover:bg-slate-600 cursor-pointer'>
                  <span className='mr-4'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-message" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <path d="M8 9h8"></path>
                      <path d="M8 13h6"></path>
                      <path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z"></path>
                    </svg>
                  </span>
                  <span className='text-left'>{item.title}</span>
                </div>
              ))
            }
          </div>
        </div>
        {/* Agrupamos Theme, Code Settings y Exit en un mismo contenedor */}
        <div className={`overflow-scroll shadow-lg hide-scroll-bar border-t p-4 rounded-lg ${theme.buttonContainerBg} flex flex-col`}>
          {/* Theme Selector */}
          <div className='py-3 text-center rounded text-lg font-light flex items-center px-8 hover:bg-slate-600 cursor-pointer' onClick={() => setShowThemeSelector(true)}>
            <span className='mr-4'>
              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-paint" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M12 5v7a2 2 0 1 0 4 0v-3a2 2 0 1 0 4 0v6a5 5 0 1 1 -10 0v-10a4 4 0 1 1 8 0"></path>
                <path d="M6 8a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z"></path>
              </svg>
            </span>
            Theme
          </div>
          {/* Code Settings */}
          <div className='py-3 text-center rounded text-lg font-light flex items-center px-8 hover:bg-slate-600 cursor-pointer'>
            <span className='mr-4'>
              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-settings-code" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M11.482 20.924a1.666 1.666 0 0 1 -1.157 -1.241a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.312 .318 1.644 1.794 .995 2.697"></path>
                <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
                <path d="M20 21l2 -2l-2 -2"></path>
                <path d="M17 17l-2 2l2 2"></path>
              </svg>
            </span>
            Code Settings
          </div>
          {/* Botón Exit */}
          <div className='mt-4'>
            <button className={`w-full h-[50px] border rounded ${theme.exitBtnBg} text-white`} onClick={() => {
              setIsLoggedIn(false);
            }}>Exit</button>
          </div>
        </div>
      </div>

      {/* Contenedor del chat con scrollbar visible y auto-scroll */}
      <div className='w-[80%]'>
        {
          chat.length > 0 ?
            (
              <div className='h-[80%] overflow-y-scroll' ref={chatContainerRef}>
                {
                  chat.map((item, index) => (
                    <div key={index} className={`w-[60%] mx-auto p-6 text-white mb-4 flex ${item.role === 'user' ? theme.userMessageBg : theme.assistantMessageBg} rounded-lg`}>
                      <span className='mr-8 p-2 bg-slate-500 text-white rounded-full h-full'>
                        {
                          item.role === 'user' ?
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-user-bolt" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                              <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
                              <path d="M6 21v-2a4 4 0 0 1 4 -4h4c.267 0 .529 .026 .781 .076"></path>
                              <path d="M19 16l-2 3h4l-2 3"></path>
                            </svg>
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-robot" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                              <path d="M7 7h10a2 2 0 0 1 2 2v1l1 1v3l-1 1v3a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-3l-1 -1v-3l1 -1v-1a2 2 0 0 1 2 -2z"></path>
                              <path d="M10 16h4"></path>
                              <circle cx="8.5" cy="11.5" r=".5" fill="currentColor"></circle>
                              <circle cx="15.5" cy="11.5" r=".5" fill="currentColor"></circle>
                              <path d="M9 7l-1 -4"></path>
                              <path d="M15 7l1 -4"></path>
                            </svg>
                        }
                      </span>
                      <div className='leading-loose whitespace-pre-wrap'>{item.content}</div>
                    </div>
                  ))
                }
              </div>
            )
            :
            (
              <div className='h-[80%] flex flex-col justify-center items-center text-white'>
                <div className='text-4xl font-bold mb-8'>APP GPT</div>
                <div className='flex flex-wrap justify-around max-w-[900px]'>
                  {
                    examples.map((item, index) => (
                      <div key={index} className='text-lg font-light mt-4 p-4 border rounded cursor-pointer min-w-[400px] hover:bg-slate-800' onClick={() => setInput(item)}>{item}</div>
                    ))
                  }
                </div>
              </div>
            )
        }
        <div className='h-[20%]'>
          <div className='flex flex-col items-center justify-center w-full h-full text-white'>
            <div className='w-[60%] flex justify-center relative'>
              {/* Caja de entrada con fondo dinámico basado en el tema */}
              <textarea
                type='text'
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                value={input}
                className={`w-full rounded-lg p-4 pr-16 ${theme.inputBg} text-white leading-`}
                placeholder='Type your message here...'
              />
              <span className='absolute right-4 top-4 cursor-pointer' onClick={() => input.trim() ? handleSend() : undefined}>
                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-send" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M10 14l11 -11"></path>
                  <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5"></path>
                </svg>
              </span>
            </div>
            {/* Texto de advertencia dinámico basado en el tema */}
            <small className={`mt-2 ${theme.warningText}`}>La IA puede cometer algunos errores.</small>
          </div>
        </div>
      </div>

      {/* Modal para seleccionar tema */}
      {showThemeSelector && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-lg font-bold mb-4">Select Theme</h2>
            <div className="space-y-4">
              <button className="w-full py-2 bg-gradient-to-r from-[#08080d] to-[#383869] text-white rounded" onClick={() => { setTheme(themes.dark); setShowThemeSelector(false); }}>Dark Theme</button>
              <button className="w-full py-2 bg-gradient-to-r from-[#b2b2d1] to-[#5353ad] text-black rounded" onClick={() => { setTheme(themes.light); setShowThemeSelector(false); }}>Light Theme</button>
              <button className="w-full py-2 bg-gradient-to-r from-[#001f3f] to-[#0074D9] text-white rounded" onClick={() => { setTheme(themes.blue); setShowThemeSelector(false); }}>Blue Theme</button>
            </div>
            <button className="mt-4 text-red-500" onClick={() => setShowThemeSelector(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
