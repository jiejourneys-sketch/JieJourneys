-- ============================================================
-- JieJourneys Trip Planner – Supabase schema
-- Run this in your Supabase SQL Editor (once)
-- ============================================================

-- 1. Trip plans (one row per itinerary)
CREATE TABLE IF NOT EXISTS trip_plans (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL DEFAULT '未命名行程',
  destination  TEXT,
  start_date   DATE,
  end_date     DATE,
  cover_image  TEXT,
  days         INTEGER NOT NULL DEFAULT 1,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Trip items (cards inside each plan, grouped by day)
CREATE TABLE IF NOT EXISTS trip_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id       UUID NOT NULL REFERENCES trip_plans(id) ON DELETE CASCADE,
  day           INTEGER NOT NULL DEFAULT 1,
  type          TEXT NOT NULL DEFAULT 'attraction'
                  CHECK (type IN ('hotel', 'ticket', 'attraction', 'food')),
  source        TEXT NOT NULL DEFAULT 'manual'
                  CHECK (source IN ('agoda', 'kkday', 'klook', 'booking', 'manual')),
  title         TEXT NOT NULL,
  original_url  TEXT,
  affiliate_url TEXT,
  thumbnail     TEXT,
  notes         TEXT,
  price         TEXT,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast per-trip queries
CREATE INDEX IF NOT EXISTS trip_items_trip_id_idx ON trip_items(trip_id);

-- ── Row-Level Security ──────────────────────────────────────
-- Public read + write (UUID-based access control, like Bill tool)
ALTER TABLE trip_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_items ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  -- trip_plans
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'trip_plans_public_select') THEN
    CREATE POLICY trip_plans_public_select ON trip_plans FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'trip_plans_public_insert') THEN
    CREATE POLICY trip_plans_public_insert ON trip_plans FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'trip_plans_public_update') THEN
    CREATE POLICY trip_plans_public_update ON trip_plans FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'trip_plans_public_delete') THEN
    CREATE POLICY trip_plans_public_delete ON trip_plans FOR DELETE USING (true);
  END IF;

  -- trip_items
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'trip_items_public_select') THEN
    CREATE POLICY trip_items_public_select ON trip_items FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'trip_items_public_insert') THEN
    CREATE POLICY trip_items_public_insert ON trip_items FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'trip_items_public_update') THEN
    CREATE POLICY trip_items_public_update ON trip_items FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'trip_items_public_delete') THEN
    CREATE POLICY trip_items_public_delete ON trip_items FOR DELETE USING (true);
  END IF;
END $$;
