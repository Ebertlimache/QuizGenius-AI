'use client';

import React, { useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Mic, MicOff, Volume2, VolumeX, CircleDot } from 'lucide-react';
import { useVoiceflowWidget, VoiceflowConfig } from '@/hooks/useVoiceflowWidget';
import './VoiceflowWidget.css';

const VoiceflowWidget: React.FC<VoiceflowConfig> = (props) => {
  const {
    isOpen,
    setIsOpen,
    messages,
    inputValue,
    setInputValue,
    isLoading,
    config,
    handleSendMessage,
    isListening,
    isSpeaking,
    speakText,
    stopSpeaking,
    startListening,
    stopListening
  } = useVoiceflowWidget(props);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTo({ top: messagesEndRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      handleSendMessage();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatMessage = (content: string) => {
    return content.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed z-50 bottom-6 right-6 h-16 w-16 rounded-full bg-black hover:bg-neutral-900 text-white shadow-2xl flex items-center justify-center transition-all duration-300 ${isOpen ? 'rotate-90' : ''}`}
        aria-label={isOpen ? 'Cerrar chat' : 'Abrir chat'}
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.35)' }}
      >
        {isOpen ? <X size={32} /> : <MessageCircle size={32} />}
      </button>

      {/* Widget del chat */}
      {isOpen && (
        <div className="voiceflow-modern-widget fixed z-40 bottom-28 right-6 w-[370px] max-w-[95vw] h-[540px] flex flex-col rounded-2xl shadow-2xl border border-neutral-800 bg-neutral-950 animate-in slide-in-from-bottom-2">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-black rounded-t-2xl border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <MessageCircle size={22} className="text-blue-500" />
              <span className="font-bold text-lg text-white tracking-wide">QuizGenius AI</span>
              <span className="ml-2 flex items-center gap-1 text-xs text-green-400 font-medium"><CircleDot size={10} className="animate-pulse" />En línea</span>
            </div>
            <div className="flex items-center gap-1">
              {config.enableSTT && (
                <button
                  type="button"
                  onClick={isListening ? stopListening : startListening}
                  className={`h-9 w-9 flex items-center justify-center rounded-full transition-all ${isListening ? 'bg-red-600/20 text-red-400 animate-pulse' : 'hover:bg-neutral-800 text-neutral-300'}`}
                  title={isListening ? 'Detener grabación' : 'Hablar'}
                >
                  {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
              )}
              {config.enableTTS && (
                <button
                  type="button"
                  onClick={isSpeaking ? stopSpeaking : () => speakText('Hola, soy tu asistente QuizGenius')}
                  className={`h-9 w-9 flex items-center justify-center rounded-full transition-all ${isSpeaking ? 'bg-green-600/20 text-green-400 animate-pulse' : 'hover:bg-neutral-800 text-neutral-300'}`}
                  title={isSpeaking ? 'Detener lectura' : 'Probar voz'}
                >
                  {isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-neutral-800 text-neutral-300"
                title="Cerrar"
              >
                <X size={18} />
              </button>
            </div>
          </div>
          {/* Mensajes */}
          <div ref={messagesEndRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-3 bg-neutral-950 custom-scrollbar">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm text-sm font-medium whitespace-pre-wrap ${message.type === 'user' ? 'bg-blue-600 text-white rounded-br-md' : 'bg-neutral-800 text-neutral-100 rounded-bl-md border border-neutral-800'}`}
                  style={{ boxShadow: message.type === 'user' ? '0 2px 8px rgba(37,99,235,0.10)' : '0 2px 8px rgba(0,0,0,0.10)' }}>
                  {formatMessage(message.content)}
                  <div className={`text-[11px] mt-1 opacity-60 ${message.type === 'user' ? 'text-blue-200' : 'text-neutral-400'}`}>{message.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-neutral-800 p-3 rounded-2xl border border-neutral-700">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-neutral-800 bg-neutral-950 rounded-b-2xl">
            <div className="flex items-center gap-2">
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje..."
                disabled={isLoading}
                className="flex-1 rounded-xl border-none bg-neutral-900 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-neutral-400 shadow-sm"
                style={{ fontSize: 15 }}
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl shadow-md transition-all disabled:opacity-60"
                style={{ fontSize: 15 }}
              >
                <Send size={18} />
              </button>
            </div>
            <div className="flex justify-between items-center mt-2 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                {isListening && (<span className="flex items-center text-red-400 font-medium animate-pulse">🎤 Escuchando...</span>)}
                {isSpeaking && (<span className="flex items-center text-green-400 font-medium animate-pulse">🔊 Reproduciendo...</span>)}
              </div>
              <div className="flex items-center gap-1">
                {config.enableSTT && <span>🎤</span>}
                {config.enableTTS && <span>🔊</span>}
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default VoiceflowWidget; 