-- 工作烦恼功能数据库架构
-- 创建日期：2025-12-28
-- 包含3张表：工作场景、话术库、用户记录

-- ========================================
-- 1. 工作场景表
-- ========================================
CREATE TABLE work_scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(10) NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 添加索引以提高查询性能
CREATE INDEX idx_work_scenarios_active ON work_scenarios(is_active, display_order);

-- 添加注释
COMMENT ON TABLE work_scenarios IS '工作烦恼场景表，存储不同类型的工作困难场景';
COMMENT ON COLUMN work_scenarios.category IS '场景类别（如：motivation, criticism, workload, conflict, pressure）';
COMMENT ON COLUMN work_scenarios.name IS '场景名称（如：不想上班、被领导批评）';
COMMENT ON COLUMN work_scenarios.icon IS '场景图标emoji';
COMMENT ON COLUMN work_scenarios.description IS '场景详细描述';
COMMENT ON COLUMN work_scenarios.display_order IS '显示顺序';

-- ========================================
-- 2. 话术库表
-- ========================================
CREATE TABLE work_phrases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id UUID NOT NULL REFERENCES work_scenarios(id) ON DELETE CASCADE,
  phrase_type VARCHAR(20) NOT NULL CHECK (phrase_type IN ('comfort', 'strategy', 'script', 'support')),
  content TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 添加索引
CREATE INDEX idx_work_phrases_scenario ON work_phrases(scenario_id, phrase_type, display_order);

-- 添加注释
COMMENT ON TABLE work_phrases IS '工作烦恼话术库，存储各种场景的应对话术';
COMMENT ON COLUMN work_phrases.phrase_type IS '话术类型：comfort(安慰), strategy(对策), script(话术), support(支持)';
COMMENT ON COLUMN work_phrases.content IS '话术内容';

-- ========================================
-- 3. 用户记录表
-- ========================================
CREATE TABLE work_trouble_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(100),
  scenario_id UUID REFERENCES work_scenarios(id),
  selected_phrase_ids UUID[],
  ai_enhanced BOOLEAN DEFAULT false,
  ai_response TEXT,
  user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 添加索引
CREATE INDEX idx_work_trouble_logs_date ON work_trouble_logs(created_at DESC);
CREATE INDEX idx_work_trouble_logs_scenario ON work_trouble_logs(scenario_id);

-- 添加注释
COMMENT ON TABLE work_trouble_logs IS '工作烦恼使用记录，跟踪用户交互';
COMMENT ON COLUMN work_trouble_logs.session_id IS '会话ID，用于识别不同用户';
COMMENT ON COLUMN work_trouble_logs.scenario_id IS '选择的场景ID';
COMMENT ON COLUMN work_trouble_logs.selected_phrase_ids IS '查看/复制的话术ID数组';
COMMENT ON COLUMN work_trouble_logs.ai_enhanced IS '是否使用了AI润色';
COMMENT ON COLUMN work_trouble_logs.ai_response IS 'AI润色后的内容';
COMMENT ON COLUMN work_trouble_logs.user_rating IS '用户评分（1-5星）';

-- ========================================
-- 4. RLS (Row Level Security) 策略
-- ========================================

-- work_scenarios: 只读访问
ALTER TABLE work_scenarios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous select scenarios" ON work_scenarios
  FOR SELECT TO anon USING (true);

-- work_phrases: 只读访问
ALTER TABLE work_phrases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous select phrases" ON work_phrases
  FOR SELECT TO anon USING (true);

-- work_trouble_logs: 全局共享，完全访问权限
ALTER TABLE work_trouble_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous all logs" ON work_trouble_logs
  FOR ALL TO anon USING (true) WITH CHECK (true);

-- ========================================
-- 5. 验证查询
-- ========================================
-- 验证表创建
SELECT table_name, table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('work_scenarios', 'work_phrases', 'work_trouble_logs')
ORDER BY table_name;

-- 验证RLS策略
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename IN ('work_scenarios', 'work_phrases', 'work_trouble_logs')
ORDER BY tablename, policyname;
