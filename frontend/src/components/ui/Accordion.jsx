import { useId, useState } from 'react';

const s = {
  item: {
    borderBottom: '1px solid var(--border)',
  },
  trigger: {
    width: '100%', background: 'none', border: 'none',
    padding: '20px 0', display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', cursor: 'pointer',
    color: 'var(--text)', fontSize: 16, fontWeight: 500,
    textAlign: 'left', fontFamily: "'Manrope', 'DM Sans', system-ui, sans-serif",
    transition: 'color var(--motion-fast) var(--ease-standard)',
  },
  arrow: {
    width: 20, height: 20, flexShrink: 0, marginLeft: 16,
    transition: 'transform var(--motion-medium) var(--ease-standard)',
    color: 'var(--accent)',
  },
  // Pattern grid-template-rows 0fr → 1fr: GPU-friendly, niente layout-trigger su max-height,
  // niente magic number di altezza massima.
  content: {
    display: 'grid',
    transition: 'grid-template-rows var(--motion-medium) var(--ease-standard), opacity var(--motion-base) var(--ease-standard)',
  },
  contentInnerWrap: {
    overflow: 'hidden',
    minHeight: 0,
  },
  inner: {
    paddingBottom: 20, fontSize: 14, color: 'var(--text-sec)',
    lineHeight: 1.7,
  },
};

export default function Accordion({ items }) {
  const [openIdx, setOpenIdx] = useState(null);
  const baseId = useId();

  return (
    <div>
      {items.map((item, i) => {
        const isOpen = openIdx === i;
        const panelId = `${baseId}-panel-${i}`;
        const triggerId = `${baseId}-trigger-${i}`;
        return (
          <div key={i} style={s.item}>
            <button
              type="button"
              id={triggerId}
              aria-expanded={isOpen}
              aria-controls={panelId}
              style={{ ...s.trigger, color: isOpen ? 'var(--accent)' : 'var(--text)' }}
              onClick={() => setOpenIdx(isOpen ? null : i)}
            >
              <span>{item.q}</span>
              <svg style={{ ...s.arrow, transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              style={{ ...s.content, gridTemplateRows: isOpen ? '1fr' : '0fr', opacity: isOpen ? 1 : 0 }}
            >
              <div style={s.contentInnerWrap}>
                <div style={s.inner}>{item.a}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
