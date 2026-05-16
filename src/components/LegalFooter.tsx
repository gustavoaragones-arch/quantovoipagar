export function LegalFooter() {
  return (
    <footer className="legal-footer" role="contentinfo">
      <p className="legal-footer-text">
        Valores estimados baseados na MP 1.357/2026. Não representa consultoria
        jurídica. © 2026 Albor Digital LLC.
      </p>
      <nav className="legal-footer-links" aria-label="Documentos legais">
        <a href="/disclaimer.html">Aviso legal</a>
        <span aria-hidden="true">·</span>
        <a href="/privacy-policy.html">Política de privacidade</a>
      </nav>
    </footer>
  );
}
