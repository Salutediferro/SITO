-- Founder Pass · schema D1 (sprint 2 mag 2026, lancio lun 11 mag)
--
-- Tabella `founder_slots`: tracking dei 200 posti riservati al Founder Pass €119/anno.
-- Pre-seeded con 200 righe slot_number 1..200 e sold_at NULL.
-- Il webhook Stripe `checkout.session.completed` con metadata.tier=founder
-- esegue UPDATE atomico del primo slot disponibile (sold_at IS NULL ORDER BY slot_number LIMIT 1).
--
-- Lettura pubblica via GET /api/founder-slots-remaining: SELECT COUNT(*) WHERE sold_at IS NULL.
--
-- Apply migration:
--   npx wrangler d1 execute sdf-db --file=migrations/0001_create_founder_slots.sql --local   (test locale)
--   npx wrangler d1 execute sdf-db --file=migrations/0001_create_founder_slots.sql --remote  (production)

CREATE TABLE IF NOT EXISTS founder_slots (
  slot_number INTEGER PRIMARY KEY,
  sold_at TEXT NULL,
  stripe_customer_id TEXT NULL,
  stripe_subscription_id TEXT NULL,
  stripe_session_id TEXT NULL,
  email TEXT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Index per la query del counter (filtra rapidamente i posti disponibili).
CREATE INDEX IF NOT EXISTS idx_founder_slots_sold_at ON founder_slots(sold_at);

-- Pre-seed 200 righe (slot_number 1..200) con sold_at NULL.
-- INSERT OR IGNORE garantisce idempotenza: ri-eseguire la migration non duplica righe.
WITH RECURSIVE counter(n) AS (
  SELECT 1
  UNION ALL
  SELECT n + 1 FROM counter WHERE n < 200
)
INSERT OR IGNORE INTO founder_slots (slot_number)
SELECT n FROM counter;

-- Verifica seed (solo informativa, può essere ignorata):
-- SELECT COUNT(*) AS total_slots, COUNT(sold_at) AS sold FROM founder_slots;
-- Atteso post-migration: total_slots=200, sold=0
