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
const OPENAI_MODEL = 'gpt-4o-mini';

/**
 * 从数据库获取所有激活的话题
 */
async function fetchTopicsFromDatabase() {
  console.log('📚 Fetching topics from database...');

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/mindset_topics?is_active=eq.true&order=display_order.asc`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch topics: ${response.status}`);
    }

    const topics = await response.json();
    console.log(`✅ Loaded ${topics.length} topics from database`);
    return topics;

  } catch (error) {
    console.error('❌ Error fetching topics:', error.message);
    throw error;
  }
}

/**
 * 生成心态文章的提示词
 */
function getMindsetPrompt(topic) {
  return `你是一个温暖、专业的心理支持伴侣（胖🐰），正在给你的🐻写一篇关于"${topic.title}"的安慰和鼓励文章。

## 背景信息
${topic.background_context}

## 写作要求
1. **语气温柔、亲密**：像胖🐰在对🐻说话，用"你"而不是"我们"
2. **真实共情**：真正理解🐻的处境和感受，不要空洞的鼓励
3. **具体可感**：用具体的例子、比喻，让🐻觉得被看见
4. **接纳为主**：重点是接纳现状，而不是要求改变
5. **适度建议**：如果有建议，要温和、可选择，不要说教
6. **字数**：280-350字
7. **结构**：
   - 开头：理解和看见🐻的感受
   - 中间：深入共情，给出接纳和支持
   - 结尾：温暖的陪伴和希望

## 注意事项
- 不要用"加油""你可以的"这类过于积极的话
- 不要说"每个人都...""大家都..."这类泛泛之谈
- 要让🐻感到"被看见""被理解""被允许"
- 可以用一些温柔的比喻和意象
- 语言要自然、口语化，像在聊天
- **最重要**：文章末尾不要加任何"AI生成"、"by ChatGPT"之类的标识

请直接输出文章内容，不要加标题或前缀说明。`;
}

/**
 * 调用OpenAI API生成文章
 */
async function generateArticleWithAI(topic) {
  console.log(`🤖 Generating article for topic: ${topic.title}`);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [{
          role: 'user',
          content: getMindsetPrompt(topic)
        }],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // 提取文本内容
    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
      const content = data.choices[0].message.content.trim();
      console.log(`✅ Generated article (${content.length} chars)`);
      return content;
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
 * 随机选择指定数量的话题
 */
function selectRandomTopics(topics, count = 5) {
  if (topics.length <= count) {
    return topics;
  }
  const shuffled = [...topics].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * 主函数：生成今日的5篇文章
 */
async function generateTodayArticles() {
  console.log('=== 开始生成今日心态文章 ===');
  console.log(`📅 Date: ${new Date().toISOString().split('T')[0]}`);

  // 1. 从数据库获取话题
  let allTopics;
  try {
    allTopics = await fetchTopicsFromDatabase();
    if (!allTopics || allTopics.length === 0) {
      throw new Error('No active topics found in database');
    }
  } catch (error) {
    console.error('❌ Failed to fetch topics from database');
    throw error;
  }

  // 2. 先过期昨天的文章
  try {
    await expireYesterdayArticles();
  } catch (error) {
    console.warn('⚠️ Failed to expire yesterday articles, continuing...');
  }

  // 3. 随机选择5个话题
  const selectedTopics = selectRandomTopics(allTopics, 5);
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
