-- 辅助脚本：获取话题ID
-- 运行这个查询，获取每个话题的UUID，然后复制到主脚本中

SELECT
  id,
  title,
  display_order,
  '替换 TOPIC_ID_' || display_order AS 替换说明
FROM mindset_topics
ORDER BY display_order;

-- 预期输出示例：
-- id                                   | title              | display_order | 替换说明
-- -------------------------------------+--------------------+---------------+------------------
-- xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx | 不想工作的时候      | 1             | 替换 TOPIC_ID_1
-- xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx | 不要自我贬低        | 2             | 替换 TOPIC_ID_2
-- ...

-- 使用说明：
-- 1. 在Supabase SQL Editor中运行上面的查询
-- 2. 复制每个话题的id (UUID)
-- 3. 打开 mindset_articles_2026_01_05.sql
-- 4. 用实际的UUID替换所有的 TOPIC_ID_1, TOPIC_ID_2, ... TOPIC_ID_8
-- 5. 运行修改后的SQL插入文章
