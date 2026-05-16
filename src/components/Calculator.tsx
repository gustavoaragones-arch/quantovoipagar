import { useCallback, useEffect, useMemo, useState } from 'react';
import { getCategoryFromPath } from '../config/categoryRoutes';
import {
  BRAZILIAN_STATES,
  calculateImport,
  compareWithBrazilPrice,
  type ImportCalculation,
} from '../logic/taxRules';
import { CurrencyInput } from './CurrencyInput';
import {
  QUICK_PRESETS,
  QuickPresets,
  type QuickPreset,
} from './QuickPresets';
import { Receipt } from './Receipt';

const USD_BRL_API =
  'https://economia.awesomeapi.com.br/json/last/USD-BRL';
const FALLBACK_USD_BRL = 5.5;

const EMPTY_RESULT: ImportCalculation = {
  cifValue: 0,
  federalTaxRate: 0,
  federalTaxTotal: 0,
  icmsRate: 0.17,
  icmsTotal: 0,
  postalFee: 16,
  totalUsd: 0,
  totalBRL: 16,
};

export function Calculator() {
  const [productPrice, setProductPrice] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [state, setState] = useState('SP');
  const [remessaConforme, setRemessaConforme] = useState(true);
  const [usdToBrl, setUsdToBrl] = useState(FALLBACK_USD_BRL);
  const [rateStatus, setRateStatus] = useState<'loading' | 'live' | 'fallback'>(
    'loading',
  );
  const [compareBrazil, setCompareBrazil] = useState(false);
  const [brazilPrice, setBrazilPrice] = useState(0);
  const [activePresetId, setActivePresetId] = useState<string>();

  useEffect(() => {
    const controller = new AbortController();

    async function fetchRate() {
      try {
        const response = await fetch(USD_BRL_API, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('rate fetch failed');

        const data = (await response.json()) as {
          USDBRL?: { bid?: string };
        };
        const bid = Number(data.USDBRL?.bid);
        if (!Number.isFinite(bid) || bid <= 0) throw new Error('invalid bid');

        setUsdToBrl(bid);
        setRateStatus('live');
      } catch {
        if (controller.signal.aborted) return;
        setUsdToBrl(FALLBACK_USD_BRL);
        setRateStatus('fallback');
      }
    }

    fetchRate();
    return () => controller.abort();
  }, []);

  const result = useMemo(
    () =>
      calculateImport(
        productPrice,
        shipping,
        state,
        remessaConforme,
        usdToBrl,
      ),
    [productPrice, shipping, state, remessaConforme, usdToBrl],
  );

  const displayResult =
    productPrice > 0 || shipping > 0 ? result : EMPTY_RESULT;

  const brazilComparison = useMemo(() => {
    if (!compareBrazil) return null;
    return compareWithBrazilPrice(brazilPrice, displayResult.totalBRL);
  }, [compareBrazil, brazilPrice, displayResult.totalBRL]);

  const applyPreset = useCallback((preset: QuickPreset) => {
    setActivePresetId(preset.id);
    setProductPrice(preset.priceUsd);
    setShipping(0);
    setRemessaConforme(preset.remessaConforme);
  }, []);

  useEffect(() => {
    const category = getCategoryFromPath(window.location.pathname);
    if (!category) return;

    const preset = QUICK_PRESETS.find((p) => p.id === category.presetId);
    if (preset) applyPreset(preset);

    document.title = category.title;

    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', category.description);
  }, [applyPreset]);

  return (
    <div className="calculator-layout">
      <section className="calculator" aria-label="Calculadora de importação">
        <header className="calculator-header">
          <h1>Quanto vou pagar?</h1>
          <p className="calculator-subtitle">
            Calcule impostos de importação dos EUA para o Brasil em tempo real.
          </p>
          <p className="rate-badge" data-status={rateStatus}>
            {rateStatus === 'loading' && 'Atualizando câmbio USD → BRL…'}
            {rateStatus === 'live' &&
              `Câmbio ao vivo: 1 USD = ${usdToBrl.toFixed(4)} BRL`}
            {rateStatus === 'fallback' &&
              `Câmbio estimado: 1 USD = ${usdToBrl.toFixed(4)} BRL`}
          </p>
        </header>

        <form className="calculator-form" onSubmit={(e) => e.preventDefault()}>
          <div className="calculator-fold">
            <CurrencyInput
              id="product-price"
              label="Valor do Produto (USD)"
              value={productPrice}
              onChange={(value) => {
                setActivePresetId(undefined);
                setProductPrice(value);
              }}
              required
            />

            <QuickPresets onSelect={applyPreset} activeId={activePresetId} />
          </div>

          <CurrencyInput
            id="shipping"
            label="Valor do Frete + Seguro (USD)"
            value={shipping}
            onChange={setShipping}
          />

          <div className="field">
            <label htmlFor="state">
              Estado de Destino <span className="required">*</span>
            </label>
            <select
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            >
              {BRAZILIAN_STATES.map(({ uf, name }) => (
                <option key={uf} value={uf}>
                  {uf} — {name}
                </option>
              ))}
            </select>
          </div>

          <fieldset className="field remessa-toggle">
            <legend>Site cadastrado no Remessa Conforme?</legend>
            <div className="toggle-group" role="radiogroup">
              <label>
                <input
                  type="radio"
                  name="remessa-conforme"
                  checked={remessaConforme}
                  onChange={() => setRemessaConforme(true)}
                />
                Sim
              </label>
              <label>
                <input
                  type="radio"
                  name="remessa-conforme"
                  checked={!remessaConforme}
                  onChange={() => setRemessaConforme(false)}
                />
                Não
              </label>
            </div>
            <p className="field-hint">
              {remessaConforme
                ? 'Compras até US$ 50 estão isentas do imposto federal (MP 1.357/2026).'
                : 'Aplica-se 60% de imposto de importação sobre o CIF, independente do valor.'}
            </p>
          </fieldset>

          <fieldset className="field compare-brazil">
            <legend className="compare-brazil-legend">
              <label className="compare-brazil-toggle">
                <input
                  type="checkbox"
                  checked={compareBrazil}
                  onChange={(e) => setCompareBrazil(e.target.checked)}
                />
                Comparar com Preço no Brasil
              </label>
            </legend>
            {compareBrazil && (
              <CurrencyInput
                id="brazil-price"
                label="Preço no Brasil (ex.: Mercado Livre)"
                value={brazilPrice}
                onChange={setBrazilPrice}
                currency="BRL"
              />
            )}
          </fieldset>
        </form>
      </section>

      <Receipt
        result={displayResult}
        usdToBrl={usdToBrl}
        remessaConforme={remessaConforme}
        state={state}
        productPrice={productPrice}
        brazilComparison={brazilComparison}
      />
    </div>
  );
}
