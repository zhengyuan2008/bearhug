#!/usr/bin/env node

/**
 * 生成搞好心态文章的脚本
 * 用途：
 * 1. 初始化：生成今日的5篇文章
 * 2. 定时任务：每天凌晨12点运行，生成新的5篇文章
 *
 * 运行方式：
 * - 本地开发：node scripts/generate-mindset-articles.js
 * - Netlify定时函数：部署到 .netlify/functions/daily-mindset-generation.js
 */

require('dotenv').config();
const fetch = require('node-fetch');

// Supabase配置（从环境变量读取）
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// OpenAI配置（从环境变量读取）
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = 'gpt-5-nano';

/**
 * 心态话题列表
 * 注意：实际运行时应该从数据库 mindset_topics 表读取
 */
const TOPICS = [
  { id: 'topic-1', title: '工作压力管理', prompt: '如何更好地管理工作中的压力' },
  { id: 'topic-2', title: '情绪调节', prompt: '负面情绪出现时如何自我调节' },
  { id: 'topic-3', title: '自我接纳', prompt: '如何接纳不完美的自己' },
  { id: 'topic-4', title: '人际关系', prompt: '如何处理复杂的人际关系' },
  { id: 'topic-5', title: '职业发展', prompt: '对职业发展感到迷茫时该怎么办' },
  { id: 'topic-6', title: '生活平衡', prompt: '如何平衡工作和生活' },
  { id: 'topic-7', title: '焦虑应对', prompt: '焦虑时如何让自己平静下来' },
  { id: 'topic-8', title: '自信培养', prompt: '如何建立自信心' }
];

/**
 * 生成心态文章的提示词
 */
function getMindsetPrompt(topic) {
  return `你是一个温暖、专业的心理健康支持助手。请写一篇关于"${topic.title}"的文章，主题是：${topic.prompt}。

要求：
1. 字数：300-400字
2. 语气：温暖、共情、鼓励，像朋友在说话
3. 结构：开头共情 → 分析原因 → 提供2-3个具体可行的建议 → 结尾鼓励
4. 避免：说教、空洞的鸡汤、过度乐观、专业术语
5. 包含：具体例子、实用技巧、可执行步骤

请直接输出文章内容，不要标题和额外说明。`;
}

/**
 * 调用OpenAI API生成文章
 */
async function generateArticleWithAI(topic) {
  console.log(`🤖 Generating article for topic: ${topic.title}`);

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        input: getMindsetPrompt(topic),
        store: true,
        reasoning: null,
        text: {
          verbosity: 'low'
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // 提取文本内容
    if (data.output && Array.isArray(data.output)) {
      const messageItem = data.output.find(item => item.type === 'message');
      if (messageItem && messageItem.content && messageItem.content[0]) {
        const content = messageItem.content[0].text;
        console.log(`✅ Generated article (${content.length} chars)`);
        return content;
      }
    }

    throw new Error('Failed to extract content from OpenAI response');

  } catch (error) {
    console.error(`❌ Error generating article for ${topic.title}:`, error.message);
    throw error;
  }
}

/**
 * 保存文章到Supabase数据库
 */
async function saveArticleToDatabase(topicId, content, displayOrder) {
  console.log(`💾 Saving article to database (order: ${displayOrder})`);

  const today = new Date().toISOString().split('T')[0];

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/mindset_articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        topic_id: topicId,
        content: content,
        generation_date: today,
        display_order: displayOrder,
        is_expired: false,
        is_read: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Supabase error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`✅ Article saved to database (ID: ${data[0].id})`);
    return data[0];

  } catch (error) {
    console.error(`❌ Error saving article to database:`, error.message);
    throw error;
  }
}

/**
 * 将昨天的文章标记为过期
 */
async function expireYesterdayArticles() {
  console.log('🗑️ Expiring yesterday\'s articles...');

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/mindset_articles?generation_date=eq.${yesterdayStr}&is_expired=eq.false`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        is_expired: true
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Supabase error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`✅ Expired ${data.length} articles from ${yesterdayStr}`);
    return data;

  } catch (error) {
    console.error(`❌ Error expiring articles:`, error.message);
    throw error;
  }
}

/**
 * 随机选择5个不同的话题
 */
function selectRandomTopics(count = 5) {
  const shuffled = [...TOPICS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * 主函数：生成今日的5篇文章
 */
async function generateTodayArticles() {
  console.log('=== 开始生成今日心态文章 ===');
  console.log(`📅 Date: ${new Date().toISOString().split('T')[0]}`);

  // 1. 先过期昨天的文章
  try {
    await expireYesterdayArticles();
  } catch (error) {
    console.warn('⚠️ Failed to expire yesterday articles, continuing...');
  }

  // 2. 随机选择5个话题
  const selectedTopics = selectRandomTopics(5);
  console.log(`📚 Selected topics:`, selectedTopics.map(t => t.title).join(', '));

  // 3. 为每个话题生成文章
  const results = [];
  for (let i = 0; i < selectedTopics.length; i++) {
    const topic = selectedTopics[i];
    const displayOrder = i + 1;

    console.log(`\n--- Generating article ${displayOrder}/5 ---`);

    try {
      // 生成文章内容
      const content = await generateArticleWithAI(topic);

      // 保存到数据库
      const savedArticle = await saveArticleToDatabase(topic.id, content, displayOrder);

      results.push({
        success: true,
        topic: topic.title,
        displayOrder,
        articleId: savedArticle.id
      });

      // 添加延迟避免API限流
      if (i < selectedTopics.length - 1) {
        console.log('⏳ Waiting 2 seconds before next generation...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

    } catch (error) {
      console.error(`❌ Failed to generate article for ${topic.title}`);
      results.push({
        success: false,
        topic: topic.title,
        displayOrder,
        error: error.message
      });
    }
  }

  // 4. 输出结果汇总
  console.log('\n=== 生成结果汇总 ===');
  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;

  console.log(`✅ 成功: ${successCount} 篇`);
  console.log(`❌ 失败: ${failCount} 篇`);

  if (failCount > 0) {
    console.log('\n失败的文章:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.topic}: ${r.error}`);
    });
  }

  return {
    success: successCount,
    failed: failCount,
    results
  };
}

/**
 * 环境变量检查
 */
function checkEnvironment() {
  if (!SUPABASE_URL) {
    throw new Error('Missing environment variable: SUPABASE_URL');
  }
  if (!SUPABASE_ANON_KEY) {
    throw new Error('Missing environment variable: SUPABASE_ANON_KEY');
  }
  if (!OPENAI_API_KEY) {
    throw new Error('Missing environment variable: OPENAI_API_KEY');
  }
  console.log('✅ Environment variables loaded');
}

/**
 * 主入口
 */
async function main() {
  try {
    checkEnvironment();
    const results = await generateTodayArticles();

    if (results.failed > 0) {
      process.exit(1); // 有失败的文章，返回错误码
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// 如果直接运行脚本
if (require.main === module) {
  main();
}

// 导出函数供Netlify Functions使用
module.exports = { generateTodayArticles, expireYesterdayArticles };
