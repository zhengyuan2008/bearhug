/**
 * Netlify Scheduled Function - Daily Mindset Article Generation
 *
 * Schedule: Every day at midnight (00:00 UTC)
 * 使用 Netlify 原生 scheduled functions
 */

const { generateTodayArticles, expireYesterdayArticles } = require('../../scripts/generate-mindset-articles');

// 配置定时任务调度
exports.schedule = "0 0 * * *";  // Cron格式：每天UTC时间00:00执行

exports.handler = async (event, context) => {
  console.log('=== Netlify Scheduled Function: Daily Mindset Generation ===');
  console.log('Triggered at:', new Date().toISOString());

  try {
    // 生成今日的5篇文章
    const results = await generateTodayArticles();

    // 返回成功响应
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Daily mindset articles generated successfully',
        generated: results.success,
        failed: results.failed,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('❌ Error in scheduled function:', error);

    // 返回错误响应
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};
