-- 清理旧的工作烦恼数据
-- 在执行新数据之前先运行这个脚本

-- 删除所有话术（会级联删除相关记录）
DELETE FROM work_phrases;

-- 删除所有场景
DELETE FROM work_scenarios;

-- 重置序列（如果使用了序列）
-- ALTER SEQUENCE work_scenarios_id_seq RESTART WITH 1;
-- ALTER SEQUENCE work_phrases_id_seq RESTART WITH 1;
