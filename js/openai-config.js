/* ========================================
   OpenAI API 配置
   ======================================== */

const OPENAI_CONFIG = {
  // ⚠️ 重要：不要直接在这里写API key！
  // 应该使用环境变量或Netlify Functions
  apiKey: '', // 暂时留空，稍后配置

  endpoint: 'https://api.openai.com/v1/responses',
  model: 'gpt-5-nano',

  // 历史上的今天提示词模板
  historyPrompt: (month, day) => `请讲述一个发生在${month}月${day}日的有趣历史事件。

要求：
1. 选择一个真实的历史事件
2. 用温暖、有趣的口吻讲述
3. 字数控制在150-200字
4. 适合给女朋友讲故事的语气
5. 结尾可以加一句温暖的话

请直接开始讲故事，不要加标题或额外说明。`
};

/**
 * 调用OpenAI API生成历史故事
 */
async function generateHistoryStory(month, day) {
  // 如果没有配置API key，返回模拟数据
  if (!OPENAI_CONFIG.apiKey) {
    console.warn('OpenAI API key not configured');
    return getMockHistoryStory(month, day);
  }

  try {
    const response = await fetch(OPENAI_CONFIG.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_CONFIG.apiKey}`
      },
      body: JSON.stringify({
        model: OPENAI_CONFIG.model,
        input: OPENAI_CONFIG.historyPrompt(month, day),
        store: true
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();

    // 根据实际API响应格式调整
    // 这里假设响应格式，需要根据GPT-5实际API调整
    return data.output || data.text || data.content || '加载失败';

  } catch (error) {
    console.error('OpenAI API error:', error);
    return getMockHistoryStory(month, day);
  }
}

/**
 * 获取模拟的历史故事（当API不可用时）
 */
function getMockHistoryStory(month, day) {
  const stories = {
    '12-27': '1831年的今天，达尔文登上了"小猎犬号"开始了他改变世界的航行。这次为期5年的旅程，让他观察到了加拉帕戈斯群岛上不同的雀鸟，最终提出了进化论。\n\n有时候，改变世界的旅程也是从一小步开始的。就像你今天又勇敢地走过了一天，每一天的小小坚持，都在慢慢塑造更好的自己 💫',
    '12-28': '1895年的今天，卢米埃尔兄弟在巴黎首次公开放映了电影。当时的观众看到火车驶向银幕时，惊慌地四处躲避，以为火车真的要冲出来了。\n\n第一次见到的东西总是让人惊奇又不安，但正是这些新奇的体验让生活变得有趣。就像我们的每一天，也都是全新的 🎬',
    'default': `${month}月${day}日这一天，历史上发生过许多有趣的事情。\n\n不过比起遥远的历史，今天你又平安度过了一天，这本身就是一件值得记录的美好事情 ✨`
  };

  const key = `${month}-${day}`;
  return stories[key] || stories['default'];
}
