# 💝 情书功能使用指南

## 概述

情书功能是一个支持文字、图片、PDF等多种内容类型的情感记录系统。你可以通过数据库添加情书，🐻可以通过"搞好心态"页面下方的💝按钮查看，并前后翻页浏览。

## 功能特点

- ✨ 支持纯文字、图片、PDF、混合等多种内容类型
- 📅 可以自定义显示日期（比如纪念日）
- 🏷️ 支持标签分类（如"纪念日"、"日常"、"特殊时刻"）
- ⏮️⏭️ 支持前后翻页浏览
- 🎨 精美的UI设计，支持图片点击放大

## 快速开始

### 第一步：创建数据库表

在你的Supabase项目中执行以下SQL：

```sql
-- 运行 sql/create_love_letters_table.sql 中的内容
```

### 第二步：添加情书

有两种方式添加情书：

#### 方式1：通过Supabase Dashboard（推荐新手）

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 点击左侧菜单的 "Table Editor"
4. 选择 `love_letters` 表
5. 点击 "Insert row" 添加新情书
6. 填写以下字段：
   - `display_date`: 显示日期（格式：2026-01-05）
   - `title`: 标题（如"给🐻的一封信"）
   - `content_type`: 内容类型
     - `text`: 纯文字
     - `image`: 图片
     - `pdf`: PDF文档
     - `mixed`: 混合（可以同时包含文字+图片+PDF）
   - `text_content`: 文字内容（换行用 `\n`）
   - `image_urls`: 图片URL数组（格式：`["images/pic1.jpg", "images/pic2.jpg"]`）
   - `pdf_url`: PDF文件URL
   - `tags`: 标签数组（格式：`["纪念日", "特殊时刻"]`）
   - `display_order`: 显示顺序（数字越小越靠前）

#### 方式2：运行SQL插入（推荐熟练者）

参考 `sql/insert_love_letters_examples.sql` 中的示例。

## 示例

### 示例1：纯文字情书

```sql
INSERT INTO love_letters (display_date, title, content_type, text_content, display_order, tags)
VALUES (
  '2026-01-05',
  '今天也要好好的',
  'text',
  '🐻，今天的你还好吗？

我知道有时候生活会有点累，工作会有点烦，但我想让你知道：你已经做得很好了。

不需要总是很坚强，不需要总是很完美。你就是你，这样就很好。💝',
  1,
  '["日常", "鼓励"]'::jsonb
);
```

### 示例2：混合内容（文字+图片+PDF）

```sql
INSERT INTO love_letters (
  display_date, title, content_type,
  text_content, image_urls, pdf_url,
  display_order, tags
)
VALUES (
  '2026-01-05',
  '关于我们的未来',
  'mixed',
  '🐻，我想和你分享我最近的一些思考。这里有一些我们的美好回忆，还有一份我认真写的关于未来的想法。',
  '["images/memory1.jpg", "images/memory2.jpg"]'::jsonb,
  'documents/our-future.pdf',
  1,
  '["未来规划", "特殊时刻"]'::jsonb
);
```

### 示例3：图片情书

```sql
INSERT INTO love_letters (display_date, title, content_type, image_urls, display_order, tags)
VALUES (
  '2026-01-06',
  '我们的回忆',
  'image',
  '["images/photo1.jpg", "images/photo2.jpg", "images/photo3.jpg"]'::jsonb,
  2,
  '["回忆", "照片"]'::jsonb
);
```

## 上传图片和PDF

### 方法1：使用Supabase Storage

1. 在Supabase Dashboard中创建一个公开的Storage bucket（如 `love-letters`）
2. 上传图片或PDF文件
3. 获取公开URL
4. 在数据库中使用该URL

### 方法2：使用项目中的目录

1. 将图片放在 `images/` 目录
2. 将PDF放在 `documents/` 目录
3. 提交并推送到GitHub
4. 使用相对路径（如 `images/photo.jpg` 或 `documents/letter.pdf`）

## 管理情书

### 修改情书

在Supabase Dashboard的Table Editor中直接编辑对应行。

### 删除情书

情书使用软删除：

```sql
UPDATE love_letters
SET is_visible = false
WHERE id = 'your-letter-id';
```

### 调整显示顺序

修改 `display_order` 字段，数字越小越靠前。

## 前端展示

🐻通过以下步骤查看情书：

1. 打开网站，进入"搞好心态"标签
2. 在页面底部看到一个半透明的💝按钮
3. 点击按钮打开情书模态框
4. 使用"上一封"和"下一封"按钮翻页浏览

## 技巧

1. **日期可以倒序**：`display_date` 可以设置为过去或未来的日期，创造"时光胶囊"的感觉
2. **display_order 优先**：系统会先按 `display_order` 排序，再按日期排序
3. **标签分类**：使用标签来组织不同主题的情书
4. **混合内容**：使用 `mixed` 类型可以同时展示文字、图片和PDF

## 常见问题

**Q: 如何隐藏某封情书？**
A: 将 `is_visible` 设置为 `false`

**Q: 图片不显示怎么办？**
A: 检查图片URL是否正确，确保图片文件已上传到正确位置

**Q: 可以添加视频吗？**
A: 当前版本不直接支持视频，但你可以在文字中添加视频链接

**Q: 情书的顺序如何控制？**
A: 先按 `display_order`（升序），再按 `display_date`（降序）

## 下一步

你可以根据需要：
- 添加更多字段（如 `mood`、`weather` 等）
- 创建一个管理后台界面（待开发）
- 设置定时发送新情书的功能

---

💝 用心记录每一个温暖的时刻
