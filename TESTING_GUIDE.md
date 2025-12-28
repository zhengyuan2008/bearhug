# 测试姨妈记录功能指南

## 🧪 如何测试

### 步骤1：刷新页面
强制刷新浏览器（**Cmd+Shift+R**）加载最新代码

### 步骤2：切换到姨妈助手Tab
点击页面上的 **🌸 姨妈助手** 按钮

### 步骤3：点击记录按钮
点击 **"今天是第一天"** 按钮

### 步骤4：查看Console
打开浏览器控制台（右键 → 检查 → Console），应该看到：
```
✓ Saved period record to cloud
✓ Logged interaction: period_mark
```

### 步骤5：查看页面反馈
- 页面顶部应该显示toast提示（例如："记下来了，这几天要对自己更温柔一点 🌸"）
- 页面上应该显示"上次：12/27"（今天的日期）

## 📊 在Supabase控制台查看记录

### 方法1：使用Table Editor（最简单）
1. 进入 Supabase 项目控制台
2. 点击左侧 **Table Editor**
3. 选择 **period_records** 表
4. 你应该看到新增的记录，包含：
   - `session_id`：你的session标识
   - `start_date`：2025-12-27
   - `created_at`：记录创建时间

### 方法2：使用SQL Editor
1. 点击左侧 **SQL Editor**
2. 点击 **New query**
3. 运行以下查询：

```sql
-- 查看所有姨妈记录
SELECT * FROM period_records
ORDER BY created_at DESC;

-- 查看本次session的记录
SELECT * FROM period_records
WHERE session_id = 'your-session-id'
ORDER BY start_date DESC;

-- 查看最近10条记录
SELECT
  id,
  session_id,
  start_date,
  created_at,
  TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_time
FROM period_records
ORDER BY created_at DESC
LIMIT 10;
```

### 查看所有互动记录
```sql
-- 查看所有用户互动
SELECT * FROM user_interactions
ORDER BY created_at DESC
LIMIT 20;

-- 查看特定类型的互动
SELECT
  event_type,
  event_data,
  created_at
FROM user_interactions
WHERE event_type = 'period_mark'
ORDER BY created_at DESC;
```

## ✏️ 如果点错了怎么修改

### 选项1：删除错误记录（SQL Editor）

```sql
-- 删除今天的记录
DELETE FROM period_records
WHERE start_date = '2025-12-27';

-- 或者删除最新的一条记录
DELETE FROM period_records
WHERE id = (
  SELECT id FROM period_records
  ORDER BY created_at DESC
  LIMIT 1
);
```

### 选项2：修改日期（SQL Editor）

```sql
-- 修改为11月15日
UPDATE period_records
SET start_date = '2024-11-15'
WHERE start_date = '2025-12-27';

-- 或者修改最新的一条
UPDATE period_records
SET start_date = '2024-11-15'
WHERE id = (
  SELECT id FROM period_records
  ORDER BY created_at DESC
  LIMIT 1
);
```

### 选项3：手动添加历史记录

```sql
-- 添加11月15日的记录
INSERT INTO period_records (session_id, start_date)
VALUES (
  'your-session-id',  -- 替换为你的session_id
  '2024-11-15'
);

-- 查看你的session_id
SELECT DISTINCT session_id FROM period_records;
```

## 🔍 查看你的Session ID

在浏览器控制台运行：
```javascript
localStorage.getItem('bearHugSessionId')
```

会返回类似：`"session_1735328400000_abc123def"`

## 📝 测试数据样本

插入一些历史测试数据：

```sql
-- 获取你的session_id（从现有记录中）
WITH my_session AS (
  SELECT session_id FROM period_records LIMIT 1
)

-- 插入最近几个月的记录
INSERT INTO period_records (session_id, start_date)
SELECT
  (SELECT session_id FROM my_session),
  date::date
FROM generate_series(
  '2024-08-15'::date,
  '2024-11-15'::date,
  '28 days'::interval
) AS date;
```

## 🎯 完整测试流程

1. ✅ 刷新页面，确认Supabase连接成功
2. ✅ 切换到姨妈助手tab
3. ✅ 点击"今天是第一天"
4. ✅ 在Supabase控制台查看 `period_records` 表
5. ✅ 确认记录已保存
6. ✅ 如果需要，使用SQL修改或删除
7. ✅ 再次刷新页面，确认数据持久化

## 💡 提示

- **本地和云端双重保存**：数据同时保存在localStorage和Supabase
- **Session隔离**：每个浏览器有独立的session_id
- **RLS保护**：只能访问自己的数据
- **时区注意**：日期使用UTC时间存储

## 🚨 常见问题

**Q: 控制台没有显示"Saved to cloud"？**
- 检查网络连接
- 查看控制台是否有错误信息
- 确认Supabase配置正确

**Q: 在Table Editor看不到记录？**
- 点击刷新按钮
- 检查是否有RLS策略错误
- 确认表已创建

**Q: 想清空所有测试数据？**
```sql
DELETE FROM period_records WHERE session_id = 'your-session-id';
DELETE FROM user_interactions WHERE session_id = 'your-session-id';
```
