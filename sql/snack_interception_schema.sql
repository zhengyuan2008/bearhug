-- 零食拦截记录功能 - 数据库Schema
-- 创建日期：2026-01-02

-- ========================================
-- 1. 零食拦截记录表
-- ========================================
CREATE TABLE IF NOT EXISTS snack_interceptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interception_date DATE NOT NULL DEFAULT CURRENT_DATE,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_snack_interceptions_date ON snack_interceptions(interception_date DESC);

-- ========================================
-- 2. 启用 RLS (Row Level Security)
-- ========================================

-- 全局共享，所有操作
ALTER TABLE snack_interceptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous all snack_interceptions"
  ON snack_interceptions
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- ========================================
-- 3. 添加注释
-- ========================================
COMMENT ON TABLE snack_interceptions IS '零食拦截记录表 - 记录胖🐰成功拦截🐻吃零食的日期和备注';
COMMENT ON COLUMN snack_interceptions.interception_date IS '拦截日期';
COMMENT ON COLUMN snack_interceptions.note IS '备注信息（可选）';
