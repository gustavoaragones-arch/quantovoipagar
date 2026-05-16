const METHODOLOGY_CARDS = [
  {
    id: 'cambio',
    title: 'Câmbio',
    body: 'Dados PTAX ao vivo via API.',
  },
  {
    id: 'impostos',
    title: 'Impostos',
    body: 'Conformidade com MP 1.357/2026 e ICMS 135/2024.',
  },
  {
    id: 'privacidade',
    title: 'Privacidade',
    body: 'Sem cookies. Seus dados não saem do seu navegador.',
  },
  {
    id: 'objetivo',
    title: 'Objetivo',
    body: 'Ajudar compradores brasileiros a estimar o custo real da importação antes de fechar o pedido — com clareza sobre impostos e taxas.',
  },
] as const;

export function Transparency() {
  return (
    <section className="transparency" aria-labelledby="transparency-heading">
      <h2 id="transparency-heading">Metodologia</h2>
      <p className="transparency-intro">
        Transparência sobre como geramos as estimativas desta calculadora.
      </p>
      <ul className="transparency-grid">
        {METHODOLOGY_CARDS.map((card) => (
          <li key={card.id} className="transparency-card">
            <h3>{card.title}</h3>
            <p>{card.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
