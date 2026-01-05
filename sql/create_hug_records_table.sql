-- 拥抱记录表
-- 记录每次"再抱我一下"的点击

CREATE TABLE IF NOT EXISTS hug_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hugged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  -- 可选：记录当时的心情（如果之前选择了心情）
  mood TEXT,

  -- 索引
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引（使用时间戳直接索引，查询时用范围过滤）
CREATE INDEX IF NOT EXISTS idx_hug_records_date ON hug_records(hugged_at DESC);

-- 创建视图：每日拥抱统计
CREATE OR REPLACE VIEW daily_hug_stats AS
SELECT
  DATE(hugged_at) as date,
  COUNT(*) as hug_count,
  ARRAY_AGG(DISTINCT mood) FILTER (WHERE mood IS NOT NULL) as moods
FROM hug_records
GROUP BY DATE(hugged_at)
ORDER BY DATE(hugged_at) DESC;

-- 启用 RLS
ALTER TABLE hug_records ENABLE ROW LEVEL SECURITY;

-- 允许匿名用户插入和查询
CREATE POLICY "Allow anonymous insert hug records"
  ON hug_records
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous select hug records"
  ON hug_records
  FOR SELECT
  TO anon
  USING (true);

-- 添加注释
COMMENT ON TABLE hug_records IS '拥抱记录表 - 记录每次点击"再抱我一下"按钮';
COMMENT ON COLUMN hug_records.hugged_at IS '拥抱时间';
COMMENT ON COLUMN hug_records.mood IS '当时的心情（可选）';
