-- Migration: Add is_active for soft delete support
ALTER TABLE students ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
