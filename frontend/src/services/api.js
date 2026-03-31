const API_BASE = 'https://form.salutediferro.com';

export async function sendLead(payload) {
  const res = await fetch(`${API_BASE}/send-lead`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function createCheckoutSession({ email, referral }) {
  const res = await fetch(`${API_BASE}/create-checkout-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, referral }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
