/** Replace with live affiliate URLs before production launch. */
export const AFFILIATES = {
  usCloser: {
    label: 'Enviar para o Brasil via UsCloser',
    href: 'https://www.uscloser.com/?ref=quantovoupagar',
  },
  nomad: {
    label: 'Pague com Dólar Comercial (Economize 10%)',
    href: 'https://www.nomadglobal.com/?ref=quantovoupagar',
    couponCode: 'QUANTOVOUPAGAR',
    microCopy: 'Use o cupom QUANTOVOUPAGAR para ganhar cashback.',
  },
} as const;

export const SITE_URL = 'https://quantovoupagar.com';
