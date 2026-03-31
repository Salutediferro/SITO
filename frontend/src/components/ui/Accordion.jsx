import { useState } from 'react';

const s = {
  item: {
    borderBottom: '1px solid var(--border)',
  },
  trigger: {
    width: '100%', background: 'none', border: 'none',
    padding: '20px 0', display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', cursor: 'pointer',
    color: 'var(--text)', fontSize: 16, fontWeight: 500,
    textAlign: 'left', fontFamily: "'DM Sans', sans-serif",
    transition: 'color 0.2s',
  },
  arrow: {
    width: 20, height: 20, flexShrink: 0, marginLeft: 16,
    transition: 'transform 0.3s ease',
    color: 'var(--accent)',
  },
  content: {
    overflow: 'hidden', transition: 'max-height 0.3s ease, opacity 0.3s ease',
  },
  inner: {
    paddingBottom: 20, fontSize: 14, color: 'var(--text-sec)',
    lineHeight: 1.7,
  },
};

export default function Accordion({ items }) {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <div>
      {items.map((item, i) => {
        const isOpen = openIdx === i;
        return (
          <div key={i} style={s.item}>
            <button
              style={{ ...s.trigger, color: isOpen ? 'var(--accent)' : 'var(--text)' }}
              onClick={() => setOpenIdx(isOpen ? null : i)}
            >
              <span>{item.q}</span>
              <svg style={{ ...s.arrow, transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div style={{ ...s.content, maxHeight: isOpen ? 300 : 0, opacity: isOpen ? 1 : 0 }}>
              <div style={s.inner}>{item.a}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
