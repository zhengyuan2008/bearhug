-- 插入示例情书数据
-- 这些是示例数据，你可以根据实际情况修改或添加

-- 示例1：纯文字情书
INSERT INTO love_letters (display_date, title, content_type, text_content, display_order, tags, mood)
VALUES (
  '2026-01-05',
  '给🐻的一封信',
  'text',
  '🐻，我想和你分享我最近关于未来、关于我们可能有的小宝宝的一些认真思考。

写这封信不是为了给你压力，而是想让你看到：**我真的很重视你**，也很重视我们的未来。

我想让你知道，你的价值从来不是由"能否给我带来孩子"来定义的。

无论将来会怎样，**我希望我们能一起面对**。你不是一个人在承受这些，我会一直在你身边。

— 永远爱你的胖🐰',
  1,
  '["特殊时刻", "未来规划"]'::jsonb,
  '温暖'
);

-- 示例2：混合内容（文字+图片）
INSERT INTO love_letters (display_date, title, content_type, text_content, image_urls, display_order, tags, mood)
VALUES (
  '2026-01-06',
  '我们的回忆',
  'mixed',
  '🐻，还记得这些美好的时刻吗？每一张照片都是我们爱的见证。

我喜欢和你在一起的每一天，无论是平凡的日常，还是特别的时刻。',
  '["images/memory1.jpg", "images/memory2.jpg"]'::jsonb,
  2,
  '["回忆", "日常"]'::jsonb,
  '浪漫'
);

-- 示例3：PDF文档
INSERT INTO love_letters (display_date, title, content_type, text_content, pdf_url, display_order, tags, mood)
VALUES (
  '2026-01-07',
  '关于未来的思考',
  'pdf',
  '这份文档里有我认真思考的所有内容，关于我们、关于未来、关于可能的小宝宝。',
  'documents/our-future.pdf',
  3,
  '["未来规划", "深度思考"]'::jsonb,
  '认真'
);

-- 示例4：纯文字鼓励信
INSERT INTO love_letters (display_date, title, content_type, text_content, display_order, tags, mood)
VALUES (
  CURRENT_DATE,
  '今天也要好好的',
  'text',
  '🐻，今天的你还好吗？

我知道有时候生活会有点累，工作会有点烦，但我想让你知道：你已经做得很好了。

不需要总是很坚强，不需要总是很完美。你就是你，这样就很好。

我会一直在你身边，陪着你。💝',
  4,
  '["日常", "鼓励"]'::jsonb,
  '温柔'
);
