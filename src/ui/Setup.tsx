import InputField from '../components/InputField';

type SetupProps = {
  tablesInput: string;
  setTablesInput: (value: string) => void;
  rangeFrom: number;
  setRangeFrom: (value: number) => void;
  rangeTo: number;
  setRangeTo: (value: number) => void;
  repeatErrors: boolean;
  setRepeatErrors: (value: boolean) => void;
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
    onStart,
  } = props;

  return (
    <section className="space-y-4 bg-white/60 dark:bg-white/5 rounded-xl p-4 shadow-sm ring-1 ring-gray-200 dark:ring-white/10">
      <InputField
        label="Tablas"
        value={tablesInput}
        onChange={e => setTablesInput(e.target.value)}
        placeholder="e.g., 2,3,5-7"
        description="Acepta listas y rangos. Ejemplos: 2,3,5-7"
      />

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

      <label className="inline-flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={repeatErrors}
          onChange={e => setRepeatErrors(e.target.checked)}
          className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
        />
        Repetir errores hasta acertarlos
      </label>

      <div className="flex justify-end">
        <button
          onClick={onStart}
          className="mt-2 w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-white font-medium shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Comenzar
        </button>
      </div>
    </section>
  );
}

