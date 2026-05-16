import type { ImportCalculation } from './taxRules';

export type TrafficLightStatus = 'green' | 'yellow' | 'red';

const MESSAGES: Record<TrafficLightStatus, string> = {
  green: 'Custo justo para importação',
  yellow: 'Carga tributária padrão',
  red: 'Custo tributário elevado',
};

export function getTaxBurdenRatio(
  productPrice: number,
  result: Pick<ImportCalculation, 'cifValue' | 'federalTaxTotal' | 'icmsTotal'>,
): number {
  const { cifValue, federalTaxTotal, icmsTotal } = result;
  const denominator = productPrice > 0 ? productPrice : cifValue;
  if (denominator <= 0) return 0;
  return (federalTaxTotal + icmsTotal) / denominator;
}

export function getTrafficLightStatus(
  productPrice: number,
  result: Pick<ImportCalculation, 'cifValue' | 'federalTaxTotal' | 'icmsTotal'>,
): TrafficLightStatus {
  const ratio = getTaxBurdenRatio(productPrice, result);

  if (ratio < 0.3) return 'green';
  if (ratio <= 0.7) return 'yellow';
  if (ratio > 0.8) return 'red';
  return 'yellow';
}

export function getTrafficLightMessage(status: TrafficLightStatus): string {
  return MESSAGES[status];
}
