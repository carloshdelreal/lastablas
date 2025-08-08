import type { Language } from './translations';

// Speech utility using Web Speech API
export class SpeechService {
  private speechSynthesis: SpeechSynthesis | null = null;
  private utterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if ('speechSynthesis' in window) {
      this.speechSynthesis = window.speechSynthesis;
    }
  }

  speak(text: string, language: Language = 'es'): void {
    if (!this.speechSynthesis) {
      console.warn('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    this.speechSynthesis.cancel();

    // Create new utterance
    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.lang = language === 'es' ? 'es-ES' : 'en-US';
    this.utterance.rate = 0.8; // Slightly slower for better clarity
    this.utterance.pitch = 1;
    this.utterance.volume = 1;

    // Speak the text
    this.speechSynthesis.speak(this.utterance);
  }

  stop(): void {
    if (this.speechSynthesis) {
      this.speechSynthesis.cancel();
    }
  }

  isSupported(): boolean {
    return 'speechSynthesis' in window;
  }
}

// Create a singleton instance
export const speechService = new SpeechService(); 