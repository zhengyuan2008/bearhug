-- 搞好心态功能 - 数据库Schema
-- 创建日期：2026-01-01

-- ========================================
-- 1. 话题表
-- ========================================
CREATE TABLE IF NOT EXISTS mindset_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(100) NOT NULL,
  description TEXT,
  background_context TEXT NOT NULL, -- 背景信息，每次生成文章时使用
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_mindset_topics_active ON mindset_topics(is_active, display_order);

-- ========================================
-- 2. 生成的文章表
-- ========================================
CREATE TABLE IF NOT EXISTS mindset_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES mindset_topics(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  generation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_mindset_articles_date ON mindset_articles(generation_date DESC);
CREATE INDEX IF NOT EXISTS idx_mindset_articles_topic ON mindset_articles(topic_id);

-- ========================================
-- 3. 启用 RLS (Row Level Security)
-- ========================================

-- mindset_topics: 只读
ALTER TABLE mindset_topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous select topics"
  ON mindset_topics
  FOR SELECT
  TO anon
  USING (true);

-- mindset_articles: 全局共享，所有操作
ALTER TABLE mindset_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous all articles"
  ON mindset_articles
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- ========================================
-- 4. 添加注释
-- ========================================
COMMENT ON TABLE mindset_topics IS '心态话题表 - 存储可用于生成文章的话题';
COMMENT ON COLUMN mindset_topics.background_context IS '背景信息 - 每次生成文章时会读取并用于AI提示词';

COMMENT ON TABLE mindset_articles IS '生成的心态文章表 - 存储AI生成的文章内容';
COMMENT ON COLUMN mindset_articles.generation_date IS '生成日期 - 用于判断是否需要生成新文章';
