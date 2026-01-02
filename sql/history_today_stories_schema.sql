-- 历史上的今天故事表 - 新Schema
-- 创建日期：2026-01-02
-- 目的：预存365天的历史故事，每天可以有多个故事

-- ========================================
-- 1. 创建 history_today_stories 表
-- ========================================
CREATE TABLE IF NOT EXISTS history_today_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  day INTEGER NOT NULL CHECK (day >= 1 AND day <= 31),
  story TEXT NOT NULL,
  story_index INTEGER DEFAULT 1 CHECK (story_index >= 1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建复合索引（按月日查询）
CREATE INDEX IF NOT EXISTS idx_history_stories_month_day
  ON history_today_stories(month, day, story_index);

-- 创建唯一约束（同一天的story_index不能重复）
CREATE UNIQUE INDEX IF NOT EXISTS idx_history_stories_unique
  ON history_today_stories(month, day, story_index);

-- ========================================
-- 2. 启用 RLS (Row Level Security)
-- ========================================

-- 全局共享，只读
ALTER TABLE history_today_stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous select history stories"
  ON history_today_stories
  FOR SELECT
  TO anon
  USING (true);

-- ========================================
-- 3. 添加注释
-- ========================================
COMMENT ON TABLE history_today_stories IS '历史上的今天故事库 - 预生成365天故事';
COMMENT ON COLUMN history_today_stories.month IS '月份（1-12）';
COMMENT ON COLUMN history_today_stories.day IS '日期（1-31）';
COMMENT ON COLUMN history_today_stories.story IS '历史故事内容';
COMMENT ON COLUMN history_today_stories.story_index IS '同一天的第几个故事（1-based）';
