import {
  useCallback,
  useId,
  useState,
  type ChangeEvent,
} from 'react';

type CurrencyInputProps = {
  id?: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  currency?: 'USD' | 'BRL';
  required?: boolean;
};

function formatDisplay(value: number, currency: 'USD' | 'BRL'): string {
  if (value === 0) return '';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function parseInput(raw: string): number {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return 0;
  return Number(digits) / 100;
}

export function CurrencyInput({
  id: idProp,
  label,
  value,
  onChange,
  currency = 'USD',
  required = false,
}: CurrencyInputProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState('');

  const displayValue = focused ? draft : formatDisplay(value, currency);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const next = parseInput(event.target.value);
      setDraft(event.target.value);
      onChange(next);
    },
    [onChange],
  );

  const handleFocus = useCallback(() => {
    setFocused(true);
    setDraft(value > 0 ? formatDisplay(value, currency) : '');
  }, [value, currency]);

  const handleBlur = useCallback(() => {
    setFocused(false);
    setDraft('');
  }, []);

  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {required && <span className="required"> *</span>}
      </label>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        required={required}
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={currency === 'USD' ? 'US$ 0,00' : 'R$ 0,00'}
      />
    </div>
  );
}
