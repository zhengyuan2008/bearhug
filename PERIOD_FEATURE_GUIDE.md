# 姨妈记录新功能使用指南

## ✨ 新增功能

### 1. 📅 历史记录显示
- 自动显示最近5条记录
- 最新记录标记为"最新"
- 其他记录显示序号

### 2. ❌ 取消本次更新按钮
- 删除最新记录
- 自动恢复到上一次记录
- 确认对话框保护

## 🧪 快速测试步骤

### Step 1: 刷新页面
```bash
Cmd + Shift + R  # 强制刷新
```

### Step 2: 添加11月15日的历史记录

在Supabase SQL Editor运行：
```sql
-- 获取你的session_id
SELECT session_id FROM period_records LIMIT 1;

-- 添加11月15日的记录（替换下面的session_id）
INSERT INTO period_records (session_id, start_date)
VALUES ('你的session_id', '2024-11-15');

-- 验证记录
SELECT
  id,
  start_date,
  TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI') as created_time
FROM period_records
ORDER BY start_date DESC;
```

### Step 3: 测试记录今天
1. 切换到 **🌸 姨妈助手** tab
2. 点击 **"今天是第一天"** 按钮
3. 应该看到：
   - Toast提示："记下来了，这几天要对自己更温柔一点 🌸"
   - 历史记录区域显示
   - 显示2条记录：
     * 12月27日（最新）
     * 11月15日（第2条）
   - **取消本次记录** 按钮出现

### Step 4: 测试取消功能
1. 点击 **"取消本次记录"** 按钮
2. 确认对话框选择"确定"
3. 应该看到：
   - Toast提示："已取消最新记录，恢复到上一次记录 ✓"
   - 历史记录更新，只显示11月15日
   - 上次记录显示：11/15

## 📊 界面说明

### 顶部日期显示
```
┌─────────────┬─────────────┐
│   今天      │  上次记录    │
│  12/27      │   11/15     │
└─────────────┴─────────────┘
```

### 历史记录区域
```
📅 最近记录
┌────────────────────────┐
│ 12月27日         最新  │
│ 11月15日         第2条 │
└────────────────────────┘
```

### 按钮布局
```
┌──────────────┬──────────────┐
│ 今天是第一天 │ 取消本次记录 │
└──────────────┴──────────────┘
```

## 🎯 完整使用流程

### 场景1：第一次使用
1. 打开姨妈助手tab → 看到"如果哪天你想记..."提示
2. 没有历史记录显示
3. 只有"今天是第一天"按钮

### 场景2：添加记录后
1. 点击"今天是第一天"
2. 历史记录区域出现
3. 显示最新记录
4. "取消本次记录"按钮出现

### 场景3：误点了需要取消
1. 点击"取消本次记录"
2. 确认对话框
3. 删除最新记录
4. 恢复到上一次状态

### 场景4：查看历史
1. 切换到姨妈助手tab
2. 自动加载并显示最近5条记录
3. 最新记录高亮显示

## 🔍 验证数据

### 在Supabase查看
```sql
-- 查看所有记录
SELECT
  id,
  start_date,
  TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_time
FROM period_records
WHERE session_id = '你的session_id'
ORDER BY created_at DESC;

-- 查看互动记录
SELECT
  event_type,
  event_data,
  created_at
FROM user_interactions
WHERE event_type IN ('period_mark', 'period_cancel')
ORDER BY created_at DESC;
```

### 在浏览器Console查看
```javascript
// 查看本地存储
localStorage.getItem('bearHugPeriodData')

// 查看session ID
localStorage.getItem('bearHugSessionId')
```

## 💡 使用提示

### 数据同步
- ✅ 点击记录 → 同时保存到本地和云端
- ✅ 点击取消 → 从云端删除，本地更新
- ✅ 刷新页面 → 从云端加载历史

### 按钮显示逻辑
- 没有记录 → 只显示"今天是第一天"
- 有记录 → 同时显示两个按钮
- 取消后只剩最后一条 → 两个按钮都显示

### 最佳实践
1. 每次都从姨妈助手tab查看历史
2. 如果点错立即取消
3. 可以手动添加历史记录补全数据
4. 云端和本地双重保存，数据更安全

## 🚨 常见问题

**Q: 取消按钮不显示？**
- 确保有历史记录
- 刷新页面重新加载

**Q: 取消后显示错误？**
- 检查网络连接
- 查看Console错误信息

**Q: 想添加更早的记录？**
- 使用SQL在Supabase手动添加
- 或等待之后的批量导入功能

**Q: 历史记录只显示5条？**
- 这是设计限制，避免界面过长
- 可以在Supabase查看完整历史
