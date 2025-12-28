-- 为 food_choices 表配置 RLS 策略
-- 允许匿名用户进行所有操作（增删改查）

-- 1. 启用 RLS（如果还没启用）
ALTER TABLE food_choices ENABLE ROW LEVEL SECURITY;

-- 2. 删除旧策略（如果存在）
DROP POLICY IF EXISTS "Allow anonymous select" ON food_choices;
DROP POLICY IF EXISTS "Allow anonymous insert" ON food_choices;
DROP POLICY IF EXISTS "Allow anonymous update" ON food_choices;
DROP POLICY IF EXISTS "Allow anonymous delete" ON food_choices;

-- 3. 创建新的策略，允许所有匿名操作

-- 允许查询
CREATE POLICY "Allow anonymous select" ON food_choices
  FOR SELECT
  TO anon
  USING (true);

-- 允许插入
CREATE POLICY "Allow anonymous insert" ON food_choices
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 允许更新
CREATE POLICY "Allow anonymous update" ON food_choices
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- 允许删除（这是关键！）
CREATE POLICY "Allow anonymous delete" ON food_choices
  FOR DELETE
  TO anon
  USING (true);

-- 验证策略
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'food_choices';
