import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AFFILIATES } from '../config/affiliates';
import type { BrazilComparison, ImportCalculation } from '../logic/taxRules';
import {
  buildShareSummary,
  formatBrl,
  formatUsd,
} from '../logic/taxRules';
import {
  getTrafficLightMessage,
  getTrafficLightStatus,
} from '../logic/trafficLight';

type ReceiptProps = {
  result: ImportCalculation;
  usdToBrl: number;
  remessaConforme: boolean;
  state: string;
  productPrice: number;
  brazilComparison: BrazilComparison | null;
};

type ReceiptRow = {
  id: string;
  label: string;
  value: string;
};

export function Receipt({
  result,
  usdToBrl,
  remessaConforme,
  state,
  productPrice,
  brazilComparison,
}: ReceiptProps) {
  const {
    cifValue,
    federalTaxRate,
    federalTaxTotal,
    icmsRate,
    icmsTotal,
    postalFee,
    totalBRL,
  } = result;

  const [icmsPulse, setIcmsPulse] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>(
    'idle',
  );
  const prevState = useRef(state);

  useEffect(() => {
    if (prevState.current !== state) {
      prevState.current = state;
      setIcmsPulse(true);
      const timer = window.setTimeout(() => setIcmsPulse(false), 700);
      return () => window.clearTimeout(timer);
    }
  }, [state]);

  const hasValues = cifValue > 0;
  const staggerKey = `${state}-${remessaConforme}-${hasValues}`;

  const trafficStatus = getTrafficLightStatus(productPrice, result);
  const trafficMessage = getTrafficLightMessage(trafficStatus);

  const rows: ReceiptRow[] = useMemo(
    () => [
      { id: 'cif', label: 'Subtotal (CIF)', value: formatUsd(cifValue) },
      {
        id: 'ii',
        label: `Imposto de Importação — I.I. (${Math.round(federalTaxRate * 100)}%)${
          remessaConforme ? '' : ' · fora RC'
        }`,
        value: formatUsd(federalTaxTotal),
      },
      {
        id: 'icms',
        label: `ICMS (${Math.round(icmsRate * 100)}%) · ${state}`,
        value: formatUsd(icmsTotal),
      },
      {
        id: 'postal',
        label: 'Despacho Postal (Correios)',
        value: formatBrl(postalFee),
      },
    ],
    [
      cifValue,
      federalTaxRate,
      federalTaxTotal,
      icmsRate,
      icmsTotal,
      postalFee,
      remessaConforme,
      state,
    ],
  );

  const shareText = useMemo(
    () =>
      buildShareSummary({
        productPriceUsd: productPrice,
        totalBRL,
        savingsBRL:
          brazilComparison?.importingIsCheaper
            ? brazilComparison.savingsBRL
            : undefined,
      }),
    [productPrice, totalBRL, brazilComparison],
  );

  const handleCopySummary = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopyStatus('copied');
      window.setTimeout(() => setCopyStatus('idle'), 2500);
    } catch {
      setCopyStatus('error');
      window.setTimeout(() => setCopyStatus('idle'), 2500);
    }
  }, [shareText]);

  return (
    <aside className="receipt" aria-live="polite" aria-atomic="false">
      <div className="receipt-paper">
        <header className="receipt-brand">
          <span className="receipt-brand-mark" aria-hidden="true">
            ★
          </span>
          <div>
            <p className="receipt-brand-name">Quanto Vou Pagar</p>
            <p className="receipt-brand-sub">Importação EUA → Brasil · 2026</p>
          </div>
        </header>

        <p className="receipt-divider" aria-hidden="true">
          - - - - - - - - - - - - - - -
        </p>

        <dl className="receipt-lines" key={staggerKey}>
          {rows.map((row, index) => (
            <div
              key={row.id}
              className={[
                'receipt-row',
                row.id === 'icms' && icmsPulse ? 'receipt-row--pulse' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              style={{ animationDelay: `${index * 0.09}s` }}
            >
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>

        <p className="receipt-divider receipt-divider--bold" aria-hidden="true">
          = = = = = = = = = = = = = = =
        </p>

        <div
          className="receipt-row receipt-total"
          style={{ animationDelay: `${rows.length * 0.09}s` }}
        >
          <dt>Total com impostos</dt>
          <dd className="receipt-total-amount">{formatBrl(totalBRL)}</dd>
        </div>

        {brazilComparison && hasValues && (
          <div
            className={`brazil-savings brazil-savings--${
              brazilComparison.importingIsCheaper ? 'win' : 'lose'
            }`}
            role="status"
          >
            {brazilComparison.importingIsCheaper ? (
              <p>
                Você economiza{' '}
                <strong>{formatBrl(brazilComparison.savingsBRL)}</strong>{' '}
                importando.
              </p>
            ) : (
              <p>
                Comprar no Brasil sai{' '}
                <strong>
                  {formatBrl(Math.abs(brazilComparison.savingsBRL))}
                </strong>{' '}
                mais barato.
              </p>
            )}
          </div>
        )}

        <div className="affiliate-rails">
          <a
            className="affiliate-btn affiliate-btn--forwarder"
            href={AFFILIATES.usCloser.href}
            target="_blank"
            rel="noopener noreferrer sponsored"
          >
            {AFFILIATES.usCloser.label}
          </a>
          <a
            className="affiliate-btn affiliate-btn--fintech"
            href={AFFILIATES.nomad.href}
            target="_blank"
            rel="noopener noreferrer sponsored"
          >
            {AFFILIATES.nomad.label}
          </a>
          <p className="affiliate-microcopy">{AFFILIATES.nomad.microCopy}</p>
        </div>

        {hasValues && (
          <div
            className={`traffic-light traffic-light--${trafficStatus}`}
            role="status"
          >
            <span className="traffic-light-dot" aria-hidden="true" />
            <span className="traffic-light-text">{trafficMessage}</span>
          </div>
        )}

        {hasValues && (
          <button
            type="button"
            className="copy-summary-btn"
            onClick={handleCopySummary}
          >
            {copyStatus === 'copied'
              ? '✓ Resumo copiado!'
              : copyStatus === 'error'
                ? 'Não foi possível copiar'
                : 'Copiar Resumo'}
          </button>
        )}

        <footer className="receipt-footer">
          <p>Câmbio: 1 USD = {usdToBrl.toFixed(4)} BRL</p>
          <p className="receipt-disclaimer">
            Estimativa educativa. Valores finais podem variar na alfândega.
          </p>
        </footer>

        <div className="receipt-tear" aria-hidden="true" />
      </div>
    </aside>
  );
}
