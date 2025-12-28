# OpenAI API 配置指南

## 🎯 功能说明

"历史上的今天"功能使用OpenAI的GPT-5模型生成有趣的历史故事。

## ✅ 已完成的实现

### 架构设计

```
前端 (openai-config.js)
    ↓
Netlify Function (history-story.js)
    ↓
OpenAI API (GPT-5)
```

✅ **Netlify Function已创建**：`netlify/functions/history-story.js`
✅ **前端已配置**：调用 `/.netlify/functions/history-story`
✅ **Fallback机制**：API不可用时自动使用预设故事
✅ **安全保护**：API key只存在Netlify环境变量中

---

## 🔧 配置步骤

### 1. 在Netlify Dashboard配置API Key

1. 登录 [Netlify Dashboard](https://app.netlify.com/)
2. 选择你的项目 **bearhug**
3. 进入 **Site settings** → **Environment variables**
4. 点击 **Add a variable**
5. 配置环境变量：
   - **Key**: `OPENAI_API_KEY`
   - **Value**: `sk-proj-你的新密钥`（记得先撤销之前暴露的密钥！）
6. 点击 **Save**

### 2. 触发重新部署

有两种方式：

**方式A：推送代码到main分支**
```bash
git checkout main
git merge dev/ai-features
git push origin main
```

**方式B：手动触发部署**
1. 在Netlify Dashboard中
2. 进入 **Deploys**
3. 点击 **Trigger deploy** → **Deploy site**

### 3. 验证部署

部署完成后，访问你的网站：
1. 点击"📜 历史上的今天"按钮
2. 打开浏览器Console
3. 查看日志：
   ```
   Calling Netlify Function for 12/27...
   Story source: openai  ← 表示成功调用AI
   或
   Story source: fallback ← 表示使用了预设故事
   ```

---

## 🔍 故障排查

### 问题1：显示fallback故事而不是AI生成的

**可能原因：**
- API key未配置或配置错误
- OpenAI API响应格式不匹配
- API配额用完或账户问题

**检查步骤：**
1. 在Netlify Dashboard确认环境变量已设置
2. 查看Netlify Functions日志：
   - Dashboard → Functions → history-story → Logs
3. 检查是否有错误信息

### 问题2：点击按钮没有反应

**可能原因：**
- Netlify Function未正确部署
- 本地开发环境（localhost:8000）无法调用Netlify Functions

**解决方法：**
- 本地开发时会自动使用fallback故事
- 需要部署到Netlify才能测试真实的AI功能
- 或者使用 `netlify dev` 命令本地测试Functions

### 问题3：CORS错误

**已解决：**
Function中已配置CORS头：
```javascript
headers: {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}
```

---

## 📊 API响应格式

如果GPT-5的实际响应格式与预期不同，需要修改 `netlify/functions/history-story.js` 第89-90行：

```javascript
// 当前代码
const story = data.output || data.text || data.content || getFallbackStory(month, day);

// 如果实际字段名不同，修改为：
const story = data.实际字段名 || getFallbackStory(month, day);
```

---

## 💰 成本控制

### Netlify Functions 免费额度

- 每月 125,000 次请求
- 100小时运行时间
- 对于这个项目完全够用

### OpenAI API 成本

GPT-5的定价需要查看官方文档。每次调用大约：
- 输入：~50 tokens（提示词）
- 输出：~150 tokens（故事）
- 总计：~200 tokens/次

建议设置使用限额：
1. OpenAI Dashboard → Usage limits
2. 设置月度预算（比如$10）
3. 超过限额会自动停止

---

## 🧪 本地开发

### 使用Netlify CLI本地测试

安装Netlify CLI：
```bash
npm install -g netlify-cli
```

运行本地开发服务器：
```bash
netlify dev
```

这样可以在本地测试Netlify Functions，需要创建 `.env` 文件：
```env
OPENAI_API_KEY=your-api-key-here
```

---

## 📝 文件说明

### 核心文件

1. **`netlify/functions/history-story.js`**
   - Netlify Function后端代码
   - 处理API调用和错误
   - 包含fallback故事

2. **`js/openai-config.js`**
   - 前端配置
   - 调用Netlify Function
   - 处理响应和错误

3. **`netlify.toml`**
   - Netlify配置文件
   - 指定Functions目录

### 环境变量

- **`OPENAI_API_KEY`**: OpenAI API密钥（必须在Netlify Dashboard配置）

---

## ✅ 安全检查清单

- [x] API key只存在Netlify环境变量中
- [x] 前端代码不包含任何密钥
- [x] 使用Netlify Function作为安全代理
- [x] 配置了CORS头
- [x] 实现了fallback机制
- [x] 添加了错误处理和日志
- [ ] 撤销之前暴露的API密钥
- [ ] 在Netlify Dashboard配置新密钥
- [ ] 测试功能正常工作
- [ ] 监控API使用量

---

## 📚 相关资源

- [OpenAI API文档](https://platform.openai.com/docs)
- [Netlify Functions文档](https://docs.netlify.com/functions/overview/)
- [Netlify CLI文档](https://docs.netlify.com/cli/get-started/)
- [环境变量最佳实践](https://12factor.net/config)
