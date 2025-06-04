import { useState, useEffect, useRef, useCallback } from 'react';

export interface VoiceflowConfig {
  theme?: 'light' | 'dark';
  position?: 'bottom-right' | 'bottom-left';
  enableTTS?: boolean;
  enableSTT?: boolean;
}

export interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

const VF_API_KEY = "VF.DM.68378e0864942d33c0a5b025.KuOIdUYFKP5uhSVe";
const VF_USER_ID = "D8na9Dxno2";
const VF_URL = `https://general-runtime.voiceflow.com/state/user/${VF_USER_ID}/interact?logs=off`;

const DEFAULT_CONFIG: VoiceflowConfig = {
  theme: 'light',
  position: 'bottom-right',
  enableTTS: true,
  enableSTT: true
};

export const useVoiceflowWidget = (userConfig: VoiceflowConfig = {}) => {
  const config = { ...DEFAULT_CONFIG, ...userConfig };
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [speechRecognition, setSpeechRecognition] = useState<any>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const handleSendMessageRef = useRef<((messageText?: string, actionType?: 'text' | 'launch') => Promise<void>) | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        synthRef.current = window.speechSynthesis;
        setSpeechSynthesis(window.speechSynthesis);
      }
      if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'es-ES';
        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputValue(transcript);
          setIsListening(false);
        };
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event: any) => setIsListening(false);
        recognitionRef.current = recognition;
        setSpeechRecognition(recognition);
      }
    }
    return () => {
      if (synthRef.current) synthRef.current.cancel();
      if (recognitionRef.current && isListening) recognitionRef.current.stop();
      currentUtteranceRef.current = null;
    };
  }, []);

  const cleanTextForSpeech = (text: string): string => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/#{1,6}\s/g, '')
      .replace(/\`([^\`]+)\`/g, '$1')
      .replace(/[\*\-\+]\s/g, '')
      .replace(/\n\s*\n/g, '. ')
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const speakText = useCallback((text: string) => {
    if (!synthRef.current || !config.enableTTS) return;
    const cleanText = cleanTextForSpeech(text);
    if (!cleanText.trim()) return;
    if (currentUtteranceRef.current) {
      synthRef.current.cancel();
      currentUtteranceRef.current = null;
    }
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      currentUtteranceRef.current = utterance;
      setIsSpeaking(true);
      utterance.onstart = () => {};
      utterance.onend = () => {
        setIsSpeaking(false);
        currentUtteranceRef.current = null;
      };
      utterance.onerror = (event) => {
        setIsSpeaking(false);
        currentUtteranceRef.current = null;
      };
      synthRef.current.speak(utterance);
    }, 50);
  }, [config.enableTTS]);

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      currentUtteranceRef.current = null;
    }
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && config.enableSTT && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {}
    }
  }, [isListening, config.enableSTT]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const handleSendMessage = useCallback(async (messageText: string = '', actionType: 'text' | 'launch' = 'text') => {
    const textToSend = messageText || inputValue.trim();
    if (actionType === 'text' && !textToSend) return;
    try {
      setIsLoading(true);
      if (actionType === 'text') {
        const userMessage: Message = {
          id: Date.now().toString(),
          type: 'user',
          content: textToSend,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
      }
      const requestBody = actionType === 'launch' 
        ? { action: { type: 'launch' } }
        : { action: { type: 'text', payload: textToSend } };
      const response = await fetch(VF_URL, {
        method: 'POST',
        headers: {
          'Authorization': VF_API_KEY,
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data && Array.isArray(data)) {
        data.forEach((item: any) => {
          if (item.type === 'text' && item.payload?.message) {
            const botMessage: Message = {
              id: (Date.now() + Math.random()).toString(),
              type: 'bot',
              content: item.payload.message,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, botMessage]);
            if (config.enableTTS && item.payload.message.length > 10) {
              setTimeout(() => {
                if (synthRef.current && !synthRef.current.speaking) {
                  speakText(item.payload.message);
                }
              }, 150);
            }
          }
        });
      }
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta nuevamente.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, config.enableTTS, speakText]);

  useEffect(() => {
    handleSendMessageRef.current = handleSendMessage;
  }, [handleSendMessage]);

  useEffect(() => {
    if (isOpen && !hasInitialized) {
      const initializeWidget = async () => {
        await handleSendMessage('', 'launch');
        setHasInitialized(true);
      };
      setTimeout(initializeWidget, 500);
    }
  }, [isOpen, hasInitialized, handleSendMessage]);

  return {
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
    speechSynthesis,
    speechRecognition,
    speakText,
    stopSpeaking,
    startListening,
    stopListening
  };
}; 