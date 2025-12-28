/* ========================================
   OpenAI API 配置
   ======================================== */

const OPENAI_CONFIG = {
  // 使用Netlify Function作为代理，保护API key
  functionEndpoint: '/.netlify/functions/history-story',

  // 本地开发配置
  localDevelopment: {
    // 🔧 本地调试时，是否使用真实的OpenAI API
    // true  = 直接调用OpenAI API（用于调试prompt）
    // false = 使用Mock数据（默认）
    useRealAPI: false,  // 默认关闭，需要时手动开启

    // ⚠️ 仅用于本地调试！不要提交真实的API key到GitHub！
    // 请在本地替换为你的OpenAI API key
    apiKey: 'YOUR_OPENAI_API_KEY_HERE',

    // OpenAI API配置
    endpoint: 'https://api.openai.com/v1/responses',
    model: 'gpt-5-nano'
  },

  // 历史上的今天提示词模板（已移到Netlify Function中）
  historyPrompt: (month, day) => `请讲述一个发生在${month}月${day}日的真实历史事件。

⚠️ 重要：必须是可验证的真实历史事件，不能编造或虚构！

要求：
1. 必须包含具体的年份、人物姓名或事件名称
2. 选择有趣、温暖或有意义的历史事件
3. 用亲切、有趣的口吻讲述
4. 字数控制在120-150字
5. 结尾可以加一句温暖的话

请直接开始讲故事，不要加标题或额外说明，不要询问用户。`
};

/**
 * 调用Netlify Function生成历史故事
 */
async function generateHistoryStory(month, day) {
  // 检测是否在本地开发环境
  const isLocalhost = window.location.hostname === 'localhost' ||
                      window.location.hostname === '127.0.0.1';

  // 本地开发模式
  if (isLocalhost) {
    // 如果启用了真实API调用（用于调试prompt）
    if (OPENAI_CONFIG.localDevelopment.useRealAPI && OPENAI_CONFIG.localDevelopment.apiKey) {
      console.log('🔧 本地开发模式：调用真实OpenAI API');
      return await callOpenAIDirectly(month, day);
    } else {
      console.log('🔧 本地开发模式：使用模拟历史故事');
      return getMockHistoryStory(month, day);
    }
  }

  // 生产环境：调用Netlify Function
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
 * 本地开发：直接调用OpenAI API（用于调试prompt）
 */
async function callOpenAIDirectly(month, day) {
  try {
    const config = OPENAI_CONFIG.localDevelopment;

    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model,
        input: OPENAI_CONFIG.historyPrompt(month, day),
        store: true,
        reasoning: null,
        text: {
          verbosity: 'low'  // 减少冗余输出
        }
        // 移除max_output_tokens限制，让模型有足够空间输出
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ OpenAI API响应成功');

    // GPT-5 API响应格式: data.output[1].content[0].text
    // output是数组，第二个元素(type="message")包含实际回复
    if (data.output && Array.isArray(data.output)) {
      const messageItem = data.output.find(item => item.type === 'message');
      if (messageItem && messageItem.content && messageItem.content[0]) {
        const text = messageItem.content[0].text;
        console.log('✅ 成功提取故事文本');
        return text;
      }
    }

    console.warn('⚠️ 无法从API响应提取文本，使用fallback');
    return getMockHistoryStory(month, day);

  } catch (error) {
    console.error('直接调用OpenAI API失败:', error);
    console.log('回退到Mock数据');
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
