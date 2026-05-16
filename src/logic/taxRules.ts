/**
 * ICMS: Convênio ICMS 81/2023 + 135/2024 (Remessa Conforme).
 * Federal import tax under US$50 (Remessa Conforme): 0% per MP 1.357/2026 (12/05/2026).
 */
export const TAX_CONSTANTS = {
  FEDERAL_TAX_THRESHOLD: 50.0,
  FEDERAL_TAX_OVER_50: 0.6,
  /** Revogação da "Taxa das Blusinhas" — 0% de II até US$ 50 CIF (Remessa Conforme). */
  FEDERAL_TAX_UNDER_50: 0.0,
  FEDERAL_TAX_NON_RC: 0.6,
  FIXED_POSTAL_FEE: 16.0,
  ICMS_DEFAULT: 0.17,
  ICMS_STATES: {
    AC: 0.2,
    AL: 0.2,
    AP: 0.17,
    AM: 0.17,
    BA: 0.2,
    CE: 0.2,
    DF: 0.17,
    ES: 0.17,
    GO: 0.17,
    MA: 0.17,
    MT: 0.17,
    MS: 0.17,
    MG: 0.2,
    PA: 0.17,
    PB: 0.2,
    PR: 0.17,
    PE: 0.17,
    PI: 0.2,
    RJ: 0.17,
    RN: 0.2,
    RS: 0.17,
    RO: 0.17,
    RR: 0.2,
    SC: 0.17,
    SP: 0.17,
    SE: 0.2,
    TO: 0.17,
  } as Record<string, number>,
} as const;

export const BRAZILIAN_STATES = [
  { uf: 'AC', name: 'Acre' },
  { uf: 'AL', name: 'Alagoas' },
  { uf: 'AP', name: 'Amapá' },
  { uf: 'AM', name: 'Amazonas' },
  { uf: 'BA', name: 'Bahia' },
  { uf: 'CE', name: 'Ceará' },
  { uf: 'DF', name: 'Distrito Federal' },
  { uf: 'ES', name: 'Espírito Santo' },
  { uf: 'GO', name: 'Goiás' },
  { uf: 'MA', name: 'Maranhão' },
  { uf: 'MT', name: 'Mato Grosso' },
  { uf: 'MS', name: 'Mato Grosso do Sul' },
  { uf: 'MG', name: 'Minas Gerais' },
  { uf: 'PA', name: 'Pará' },
  { uf: 'PB', name: 'Paraíba' },
  { uf: 'PR', name: 'Paraná' },
  { uf: 'PE', name: 'Pernambuco' },
  { uf: 'PI', name: 'Piauí' },
  { uf: 'RJ', name: 'Rio de Janeiro' },
  { uf: 'RN', name: 'Rio Grande do Norte' },
  { uf: 'RS', name: 'Rio Grande do Sul' },
  { uf: 'RO', name: 'Rondônia' },
  { uf: 'RR', name: 'Roraima' },
  { uf: 'SC', name: 'Santa Catarina' },
  { uf: 'SP', name: 'São Paulo' },
  { uf: 'SE', name: 'Sergipe' },
  { uf: 'TO', name: 'Tocantins' },
] as const;

export type ImportCalculation = {
  cifValue: number;
  federalTaxRate: number;
  federalTaxTotal: number;
  icmsRate: number;
  icmsTotal: number;
  postalFee: number;
  totalUsd: number;
  totalBRL: number;
};

export function getIcmsRate(state: string): number {
  return TAX_CONSTANTS.ICMS_STATES[state] ?? TAX_CONSTANTS.ICMS_DEFAULT;
}

export function calculateImport(
  productPrice: number,
  shipping: number,
  state: string,
  remessaConforme: boolean,
  usdToBrl = 1,
): ImportCalculation {
  const cifValue = Math.max(0, productPrice) + Math.max(0, shipping);
  const isBelowThreshold = cifValue <= TAX_CONSTANTS.FEDERAL_TAX_THRESHOLD;

  const federalTaxRate = remessaConforme
    ? isBelowThreshold
      ? TAX_CONSTANTS.FEDERAL_TAX_UNDER_50
      : TAX_CONSTANTS.FEDERAL_TAX_OVER_50
    : TAX_CONSTANTS.FEDERAL_TAX_NON_RC;

  const federalTaxTotal = cifValue * federalTaxRate;

  const icmsRate = getIcmsRate(state);
  const icmsTotal =
    ((cifValue + federalTaxTotal) / (1 - icmsRate)) * icmsRate;

  const postalFee = TAX_CONSTANTS.FIXED_POSTAL_FEE;
  const totalUsd = cifValue + federalTaxTotal + icmsTotal;
  const totalBRL = totalUsd * usdToBrl + postalFee;

  return {
    cifValue,
    federalTaxRate,
    federalTaxTotal,
    icmsRate,
    icmsTotal,
    postalFee,
    totalUsd,
    totalBRL,
  };
}

export type BrazilComparison = {
  brazilPriceBRL: number;
  importTotalBRL: number;
  savingsBRL: number;
  importingIsCheaper: boolean;
};

/** Compare landed import cost (BRL) vs local retail price (BRL). */
export function compareWithBrazilPrice(
  brazilPriceBRL: number,
  importTotalBRL: number,
): BrazilComparison | null {
  if (brazilPriceBRL <= 0) return null;

  const savingsBRL = brazilPriceBRL - importTotalBRL;

  return {
    brazilPriceBRL,
    importTotalBRL,
    savingsBRL,
    importingIsCheaper: savingsBRL > 0,
  };
}

export function formatBrl(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatUsd(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

export type ShareSummaryInput = {
  productPriceUsd: number;
  totalBRL: number;
  savingsBRL?: number;
};

export function buildShareSummary({
  productPriceUsd,
  totalBRL,
  savingsBRL,
}: ShareSummaryInput): string {
  const lines = [
    '📊 Taxa de Importação (quantovoupagar.com)',
    `Produto: ${formatUsd(productPriceUsd)}`,
    `Total com Impostos: ${formatBrl(totalBRL)}`,
  ];

  if (savingsBRL !== undefined && savingsBRL > 0) {
    lines.push(`Economia: ${formatBrl(savingsBRL)} vs Brasil!`);
  }

  return lines.join('\n');
}
