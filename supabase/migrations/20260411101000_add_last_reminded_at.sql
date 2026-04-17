-- Migration: Add last_reminded_at to students table
ALTER TABLE students ADD COLUMN IF NOT EXISTS last_reminded_at TIMESTAMP WITH TIME ZONE;
