-- Migration: Add subject and internal_notes columns to students
-- Date: 2026-04-13

ALTER TABLE students
  ADD COLUMN IF NOT EXISTS subject TEXT DEFAULT 'Mathématiques',
  ADD COLUMN IF NOT EXISTS internal_notes TEXT;
