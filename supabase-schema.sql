-- ========================================
-- 给熊印的小空间 - Supabase 数据库表结构
-- ========================================

-- 1. 用户互动记录表
CREATE TABLE IF NOT EXISTS user_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'button_click', 'emotion_select', 'hug', 'period_mark', 'survival_check'
  event_data JSONB, -- 存储额外的事件数据
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 姨妈周期记录表
CREATE TABLE IF NOT EXISTS period_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  start_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 签到记录表
CREATE TABLE IF NOT EXISTS survival_checkins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  checkin_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, checkin_date)
);

-- 4. 温暖语录库
CREATE TABLE IF NOT EXISTS warm_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL, -- 'general', 'tired', 'sad', 'scared', 'okay', 'survival', 'period'
  message TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. AI配置表（为未来AI功能预留）
CREATE TABLE IF NOT EXISTS ai_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  config_key TEXT UNIQUE NOT NULL,
  config_value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 索引优化
-- ========================================

CREATE INDEX IF NOT EXISTS idx_interactions_session ON user_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_interactions_created ON user_interactions(created_at);
CREATE INDEX IF NOT EXISTS idx_period_session ON period_records(session_id);
CREATE INDEX IF NOT EXISTS idx_survival_session ON survival_checkins(session_id);
CREATE INDEX IF NOT EXISTS idx_warm_messages_category ON warm_messages(category);

-- ========================================
-- Row Level Security (RLS) 策略
-- ========================================

-- 启用 RLS
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE period_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE survival_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE warm_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_config ENABLE ROW LEVEL SECURITY;

-- 允许匿名用户插入和读取自己的数据
CREATE POLICY "Allow anonymous insert" ON user_interactions
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow read own data" ON user_interactions
  FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous insert" ON period_records
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow read own data" ON period_records
  FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous insert" ON survival_checkins
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow read own data" ON survival_checkins
  FOR SELECT TO anon USING (true);

-- 温暖语录库：所有人可读，只有管理员可写
CREATE POLICY "Allow public read" ON warm_messages
  FOR SELECT TO anon USING (is_active = true);

CREATE POLICY "Allow public read" ON ai_config
  FOR SELECT TO anon USING (true);

-- ========================================
-- 初始化温暖语录数据
-- ========================================

INSERT INTO warm_messages (category, message) VALUES
  ('general', '今天辛苦啦，先不用很坚强，可以在我这里当一只小🐻。'),
  ('general', '就算全世界都很吵，你在我这里可以不说话，只需要被抱着就好。'),
  ('general', '我知道很多时候你觉得自己一个人扛着，但其实我一直在你这边。'),
  ('tired', '今天如果觉得有点撑不住，就先放过今天吧，其他以后再说。'),
  ('tired', '不一定要变成「高能量老鼠人」，你可以做一只慢悠悠的小🐻。'),
  ('sad', '难过的时候不用假装没事，在我这里你可以就是难过着。'),
  ('sad', '你的难过是真实的，不需要被评判或者赶紧好起来。'),
  ('scared', '害怕是很正常的，不代表你不够勇敢。'),
  ('scared', '你可以害怕，同时我会在这里，不会让你一个人面对。'),
  ('okay', '还好就已经很好了，不用每天都是「很好」。'),
  ('survival', '今天很不容易，恭喜你还是走到了这里 💫'),
  ('survival', '谢谢你又陪自己走完今天，这本身就很了不起 ✨'),
  ('period', '知道你身体今天更辛苦一点，辛苦了 🌸'),
  ('period', '记下来了，这几天要对自己更温柔一点 💝')
ON CONFLICT DO NOTHING;
