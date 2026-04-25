-- ============================================================
-- JieJourneys Plan Planner – Supabase schema
-- Run in JieJourneysTrip project SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS plans (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL DEFAULT '我的行程',
  destination TEXT,
  days        INTEGER NOT NULL DEFAULT 1,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS plan_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id     UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  day         INTEGER NOT NULL DEFAULT 1,
  name        TEXT NOT NULL,
  type        TEXT NOT NULL DEFAULT 'attraction'
                CHECK (type IN ('hotel', 'attraction', 'food', 'transport', 'other')),
  address     TEXT,
  lat         FLOAT,
  lng         FLOAT,
  start_time  TEXT,        -- stored as "HH:MM", recalculated on reorder
  duration    INTEGER NOT NULL DEFAULT 90,  -- minutes at this stop
  notes       TEXT,
  image_url   TEXT,
  booking_url   TEXT,
  affiliate_url TEXT,
  thumbnail     TEXT,
  price         TEXT,
  order_index   INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS plan_items_plan_id_idx   ON plan_items(plan_id);
CREATE INDEX IF NOT EXISTS plan_items_day_order_idx ON plan_items(plan_id, day, order_index);

-- ── RLS (public, UUID-gated access) ────────────────────────
ALTER TABLE plans      ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_items ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'plans_select')      THEN CREATE POLICY plans_select      ON plans      FOR SELECT USING (true); END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'plans_insert')      THEN CREATE POLICY plans_insert      ON plans      FOR INSERT WITH CHECK (true); END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'plans_update')      THEN CREATE POLICY plans_update      ON plans      FOR UPDATE USING (true); END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'plans_delete')      THEN CREATE POLICY plans_delete      ON plans      FOR DELETE USING (true); END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'plan_items_select') THEN CREATE POLICY plan_items_select ON plan_items FOR SELECT USING (true); END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'plan_items_insert') THEN CREATE POLICY plan_items_insert ON plan_items FOR INSERT WITH CHECK (true); END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'plan_items_update') THEN CREATE POLICY plan_items_update ON plan_items FOR UPDATE USING (true); END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'plan_items_delete') THEN CREATE POLICY plan_items_delete ON plan_items FOR DELETE USING (true); END IF;
END $$;
