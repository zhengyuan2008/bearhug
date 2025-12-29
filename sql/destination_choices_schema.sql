-- 去哪儿选择记录表
-- 创建日期：2025-12-29

CREATE TABLE IF NOT EXISTS destination_choices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(100),
  choice_date DATE NOT NULL,
  destination VARCHAR(100) NOT NULL,
  is_locked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_destination_choices_date ON destination_choices(choice_date DESC);
CREATE INDEX IF NOT EXISTS idx_destination_choices_session ON destination_choices(session_id);

-- 启用 RLS (Row Level Security)
ALTER TABLE destination_choices ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许匿名用户所有操作（全局共享）
CREATE POLICY "Allow anonymous all on destination_choices"
  ON destination_choices
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- 添加注释
COMMENT ON TABLE destination_choices IS '去哪儿选择记录表 - 存储每天的地点选择';
COMMENT ON COLUMN destination_choices.choice_date IS '选择日期（本地时间）';
COMMENT ON COLUMN destination_choices.destination IS '选择的地点名称';
COMMENT ON COLUMN destination_choices.is_locked IS '是否已确认锁定';
