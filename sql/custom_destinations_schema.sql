-- 自定义目的地功能 - 数据库Schema
-- 创建日期：2026-01-02

-- ========================================
-- 1. 自定义目的地表
-- ========================================
CREATE TABLE IF NOT EXISTS custom_destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_custom_destinations_active ON custom_destinations(is_active, created_at DESC);

-- ========================================
-- 2. 启用 RLS (Row Level Security)
-- ========================================

-- 全局共享，所有操作
ALTER TABLE custom_destinations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous all custom_destinations"
  ON custom_destinations
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- ========================================
-- 3. 添加注释
-- ========================================
COMMENT ON TABLE custom_destinations IS '用户自定义目的地表 - 存储用户手动添加的目的地';
COMMENT ON COLUMN custom_destinations.name IS '目的地名称';
COMMENT ON COLUMN custom_destinations.is_active IS '是否启用（用于软删除）';
