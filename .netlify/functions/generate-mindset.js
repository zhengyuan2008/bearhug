const fetch = require('node-fetch');

exports.handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { topicTitle, topicDescription, backgroundContext } = JSON.parse(event.body);

    const prompt = `你是一个温暖、专业的心理支持伴侣（胖🐰），正在给你的🐻写一篇安慰和鼓励的文章。

## 话题
**${topicTitle}**
${topicDescription}

## 背景信息
${backgroundContext}

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

请直接输出文章内容，不要加标题或前缀说明。`;

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-5-nano',
        input: prompt,
        store: true,
        reasoning: null,
        text: {
          verbosity: 'low'
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    // Extract text from response - GPT-5 format
    let article = `${topicTitle}\n\n我知道你现在可能在经历一些不容易的时刻。作为你的胖🐰，我想告诉你：你所感受到的一切都是真实的，也都是被允许的。\n\n${topicDescription}这些感受不需要被快速解决，也不需要被证明是"对"还是"错"。它们就在那里，是你此刻真实状态的一部分。\n\n你不需要总是很坚强，也不需要总是很积极。有时候，允许自己就这样待着，已经是很了不起的事情了。我会一直在你身边，陪着你慢慢来。`; // fallback

    if (data.output && Array.isArray(data.output)) {
      const messageItem = data.output.find(item => item.type === 'message');
      if (messageItem && messageItem.content && messageItem.content[0]) {
        article = messageItem.content[0].text;
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        article,
        source: 'openai-api',
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Error:', error);

    const { topicTitle, topicDescription } = JSON.parse(event.body || '{}');

    // 即使出错，也返回200状态码和fallback内容，让客户端能正常显示
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        article: `${topicTitle || '今天也要好好对待自己'}\n\n我知道你现在可能在经历一些不容易的时刻。作为你的胖🐰，我想告诉你：你所感受到的一切都是真实的，也都是被允许的。\n\n${topicDescription || ''}这些感受不需要被快速解决，也不需要被证明是"对"还是"错"。它们就在那里，是你此刻真实状态的一部分。\n\n你不需要总是很坚强，也不需要总是很积极。有时候，允许自己就这样待着，已经是很了不起的事情了。我会一直在你身边，陪着你慢慢来。`,
        source: 'error-fallback',
        error: error.message
      })
    };
  }
};
