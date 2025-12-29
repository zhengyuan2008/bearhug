# 更新工作烦恼数据 - 操作指南

## 📋 更新内容

### UI 优化
- ✅ 更紧凑的布局（减少间距和padding）
- ✅ 3列网格（原来2列）
- ✅ 更小的图标和字体

### 内容优化
- ❌ 删除：「被领导批评」「DDL要到了」
- ✅ 保留 6 个场景：
  1. 😮‍💨 不想上班
  2. 🌫️ 工作没意义
  3. 😔 犯了错误
  4. 😰 任务太多压力大
  5. 😣 同事关系紧张
  6. 😶 不想开会/社交

### 话术特点
- 🎯 针对 Apple MDE 工程师角色定制
- 🌐 应对策略和对话话术包含英文工作用语
- 💝 根据心理特征调整（重视边界、控制感、自我保护）
- 👥 考虑实际工作场景（manager E、mentor T、同事KQ/GR）

## 🔧 数据库更新步骤

### 1. 登录 Supabase Dashboard
访问：https://supabase.com/dashboard

### 2. 进入 SQL Editor
左侧菜单 → SQL Editor → New Query

### 3. 执行清理脚本
复制 `sql/clean_work_troubles_data.sql` 的内容并执行：

```sql
-- ⚠️ 必须按此顺序删除，避免外键约束冲突
DELETE FROM work_trouble_logs;  -- 先删除日志
DELETE FROM work_phrases;        -- 再删除话术
DELETE FROM work_scenarios;      -- 最后删除场景
```

### 4. 执行新数据脚本
复制 `sql/work_troubles_initial_data_v2.sql` 的全部内容并执行

### 5. 验证数据
运行查询确认：

```sql
-- 应该返回 6 条记录
SELECT name, icon, description FROM work_scenarios ORDER BY display_order;

-- 应该返回 72 条记录（6个场景 × 12条话术）
SELECT COUNT(*) FROM work_phrases;

-- 查看每个场景的话术数量
SELECT
  s.name,
  COUNT(p.id) as phrase_count
FROM work_scenarios s
LEFT JOIN work_phrases p ON s.id = p.scenario_id
GROUP BY s.name
ORDER BY s.display_order;
```

## ✅ 完成后测试

1. 刷新页面：http://127.0.0.1:8000
2. 点击「💼 工作烦恼」tab
3. 应该看到 **3列 × 2行** 的场景网格（6个卡片）
4. 点击任一场景，查看话术是否更新
5. 注意「应对策略」和「对话话术」中的英文内容

## 📝 话术示例

**应对策略示例**（包含英文）：
```
试试"最小完成单位"：今天只完成1个最关键的deliverable就算赢。

跟自己说："I'll just show up and see what happens. No pressure to overperform today."

降低内耗，保护能量。
```

**对话话术示例**（工作场景英文）：
```
如果状态真的不好，可以跟manager说：

"I'm not feeling 100% today. I'll focus on [critical task] first
and keep you posted on bandwidth for other items."

诚实但不过度解释，给自己留出空间。
```

## 🎨 UI 对比

### 之前：
- 2列网格
- 较大间距
- 8个场景

### 现在：
- 3列网格
- 紧凑布局
- 6个场景
- 更适合她的实际需求

---

如有问题，检查：
1. 浏览器是否硬刷新（Cmd+Shift+R）
2. Supabase 数据是否成功导入
3. 控制台是否有错误信息
