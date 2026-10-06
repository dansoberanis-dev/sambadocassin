import { Preloader } from './components/Preloader';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { Agenda } from './components/Agenda';
import { Lancamento } from './components/Lancamento';
import { Discografia } from './components/Discografia';
import { Fotos } from './components/Fotos';
import { Bio } from './components/Bio';
import { Contrate } from './components/Contrate';
import { Instagram } from './components/Instagram';
import { Footer } from './components/Footer';
import { FloatingButtons } from './components/FloatingButtons';

/**
 * Site do grupo — estrutura inspirada em pericles.com.br:
 * Capa → Agenda (carrossel automático) → Lançamento → Discografia → Fotos → Bio → Contrate → Instagram
 *
 * 👉 Para editar textos, shows, fotos e contatos, abra: src/data/config.ts
 */
export default function App() {
  return (
    <div className="overflow-x-clip">
      <Preloader />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Agenda />
        <Lancamento />
        <Discografia />
        <Fotos />
        <Bio />
        <Contrate />
        <Instagram />
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
}
