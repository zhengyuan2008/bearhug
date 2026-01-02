-- 搞好心态文章表 - 优化Schema
-- 更新日期：2026-01-02
-- 目的：支持预生成文章、自动过期、已读标记

-- ========================================
-- 1. 更新 mindset_articles 表结构
-- ========================================

-- 添加新字段
ALTER TABLE mindset_articles
  ADD COLUMN IF NOT EXISTS generation_date DATE DEFAULT CURRENT_DATE,  -- 文章生成日期（不是显示日期）
  ADD COLUMN IF NOT EXISTS is_expired BOOLEAN DEFAULT false,           -- 是否已过期
  ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false,              -- 是否已被用户读过
  ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;            -- 显示顺序（1-5）

-- 创建索引优化查询
CREATE INDEX IF NOT EXISTS idx_mindset_articles_generation_date
  ON mindset_articles(generation_date DESC, is_expired, is_read);

-- 创建索引优化今日未读文章查询
CREATE INDEX IF NOT EXISTS idx_mindset_articles_today_unread
  ON mindset_articles(generation_date, is_expired, is_read)
  WHERE is_expired = false AND is_read = false;

-- ========================================
-- 2. 添加注释
-- ========================================
COMMENT ON COLUMN mindset_articles.generation_date IS '文章生成日期（用于判断是否过期）';
COMMENT ON COLUMN mindset_articles.is_expired IS '是否已过期（第二天生成新文章后标记）';
COMMENT ON COLUMN mindset_articles.is_read IS '是否已被用户阅读（换一篇时标记）';
COMMENT ON COLUMN mindset_articles.display_order IS '显示顺序（1-5，每天生成5篇）';
