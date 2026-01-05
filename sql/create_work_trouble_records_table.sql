-- 工作烦恼记录表
-- 记录每次点击工作烦恼按钮

CREATE TABLE IF NOT EXISTS work_trouble_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trouble_type TEXT NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_work_trouble_records_date ON work_trouble_records(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_work_trouble_records_type ON work_trouble_records(trouble_type);

-- 创建视图：每日工作烦恼统计
CREATE OR REPLACE VIEW daily_work_trouble_stats AS
SELECT
  DATE(recorded_at) as date,
  trouble_type,
  COUNT(*) as count
FROM work_trouble_records
GROUP BY DATE(recorded_at), trouble_type
ORDER BY DATE(recorded_at) DESC, trouble_type;

-- 启用 RLS
ALTER TABLE work_trouble_records ENABLE ROW LEVEL SECURITY;

-- 允许匿名用户插入和查询
CREATE POLICY "Allow anonymous insert work trouble records"
  ON work_trouble_records
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous select work trouble records"
  ON work_trouble_records
  FOR SELECT
  TO anon
  USING (true);

-- 添加注释
COMMENT ON TABLE work_trouble_records IS '工作烦恼记录表 - 记录每次点击工作烦恼按钮';
COMMENT ON COLUMN work_trouble_records.trouble_type IS '烦恼类型';
COMMENT ON COLUMN work_trouble_records.recorded_at IS '记录时间';
