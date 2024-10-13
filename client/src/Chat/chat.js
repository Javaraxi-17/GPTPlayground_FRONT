import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { marked } from 'marked';

// Function to strip HTML tags and get plain text
const stripHtml = (html) => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || '';
};

const examples = [
  '¿Como funciona la IA?',
  '¿Que es inteligencia artificial?',
  '¿Lenguajes de programación más usados en IA',
  '¿Qué es un modelo de lenguaje grande?',
  '¿Cómo funciona el aprendizaje automático?',
  '¿Qué es el procesamiento de lenguaje natural?',
];

const themes = {
  dark: {
    chatBg: 'bg-gradient-to-r from-[#08080d] to-[#383869]',
    sidebarBg: 'bg-[#0c0c15]',
    inputBg: 'bg-[#1a1a2e]',
    userMessageBg: 'bg-[#2a2a4e]',
    assistantMessageBg: 'bg-[#1e1e38]',
    exitBtnBg: 'bg-[#1A1A2E] hover:bg-[#0C0C15]',
    buttonContainerBg: 'bg-[#1a1a2e]',
    warningText: 'text-[#cdcdf7]',
  },
  light: {
    chatBg: 'bg-gradient-to-r from-[#b8b8e6] to-[#5353ad]',
    sidebarBg: 'bg-[#aaaae6]',
    inputBg: 'bg-[#6060A5]',
    userMessageBg: 'bg-[#6060A5]',
    assistantMessageBg: 'bg-[#a1a1bb]',
    exitBtnBg: 'bg-[#6060A5] hover:bg-[#AAAAE6]',
    buttonContainerBg: 'bg-[#AAAAE6]',
    warningText: 'text-[#A4A4DF]',
  },
  blue: {
    chatBg: 'bg-gradient-to-r from-[#002045] to-[#0073D7]',
    sidebarBg: 'bg-[#012e59]',
    inputBg: 'bg-[#014c8e]',
    userMessageBg: 'bg-[#014C8E]',
    assistantMessageBg: 'bg-[#013b6b]',
    exitBtnBg: 'bg-[#014C8E] hover:bg-[#012E59]',
    buttonContainerBg: 'bg-[#012e59]',
    warningText: 'text-[#041b30]',
  },
  red: {
    chatBg: 'bg-gradient-to-r from-[#7f0000] to-[#ff0000]',
    sidebarBg: 'bg-[#bf0000]',
    inputBg: 'bg-[#990000]',
    userMessageBg: 'bg-[#b30000]',
    assistantMessageBg: 'bg-[#e60000]',
    exitBtnBg: 'bg-[#990000] hover:bg-[#7f0000]',
    buttonContainerBg: 'bg-[#bf0000]',
    warningText: 'text-[#ffcccc]',
  },
  purpleOrange: {
    chatBg: 'bg-gradient-to-r from-[#4B0082] to-[#FFA500]',
    sidebarBg: 'bg-[#780178]',
    inputBg: 'bg-[#FF7F50]',
    userMessageBg: 'bg-[#db9107]',
    assistantMessageBg: 'bg-[#FF8C00]',
    exitBtnBg: 'bg-[#590259] hover:bg-[#660d66]',
    buttonContainerBg: 'bg-[#800080]',
    warningText: 'text-[#FFE4B5]',
  },
};

const Chat = ({ onLogout }) => {
  const [chat, setChat] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [title, setTitle] = useState('');
  const [input, setInput] = useState('');
  const [theme, setTheme] = useState(themes.dark); // Default theme
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [selectedModel, setSelectedModel] = useState('GPT-3');
  const [conversation, setConversation] = useState(''); // Mantener contexto de la conversación
  const [copyStatus, setCopyStatus] = useState('Copy text'); // Estado del botón de copiar

  const chatContainerRef = useRef(null);
  const navigate = useNavigate(); // Hook para navegación

  // Función para manejar el botón de salida (Exit)
  const handleExit = () => {
    setChat([]); // Limpia el chat
    setConversation(''); // Limpia el historial de la conversación
    onLogout(); // Cambia el estado de autenticación (isLoggedIn a false)
    navigate('/login'); // Redirige al login
  };

  // Función para manejar el envío del mensaje
  const handleSend = async () => {
    if (input.trim()) {
      // Añadimos el mensaje del usuario al chat
      const newMessage = { role: 'user', content: input };
      setChat((prevChat) => [...prevChat, newMessage]);
      setInput(''); // Limpiamos el input del usuario

      const newConversation = `${conversation}\nUsuario: ${input}\n`;
      setConversation(newConversation);

      // Estructura de la solicitud POST a la API
      const response = await fetch('https://gpt-playground-932770499416.us-central1.run.app/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: newConversation, // Enviar la conversación acumulada
                },
              ],
            },
          ],
        }),
      });

      // Verificamos si la respuesta fue exitosa
      if (!response.ok) {
        throw new Error(`Error en la respuesta: ${response.statusText}`);
      }

      const data = await response.json();

      // Extraemos la respuesta de la IA desde la estructura de los datos
      const aiResponseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (aiResponseText && aiResponseText.trim() !== "") {
        const formattedResponse = marked(aiResponseText);
        animateAssistantResponse(formattedResponse);

        // Actualizamos la conversación acumulada
        setConversation((prevConversation) => `${prevConversation}Asistente: ${aiResponseText}\n`);
      } else {
        setChat((prevChat) => [
          ...prevChat,
          { role: 'assistant', content: 'Error: No se recibió una respuesta válida de la IA.' },
        ]);
      }
    }
  };

// Función para animar la respuesta del asistente
const animateAssistantResponse = (responseText) => {
  const words = responseText.split(' ');
  let currentWordIndex = 0;

  // Añadimos un mensaje vacío inicialmente para luego ir actualizando
  setChat((prevChat) => [...prevChat, { role: 'assistant', content: '' }]);

  // Establecemos un intervalo para ir añadiendo palabras una a una
  const animationInterval = setInterval(() => {
    setChat((prevChat) => {
      const lastMessage = prevChat[prevChat.length - 1];
      
      // Aseguramos que no intentamos acceder a índices fuera del array
      if (currentWordIndex < words.length) {
        const updatedContent = `${lastMessage.content} ${words[currentWordIndex]}`.trim();
        const updatedMessage = { ...lastMessage, content: updatedContent };
        return [...prevChat.slice(0, -1), updatedMessage];
      } else {
        clearInterval(animationInterval);  // Detenemos el intervalo cuando se alcance el final
        return prevChat;
      }
    });

    currentWordIndex += 1;

  }, 50); // Retraso de 50ms entre cada palabra
};


  // Función para manejar el evento "Enter" y "Shift + Enter"
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (!e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    }
  };

  // Listener global para capturar la tecla "Enter" fuera del cuadro de texto
  useEffect(() => {
    const handleGlobalEnter = (e) => {
      if (e.key === 'Enter' && !e.shiftKey && input.trim()) {
        e.preventDefault();
        handleSend(); // Envía el mensaje cuando presiona "Enter" fuera del input
      }
    };

    window.addEventListener('keydown', handleGlobalEnter);
    return () => {
      window.removeEventListener('keydown', handleGlobalEnter);
    };
  }, [input]); // El listener se registra cada vez que cambia el valor del input

  // Auto-scroll hacia abajo cuando se agregue un nuevo mensaje
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat]);

  // Función para copiar el contenido del asistente en formato de texto plano
  const handleCopy = (content) => {
    const plainText = stripHtml(content); // Remover el formato HTML
    navigator.clipboard.writeText(plainText);
    setCopyStatus('Copied'); // Cambiar el botón a "Copied"
    setTimeout(() => {
      setCopyStatus('Copy text'); // Regresar a "Copy text" después de 2 segundos
    }, 2000);
  };

  return (
    <div className={`h-screen w-screen flex ${theme.chatBg}`}>
      {/* Panel izquierdo con configuraciones de tema, modelo y botón de salida */}
      <div className={`w-[20%] h-screen ${theme.sidebarBg} text-white p-4 flex flex-col justify-between`}>
        <div className="flex flex-col items-center">
          {/* Logo centrado */}
          <img src="/gptlogo.png" alt="GPT Logo" className="w-24 h-auto mb-4" />
          <button
            className="w-full h-[50px] border rounded-full hover:bg-slate-600"
            onClick={() => {
              setChat([]);
              setTitle('');
              setConversation(''); // Limpiar el historial de conversación
            }}
          >
            + New Chat
          </button>
        </div>
        <div className="h-[70%] overflow-scroll shadow-lg hide-scroll-bar mb-4">
          {chatHistory.map((item, index) => (
            <div
              key={index}
              className="py-3 text-center rounded-full mt-4 text-lg font-light flex items-center px-8 hover:bg-slate-600 cursor-pointer"
            >
              <span className="mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-message"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M8 9h8" />
                  <path d="M8 13h6" />
                  <path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z" />
                </svg>
              </span>
              <span className="text-left">{item.title}</span>
            </div>
          ))}
        </div>

        {/* Opciones: seleccionar tema, modelo, y salir */}
        <div className={`border-t p-4 rounded-lg ${theme.buttonContainerBg} flex flex-col space-y-4`}>
          <div
            className="py-3 text-center rounded-full text-lg font-light flex items-center px-8 hover:bg-slate-600 cursor-pointer"
            onClick={() => setShowThemeSelector(true)}
          >
            <span className="mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-paint"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 5v7a2 2 0 1 0 4 0v-3a2 2 0 1 0 4 0v6a5 5 0 1 1 -10 0v-10a4 4 0 1 1 8 0" />
                <path d="M6 8a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z" />
              </svg>
            </span>
            Theme
          </div>
          <div
            className="py-3 text-center rounded-full text-lg font-light flex items-center px-8 hover:bg-slate-600 cursor-pointer"
            onClick={() => setShowModelSelector(true)}
          >
            <span className="mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-settings-code"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M11.482 20.924a1.666 1.666 0 0 1 -1.157 -1.241a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.312 .318 1.644 1.794 .995 2.697" />
                <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                <path d="M20 21l2 -2l-2 -2" />
                <path d="M17 17l-2 2l2 2" />
              </svg>
            </span>
            Code Settings
          </div>
          <div className="mt-4">
            <button
              className={`w-full h-[50px] border rounded-full ${theme.exitBtnBg} text-white`}
              onClick={handleExit}
            >
              Exit
            </button>
          </div>
        </div>
      </div>

      {/* Contenedor del chat con scrollbar visible y auto-scroll */}
      <div className="w-[80%]">
        {chat.length > 0 ? (
          <div className="h-[80%] overflow-y-scroll" ref={chatContainerRef}>
            {chat.map((item, index) => (
              <div
                key={index}
                className={`relative w-[60%] mx-auto p-6 text-white mb-4 flex ${item.role === 'user' ? theme.userMessageBg : theme.assistantMessageBg} rounded-lg`}
              >
                <span className="mr-8 p-2 bg-slate-500 text-white rounded-full h-full">
                  {item.role === 'user' ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-user-bolt"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                      <path d="M6 21v-2a4 4 0 0 1 4 -4h4c.267 0 .529 .026 .781 .076" />
                      <path d="M19 16l-2 3h4l-2 3" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-robot"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M7 7h10a2 2 0 0 1 2 2v1l1 1v3l-1 1v3a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-3l-1 -1v-3l1 -1v-1a2 2 0 0 1 2 -2z" />
                      <path d="M10 16h4" />
                      <circle cx="8.5" cy="11.5" r=".5" fill="currentColor" />
                      <circle cx="15.5" cy="11.5" r=".5" fill="currentColor" />
                      <path d="M9 7l-1 -4" />
                      <path d="M15 7l1 -4" />
                    </svg>
                  )}
                </span>
                {/* Renderizado seguro del contenido HTML utilizando dangerouslySetInnerHTML */}
                <div className="leading-loose whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: item.content }} />
                {item.role === 'assistant' && (
                  <button
                    className="absolute top-2 right-2 text-sm border border-white px-2 py-1 rounded-full text-white bg-transparent mb-10"
                    onClick={() => handleCopy(item.content)} // Usar la función de copiar texto limpio
                  >
                    {copyStatus}
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[80%] flex flex-col justify-center items-center text-white">
            <div className="text-4xl font-bold mb-8">NOVA GPT</div>
            <div className="flex flex-wrap justify-around max-w-[900px]">
              {examples.map((item, index) => (
                <div
                  key={index}
                  className="text-lg font-light mt-4 p-4 border rounded-full cursor-pointer min-w-[400px] hover:bg-slate-800"
                  onClick={() => setInput(item)}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="h-[20%]">
          <div className="flex flex-col items-center justify-center w-full h-full text-white">
            <div className="w-[60%] flex items-center relative">
                {/* Caja de entrada con fondo dinámico basado en el tema */}
                <textarea
                  type="text"
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  value={input}
                  className={`w-full rounded-full p-4 pr-16 ${theme.inputBg} text-white leading- placeholder-gray-300 h-[70px] flex items-center `}
                  placeholder="Type your message here..."
                />
                <span className="absolute right-6 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={() => (input.trim() ? handleSend() : undefined)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-send"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M10 14l11 -11" />
                    <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />
                  </svg>
                </span>
              </div>
            <small className={`mt-2 ${theme.warningText}`}>The AI can make some mistakes</small>
          </div>
        </div>
      </div>

      {/* Modal para seleccionar modelo GPT */}
      {showModelSelector && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">Enter the desired model</h2>
            <div className="space-y-4">
              <select
                className="w-full py-2 border rounded-full text-black"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                <option value="GPT-1">GPT-1</option>
                <option value="GPT-2">GPT-2</option>
                <option value="GPT-3">GPT-3</option>
              </select>
            </div>
            <div className="flex justify-end mt-4">
              <button className="mr-4 text-blue-500" onClick={() => setShowModelSelector(false)}>
                Cancel
              </button>
              <button className="text-blue-500" onClick={() => setShowModelSelector(false)}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para seleccionar tema */}
      {showThemeSelector && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-lg font-bold mb-4">Select Theme</h2>
            <div className="space-y-4">
              <button className="w-full py-2 bg-gradient-to-r from-[#08080d] to-[#383869] text-white rounded-full" onClick={() => { setTheme(themes.dark); setShowThemeSelector(false); }}>Dark Theme</button>
              <button className="w-full py-2 bg-gradient-to-r from-[#b2b2d1] to-[#5353ad] text-black rounded-full" onClick={() => { setTheme(themes.light); setShowThemeSelector(false); }}>Light Theme</button>
              <button className="w-full py-2 bg-gradient-to-r from-[#001f3f] to-[#0074D9] text-white rounded-full" onClick={() => { setTheme(themes.blue); setShowThemeSelector(false); }}>Blue Theme</button>
              <button className="w-full py-2 bg-gradient-to-r from-[#7f0000] to-[#ff0000] text-white rounded-full" onClick={() => { setTheme(themes.red); setShowThemeSelector(false); }}>Red Theme</button>
              <button className="w-full py-2 bg-gradient-to-r from-[#4B0082] to-[#FFA500] text-white rounded-full" onClick={() => { setTheme(themes.purpleOrange); setShowThemeSelector(false); }}>Purple Orange Theme</button>
            </div>
            <button className="mt-4 text-red-500" onClick={() => setShowThemeSelector(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
