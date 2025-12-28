-- 为所有表配置完整的 RLS 策略
-- 确保匿名用户可以进行所有必要的操作

-- ========================================
-- 1. user_interactions 表
-- ========================================
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous insert interactions" ON user_interactions;
DROP POLICY IF EXISTS "Allow anonymous select interactions" ON user_interactions;

CREATE POLICY "Allow anonymous insert interactions" ON user_interactions
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous select interactions" ON user_interactions
  FOR SELECT TO anon USING (true);

-- ========================================
-- 2. period_records 表
-- ========================================
ALTER TABLE period_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous all period" ON period_records;

CREATE POLICY "Allow anonymous all period" ON period_records
  FOR ALL TO anon USING (true) WITH CHECK (true);

-- ========================================
-- 3. survival_checkins 表
-- ========================================
ALTER TABLE survival_checkins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous all checkins" ON survival_checkins;

CREATE POLICY "Allow anonymous all checkins" ON survival_checkins
  FOR ALL TO anon USING (true) WITH CHECK (true);

-- ========================================
-- 4. emotion_logs 表
-- ========================================
ALTER TABLE emotion_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous all emotions" ON emotion_logs;

CREATE POLICY "Allow anonymous all emotions" ON emotion_logs
  FOR ALL TO anon USING (true) WITH CHECK (true);

-- ========================================
-- 5. food_options 表（只读）
-- ========================================
ALTER TABLE food_options ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous select food_options" ON food_options;

CREATE POLICY "Allow anonymous select food_options" ON food_options
  FOR SELECT TO anon USING (true);

-- ========================================
-- 6. food_choices 表（完整权限，包括删除）
-- ========================================
ALTER TABLE food_choices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous all food_choices" ON food_choices;

CREATE POLICY "Allow anonymous all food_choices" ON food_choices
  FOR ALL TO anon USING (true) WITH CHECK (true);

-- ========================================
-- 验证所有策略
-- ========================================
SELECT
  schemaname,
  tablename,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename IN (
  'user_interactions',
  'period_records',
  'survival_checkins',
  'emotion_logs',
  'food_options',
  'food_choices'
)
ORDER BY tablename, cmd;
