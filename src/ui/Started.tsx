import { type RefObject, useEffect, useState } from 'react';
import { speechService } from '../utils/speech';

type Question = {
  multiplicand: number;
  multiplier: number;
};

type Answer = {
  question: Question;
  given: string;
  correct: boolean;
};

type StartedProps = {
  current: Question;
  totalQuestions: number;
  solvedUnique: number;
  correctCount: number;
  answers: Answer[];
  answer: string;
  setAnswer: (value: string) => void;
  onSubmit: () => void;
  inputRef: RefObject<HTMLInputElement>;
  voiceEnabled?: boolean;
};

export default function Started(props: StartedProps): JSX.Element {
  const {
    current,
    totalQuestions,
    solvedUnique,
    correctCount,
    answers,
    answer,
    setAnswer,
    onSubmit,
    inputRef,
    voiceEnabled = false,
  } = props;

  const [localVoiceEnabled, setLocalVoiceEnabled] = useState(voiceEnabled);

  // Update local voice state when prop changes
  useEffect(() => {
    setLocalVoiceEnabled(voiceEnabled);
  }, [voiceEnabled]);

  // Speak the question when it changes (only if voice is enabled)
  useEffect(() => {
    if (localVoiceEnabled && speechService.isSupported()) {
      const questionText = `${current.multiplicand} por ${current.multiplier}`;
      speechService.speak(questionText);
    }
  }, [current, localVoiceEnabled]);


  const handleSubmit = () => {
    // Check if the current answer is correct before submitting
    const isCorrect = current && answer.trim() !== '' && 
      Number(answer.trim()) === current.multiplicand * current.multiplier;
    
    // Provide immediate voice feedback if voice is enabled
    if (localVoiceEnabled && speechService.isSupported()) {
      if (isCorrect) {
        const result = current.multiplicand * current.multiplier;
        const feedbackText = `${current.multiplicand} por ${current.multiplier} es ${result}`;
        speechService.speak(feedbackText);
      } else {
        speechService.speak("error");
      }
    }
    
    // Call the original onSubmit
    onSubmit();
  };

  return (
    <section className="space-y-4 bg-white/60 dark:bg-white/5 rounded-xl p-4 shadow-sm ring-1 ring-gray-200 dark:ring-white/10">
      <div className="flex items-baseline justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          📊 Progreso: {solvedUnique}/{totalQuestions}
        </p>
        <div className="flex items-center gap-4">
          {speechService.isSupported() && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                🎤 Voz
              </span>
              <button
                onClick={() => setLocalVoiceEnabled(!localVoiceEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  localVoiceEnabled
                    ? 'bg-indigo-600'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localVoiceEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          )}
          <p className="text-sm">
            🎯 Aciertos:{' '}
            <span className="font-semibold text-emerald-600">{correctCount}</span>
          </p>
        </div>
      </div>
      <div className="text-center py-6">
        <div className="text-5xl font-extrabold tracking-tight">
          {current.multiplicand} × {current.multiplier} = ?
        </div>
      </div>
      <div className="flex flex-col items-center gap-3">
        <input
          inputMode="numeric"
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') handleSubmit();
          }}
          className="flex-1 rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Tu respuesta"
          ref={inputRef}
        />
        <button
          onClick={handleSubmit}
          onPointerDown={e => e.preventDefault()}
          type="button"
          className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-white font-medium shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Responder
        </button>
      </div>
      {answers.length > 0 && (
        <div className="text-sm text-gray-600 dark:text-gray-300">
          📝 Última respuesta:{' '}
          {answers[answers.length - 1].correct ? (
            <span className="text-emerald-600 font-medium">✅ Correcta</span>
          ) : (
            <span className="text-rose-600 font-medium">❌ Incorrecta</span>
          )}
        </div>
      )}
    </section>
  );
}

