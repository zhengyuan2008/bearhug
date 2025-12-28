/**
 * Netlify Function: 生成历史上的今天故事
 *
 * 这个函数作为后端代理，保护OpenAI API key不被暴露在前端
 */

exports.handler = async (event, context) => {
  // 设置CORS头
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // 处理OPTIONS预检请求
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // 只允许POST请求
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // 解析请求参数
    const { month, day } = JSON.parse(event.body);

    // 验证参数
    if (!month || !day) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing month or day parameter' })
      };
    }

    // 检查API key是否配置
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OPENAI_API_KEY not configured');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          story: getFallbackStory(month, day),
          source: 'fallback'
        })
      };
    }

    // 构建提示词
    const prompt = `请讲述一个发生在${month}月${day}日的有趣历史事件。

要求：
1. 选择一个真实的历史事件
2. 用温暖、有趣的口吻讲述
3. 字数控制在150-200字
4. 适合给女朋友讲故事的语气
5. 结尾可以加一句温暖的话

请直接开始讲故事，不要加标题或额外说明。`;

    console.log(`Calling OpenAI API for ${month}/${day}...`);

    // 调用OpenAI API
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-5-nano',
        input: prompt,
        store: true
      })
    });

    // 检查响应状态
    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);

      // 如果API调用失败，返回fallback故事
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          story: getFallbackStory(month, day),
          source: 'fallback',
          error: `API error: ${response.status}`
        })
      };
    }

    const data = await response.json();
    console.log('OpenAI API response received');

    // 提取故事内容（根据实际API响应格式调整）
    const story = data.output || data.text || data.content || getFallbackStory(month, day);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        story,
        source: 'openai'
      })
    };

  } catch (error) {
    console.error('Function error:', error);

    // 发生错误时返回fallback故事
    const { month, day } = JSON.parse(event.body || '{}');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        story: getFallbackStory(month, day),
        source: 'fallback',
        error: error.message
      })
    };
  }
};

/**
 * 获取fallback故事（当API不可用时）
 */
function getFallbackStory(month, day) {
  const stories = {
    '12-27': '1831年的今天，达尔文登上了"小猎犬号"开始了他改变世界的航行。这次为期5年的旅程，让他观察到了加拉帕戈斯群岛上不同的雀鸟，最终提出了进化论。\n\n有时候，改变世界的旅程也是从一小步开始的。就像你今天又勇敢地走过了一天，每一天的小小坚持，都在慢慢塑造更好的自己 💫',

    '12-28': '1895年的今天，卢米埃尔兄弟在巴黎首次公开放映了电影。当时的观众看到火车驶向银幕时，惊慌地四处躲避，以为火车真的要冲出来了。\n\n第一次见到的东西总是让人惊奇又不安，但正是这些新奇的体验让生活变得有趣。就像我们的每一天，也都是全新的 🎬',

    '1-1': '1863年的今天，林肯总统签署了《解放黑奴宣言》。虽然这只是一个开始，但它象征着正义和平等的重要一步。\n\n每一个重要的改变，都始于勇敢的第一步。今天也是新的一年，愿你的每一天都充满希望 🌟',

    'default': `${month}月${day}日这一天，历史上发生过许多有趣的事情。\n\n不过比起遥远的历史，今天你又平安度过了一天，这本身就是一件值得记录的美好事情 ✨`
  };

  const key = `${month}-${day}`;
  return stories[key] || stories['default'];
}
