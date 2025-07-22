/**
 * Text-to-speech player utility
 */

// Keep track of current utterance
let currentUtterance: SpeechSynthesisUtterance | null = null;

/**
 * Play text using text-to-speech
 */
export const playTextToSpeech = (text: string, options?: {
  volume?: number;
  rate?: number;
  pitch?: number;
  lang?: string;
  onEnd?: () => void;
}) => {
  // Check if browser supports speech synthesis
  if (!('speechSynthesis' in window)) {
    console.warn('Text-to-speech is not supported in this browser');
    return;
  }
  
  // Cancel any ongoing speech
  stopTextToSpeech();
  
  // Create new utterance
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set options
  utterance.volume = options?.volume ?? 1;
  utterance.rate = options?.rate ?? 1;
  utterance.pitch = options?.pitch ?? 1;
  utterance.lang = options?.lang ?? 'en-US';
  
  // Set end callback if provided
  if (options?.onEnd) {
    utterance.onend = options.onEnd;
  }
  
  // Store current utterance
  currentUtterance = utterance;
  
  // Play speech
  window.speechSynthesis.speak(utterance);
};

/**
 * Stop any currently playing text-to-speech
 */
export const stopTextToSpeech = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
};

/**
 * Check if text-to-speech is currently speaking
 */
export const isSpeaking = (): boolean => {
  if ('speechSynthesis' in window) {
    return window.speechSynthesis.speaking;
  }
  return false;
};

/**
 * Get voices available for speech synthesis
 */
export const getAvailableVoices = (): SpeechSynthesisVoice[] => {
  if ('speechSynthesis' in window) {
    return window.speechSynthesis.getVoices();
  }
  return [];
};
