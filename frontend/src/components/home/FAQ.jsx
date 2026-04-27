import FadeUp from '../ui/FadeUp';
import Accordion from '../ui/Accordion';
import { FAQ_ITEMS } from '../../constants/faq';

const s = {
  section: {
    padding: '80px 40px', maxWidth: 800, margin: '0 auto',
  },
  tag: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif", fontSize: 14, letterSpacing: 4,
    color: 'var(--accent)', marginBottom: 12, textAlign: 'center',
  },
  h2: {
    fontFamily: "'Antonio', 'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 5vw, 52px)',
    letterSpacing: 2, color: 'var(--text)', textAlign: 'center', marginBottom: 8,
  },
  sub: {
    fontSize: 15, color: 'var(--text-sec)', textAlign: 'center', marginBottom: 40,
    fontWeight: 300,
  },
};

export default function FAQ() {
  return (
    <section style={s.section}>
      <FadeUp>
        <div style={s.tag}>Domande Frequenti</div>
        <h2 style={s.h2}>HAI DUBBI? NORMALE.</h2>
        <p style={s.sub}>Le risposte che cercavi, senza giri di parole.</p>
      </FadeUp>
      <FadeUp delay={0.2}>
        <Accordion items={FAQ_ITEMS} />
      </FadeUp>
    </section>
  );
}
