# 本地调试OpenAI Prompt指南

## 🎯 目的

这个指南帮助你在本地开发环境中直接调用真实的OpenAI API，用于调试和优化prompt。

---

## 📋 前提条件

1. ✅ 已经有OpenAI API key
2. ✅ 在本地运行开发服务器（localhost:8000）

---

## 🔧 使用步骤

### 1. 打开配置文件

编辑 `js/openai-config.js`

### 2. 启用真实API调用

找到这部分代码（第10-23行）：

```javascript
localDevelopment: {
  // 🔧 本地调试时，是否使用真实的OpenAI API
  // true  = 直接调用OpenAI API（用于调试prompt）
  // false = 使用Mock数据（默认）
  useRealAPI: false,  // 👈 改成 true

  // ⚠️ 仅用于本地调试！不要提交到GitHub！
  // 调试完成后记得改回 useRealAPI: false
  apiKey: '',  // 👈 填入你的API key

  // OpenAI API配置
  endpoint: 'https://api.openai.com/v1/responses',
  model: 'gpt-5-nano'
},
```

修改为：

```javascript
localDevelopment: {
  useRealAPI: true,  // ✅ 启用真实API
  apiKey: 'sk-proj-你的API密钥',  // ✅ 填入密钥
  endpoint: 'https://api.openai.com/v1/responses',
  model: 'gpt-5-nano'
},
```

### 3. 修改Prompt（如果需要）

在第26-35行，修改提示词：

```javascript
historyPrompt: (month, day) => `请讲述一个发生在${month}月${day}日的有趣历史事件。

要求：
1. 选择一个真实的历史事件
2. 用温暖、有趣的口吻讲述
3. 字数控制在150-200字
4. 适合给女朋友讲故事的语气
5. 结尾可以加一句温暖的话

请直接开始讲故事，不要加标题或额外说明。`
```

你可以修改这里的要求，比如：
- 改变字数
- 改变语气
- 添加特殊要求

### 4. 测试

1. **刷新浏览器**（Cmd + R）
2. **点击"📜 历史上的今天"**
3. **查看Console**：
   ```
   🔧 本地开发模式：调用真实OpenAI API
   ✅ OpenAI API响应成功
   ```
4. **查看生成的故事**

### 5. 完成调试后

**⚠️ 重要：记得恢复配置！**

```javascript
localDevelopment: {
  useRealAPI: false,  // ❌ 改回 false
  apiKey: '',         // ❌ 清空API key
  // ...
},
```

---

## 🔒 安全注意事项

### ⚠️ 不要提交API key到GitHub！

**方法1：使用Git的本地忽略**

创建 `.git/info/exclude` 文件（如果不存在），添加：
```
js/openai-config.js
```

**方法2：每次调试前检查**

```bash
# 调试前：修改配置
# useRealAPI: true
# apiKey: 'sk-proj-...'

# 调试完：立即恢复
# useRealAPI: false
# apiKey: ''

# 提交前检查
git diff js/openai-config.js
```

**方法3：使用stash**

```bash
# 修改配置进行调试
# ...

# 调试完成后，不提交这个文件
git stash push js/openai-config.js
```

---

## 📊 调试流程示例

### 场景1：优化prompt让故事更有趣

1. **启用真实API**（useRealAPI: true）
2. **修改prompt**：
   ```javascript
   historyPrompt: (month, day) => `请讲述${month}月${day}日的历史趣事。

   要求：
   1. 选择有趣的历史事件
   2. 语气轻松幽默
   3. 150字以内
   4. 必须包含一个意外的转折
   5. 结尾用emoji`
   ```
3. **刷新页面测试**
4. **查看效果，继续优化**
5. **满意后复制prompt到 `netlify/functions/history-story.js`**
6. **恢复配置**（useRealAPI: false）

### 场景2：测试不同日期的生成效果

1. **启用真实API**
2. **点击多次按钮**（每次刷新页面会生成新故事）
3. **查看不同日期的故事质量**
4. **记录观察结果**
5. **恢复配置**

---

## 💰 成本控制

### 估算成本

每次测试大约消耗：
- 输入：~50 tokens（prompt）
- 输出：~150 tokens（故事）
- 总计：~200 tokens

假设GPT-5定价为 $0.01/1000 tokens：
- 每次测试：$0.002（约1.5分人民币）
- 测试50次：$0.10（约7毛人民币）

### 节省成本的技巧

1. **先用Mock数据测试UI**
2. **只在需要优化prompt时才启用真实API**
3. **批量测试：一次性测试多个日期**
4. **记录好的结果，避免重复测试**

---

## 🐛 故障排查

### 问题1：调用失败，显示401错误

**原因**：API key无效或已过期

**解决**：
1. 确认API key正确
2. 检查key是否还有效
3. 重新创建key

### 问题2：CORS错误

**原因**：浏览器安全限制

**解决**：
- 本地开发时，OpenAI API应该允许跨域
- 如果还是有问题，使用Netlify Function（线上环境）

### 问题3：没有调用真实API

**检查**：
1. `useRealAPI` 是否为 `true`
2. `apiKey` 是否已填入
3. 是否在localhost运行
4. Console是否显示 "🔧 本地开发模式：调用真实OpenAI API"

---

## 📚 相关资源

- [OpenAI API文档](https://platform.openai.com/docs)
- [Prompt工程指南](https://platform.openai.com/docs/guides/prompt-engineering)
- [GPT最佳实践](https://platform.openai.com/docs/guides/gpt-best-practices)

---

## ✅ 使用检查清单

调试前：
- [ ] 已启用 `useRealAPI: true`
- [ ] 已填入 `apiKey`
- [ ] 在localhost运行

调试后：
- [ ] 已恢复 `useRealAPI: false`
- [ ] 已清空 `apiKey`
- [ ] 已复制优化后的prompt到Netlify Function
- [ ] 已提交代码（确认没有包含API key）
