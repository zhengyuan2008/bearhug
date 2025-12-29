-- 添加更多美食选项
-- 执行日期：2025-12-28

-- ========================================
-- 添加新的吃的选项
-- ========================================
INSERT INTO food_options (name, category, is_active) VALUES
('十屠夫', 'food', true),
('Hey Chicken', 'food', true),
('Cajun sea food', 'food', true),
('自制火锅', 'food', true),
('自制烤肉', 'food', true),
('O2 Valley', 'food', true),
('鲤鱼门', 'food', true),
('敦煌', 'food', true),
('李与白包子', 'food', true),
('山城私房菜', 'food', true),
('烤串 (Ace King)', 'food', true),
('橘子堂', 'food', true),
('一屋饭湘', 'food', true);

-- ========================================
-- 添加新的喝的选项
-- ========================================
INSERT INTO food_options (name, category, is_active) VALUES
('树夏', 'drink', true),
('鲜芋仙', 'drink', true),
('喜茶', 'drink', true),
('三喵制茶', 'drink', true),
('Wow tea', 'drink', true),
('上宇林', 'drink', true),
('春阳茶室', 'drink', true),
('Sunright', 'drink', true);

-- ========================================
-- 验证新增的选项
-- ========================================
SELECT category, COUNT(*) as count
FROM food_options
WHERE is_active = true
GROUP BY category
ORDER BY category;

-- 查看所有选项
SELECT * FROM food_options
WHERE is_active = true
ORDER BY category, name;
