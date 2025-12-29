-- 清理旧的工作烦恼数据
-- 在执行新数据之前先运行这个脚本

-- ⚠️ 重要：必须按以下顺序删除，以避免外键约束冲突

-- 1. 先删除日志（引用了 work_scenarios）
DELETE FROM work_trouble_logs;

-- 2. 删除所有话术（引用了 work_scenarios）
DELETE FROM work_phrases;

-- 3. 最后删除所有场景（被引用的父表）
DELETE FROM work_scenarios;

-- 重置序列（如果使用了序列）
-- ALTER SEQUENCE work_scenarios_id_seq RESTART WITH 1;
-- ALTER SEQUENCE work_phrases_id_seq RESTART WITH 1;
