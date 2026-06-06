export type Language = 'es' | 'en';

export interface Translations {
  // App
  title: string;
  subtitle: string;
  
  // Setup
  availableTables: string;
  selectAtLeastOneTable: string;
  from: string;
  to: string;
  repeatErrors: string;
  easyMode: string;
  activateVoice: string;
  start: string;
  
  // Game
  progress: string;
  voice: string;
  correctAnswers: string;
  yourAnswer: string;
  answer: string;
  lastAnswer: string;
  correct: string;
  incorrect: string;
  
  // Summary
  summary: string;
  questions: string;
  accuracy: string;
  completedIn: string;
  minute: string;
  minutes: string;
  second: string;
  seconds: string;
  question: string;
  yourResponse: string;
  result: string;
  practiceAnotherTable: string;
  repeat: string;
  
  // Voice feedback
  error: string;
}

export const translations: Record<Language, Translations> = {
  es: {
    // App
    title: '🧮 Las Tablas',
    subtitle: '✨ Practica las tablas de multiplicar de forma divertida',
    
    // Setup
    availableTables: '🎯 Tablas disponibles',
    selectAtLeastOneTable: '⚠️ Seleccione al menos una tabla por favor',
    from: '📊 Desde',
    to: '📈 Hasta',
    repeatErrors: '🔄 Repetir errores hasta acertarlos',
    easyMode: '😌 Modo fácil (tablas en orden)',
    activateVoice: '🎤 Activar voz',
    start: '🚀 Comenzar',
    
    // Game
    progress: '📊 Progreso',
    voice: '🎤 Voz',
    correctAnswers: '🎯 Aciertos',
    yourAnswer: 'Tu respuesta',
    answer: '🎯 Responder',
    lastAnswer: '📝 Última respuesta',
    correct: '✅ Correcta',
    incorrect: '❌ Incorrecta',
    
    // Summary
    summary: '📊 Resumen',
    questions: '🎯 Preguntas',
    accuracy: '📈 Precisión',
    completedIn: '⏱️ Lo completaste en',
    minute: 'minuto',
    minutes: 'minutos',
    second: 'segundo',
    seconds: 'segundos',
    question: '❓ Pregunta',
    yourResponse: '✏️ Tu respuesta',
    result: '🎯 Resultado',
    practiceAnotherTable: '🎯 Practica otra tabla',
    repeat: '🔄 Repetir',
    
    // Voice feedback
    error: 'error',
  },
  en: {
    // App
    title: '🧮 Multiplication Tables',
    subtitle: '✨ Practice multiplication tables in a fun way',
    
    // Setup
    availableTables: '🎯 Available Tables',
    selectAtLeastOneTable: '⚠️ Please select at least one table',
    from: '📊 From',
    to: '📈 To',
    repeatErrors: '🔄 Repeat errors until correct',
    easyMode: '😌 Easy mode (tables in order)',
    activateVoice: '🎤 Activate voice',
    start: '🚀 Start',
    
    // Game
    progress: '📊 Progress',
    voice: '🎤 Voice',
    correctAnswers: '🎯 Correct',
    yourAnswer: 'Your answer',
    answer: '🎯 Answer',
    lastAnswer: '📝 Last answer',
    correct: '✅ Correct',
    incorrect: '❌ Incorrect',
    
    // Summary
    summary: '📊 Summary',
    questions: '🎯 Questions',
    accuracy: '📈 Accuracy',
    completedIn: '⏱️ You completed it in',
    minute: 'minute',
    minutes: 'minutes',
    second: 'second',
    seconds: 'seconds',
    question: '❓ Question',
    yourResponse: '✏️ Your response',
    result: '🎯 Result',
    practiceAnotherTable: '🎯 Practice another table',
    repeat: '🔄 Repeat',
    
    // Voice feedback
    error: 'error',
  },
};

export function getTranslation(language: Language): Translations {
  return translations[language];
}

export function formatDuration(ms: number, language: Language): string {
  const t = translations[language];
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const secondsPart = `${seconds} ${seconds === 1 ? t.second : t.seconds}`;
  if (minutes > 0) {
    const minutesPart = `${minutes} ${minutes === 1 ? t.minute : t.minutes}`;
    return `${minutesPart} ${secondsPart}`;
  }
  return secondsPart;
} 