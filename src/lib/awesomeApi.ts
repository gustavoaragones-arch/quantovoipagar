const FALLBACK_USD_BRL = 5.5;

export const USD_BRL_API =
  'https://economia.awesomeapi.com.br/json/last/USD-BRL';

export { FALLBACK_USD_BRL };

type AwesomeApiQuote = {
  bid?: string | number;
  ask?: string | number;
};

type AwesomeApiUsdBrlResponse = {
  USDBRL?: AwesomeApiQuote;
};

function parseQuoteValue(raw: string | number | undefined): number | null {
  if (raw === undefined || raw === null) return null;
  const rate =
    typeof raw === 'number' ? raw : Number(String(raw).replace(',', '.'));
  if (!Number.isFinite(rate) || rate <= 0) return null;
  return rate;
}

/** Parse USD/BRL from AwesomeAPI `/last/USD-BRL` — uses `USDBRL.bid`, then `USDBRL.ask`. */
export function parseUsdBrlFromAwesomeApi(data: unknown): number | null {
  if (!data || typeof data !== 'object') return null;

  const quote = (data as AwesomeApiUsdBrlResponse).USDBRL;
  if (!quote || typeof quote !== 'object') return null;

  return parseQuoteValue(quote.bid) ?? parseQuoteValue(quote.ask);
}

export function getSafeExchangeRate(rate: number): number {
  return Number.isFinite(rate) && rate > 0 ? rate : FALLBACK_USD_BRL;
}
