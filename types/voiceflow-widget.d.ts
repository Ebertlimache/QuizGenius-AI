// Declaraciones de tipos globales para Voiceflow Widget
declare global {
  interface Window {
    VoiceflowWidget: {
      init: (config: VoiceflowWidgetConfig) => VoiceflowWidgetInstance;
      destroy: () => void;
    };
    vfWidgetInstance: VoiceflowWidgetInstance | null;
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export interface VoiceflowWidgetConfig {
  apiKey?: string;
  userId?: string;
  endpoint?: string;
  theme?: 'light' | 'dark';
  position?: 'bottom-right' | 'bottom-left';
}

export interface VoiceflowWidgetInstance {
  config: VoiceflowWidgetConfig;
  userId: string;
  isOpen: boolean;
  messages: Array<{
    id: string;
    type: 'user' | 'bot';
    content: string;
    timestamp: Date;
  }>;
  isLoading: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  audioEnabled: boolean;
  volume: number;
  speechRate: number;
  container: HTMLElement;
  toggleChat: () => void;
  closeChat: () => void;
  sendMessage: () => void;
  toggleListening: () => void;
  toggleAudio: () => void;
  speakText: (text: string) => void;
}

// Declaraciones para APIs de voz del navegador
export interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

export interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
  isFinal: boolean;
}

export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

export interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

export interface SpeechSynthesisErrorEvent extends Event {
  error: string;
  charIndex?: number;
  charLength?: number;
  elapsedTime?: number;
  name?: string;
  utterance: SpeechSynthesisUtterance;
}

export {}; 