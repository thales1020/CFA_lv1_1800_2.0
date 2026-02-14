-- Script 1: Bỏ foreign key constraints (Khuyên dùng cho test)
-- Copy và paste vào Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)

-- 1. Bỏ foreign key cho user_id
ALTER TABLE attempts 
  DROP CONSTRAINT IF EXISTS attempts_user_id_fkey;

-- 2. Bỏ foreign key cho exam_id  
ALTER TABLE attempts 
  DROP CONSTRAINT IF EXISTS attempts_exam_id_fkey;

-- 3. Cho phép user_id NULL
ALTER TABLE attempts 
  ALTER COLUMN user_id DROP NOT NULL;

SELECT 'Foreign key constraints removed successfully! ✅' as result;


-- ============================================
-- Script 2 (Alternative): Tạo exam record với UUID cố định
-- ============================================

-- INSERT INTO exams (id, title, duration_minutes, total_questions)
-- VALUES 
--   ('550e8400-e29b-41d4-a716-446655440000', 'CFA Level 1 Mock Exam', 120, 20)
-- ON CONFLICT (id) DO NOTHING;

