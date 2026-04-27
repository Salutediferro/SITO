import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Wrappa la parola "ferro" (case-insensitive, word boundary) in <span class="ferro-accent">
 * SOLO se il colore parent è bianco/quasi-bianco (R,G,B tutti >= 200).
 * Skip elementi già accent, già wrappati, e <script>/<style>/<title>.
 *
 * Re-applica:
 * - al mount
 * - al cambio rotta
 * - su mutazioni DOM (quiz step, dinamici), debounced 200ms
 */
export default function useFerroHighlight() {
  const { pathname } = useLocation();

  useEffect(() => {
    let scheduled = null;
    let observer = null;

    const isWhiteish = (rgbStr) => {
      const m = rgbStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!m) return false;
      const [r, g, b] = [+m[1], +m[2], +m[3]];
      return r >= 200 && g >= 200 && b >= 200;
    };

    // Skip se qualche ancestor ha background "rosso-ish" significativo:
    // R domina su G/B di almeno 30 punti AND alpha effettiva >= 0.3.
    // Evita di colorare "ferro" rosso dentro badge/box rossi (illeggibile + perde forza).
    const hasReddishAncestor = (el) => {
      let cur = el;
      while (cur && cur !== document.documentElement) {
        const cs = window.getComputedStyle(cur);
        const bg = cs.backgroundColor;
        const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (m) {
          const r = +m[1], g = +m[2], b = +m[3];
          const a = m[4] !== undefined ? parseFloat(m[4]) : 1;
          if (a >= 0.3 && r > g + 30 && r > b + 30 && r > 100) return true;
        }
        // Anche check su gradient background-image (es. bottoni con linear-gradient)
        const bgImg = cs.backgroundImage || '';
        if (bgImg.includes('gradient') && /\b(rgb|#)/i.test(bgImg)) {
          // estrai i colori del gradient e check se almeno uno è rosso forte
          const colorMatches = bgImg.match(/rgba?\(\d+,\s*\d+,\s*\d+(?:,\s*[\d.]+)?\)|#[0-9a-fA-F]{3,8}/g) || [];
          for (const c of colorMatches) {
            let r = 0, g = 0, b = 0, a = 1;
            const rgbM = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
            if (rgbM) {
              r = +rgbM[1]; g = +rgbM[2]; b = +rgbM[3];
              if (rgbM[4] !== undefined) a = parseFloat(rgbM[4]);
            } else if (c.startsWith('#')) {
              const h = c.slice(1);
              const norm = h.length === 3 ? h.split('').map(x => x + x).join('') : h.slice(0, 6);
              r = parseInt(norm.slice(0, 2), 16);
              g = parseInt(norm.slice(2, 4), 16);
              b = parseInt(norm.slice(4, 6), 16);
            }
            if (a >= 0.3 && r > g + 30 && r > b + 30 && r > 100) return true;
          }
        }
        cur = cur.parentElement;
      }
      return false;
    };

    const apply = () => {
      // Pause observer durante manipolazioni DOM (evita loop)
      if (observer) observer.disconnect();

      // Cleanup: unwrap tutti gli .ferro-accent esistenti, rimette text node puro.
      // Necessario perché elementi nuovi (es. navbar CTA) potrebbero rendersi
      // DOPO il primo run e il check ancestor potrebbe non aver visto il bg rosso.
      document.querySelectorAll('.ferro-accent').forEach((span) => {
        const parent = span.parentNode;
        if (parent) {
          parent.replaceChild(document.createTextNode(span.textContent), span);
          parent.normalize();
        }
      });

      const root = document.querySelector('main, #root') || document.body;
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          if (!node.nodeValue || !/\bferro\b/i.test(node.nodeValue)) {
            return NodeFilter.FILTER_REJECT;
          }
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          const tag = parent.tagName;
          if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'TITLE', 'META', 'LINK'].includes(tag)) {
            return NodeFilter.FILTER_REJECT;
          }
          if (parent.closest('.ferro-accent, .gradient-text, .q-btn-primary, .hero-cta')) {
            return NodeFilter.FILTER_REJECT;
          }
          // Solo se parent ha colore "bianco-ish" (skip elementi già colorati)
          const cs = window.getComputedStyle(parent);
          if (!isWhiteish(cs.color)) return NodeFilter.FILTER_REJECT;
          // Skip se parent (o un ancestor) ha background rosso significativo
          if (hasReddishAncestor(parent)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      });

      const toReplace = [];
      let node;
      while ((node = walker.nextNode())) toReplace.push(node);

      toReplace.forEach((textNode) => {
        const frag = document.createDocumentFragment();
        const parts = textNode.nodeValue.split(/(\bferro\b)/gi);
        parts.forEach((part) => {
          if (/^ferro$/i.test(part)) {
            const span = document.createElement('span');
            span.className = 'ferro-accent';
            span.textContent = part;
            frag.appendChild(span);
          } else if (part) {
            frag.appendChild(document.createTextNode(part));
          }
        });
        textNode.parentNode.replaceChild(frag, textNode);
      });

      // Riattiva observer dopo aver finito le manipolazioni
      if (observer) observer.observe(document.body, { childList: true, subtree: true });
    };

    const schedule = () => {
      if (scheduled) clearTimeout(scheduled);
      scheduled = setTimeout(apply, 200);
    };

    // Mount + route change: applica subito (dopo React render)
    schedule();

    // Mutation observer per dynamic content (quiz step, modal, ecc.)
    observer = new MutationObserver((muts) => {
      // Skip se le mutazioni sono solo i nostri span (evita loop)
      const shouldRun = muts.some((m) =>
        Array.from(m.addedNodes).some((n) => {
          if (n.nodeType === 1) return !n.classList?.contains('ferro-accent');
          if (n.nodeType === 3) return /\bferro\b/i.test(n.nodeValue || '');
          return false;
        })
      );
      if (shouldRun) schedule();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      if (scheduled) clearTimeout(scheduled);
      if (observer) observer.disconnect();
    };
  }, [pathname]);
}
