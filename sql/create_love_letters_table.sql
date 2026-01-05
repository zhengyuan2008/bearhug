-- 情书数据库表
-- 支持文字、图片、PDF等多种内容类型

CREATE TABLE IF NOT EXISTS love_letters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  -- 显示日期（可以和创建日期不同，用于"回忆中的日期"）
  display_date DATE NOT NULL,

  -- 标题
  title TEXT NOT NULL,

  -- 内容类型：text（纯文字）, image（图片）, pdf（PDF文档）, mixed（混合）
  content_type TEXT NOT NULL CHECK (content_type IN ('text', 'image', 'pdf', 'mixed')),

  -- 文字内容（支持markdown格式）
  text_content TEXT,

  -- 图片URLs（JSON数组）
  image_urls JSONB DEFAULT '[]'::jsonb,

  -- PDF URL
  pdf_url TEXT,

  -- 显示顺序（数字越小越靠前）
  display_order INTEGER DEFAULT 0,

  -- 是否可见
  is_visible BOOLEAN DEFAULT true,

  -- 标签/分类（可选，如"纪念日"、"日常"、"特殊时刻"）
  tags JSONB DEFAULT '[]'::jsonb,

  -- 情绪色调（可选，如"温暖"、"鼓励"、"浪漫"）
  mood TEXT
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_love_letters_display_date ON love_letters(display_date DESC);
CREATE INDEX IF NOT EXISTS idx_love_letters_visible ON love_letters(is_visible) WHERE is_visible = true;
CREATE INDEX IF NOT EXISTS idx_love_letters_order ON love_letters(display_order ASC, display_date DESC);

-- 添加注释
COMMENT ON TABLE love_letters IS '给🐻的情书收藏，支持文字、图片、PDF等多种内容';
COMMENT ON COLUMN love_letters.display_date IS '显示的日期，可以是写信日期或纪念日期';
COMMENT ON COLUMN love_letters.content_type IS '内容类型：text纯文字, image图片, pdf文档, mixed混合';
COMMENT ON COLUMN love_letters.text_content IS '文字内容，支持markdown格式';
COMMENT ON COLUMN love_letters.image_urls IS 'JSON数组，存储多张图片的URL';
