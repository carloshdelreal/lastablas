import { useEffect, useRef } from 'react';
import Started from './ui/Started';
import Setup from './ui/Setup';
import Summary from './ui/Summary';
import LanguageSelector from './components/LanguageSelector';
import { useGame } from './hooks/useGame';
import { getTranslation } from './utils/translations';

function App(): JSX.Element {
  const {
    tablesInput,
    setTablesInput,
    rangeFrom,
    setRangeFrom,
    rangeTo,
    setRangeTo,
    repeatErrors,
    setRepeatErrors,
    voiceEnabled,
    setVoiceEnabled,
    language,
    setLanguage,
    deck,
    current,
    answer,
    setAnswer,
    answers,
    started,
    totalQuestions,
    start,
    submit,
    reset,
  } = useGame();

  const answerInputRef = useRef<HTMLInputElement | null>(null);
  const t = getTranslation(language);

  const handleSubmit = (): void => {
    submit();
    // Re-enfocar el input para mantener abierto el teclado en móvil
    setTimeout(() => {
      answerInputRef.current?.focus();
    }, 0);
  };

  // Asegura que al cambiar de pregunta el input recupere el foco
  useEffect(() => {
    if (started) {
      answerInputRef.current?.focus();
    }
  }, [current, started]);

  const pendingUnique = (current ? 1 : 0) + deck.length;
  const solvedUnique = Math.max(0, totalQuestions - pendingUnique);
  const correctCount = answers.filter(a => a.correct).length;

  return (
    <div className="min-h-full flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <header className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
            <LanguageSelector language={language} onLanguageChange={setLanguage} voiceEnabled={voiceEnabled} />
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            {t.subtitle}
          </p>
        </header>
        {!started ? (
          <Setup
            tablesInput={tablesInput}
            setTablesInput={setTablesInput}
            rangeFrom={rangeFrom}
            setRangeFrom={setRangeFrom}
            rangeTo={rangeTo}
            setRangeTo={setRangeTo}
            repeatErrors={repeatErrors}
            setRepeatErrors={setRepeatErrors}
            voiceEnabled={voiceEnabled}
            setVoiceEnabled={setVoiceEnabled}
            language={language}
            onStart={start}
          />
        ) : current ? (
          <Started
            current={current}
            totalQuestions={totalQuestions}
            solvedUnique={solvedUnique}
            correctCount={correctCount}
            answers={answers}
            answer={answer}
            setAnswer={setAnswer}
            onSubmit={handleSubmit}
            inputRef={answerInputRef}
            voiceEnabled={voiceEnabled}
            language={language}
          />
        ) : (
          <Summary
            answers={answers}
            correctCount={correctCount}
            language={language}
            onBack={reset}
            onRepeat={start}
          />
        )}
      </div>
      <footer className="mt-10 text-xs text-gray-500">
        Hecho con ❤️ por{' '}
        <a
          href="https://carloshdelreal.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Carlos Del Real
        </a>
      </footer>
    </div>
  );
}

export default App;
