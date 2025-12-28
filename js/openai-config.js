/* ========================================
   OpenAI API 配置
   ======================================== */

const OPENAI_CONFIG = {
  // 使用Netlify Function作为代理，保护API key
  functionEndpoint: '/.netlify/functions/history-story',

  // 历史上的今天提示词模板（已移到Netlify Function中）
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
 * 调用Netlify Function生成历史故事
 */
async function generateHistoryStory(month, day) {
  // 检测是否在本地开发环境
  const isLocalhost = window.location.hostname === 'localhost' ||
                      window.location.hostname === '127.0.0.1';

  // 本地开发时直接使用mock数据，避免调用不存在的Netlify Function
  if (isLocalhost) {
    console.log('🔧 本地开发模式：使用模拟历史故事');
    return getMockHistoryStory(month, day);
  }

  try {
    console.log(`Calling Netlify Function for ${month}/${day}...`);

    const response = await fetch(OPENAI_CONFIG.functionEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ month, day })
    });

    if (!response.ok) {
      throw new Error(`Function request failed: ${response.status}`);
    }

    const data = await response.json();

    console.log('Story source:', data.source);
    if (data.error) {
      console.warn('Function returned error:', data.error);
    }

    return data.story;

  } catch (error) {
    console.error('Netlify Function error:', error);
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
