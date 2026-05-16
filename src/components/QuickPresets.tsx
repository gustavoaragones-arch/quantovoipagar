export type QuickPreset = {
  id: string;
  label: string;
  priceUsd: number;
  remessaConforme: boolean;
};

export const QUICK_PRESETS: QuickPreset[] = [
  { id: 'iphone', label: 'iPhone 16', priceUsd: 799, remessaConforme: false },
  { id: 'ps5', label: 'PlayStation 5', priceUsd: 499, remessaConforme: false },
  { id: 'supplements', label: 'Suplementos', priceUsd: 45, remessaConforme: true },
  { id: 'shoes', label: 'Tênis', priceUsd: 120, remessaConforme: false },
];

type QuickPresetsProps = {
  onSelect: (preset: QuickPreset) => void;
  activeId?: string;
};

export function QuickPresets({ onSelect, activeId }: QuickPresetsProps) {
  return (
    <div className="quick-presets">
      <p className="quick-presets-label">Preencher rápido</p>
      <div className="quick-presets-list" role="group" aria-label="Produtos populares">
        {QUICK_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            className={`quick-preset-btn${activeId === preset.id ? ' quick-preset-btn--active' : ''}`}
            onClick={() => onSelect(preset)}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
