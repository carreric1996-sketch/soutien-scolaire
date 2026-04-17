-- Migration: Add groupe column and ensure created_at exists
-- Date: 2026-04-13

ALTER TABLE students
  ADD COLUMN IF NOT EXISTS groupe TEXT;

-- created_at is auto-added by Supabase, but make sure it exists
ALTER TABLE students
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
