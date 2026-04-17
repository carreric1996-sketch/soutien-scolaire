-- Migration: Add teacher_id to students and enable RLS
-- Date: 2026-04-12

-- 1. Add teacher_id column
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS teacher_id UUID REFERENCES auth.users(id);

-- 2. Enable RLS
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- 3. Create Policies

-- Policy: Users can only see their own students
CREATE POLICY "Teachers can view their own students" 
ON students 
FOR SELECT 
USING (auth.uid() = teacher_id);

-- Policy: Users can insert their own students
CREATE POLICY "Teachers can insert their own students" 
ON students 
FOR INSERT 
WITH CHECK (auth.uid() = teacher_id);

-- Policy: Users can update their own students
CREATE POLICY "Teachers can update their own students" 
ON students 
FOR UPDATE 
USING (auth.uid() = teacher_id)
WITH CHECK (auth.uid() = teacher_id);

-- Policy: Users can delete their own students
CREATE POLICY "Teachers can delete their own students" 
ON students 
FOR DELETE 
USING (auth.uid() = teacher_id);
