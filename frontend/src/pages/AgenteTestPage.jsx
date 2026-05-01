import { useEffect } from 'react';
import AgenteFerro from '../components/agent/AgenteFerro';

/**
 * AgenteTestPage — pagina di test interno dell'Agente di Ferro
 *
 * Path: /agente-test (NON linkata da navbar)
 *
 * Caratteristiche:
 *  - noindex via meta tag dinamica
 *  - title dedicato
 *  - viewport mobile-friendly già da App
 *  - banner "modalità test" sempre visibile
 */
export default function AgenteTestPage() {
  useEffect(() => {
    document.title = 'Agente di Ferro · Test Interno · SDF';
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'robots');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'noindex,nofollow');
    return () => {
      meta.setAttribute('content', 'index,follow');
      document.title = 'Salute di Ferro';
    };
  }, []);

  return <AgenteFerro />;
}
