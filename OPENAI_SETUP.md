# OpenAI API 配置指南

## 🎯 功能说明

"历史上的今天"功能使用OpenAI的GPT-5模型生成有趣的历史故事。

## ⚠️ 重要安全提示

**不要直接在前端代码中写入API key！** 这会导致密钥暴露，任何人都能看到并使用你的API额度。

有两种安全的配置方式：

---

## 方案A：使用Netlify Functions（推荐）

### 1. 创建Netlify Function

在项目根目录创建 `netlify/functions/history-story.js`：

```javascript
// netlify/functions/history-story.js
exports.handler = async (event, context) => {
  // 只允许POST请求
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { month, day } = JSON.parse(event.body);

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-5-nano',
        input: `请讲述一个发生在${month}月${day}日的有趣历史事件...`,
        store: true
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        story: data.output || data.text || data.content
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

### 2. 在Netlify配置环境变量

1. 登录 Netlify Dashboard
2. 进入你的项目 → **Site settings** → **Environment variables**
3. 添加变量：
   - Key: `OPENAI_API_KEY`
   - Value: `你的新API密钥`

### 3. 修改前端调用

修改 `js/openai-config.js`：

```javascript
async function generateHistoryStory(month, day) {
  try {
    const response = await fetch('/.netlify/functions/history-story', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ month, day })
    });

    const data = await response.json();
    return data.story;

  } catch (error) {
    console.error('API error:', error);
    return getMockHistoryStory(month, day);
  }
}
```

---

## 方案B：临时测试（仅本地开发）

⚠️ **仅用于本地测试，不要部署到线上！**

### 1. 直接在代码中配置

编辑 `js/openai-config.js`：

```javascript
const OPENAI_CONFIG = {
  apiKey: 'sk-proj-你的新密钥', // ⚠️ 仅本地测试！
  endpoint: 'https://api.openai.com/v1/responses',
  model: 'gpt-5-nano'
};
```

### 2. 添加到 .gitignore

确保 `.gitignore` 包含：

```
js/openai-config.js
```

这样修改后的配置文件不会被提交到GitHub。

---

## 🔒 安全检查清单

- [ ] 已撤销之前暴露的API密钥
- [ ] 创建了新的API密钥
- [ ] 使用Netlify Functions或环境变量存储密钥
- [ ] 确认 `.gitignore` 包含敏感文件
- [ ] 测试功能正常工作
- [ ] 监控API使用量，防止滥用

---

## 🧪 测试步骤

1. 配置完成后，刷新页面
2. 点击"📜 历史上的今天"按钮
3. 应该看到"AI正在为你讲故事..."
4. 几秒后显示历史故事
5. 查看浏览器Console，确认没有错误

---

## 📝 API响应格式说明

根据你提供的curl命令，GPT-5的响应格式可能是：

```json
{
  "output": "故事内容...",
  // 或者
  "text": "故事内容...",
  // 或者
  "content": "故事内容..."
}
```

如果实际格式不同，请修改 `openai-config.js` 中的解析逻辑。

---

## 💡 故障排查

### 问题1：显示"加载失败"

- 检查Network标签页，查看请求是否成功
- 确认API key是否正确配置
- 检查Netlify Function是否部署成功

### 问题2：显示模拟数据

- 说明API调用失败，回退到模拟数据
- 检查Console的错误信息
- 确认endpoint和model名称是否正确

### 问题3：CORS错误

- 如果直接调用API遇到CORS问题
- 必须使用Netlify Functions作为代理
- 不要从前端直接调用OpenAI API

---

## 📚 相关文档

- [OpenAI API文档](https://platform.openai.com/docs)
- [Netlify Functions文档](https://docs.netlify.com/functions/overview/)
- [环境变量最佳实践](https://12factor.net/config)
