export function track(event, params = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

export function getUTM() {
  const utm = {};
  try {
    const sp = new URLSearchParams(window.location.search);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(k => {
      if (sp.get(k)) utm[k] = sp.get(k);
    });
  } catch (e) {}
  return utm;
}
