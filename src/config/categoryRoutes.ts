export type CategorySlug =
  | 'iphone'
  | 'playstation'
  | 'suplementos'
  | 'tenis';

export type CategoryRoute = {
  presetId: string;
  title: string;
  description: string;
};

export const CATEGORY_ROUTES: Record<CategorySlug, CategoryRoute> = {
  iphone: {
    presetId: 'iphone',
    title: 'Imposto de Importação iPhone — Quanto Vou Pagar?',
    description:
      'Calcule o imposto de importação do iPhone dos EUA para o Brasil. Estimativa em tempo real com MP 1.357/2026.',
  },
  playstation: {
    presetId: 'ps5',
    title: 'Imposto de Importação PlayStation — Quanto Vou Pagar?',
    description:
      'Calcule quanto você paga de taxa ao importar PlayStation 5 dos EUA para o Brasil.',
  },
  suplementos: {
    presetId: 'supplements',
    title: 'Imposto de Importação Suplementos — Quanto Vou Pagar?',
    description:
      'Calcule impostos na importação de suplementos (Remessa Conforme) dos EUA para o Brasil.',
  },
  tenis: {
    presetId: 'shoes',
    title: 'Imposto de Importação Tênis — Quanto Vou Pagar?',
    description:
      'Calcule o imposto de importação de tênis comprados nos EUA para o Brasil.',
  },
};

export function getCategoryFromPath(pathname: string): CategoryRoute | null {
  const slug = pathname.replace(/^\/+|\/+$/g, '') as CategorySlug;
  return CATEGORY_ROUTES[slug] ?? null;
}
