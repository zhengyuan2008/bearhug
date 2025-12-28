-- 为 food_choices 表添加 is_locked 列
ALTER TABLE food_choices
ADD COLUMN is_locked BOOLEAN DEFAULT false;

-- 添加注释
COMMENT ON COLUMN food_choices.is_locked IS '是否已确认锁定今日选择';
