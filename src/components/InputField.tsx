import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes } from 'react';

type InputFieldProps = {
  label: string;
  description?: string;
  containerClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  id?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const defaultInputClasses =
  'w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500';

const defaultLabelClasses = 'block text-sm font-medium mb-1';
const defaultDescriptionClasses = 'mt-1 text-xs text-gray-500';

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      description,
      containerClassName,
      inputClassName,
      labelClassName,
      descriptionClassName,
      id,
      ...inputProps
    },
    ref
  ) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const descriptionId = description ? `${inputId}-desc` : undefined;

    return (
      <div className={containerClassName}>
        <label htmlFor={inputId} className={labelClassName ?? defaultLabelClasses}>
          {label}
        </label>
        <input
          id={inputId}
          ref={ref}
          aria-describedby={descriptionId}
          className={inputClassName ?? defaultInputClasses}
          {...inputProps}
        />
        {description ? (
          <p id={descriptionId} className={descriptionClassName ?? defaultDescriptionClasses}>
            {description}
          </p>
        ) : null}
      </div>
    );
  }
);

InputField.displayName = 'InputField';

export default InputField;

