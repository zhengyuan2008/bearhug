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
    const { originalPhrase, scenarioName, scenarioDesc } = JSON.parse(event.body);

    const prompt = `你是一个温暖、专业的职场心理支持助手。用户现在遇到了工作烦恼："${scenarioName}"${scenarioDesc ? `（${scenarioDesc}）` : ''}。

我提供了一段支持性的话术给用户：
"${originalPhrase}"

请帮我把这段话术做得更加：
1. 个性化 - 让它听起来像是真的在对这个人说话，而不是通用话术
2. 共情 - 体现出你真的理解TA的处境和感受
3. 实用 - 如果有具体建议，让它更清晰、可执行
4. 温暖 - 保持鼓励、支持的语气，不说教

要求：
- 保留原话术的核心意思和结构
- 字数控制在150-200字
- 语气亲切自然，像朋友在说话
- 可以加入1-2个具体的例子或比喻
- 不要过度夸张或虚假乐观

请直接输出润色后的话术，不要加标题或额外说明。`;

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
        text: { verbosity: 'low' }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    // Extract text from response
    let enhancedPhrase = originalPhrase; // fallback
    if (data.output && Array.isArray(data.output)) {
      const messageItem = data.output.find(item => item.type === 'message');
      if (messageItem && messageItem.content && messageItem.content[0]) {
        enhancedPhrase = messageItem.content[0].text;
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        enhancedPhrase,
        source: 'openai-api',
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Error:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        enhancedPhrase: originalPhrase || '润色失败，请稍后重试',
        source: 'error-fallback',
        error: error.message
      })
    };
  }
};
