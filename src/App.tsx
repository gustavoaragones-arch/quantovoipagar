import { Calculator } from './components/Calculator';
import { ImportFAQ } from './components/ImportFAQ';
import { LegalFooter } from './components/LegalFooter';
import { Transparency } from './components/Transparency';
import './App.css';

function App() {
  return (
    <div className="site">
      <main className="app">
        <Calculator />
        <ImportFAQ />
        <Transparency />
      </main>
      <LegalFooter />
    </div>
  );
}

export default App;
