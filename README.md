# 给熊印的小空间 🐻

一个温柔的情感陪伴web应用，为🐻打造的私密小空间。

## 📱 功能特性

### 已实现功能
- ✨ **现代Apple风格UI** - 玻璃态设计，柔和渐变背景
- 🤗 **情感陪伴** - 随机照片 + 温暖文字，情绪按钮支持
- 📝 **"我又活过了一天"签到** - 无压力的每日记录
- 🌸 **姨妈记录** - 简单、温柔的周期追踪
- 💾 **本地存储** - 所有数据保存在本机，隐私第一

### 未来计划
- 💬 留言/日记功能
- 🤖 AI温柔回复（OpenAI集成）
- 💡 小确幸随机内容
- 📊 数据导出功能

## 🗂️ 文件结构

```
bearhug/
├── index.html          # 主HTML文件
├── css/
│   └── styles.css      # 样式表（Apple风格）
├── js/
│   ├── config.js       # 配置文件（所有文案在这里）
│   └── main.js         # 主逻辑
├── images/             # 照片文件夹
│   ├── photo1.png
│   ├── photo2.png
│   └── photo3.png
└── README.md           # 说明文档
```

## 🖼️ 图片优化指南

### 推荐规格
- **格式**: JPEG 或 WebP（推荐WebP，更小）
- **尺寸**: 最大宽度 1200-1600px
- **文件大小**: 每张 200-500KB
- **压缩工具**:
  - [Squoosh](https://squoosh.app/) - 在线压缩，支持WebP
  - [TinyPNG](https://tinypng.com/) - 在线压缩PNG/JPEG
  - macOS Photos 导出时选择"中等"质量

### 如何添加新照片

1. **准备照片**
   ```bash
   # 将照片放入 images/ 文件夹
   # 命名为 photo1.png, photo2.png 等
   ```

2. **更新配置**
   编辑 `js/config.js`，在 `photos` 数组中添加：
   ```javascript
   photos: [
     { src: "images/photo1.png", label: "今天的胖🐰" },
     { src: "images/photo2.png", label: "认真工作的胖🐰" },
     { src: "images/photo3.png", label: "发呆中的胖🐰" },
     { src: "images/photo4.png", label: "你的新照片描述" }  // 新增
   ]
   ```

## ✏️ 修改文案

所有文案都在 `js/config.js` 中，可以直接编辑：

### 修改温暖消息
```javascript
messagesGeneral: [
  "你的新消息1",
  "你的新消息2",
  // 添加更多...
]
```

### 修改情绪相关消息
```javascript
messagesTired: [ /* 累的时候 */ ],
messagesSad: [ /* 难过的时候 */ ],
messagesScared: [ /* 害怕的时候 */ ],
messagesOkay: [ /* 还好的时候 */ ]
```

### 修改签到消息
```javascript
survivalMessages: [ /* 签到成功的消息 */ ]
```

## 🚀 本地测试

1. **直接打开**
   ```bash
   # 在浏览器中打开 index.html
   open index.html  # macOS
   ```

2. **使用本地服务器**（推荐）
   ```bash
   # Python 3
   python3 -m http.server 8000
   
   # 然后访问 http://localhost:8000
   ```

3. **检查功能**
   - ✅ 点击"再抱我一下"，照片和文字应该随机变化
   - ✅ 点击情绪按钮，消息应该对应变化
   - ✅ 点击"我又活过了一天"，应该显示toast提示
   - ✅ 刷新页面，签到统计应该保留
   - ✅ 打开开发者工具 → Application → Local Storage，查看数据

## 📦 部署到GitHub Pages

1. **推送代码**
   ```bash
   git add .
   git commit -m "Update bearhug app"
   git push origin main
   ```

2. **启用GitHub Pages**
   - 进入仓库 Settings
   - 找到 Pages 选项
   - Source 选择 `main` 分支
   - 保存后等待几分钟

3. **访问网站**
   ```
   https://zhengyuan2008.github.io/bearhug/
   ```

## 🔒 隐私说明

- ✅ 所有数据存储在本地浏览器（localStorage）
- ✅ 不使用任何第三方追踪
- ✅ 不使用Google Analytics
- ✅ 不发送任何数据到服务器
- ⚠️ 清除浏览器数据会丢失记录（未来可添加导出功能）

## 💾 数据存储

应用使用以下localStorage键：
- `bearHugSurvivalLog` - 签到记录（日期数组）
- `bearHugPeriodData` - 姨妈记录（最后开始日期）
- `bearHugEmotionLog` - 情绪记录（可选，未来分析用）

## 🛠️ 技术栈

- **前端**: 纯HTML + CSS + Vanilla JavaScript
- **样式**: 自定义CSS（Apple风格玻璃态设计）
- **存储**: localStorage
- **部署**: GitHub Pages / Netlify

## 📝 开发笔记

### 设计原则
1. **情感优先** - 每个功能都围绕温暖、支持、无压力
2. **简洁至上** - 不添加不必要的功能
3. **隐私第一** - 本地存储，不追踪
4. **移动优先** - 针对iPhone Safari优化

### 代码组织
- `config.js` - 所有用户可见的文案
- `main.js` - 核心逻辑，函数命名清晰
- `styles.css` - CSS变量，易于主题调整

## 🤝 未来扩展

### 留言功能（计划中）
```javascript
// 预留接口
function saveJournalEntry(text) {
  // 保存到localStorage
  // 未来可发送到serverless function
}
```

### AI回复（计划中）
```javascript
// 预留接口
async function getAIReply(userMessage) {
  // 调用Netlify Function
  // 使用OpenAI API
  // 返回温柔的回复
}
```

## ❤️ 致谢

Made with love by 胖兔 🐰，只给🐻看。

---

**最后更新**: 2024-12-27