const FAQ_ITEMS = [
  {
    id: 'mp-1357',
    question: 'O que mudou com a MP 1.357/2026?',
    answer:
      'A chamada "Taxa das Blusinhas" — o adicional de 20% de imposto de importação sobre compras internacionais de até US$ 50 — foi revogada. A partir de maio de 2026, encomendas no Remessa Conforme com valor CIF (produto + frete) de até US$ 50 passam a ter alíquota federal de 0% sobre o imposto de importação. Acima desse limite, mantém-se a alíquota de 60% sobre o CIF, mais ICMS estadual e o Despacho Postal dos Correios.',
  },
  {
    id: 'icms-por-dentro',
    question: 'Por que o ICMS é calculado "por dentro"?',
    answer:
      'No Brasil, o ICMS integra sua própria base de cálculo — a técnica conhecida como "cálculo por dentro". Em vez de aplicar 17% ou 20% apenas sobre o valor do produto, a fórmula é: (CIF + Imposto de Importação) ÷ (1 − alíquota ICMS) × alíquota ICMS. Isso faz o ICMS efetivo ser maior do que a alíquota nominal sugere e explica por que o total em reais costuma surpreender quem compara com impostos calculados "por fora", como nos EUA.',
  },
  {
    id: 'despacho-postal',
    question: 'O que é o Despacho Postal de R$ 16,00?',
    answer:
      'É a taxa fixa cobrada pelos Correios para liberar encomendas internacionais no Brasil — o "Despacho Postal" previsto na legislação aduaneira. Esse valor é independente do tamanho da compra e aparece na maioria das importações via remessa postal. Nossa calculadora inclui essa taxa no total em reais para você não ter surpresas na hora de retirar ou receber o pacote.',
  },
  {
    id: 'imunidade-livros-medicamentos',
    question: 'Livros e medicamentos pagam imposto?',
    answer:
      'Livros, jornais e periódicos são imunes de impostos (Art. 150 da CF). Medicamentos para pessoa física também podem ter isenção, desde que acompanhados de receita médica e aprovados pela Anvisa.',
  },
  {
    id: 'abandono-carga',
    question: 'O que acontece se eu não pagar o imposto?',
    answer:
      'Caso o pagamento não seja efetuado no prazo (geralmente 20–30 dias), a mercadoria é considerada abandonada. Ela pode ser leiloada pela Receita Federal, destruída ou devolvida ao remetente.',
  },
  {
    id: 'redirecionadores',
    question: 'Vale a pena usar um Redirecionador (Forwarder)?',
    answer:
      'Sim, especialmente para consolidar vários pacotes em um só ou para lojas que não enviam direto ao Brasil. Note que o imposto será calculado sobre o valor total declarado no envio final.',
  },
  {
    id: 'calculo-frete-cif',
    question: 'O frete entra no cálculo do imposto?',
    answer:
      'Sim. A base de cálculo é o Valor Aduaneiro (CIF), que soma o preço do produto + frete + seguro. Por isso, um frete caro pode te colocar acima do limite de isenção de US$ 50.',
  },
] as const;

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

export function ImportFAQ() {
  return (
    <section className="import-faq" aria-labelledby="faq-heading">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <h2 id="faq-heading">Perguntas frequentes sobre importação</h2>
      <div className="faq-list">
        {FAQ_ITEMS.map((item) => (
          <details key={item.id} className="faq-item" id={item.id}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
