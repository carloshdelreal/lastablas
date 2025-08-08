import InputField from '../components/InputField';
import { parseTables } from '../game/logic';
import { useState } from 'react';
import { speechService } from '../utils/speech';

type SetupProps = {
  tablesInput: string;
  setTablesInput: (value: string) => void;
  rangeFrom: number;
  setRangeFrom: (value: number) => void;
  rangeTo: number;
  setRangeTo: (value: number) => void;
  repeatErrors: boolean;
  setRepeatErrors: (value: boolean) => void;
  voiceEnabled: boolean;
  setVoiceEnabled: (value: boolean) => void;
  onStart: () => void;
};

export default function Setup(props: SetupProps): JSX.Element {
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
    onStart,
  } = props;

  const [showError, setShowError] = useState(false);

  // Parse current tables input to get selected tables
  const selectedTables = parseTables(tablesInput);

  const toggleTable = (tableNumber: number) => {
    const isSelected = selectedTables.includes(tableNumber);
    let newTables: number[];
    
    if (isSelected) {
      // Remove table
      newTables = selectedTables.filter(t => t !== tableNumber);
    } else {
      // Add table
      newTables = [...selectedTables, tableNumber].sort((a, b) => a - b);
    }
    
    // Convert back to string format
    const newTablesInput = newTables.length > 0 ? newTables.join(',') : '';
    setTablesInput(newTablesInput);
    
    // Hide error when user selects a table
    if (newTables.length > 0) {
      setShowError(false);
    }
  };

  const handleStart = () => {
    if (selectedTables.length === 0) {
      setShowError(true);
      return;
    }
    onStart();
  };

  return (
    <section className="space-y-4 bg-white/60 dark:bg-white/5 rounded-xl p-4 shadow-sm ring-1 ring-gray-200 dark:ring-white/10">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tablas disponibles
        </label>
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 10 }, (_, i) => i + 1).map(tableNumber => {
            const isSelected = selectedTables.includes(tableNumber);
            return (
              <button
                key={tableNumber}
                onClick={() => toggleTable(tableNumber)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {tableNumber}
              </button>
            );
          })}
        </div>
        {showError && selectedTables.length === 0 && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
            Seleccione al menos una tabla por favor
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <InputField
            label="Desde"
            type="number"
            value={rangeFrom}
            onChange={e => setRangeFrom(Number(e.target.value))}
          />
        </div>
        <div>
          <InputField
            label="Hasta"
            type="number"
            value={rangeTo}
            onChange={e => setRangeTo(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={repeatErrors}
            onChange={e => setRepeatErrors(e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
          />
          Repetir errores hasta acertarlos
        </label>
        
        {speechService.isSupported() && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Activar voz
            </span>
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                voiceEnabled
                  ? 'bg-indigo-600'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  voiceEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleStart}
          className="mt-2 w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-white font-medium shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Comenzar
        </button>
      </div>
    </section>
  );
}

