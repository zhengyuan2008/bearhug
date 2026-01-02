# 🚀 Deployment Guide - 搞好心态 & 历史上的今天优化

本指南涵盖优化后的"搞好心态"和"历史上的今天"功能的完整部署流程。

---

## 📋 变更摘要

### 搞好心态 (Mindset Tab)
**优化前**: 用户点击时实时调用AI生成（10-60秒等待）
**优化后**:
- 每天凌晨12点预生成5篇文章存入数据库
- 用户点击时从数据库即时加载（<1秒）
- 已读文章自动标记，不重复显示
- 昨日文章自动过期

### 历史上的今天 (History Today)
**优化前**: 用户点击时实时调用AI生成（10-60秒等待）
**优化后**:
- 预先生成365天的历史故事存入数据库
- 每天可有多个故事供用户切换
- 用户点击时从数据库即时加载（<1秒）
- 移除AI生成按钮，提供"另一个故事"导航

---

## 🎯 部署步骤

### Step 1: 安装依赖

```bash
cd /Users/zhengyuantu/Bearhug

# 安装Node.js依赖
npm install

# 验证环境变量加载
npm run test:env
```

预期输出：
```
✅ API Key loaded
```

如果显示 `❌ Missing API Key`，请继续下一步配置环境变量。

---

### Step 2: 配置环境变量

#### 本地开发环境

创建 `.env` 文件（已有 `.env.example` 模板）：

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入真实密钥：

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI Configuration
OPENAI_API_KEY=sk-proj-your-actual-api-key-here

# Optional
NODE_ENV=development
```

**⚠️ 重要**: `.env` 文件已在 `.gitignore` 中，不会提交到Git仓库。

#### Netlify生产环境

在 Netlify Dashboard 中配置环境变量：

1. 打开项目设置：`Site settings > Environment variables`
2. 添加以下变量：

| 变量名 | 值 | 说明 |
|--------|------|------|
| `SUPABASE_URL` | `https://xxx.supabase.co` | Supabase项目URL |
| `SUPABASE_ANON_KEY` | `eyJhbGci...` | Supabase匿名密钥 |
| `OPENAI_API_KEY` | `sk-proj-...` | OpenAI API密钥 |

3. 保存配置

---

### Step 3: 执行数据库Schema

在 Supabase Dashboard 的 SQL Editor 中依次执行以下SQL文件：

#### 3.1 更新搞好心态表结构

文件：`sql/mindset_articles_update.sql`

```sql
-- 添加新列和索引
ALTER TABLE mindset_articles
  ADD COLUMN IF NOT EXISTS generation_date DATE DEFAULT CURRENT_DATE,
  ADD COLUMN IF NOT EXISTS is_expired BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_mindset_articles_generation_date
  ON mindset_articles(generation_date DESC, is_expired, is_read);

CREATE INDEX IF NOT EXISTS idx_mindset_articles_today_unread
  ON mindset_articles(generation_date, is_expired, is_read)
  WHERE is_expired = false AND is_read = false;
```

**验证**：执行后检查表结构
```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'mindset_articles';
```

应该看到新增的4个列：`generation_date`, `is_expired`, `is_read`, `display_order`

#### 3.2 创建历史故事表

文件：`sql/history_today_stories_schema.sql`

```sql
CREATE TABLE IF NOT EXISTS history_today_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  day INTEGER NOT NULL CHECK (day >= 1 AND day <= 31),
  story TEXT NOT NULL,
  story_index INTEGER DEFAULT 1 CHECK (story_index >= 1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引和RLS策略
CREATE INDEX IF NOT EXISTS idx_history_stories_month_day
  ON history_today_stories(month, day, story_index);

CREATE UNIQUE INDEX IF NOT EXISTS idx_history_stories_unique
  ON history_today_stories(month, day, story_index);

ALTER TABLE history_today_stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous select history stories"
  ON history_today_stories FOR SELECT TO anon USING (true);
```

**验证**：检查表是否创建成功
```sql
SELECT * FROM history_today_stories LIMIT 1;
```

此时应该返回空结果（表存在但无数据）。

---

### Step 4: 生成初始数据

#### 4.1 生成今日的搞好心态文章（5篇）

```bash
npm run generate:mindset
```

**预期输出**：
```
=== 开始生成今日心态文章 ===
📅 Date: 2026-01-02
🤖 Generating article for topic: 工作压力管理
✅ Generated article (350 chars)
💾 Saving article to database (order: 1)
✅ Article saved to database (ID: xxx)
...
=== 生成结果汇总 ===
✅ 成功: 5 篇
❌ 失败: 0 篇
```

**验证**：在Supabase中查询
```sql
SELECT generation_date, display_order, is_expired, is_read
FROM mindset_articles
WHERE generation_date = CURRENT_DATE
ORDER BY display_order;
```

应该看到5篇文章，`display_order` 为 1-5。

#### 4.2 测试历史故事生成（1月份，dry-run模式）

```bash
npm run populate:history:test
```

这会生成1月份的故事，但不写入数据库（测试模式）。

**预期输出**：
```
⚠️  WARNING: This script will make hundreds of OpenAI API calls!
Estimated API calls: 31
Estimated cost: ~$0.62 USD

🤖 Generating story for 1/1 (story #1)
✅ Generated story (450 chars)
🔍 DRY RUN: Would save story (450 chars)
...
✅ 成功生成: 31 个故事
```

如果测试成功，继续下一步实际生成。

#### 4.3 生成1月份历史故事（写入数据库）

```bash
npm run populate:history
```

**预期输出**：
```
⏳ Starting in 5 seconds... (Ctrl+C to cancel)
📅 Processing 1/1...
🤖 Generating story for 1/1 (story #1)
✅ Generated story (450 chars)
💾 Saving story to database: 1/1 #1
✅ Story saved (ID: xxx)
...
✅ 成功生成: 62 个故事 (31天 × 2个/天)
```

**验证**：
```sql
SELECT month, day, COUNT(*) as story_count
FROM history_today_stories
WHERE month = 1
GROUP BY month, day
ORDER BY day;
```

应该看到1月份每天都有2个故事。

#### 4.4 生成全年历史故事（可选）

⚠️ **注意**: 这会调用约 730 次 OpenAI API，预计费用 **$15-20 USD**，耗时约 **1-2小时**。

```bash
npm run populate:history:all
```

如果中途中断，脚本会自动跳过已生成的故事（通过数据库去重），可以安全重新运行。

**验证全年数据**：
```sql
-- 检查覆盖率（应该是366天，包括闰年2月29日）
SELECT COUNT(DISTINCT (month, day)) as covered_days
FROM history_today_stories;

-- 检查每个月的故事数
SELECT month, COUNT(*) as total_stories
FROM history_today_stories
GROUP BY month
ORDER BY month;
```

---

### Step 5: 部署到Netlify

#### 5.1 提交代码

```bash
git add .
git commit -m "Optimize mindset & history tabs with pre-generation"
git push
```

#### 5.2 触发Netlify部署

Netlify会自动检测到代码变更并开始部署。

#### 5.3 验证定时函数配置

1. 在 Netlify Dashboard 中打开项目
2. 进入 `Functions` 标签页
3. 应该看到函数列表：
   - `daily-mindset-generation` (scheduled: 0 0 * * *)
   - `enhance-phrase`
   - `generate-mindset`
   - `history-story`

4. 点击 `daily-mindset-generation`，查看函数详情
5. 确认 Schedule 显示为 `0 0 * * *` (每天UTC时间00:00)

#### 5.4 测试定时函数（手动触发）

在Netlify Functions页面，点击 `daily-mindset-generation` 右侧的 "Trigger function" 按钮手动测试。

**预期响应**：
```json
{
  "success": true,
  "message": "Daily mindset articles generated successfully",
  "generated": 5,
  "failed": 0,
  "timestamp": "2026-01-02T12:00:00.000Z"
}
```

---

### Step 6: 前端测试

#### 6.1 测试搞好心态功能

1. 打开 Bearhug 应用
2. 切换到 "🌟 搞好心态" tab
3. 观察加载速度（应该 <1秒）
4. 点击 "💫 换一篇文章"
5. 重复点击，直到5篇文章都看完
6. 第6次点击应该触发AI生成（显示"正在生成..."）

**预期行为**：
- 前5篇：瞬间加载（从数据库）
- 第6篇：10-60秒（AI生成，fallback机制）

#### 6.2 测试历史上的今天功能

1. 切换到 "📖 历史上的今天" tab
2. 观察加载速度（应该 <1秒）
3. 确认显示今日历史故事
4. 如果今日有多个故事，会显示 "📖 另一个故事 (1 / 2)"
5. 点击 "📖 另一个故事" 按钮
6. 观察切换速度（应该瞬间切换）

**预期行为**：
- 初次加载：<1秒（从数据库加载所有故事）
- 切换故事：瞬间（已在内存中）
- 无AI生成按钮（已移除）

---

## 📊 数据统计

### 搞好心态文章

- **生成频率**: 每天凌晨12点（UTC 00:00）
- **每日生成**: 5篇文章
- **文章长度**: 300-400字
- **存储周期**: 保留当日未读文章，昨日自动过期
- **预计存储**: 约 150 篇（30天 × 5篇/天）
- **API费用**: ~$3-5 USD/月

### 历史上的今天故事

- **总数据量**: 366天（含闰年） × 2-3个故事 = 732-1098 个故事
- **每个故事长度**: 400-600字
- **存储大小**: 约 1-2MB
- **一次性生成费用**: ~$15-20 USD
- **后续费用**: $0/月（无需重新生成）

---

## 🔄 日常运维

### 自动化任务

✅ **每日凌晨12点** - Netlify定时函数自动执行：
1. 标记昨天的文章为过期 (`is_expired = true`)
2. 随机选择5个话题
3. 调用OpenAI API生成5篇新文章
4. 保存到数据库，`display_order` 为 1-5

### 手动维护

#### 查看今日文章生成状态

```sql
SELECT
  generation_date,
  display_order,
  topic_id,
  is_expired,
  is_read,
  created_at
FROM mindset_articles
WHERE generation_date = CURRENT_DATE
ORDER BY display_order;
```

#### 查看历史故事覆盖率

```sql
-- 检查每天有几个故事
SELECT month, day, COUNT(*) as story_count
FROM history_today_stories
GROUP BY month, day
HAVING COUNT(*) < 2
ORDER BY month, day;
```

如果发现某些日期故事数量不足，可以手动补充：

```bash
# 重新生成3月份的故事（覆盖已有的）
node scripts/populate-history-stories.js --month=3 --force
```

#### 刷新某个月份的历史故事

```bash
# 重新生成并覆盖1月份的故事
npm run populate:history:force -- --month=1
```

---

## 🐛 故障排查

### 问题 1: 定时函数未执行

**症状**: 第二天早上没有新文章生成

**排查步骤**:
1. 检查 Netlify Functions 日志：
   - Dashboard > Functions > daily-mindset-generation > Logs
2. 查看最近执行记录
3. 检查是否有错误信息

**可能原因**:
- 环境变量未配置
- API密钥过期或额度不足
- Supabase连接失败

**解决方案**:
```bash
# 手动运行脚本测试
npm run generate:mindset

# 如果本地运行成功，问题在Netlify环境变量
# 检查 Netlify Dashboard > Site settings > Environment variables
```

---

### 问题 2: 前端加载不到文章

**症状**: "搞好心态" tab显示"正在生成..."超过10秒

**排查步骤**:
1. 打开浏览器开发者工具 (F12)
2. 查看 Console 日志
3. 查看 Network 请求

**检查数据库**:
```sql
-- 检查今日是否有未读文章
SELECT * FROM mindset_articles
WHERE generation_date = CURRENT_DATE
AND is_expired = false
AND is_read = false;
```

**如果结果为空**:
```bash
# 手动生成今日文章
npm run generate:mindset
```

---

### 问题 3: OpenAI API报错

**症状**: 脚本执行失败，错误信息包含 "OpenAI API error"

**可能错误码**:
- `401 Unauthorized` - API Key无效
- `429 Too Many Requests` - 触发限流
- `500 Internal Server Error` - OpenAI服务故障

**解决方案**:

1. **检查API Key**:
```bash
npm run test:env
```

2. **检查账户余额**:
   - 访问 [OpenAI Platform](https://platform.openai.com/usage)
   - 确认有足够余额

3. **限流处理**:
   - 脚本已内置2秒延迟，一般不会触发限流
   - 如果仍触发，修改 `scripts/*.js` 中的延迟时间：
   ```javascript
   await new Promise(resolve => setTimeout(resolve, 5000)); // 改为5秒
   ```

---

### 问题 4: 历史故事显示"今日暂无历史故事"

**症状**: "历史上的今天" tab没有显示故事

**排查**:
```sql
-- 检查今日是否有故事
SELECT * FROM history_today_stories
WHERE month = EXTRACT(MONTH FROM CURRENT_DATE)
AND day = EXTRACT(DAY FROM CURRENT_DATE);
```

**如果结果为空**:
```bash
# 生成今日所在月份的故事
# 假设今天是1月15日
npm run populate:history -- --month=1
```

---

## 📈 性能监控

### 数据库查询性能

关键索引已创建，确保查询速度：

```sql
-- 搞好心态：检查索引使用
EXPLAIN ANALYZE
SELECT * FROM mindset_articles
WHERE generation_date = CURRENT_DATE
AND is_expired = false
AND is_read = false
ORDER BY display_order
LIMIT 1;
```

预期：`Index Scan using idx_mindset_articles_today_unread`

```sql
-- 历史故事：检查索引使用
EXPLAIN ANALYZE
SELECT * FROM history_today_stories
WHERE month = 1 AND day = 15
ORDER BY story_index;
```

预期：`Index Scan using idx_history_stories_month_day`

### API使用监控

在 OpenAI Dashboard 中监控：
- 每日API调用次数（应该是5次/天用于心态文章）
- Token使用量
- 费用趋势

---

## 🎉 部署完成检查清单

部署完成后，请确认以下所有项：

### 数据库
- [ ] `mindset_articles` 表有新列：`generation_date`, `is_expired`, `is_read`, `display_order`
- [ ] `history_today_stories` 表已创建
- [ ] 索引已创建（至少4个索引）
- [ ] RLS策略已应用

### 数据
- [ ] 今日有5篇搞好心态文章
- [ ] 至少1月份有历史故事（31天 × 2个 = 62个故事）
- [ ] （可选）全年365天的历史故事已生成

### Netlify
- [ ] 环境变量已配置（3个）
- [ ] `daily-mindset-generation` 函数显示为 scheduled
- [ ] 手动触发测试成功
- [ ] Functions 日志无错误

### 前端
- [ ] 搞好心态加载速度 <1秒
- [ ] 换一篇文章功能正常
- [ ] 历史故事加载速度 <1秒
- [ ] "另一个故事"切换正常
- [ ] 无AI生成按钮（历史故事）

---

## 📞 技术支持

如遇到问题，请查看：
1. `scripts/README.md` - 脚本详细文档
2. Supabase Dashboard - 数据库日志
3. Netlify Dashboard - Functions 执行日志
4. 浏览器 Console - 前端错误日志

完成部署后，建议在生产环境运行1-2天，观察：
- 定时函数是否每天执行成功
- 用户体验是否符合预期（加载速度快）
- 数据库存储是否正常增长

祝部署顺利！🚀
