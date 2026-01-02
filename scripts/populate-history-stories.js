#!/usr/bin/env node

/**
 * 生成365天历史上的今天故事的脚本
 * 用途：一次性预生成全年的历史故事，每天2-3个故事
 *
 * 运行方式：
 * - 本地开发：node scripts/populate-history-stories.js
 * - 可选参数：
 *   --month=1-12  只生成指定月份
 *   --stories=2   每天生成几个故事（默认2）
 *   --dry-run     不写入数据库，仅测试
 */

require('dotenv').config();
const fetch = require('node-fetch');

// Supabase配置
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// OpenAI配置
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = 'gpt-5-nano';

// 每个月的天数
const DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // 考虑闰年2月29日

/**
 * 生成历史故事的提示词
 */
function getHistoryPrompt(month, day, storyIndex) {
  const date = `${month}月${day}日`;

  return `你是一个历史学者和故事讲述者。请为"${date}"这一天写一个历史上的今天故事（第${storyIndex}个故事）。

要求：
1. 字数：400-600字（因为是预生成，可以写得详细一些）
2. 选择这一天发生的真实历史事件，可以是：
   - 重大历史事件（战争、和平条约、科技突破等）
   - 名人诞生或去世
   - 文化艺术里程碑
   - 社会变革
3. 结构：
   - 开头：简洁地介绍事件（时间+地点+主角）
   - 中间：讲述事件经过和细节
   - 结尾：简要说明这个事件的历史意义或影响
4. 语气：客观、有趣、引人入胜
5. 避免：过度煽情、主观评价、政治敏感内容

${storyIndex > 1 ? `注意：这是第${storyIndex}个故事，请选择与前面不同的事件类型。` : ''}

请直接输出故事内容，不要加日期标题或额外说明。`;
}

/**
 * 调用OpenAI API生成历史故事
 */
async function generateHistoryStory(month, day, storyIndex) {
  console.log(`🤖 Generating story for ${month}/${day} (story #${storyIndex})`);

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        input: getHistoryPrompt(month, day, storyIndex),
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
        const story = messageItem.content[0].text;
        console.log(`✅ Generated story (${story.length} chars)`);
        return story;
      }
    }

    throw new Error('Failed to extract story from OpenAI response');

  } catch (error) {
    console.error(`❌ Error generating story for ${month}/${day} #${storyIndex}:`, error.message);
    throw error;
  }
}

/**
 * 保存故事到Supabase数据库
 */
async function saveStoryToDatabase(month, day, story, storyIndex) {
  console.log(`💾 Saving story to database: ${month}/${day} #${storyIndex}`);

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/history_today_stories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        month,
        day,
        story,
        story_index: storyIndex
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Supabase error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`✅ Story saved (ID: ${data[0].id})`);
    return data[0];

  } catch (error) {
    console.error(`❌ Error saving story to database:`, error.message);
    throw error;
  }
}

/**
 * 检查数据库中是否已存在该故事
 */
async function checkStoryExists(month, day, storyIndex) {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/history_today_stories?month=eq.${month}&day=eq.${day}&story_index=eq.${storyIndex}`,
      {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to check existing stories`);
    }

    const data = await response.json();
    return data.length > 0;

  } catch (error) {
    console.error(`❌ Error checking story existence:`, error.message);
    return false;
  }
}

/**
 * 为一天生成多个故事
 */
async function generateStoriesForDay(month, day, storiesPerDay, dryRun = false, skipExisting = true) {
  console.log(`\n📅 Processing ${month}/${day}...`);

  const results = [];

  for (let storyIndex = 1; storyIndex <= storiesPerDay; storyIndex++) {
    try {
      // 检查是否已存在
      if (skipExisting) {
        const exists = await checkStoryExists(month, day, storyIndex);
        if (exists) {
          console.log(`⏭️  Story ${month}/${day} #${storyIndex} already exists, skipping...`);
          results.push({
            success: true,
            skipped: true,
            month,
            day,
            storyIndex
          });
          continue;
        }
      }

      // 生成故事
      const story = await generateHistoryStory(month, day, storyIndex);

      // 保存到数据库（除非是dry-run模式）
      let savedStory = null;
      if (!dryRun) {
        savedStory = await saveStoryToDatabase(month, day, story, storyIndex);
      } else {
        console.log(`🔍 DRY RUN: Would save story (${story.length} chars)`);
      }

      results.push({
        success: true,
        skipped: false,
        month,
        day,
        storyIndex,
        storyId: savedStory?.id
      });

      // API限流延迟
      if (storyIndex < storiesPerDay) {
        console.log('⏳ Waiting 2 seconds before next story...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

    } catch (error) {
      console.error(`❌ Failed to process story ${month}/${day} #${storyIndex}`);
      results.push({
        success: false,
        skipped: false,
        month,
        day,
        storyIndex,
        error: error.message
      });
    }
  }

  return results;
}

/**
 * 生成指定月份的所有故事
 */
async function generateStoriesForMonth(month, storiesPerDay, dryRun, skipExisting) {
  console.log(`\n========== 开始处理 ${month}月 ==========`);

  const daysInMonth = DAYS_IN_MONTH[month - 1];
  const allResults = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const dayResults = await generateStoriesForDay(month, day, storiesPerDay, dryRun, skipExisting);
    allResults.push(...dayResults);

    // 每天之间延迟，避免API限流
    if (day < daysInMonth) {
      console.log('⏳ Waiting 3 seconds before next day...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  return allResults;
}

/**
 * 生成全年365天的故事
 */
async function generateAllStories(storiesPerDay = 2, dryRun = false, skipExisting = true, targetMonth = null) {
  console.log('=== 开始生成历史上的今天故事 ===');
  console.log(`📊 Configuration:`);
  console.log(`  - Stories per day: ${storiesPerDay}`);
  console.log(`  - Dry run: ${dryRun ? 'Yes (不写入数据库)' : 'No (写入数据库)'}`);
  console.log(`  - Skip existing: ${skipExisting ? 'Yes' : 'No'}`);
  console.log(`  - Target month: ${targetMonth || 'All (1-12)'}`);

  const allResults = [];
  const startMonth = targetMonth || 1;
  const endMonth = targetMonth || 12;

  for (let month = startMonth; month <= endMonth; month++) {
    const monthResults = await generateStoriesForMonth(month, storiesPerDay, dryRun, skipExisting);
    allResults.push(...monthResults);

    // 月份之间延迟
    if (month < endMonth) {
      console.log('\n⏳ Waiting 5 seconds before next month...\n');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  // 输出汇总
  console.log('\n========== 生成结果汇总 ==========');
  const successCount = allResults.filter(r => r.success && !r.skipped).length;
  const skippedCount = allResults.filter(r => r.skipped).length;
  const failCount = allResults.filter(r => !r.success).length;
  const totalDays = allResults.length / storiesPerDay;

  console.log(`✅ 成功生成: ${successCount} 个故事`);
  console.log(`⏭️  跳过已存在: ${skippedCount} 个故事`);
  console.log(`❌ 失败: ${failCount} 个故事`);
  console.log(`📅 处理天数: ${totalDays} 天`);

  if (failCount > 0) {
    console.log('\n失败的故事:');
    allResults.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.month}/${r.day} #${r.storyIndex}: ${r.error}`);
    });
  }

  return {
    success: successCount,
    skipped: skippedCount,
    failed: failCount,
    total: allResults.length,
    results: allResults
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
 * 解析命令行参数
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    storiesPerDay: 2,
    dryRun: false,
    skipExisting: true,
    targetMonth: null
  };

  args.forEach(arg => {
    if (arg.startsWith('--stories=')) {
      options.storiesPerDay = parseInt(arg.split('=')[1]);
    } else if (arg.startsWith('--month=')) {
      options.targetMonth = parseInt(arg.split('=')[1]);
      if (options.targetMonth < 1 || options.targetMonth > 12) {
        throw new Error('Month must be between 1 and 12');
      }
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--force') {
      options.skipExisting = false;
    }
  });

  return options;
}

/**
 * 主入口
 */
async function main() {
  try {
    checkEnvironment();
    const options = parseArgs();

    console.log('\n⚠️  WARNING: This script will make hundreds of OpenAI API calls!');
    console.log(`Estimated API calls: ${(options.targetMonth ? DAYS_IN_MONTH[options.targetMonth - 1] : 365) * options.storiesPerDay}`);
    console.log(`Estimated cost: ~$${((options.targetMonth ? DAYS_IN_MONTH[options.targetMonth - 1] : 365) * options.storiesPerDay * 0.02).toFixed(2)} USD\n`);

    if (!options.dryRun) {
      console.log('⏳ Starting in 5 seconds... (Ctrl+C to cancel)');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    const results = await generateAllStories(
      options.storiesPerDay,
      options.dryRun,
      options.skipExisting,
      options.targetMonth
    );

    console.log('\n✅ Script completed successfully');
    process.exit(results.failed > 0 ? 1 : 0);

  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// 如果直接运行脚本
if (require.main === module) {
  main();
}

// 导出函数供其他模块使用
module.exports = {
  generateHistoryStory,
  generateStoriesForDay,
  generateStoriesForMonth,
  generateAllStories
};
