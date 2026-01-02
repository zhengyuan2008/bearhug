# Backend Scripts - 后端数据生成脚本

这个目录包含用于预生成和管理数据的后端脚本。

## 📋 脚本列表

### 1. `generate-mindset-articles.js`
**用途**: 生成搞好心态文章（每天5篇）

**功能**:
- 随机选择5个不同的心态话题
- 使用OpenAI API生成文章内容
- 保存到Supabase数据库
- 自动标记昨天的文章为过期

**运行方式**:
```bash
# 本地运行
node scripts/generate-mindset-articles.js

# 通过Netlify定时函数运行（每天凌晨12点）
# 见 .netlify/functions/daily-mindset-generation.js
```

### 2. `generate-january-stories-claude.js` ⭐ **推荐使用**
**用途**: 使用Claude Code直接生成1月份历史故事（无需OpenAI API）

**功能**:
- 生成1月份31天的62个历史故事（每天2个）
- 所有故事由Claude Code直接编写，内容真实可靠
- 输出SQL文件，可直接在Supabase中执行
- **完全免费，不消耗OpenAI budget**

**运行方式**:
```bash
# 生成1月份故事SQL文件
node scripts/generate-january-stories-claude.js

# 输出文件: sql/january_stories_insert.sql
# 然后在Supabase SQL Editor中执行该文件
```

**优势**:
- ✅ 零成本：不调用OpenAI API
- ✅ 即时完成：无需等待API响应
- ✅ 内容可靠：基于真实历史事件
- ✅ 易于修改：可直接编辑SQL文件

---

### 3. `populate-history-stories.js`
**用途**: 一次性预生成365天的历史故事（调用OpenAI API）

**功能**:
- 为全年365天生成历史故事
- 每天可生成2-3个故事
- 支持按月份分批生成
- 自动跳过已存在的故事

**⚠️ 注意**: 此脚本会调用OpenAI API，产生费用（约$15-20 USD用于365天）

**运行方式**:
```bash
# 生成全年故事（每天2个）
node scripts/populate-history-stories.js

# 只生成1月份（每天2个故事）
node scripts/populate-history-stories.js --month=1

# 每天生成3个故事
node scripts/populate-history-stories.js --stories=3

# 测试模式（不写入数据库）
node scripts/populate-history-stories.js --dry-run

# 强制重新生成（覆盖已存在的）
node scripts/populate-history-stories.js --force

# 组合使用
node scripts/populate-history-stories.js --month=1 --stories=3 --dry-run
```

---

## 🔧 环境配置

### 1. 创建 `.env` 文件

在项目根目录创建 `.env` 文件（不要提交到Git）：

```env
# Supabase配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# OpenAI配置
OPENAI_API_KEY=sk-proj-your-api-key
```

### 2. 安装依赖

```bash
npm install node-fetch dotenv
```

### 3. 更新脚本以加载环境变量

在每个脚本顶部添加：

```javascript
require('dotenv').config();
```

---

## 🚀 首次部署流程

### Step 1: 执行数据库Schema

在Supabase SQL Editor中执行：

```bash
# 1. 更新搞好心态表结构
sql/mindset_articles_update.sql

# 2. 创建历史故事表
sql/history_today_stories_schema.sql
```

### Step 2: 生成初始数据

```bash
# 1. 生成今天的5篇心态文章
node scripts/generate-mindset-articles.js

# 2. 生成全年365天的历史故事（可分批运行）
# 建议先测试1月份
node scripts/populate-history-stories.js --month=1 --stories=2

# 确认无误后，生成全年
node scripts/populate-history-stories.js --stories=2
```

**⚠️ 注意**: 生成全年历史故事会调用约730次OpenAI API（每天2个故事），预计费用约$14-20 USD。

### Step 3: 配置Netlify定时任务

在 `netlify.toml` 中添加：

```toml
[[plugins]]
  package = "@netlify/plugin-scheduled-functions"

[functions."daily-mindset-generation"]
  schedule = "0 0 * * *"  # 每天UTC时间00:00执行
```

在Netlify后台配置环境变量：
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`

---

## 📊 数据统计

### 搞好心态文章
- **生成频率**: 每天凌晨12点
- **每次生成**: 5篇文章
- **文章长度**: 300-400字
- **过期机制**: 自动标记昨天的文章为过期
- **用户体验**: 优先读取数据库，如果全部读完才使用AI生成（慢）

### 历史上的今天
- **总数据量**: 365天 × 2-3个故事 = 730-1095个故事
- **每个故事长度**: 400-600字
- **用户体验**: 从数据库即时加载，支持"另一个故事"切换

---

## 🧪 测试建议

### 本地测试流程

1. **测试环境变量**:
```bash
node -e "console.log(process.env.OPENAI_API_KEY ? '✅ API Key loaded' : '❌ Missing API Key')"
```

2. **测试单篇文章生成**:
```bash
# 生成今天的5篇文章
node scripts/generate-mindset-articles.js
```

3. **测试单月历史故事**:
```bash
# 只生成1月份，dry-run模式
node scripts/populate-history-stories.js --month=1 --dry-run
```

4. **验证数据库**:
在Supabase SQL Editor中查询：
```sql
-- 检查今日心态文章
SELECT * FROM mindset_articles
WHERE generation_date = CURRENT_DATE
ORDER BY display_order;

-- 检查历史故事
SELECT month, day, COUNT(*) as story_count
FROM history_today_stories
GROUP BY month, day
ORDER BY month, day;
```

---

## ⚠️ 注意事项

1. **API费用控制**:
   - 每篇文章约$0.01-0.03 USD
   - 每月生成150篇心态文章（5篇/天 × 30天）≈ $3-5 USD/月
   - 一次性生成730个历史故事 ≈ $15-20 USD

2. **API限流**:
   - 脚本内置延迟机制（每个故事间隔2秒）
   - 如遇限流错误，增加延迟时间或分批执行

3. **数据库容量**:
   - 心态文章：每天5篇，保留30天 ≈ 150篇
   - 历史故事：730-1095个故事（固定）
   - 总文本数据量：约1-2MB

4. **错误处理**:
   - 脚本会输出详细日志
   - 失败的生成会记录错误，不影响其他生成
   - 建议监控Netlify定时函数的执行日志

---

## 🔄 日常维护

### 每日自动任务
- ✅ Netlify定时函数每天凌晨12点自动运行
- ✅ 生成5篇新文章
- ✅ 标记昨天的文章为过期

### 手动维护任务

**刷新历史故事** (可选，建议每季度一次):
```bash
# 重新生成某个月份的故事
node scripts/populate-history-stories.js --month=3 --force
```

**检查数据库健康**:
```sql
-- 检查是否有未过期的旧文章
SELECT * FROM mindset_articles
WHERE generation_date < CURRENT_DATE - INTERVAL '1 day'
AND is_expired = false;

-- 检查历史故事覆盖率
SELECT COUNT(DISTINCT (month, day)) as covered_days
FROM history_today_stories;
-- 应该是366天（含闰年2月29日）
```

---

## 📞 故障排查

### 问题1: Netlify定时函数未执行
**解决方案**:
1. 检查 `netlify.toml` 配置
2. 确认已安装 `@netlify/plugin-scheduled-functions` 插件
3. 在Netlify后台查看函数执行日志

### 问题2: OpenAI API报错
**解决方案**:
1. 检查API Key是否有效
2. 确认账户余额充足
3. 检查是否触发限流（Rate Limit）

### 问题3: 数据库写入失败
**解决方案**:
1. 检查Supabase连接
2. 验证RLS策略配置
3. 确认表结构与代码一致

### 问题4: 前端加载不到文章
**解决方案**:
```sql
-- 检查今日是否有文章
SELECT * FROM mindset_articles
WHERE generation_date = CURRENT_DATE
AND is_expired = false
AND is_read = false;

-- 如果没有，手动运行生成脚本
node scripts/generate-mindset-articles.js
```

---

## 📈 未来优化建议

1. **增加话题多样性**:
   - 从数据库 `mindset_topics` 表动态读取话题
   - 支持管理员在Supabase后台添加新话题

2. **历史故事质量监控**:
   - 添加人工审核机制
   - 支持标记和替换低质量故事

3. **性能优化**:
   - 使用批量插入减少数据库调用
   - 添加生成进度缓存

4. **监控和告警**:
   - 集成Sentry监控脚本执行
   - 定时函数失败时发送邮件通知

---

## 🎯 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入你的API密钥

# 3. 执行数据库Schema
# 在Supabase SQL Editor中运行 sql/mindset_articles_update.sql 和 sql/history_today_stories_schema.sql

# 4. 生成初始数据
node scripts/generate-mindset-articles.js
node scripts/populate-history-stories.js --month=1 --stories=2

# 5. 部署到Netlify
git add .
git commit -m "Add backend generation scripts"
git push
# 在Netlify后台配置环境变量和定时任务
```

完成！🎉
