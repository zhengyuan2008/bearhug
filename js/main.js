/* ========================================
   给熊印的小空间 - 主逻辑文件
   ======================================== */

// ========================================
// 工具函数
// ========================================

/**
 * 从数组中随机选择一个元素（避免连续重复）
 */
let lastRandomIndex = -1;
function getRandomItem(array) {
  if (!array || array.length === 0) return null;
  if (array.length === 1) return array[0];
  
  let index;
  do {
    index = Math.floor(Math.random() * array.length);
  } while (index === lastRandomIndex && array.length > 1);
  
  lastRandomIndex = index;
  return array[index];
}

/**
 * 显示Toast提示
 */
function showToast(message, duration = 2500) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  
  toast.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

/**
 * 格式化日期为 YYYY-MM-DD
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 获取今天的日期字符串
 */
function getTodayString() {
  return formatDate(new Date());
}

/**
 * 计算两个日期之间的天数差
 */
function daysBetween(date1, date2) {
  const oneDay = 24 * 60 * 60 * 1000;
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);
  return Math.round(Math.abs((firstDate - secondDate) / oneDay));
}

// ========================================
// LocalStorage 管理
// ========================================

const STORAGE_KEYS = {
  SURVIVAL_LOG: 'bearHugSurvivalLog',
  PERIOD_DATA: 'bearHugPeriodData',
  EMOTION_LOG: 'bearHugEmotionLog'
};

/**
 * 获取签到记录
 */
function getSurvivalLog() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SURVIVAL_LOG);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('读取签到记录失败:', e);
    return [];
  }
}

/**
 * 保存签到记录
 */
function saveSurvivalLog(log) {
  try {
    localStorage.setItem(STORAGE_KEYS.SURVIVAL_LOG, JSON.stringify(log));
  } catch (e) {
    console.error('保存签到记录失败:', e);
  }
}

/**
 * 获取姨妈记录
 */
function getPeriodData() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PERIOD_DATA);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('读取姨妈记录失败:', e);
    return null;
  }
}

/**
 * 保存姨妈记录
 */
function savePeriodData(data) {
  try {
    localStorage.setItem(STORAGE_KEYS.PERIOD_DATA, JSON.stringify(data));
  } catch (e) {
    console.error('保存姨妈记录失败:', e);
  }
}

// ========================================
// 照片和消息更新
// ========================================

/**
 * 更新照片和消息
 */
function updatePhotoAndMessage(messageArray = null) {
  const photo = getRandomItem(CONFIG.photos);
  const message = getRandomItem(messageArray || CONFIG.messagesGeneral);
  
  if (photo) {
    const photoElement = document.getElementById('hug-photo');
    const labelElement = document.getElementById('photo-label');
    
    if (photoElement) {
      photoElement.src = photo.src;
      photoElement.alt = photo.label;
    }
    
    if (labelElement) {
      labelElement.textContent = photo.label;
    }
  }
  
  if (message) {
    const messageElement = document.getElementById('main-message');
    if (messageElement) {
      messageElement.textContent = message;
    }
  }
}

/**
 * "再抱我一下" 按钮点击
 */
function handleHugClick() {
  updatePhotoAndMessage();
}

/**
 * 情绪按钮点击
 */
function handleEmotionClick(emotionType) {
  const emotion = CONFIG.emotionButtons.find(e => e.id === emotionType);
  if (!emotion) return;
  
  const messageKey = emotion.messageKey;
  const messages = CONFIG[messageKey];
  
  if (messages && messages.length > 0) {
    updatePhotoAndMessage(messages);
  }
  
  // 可选：记录情绪日志（未来可用于分析）
  logEmotion(emotionType);
}

/**
 * 记录情绪（简单版本，未来可扩展）
 */
function logEmotion(emotionType) {
  try {
    const log = JSON.parse(localStorage.getItem(STORAGE_KEYS.EMOTION_LOG) || '[]');
    log.push({
      type: emotionType,
      date: getTodayString(),
      timestamp: new Date().toISOString()
    });
    
    // 只保留最近30天的记录
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const filtered = log.filter(entry => new Date(entry.timestamp) > thirtyDaysAgo);
    
    localStorage.setItem(STORAGE_KEYS.EMOTION_LOG, JSON.stringify(filtered));
  } catch (e) {
    console.error('记录情绪失败:', e);
  }
}

// ========================================
// "我又活过了一天" 签到功能
// ========================================

/**
 * 标记今天已签到
 */
function markSurvivalToday() {
  const today = getTodayString();
  const log = getSurvivalLog();
  
  // 检查今天是否已经签到
  if (log.includes(today)) {
    const message = getRandomItem(CONFIG.survivalAlreadyMarked);
    showToast(message);
    return;
  }
  
  // 添加今天的签到
  log.push(today);
  saveSurvivalLog(log);
  
  // 显示确认消息
  const message = getRandomItem(CONFIG.survivalMessages);
  showToast(message);
  
  // 更新统计
  updateSurvivalStats();
}

/**
 * 更新签到统计
 */
function updateSurvivalStats() {
  const count = getLast7DaysCount();
  const statsElement = document.getElementById('survival-stats');
  
  if (statsElement) {
    statsElement.textContent = CONFIG.ui.survivalStatsText(count);
  }
}

/**
 * 获取最近7天的签到次数
 */
function getLast7DaysCount() {
  const log = getSurvivalLog();
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);
  
  return log.filter(dateStr => {
    const date = new Date(dateStr);
    return date >= sevenDaysAgo && date <= today;
  }).length;
}

// ========================================
// 姨妈记录功能
// ========================================

/**
 * 标记今天是姨妈第一天
 */
function markPeriodStartToday() {
  const today = getTodayString();

  // 保存到本地
  savePeriodData({
    lastStart: today
  });

  // 保存到云端
  savePeriodToCloud(today);

  // 记录用户互动
  logInteraction('period_mark', { date: today });

  // 显示确认消息
  const message = getRandomItem(CONFIG.periodStartMessages);
  showToast(message);

  // 更新显示
  updatePeriodInfo();
}

/**
 * 更新姨妈记录显示
 */
async function updatePeriodInfo() {
  const data = getPeriodData();
  const infoElement = document.getElementById('period-info');
  const lastPeriodDateElement = document.getElementById('last-period-date');
  const careTipsElement = document.getElementById('period-care-tips');
  const cancelButton = document.getElementById('btn-period-cancel');

  if (!infoElement) return;

  // 更新今天日期
  const todayElement = document.getElementById('today-date');
  if (todayElement) {
    const today = new Date();
    todayElement.textContent = `${today.getMonth() + 1}/${today.getDate()}`;
  }

  // 从云端加载最新记录
  const history = await getPeriodHistory(1); // 只获取最新一条

  // 显示取消按钮（如果有记录）
  if (cancelButton) {
    if (history && history.length > 0) {
      cancelButton.style.display = 'inline-block';
    } else {
      cancelButton.style.display = 'none';
    }
  }

  // 如果没有记录
  if (!history || history.length === 0) {
    infoElement.innerHTML = `<p>${CONFIG.periodNoDataText}</p>`;
    if (lastPeriodDateElement) lastPeriodDateElement.textContent = '--';
    if (careTipsElement) careTipsElement.style.display = 'none';
    return;
  }

  // 显示最新记录
  const latestRecord = history[0];
  const lastStart = latestRecord.start_date;
  const lastDate = new Date(lastStart + 'T00:00:00'); // 强制使用本地时区
  const daysSince = daysBetween(getTodayString(), lastStart);
  const avgCycle = 28;
  const daysToNext = Math.max(0, avgCycle - daysSince);

  // 更新上次日期显示
  if (lastPeriodDateElement) {
    lastPeriodDateElement.textContent = `${lastDate.getMonth() + 1}/${lastDate.getDate()}`;
  }

  const lastStartText = CONFIG.ui.periodLastStartText(lastStart);
  const estimateText = CONFIG.periodEstimateText(daysToNext);

  infoElement.innerHTML = `
    <p><strong>${lastStartText}</strong></p>
    <p>${estimateText}</p>
  `;

  // 如果是最近3天内，显示照护小贴士
  if (careTipsElement) {
    if (daysSince <= 3) {
      careTipsElement.style.display = 'block';
    } else {
      careTipsElement.style.display = 'none';
    }
  }

  // 同步更新本地存储
  savePeriodData({
    lastStart: lastStart
  });
}

/**
 * 取消最新的姨妈记录
 */
async function cancelLatestPeriodRecord() {
  // 确认对话框
  if (!confirm('确定要取消最新的记录吗？\n这将删除最近添加的记录，并恢复到上一次的状态。')) {
    return;
  }

  // 删除云端记录
  const success = await deleteLatestPeriodRecord();

  if (success) {
    // 从云端重新加载历史记录
    const history = await getPeriodHistory(5);

    if (history && history.length > 0) {
      // 更新本地存储为上一条记录
      const previousRecord = history[0];
      savePeriodData({
        lastStart: previousRecord.start_date
      });
      showToast('已取消最新记录，恢复到上一次记录 ✓');
    } else {
      // 如果没有历史记录了，清空本地存储
      localStorage.removeItem(STORAGE_KEYS.PERIOD_DATA);
      showToast('已取消记录 ✓');
    }

    // 记录互动
    logInteraction('period_cancel', { success: true });

    // 刷新显示
    await updatePeriodInfo();
  } else {
    showToast('取消失败，请稍后重试');
    logInteraction('period_cancel', { success: false });
  }
}

/**
 * 切换Tab
 */
function switchTab(tabName) {
  console.log('=== 开始切换Tab ===');
  console.log('目标Tab:', tabName);
  
  // 移除所有active类
  const allButtons = document.querySelectorAll('.tab-button');
  const allContents = document.querySelectorAll('.tab-content');
  
  console.log('找到按钮数量:', allButtons.length);
  console.log('找到内容区数量:', allContents.length);
  
  allButtons.forEach(btn => {
    btn.classList.remove('active');
  });
  allContents.forEach(content => {
    content.classList.remove('active');
  });
  
  // 添加active类到选中的tab
  const selectedButton = document.querySelector(`[data-tab="${tabName}"]`);
  const selectedContent = document.getElementById(`content-${tabName}`);
  
  console.log('选中的按钮:', selectedButton);
  console.log('选中的内容:', selectedContent);
  
  if (selectedButton) {
    selectedButton.classList.add('active');
    console.log('✓ 按钮已激活');
  } else {
    console.error('❌ 找不到按钮!');
  }
  
  if (selectedContent) {
    selectedContent.classList.add('active');
    console.log('✓ 内容已显示');
  } else {
    console.error('❌ 找不到内容区!');
  }
  
  // 如果切换到姨妈助手，更新信息
  if (tabName === 'period') {
    updatePeriodInfo();
  }
  
  console.log('=== Tab切换完成 ===');
}

// ========================================
// 初始化
// ========================================

/**
 * 初始化UI
 */
function initUI() {
  // 设置标题和副标题
  const titleElement = document.getElementById('app-title');
  const subtitleElement = document.getElementById('app-subtitle');
  
  if (titleElement) titleElement.textContent = CONFIG.ui.title;
  if (subtitleElement) subtitleElement.textContent = CONFIG.ui.subtitle;
  
  // 初始化照片和消息
  updatePhotoAndMessage();
  
  // 创建情绪按钮
  createEmotionButtons();
  
  // 更新签到统计
  updateSurvivalStats();
  
  // 更新姨妈记录
  updatePeriodInfo();
  
  // 绑定事件
  bindEvents();
}

/**
 * 创建情绪按钮
 */
function createEmotionButtons() {
  const container = document.getElementById('emotion-buttons');
  if (!container) return;
  
  container.innerHTML = '';
  
  CONFIG.emotionButtons.forEach(emotion => {
    const button = document.createElement('button');
    button.className = 'btn-emotion';
    button.innerHTML = `<span>${emotion.emoji}</span><span>${emotion.text}</span>`;
    button.onclick = () => handleEmotionClick(emotion.id);
    container.appendChild(button);
  });
}

/**
 * 绑定事件
 */
function bindEvents() {
  console.log('绑定事件开始...');

  // "再抱我一下" 按钮
  const hugButton = document.getElementById('btn-hug');
  if (hugButton) {
    hugButton.onclick = handleHugClick;
    console.log('✓ 绑定了"再抱我一下"按钮');
  }

  // "我又活过了一天" 按钮
  const survivalButton = document.getElementById('btn-survival');
  if (survivalButton) {
    survivalButton.onclick = markSurvivalToday;
    console.log('✓ 绑定了签到按钮');
  }

  // 姨妈记录按钮
  const periodButton = document.getElementById('btn-period');
  if (periodButton) {
    periodButton.onclick = markPeriodStartToday;
    console.log('✓ 绑定了姨妈记录按钮');
  }

  // 取消姨妈记录按钮
  const periodCancelButton = document.getElementById('btn-period-cancel');
  if (periodCancelButton) {
    periodCancelButton.onclick = cancelLatestPeriodRecord;
    console.log('✓ 绑定了取消记录按钮');
  }

  // Tab切换按钮
  const tabButtons = document.querySelectorAll('.tab-button');
  console.log('找到Tab按钮数量:', tabButtons.length);

  tabButtons.forEach((button, index) => {
    const tabName = button.getAttribute('data-tab');
    console.log(`绑定Tab按钮 ${index + 1}:`, tabName);

    button.addEventListener('click', () => {
      console.log('Tab按钮被点击:', tabName);
      switchTab(tabName);
    });
  });

  console.log('事件绑定完成！');
}

// ========================================
// 页面加载完成后初始化
// ========================================

document.addEventListener('DOMContentLoaded', initUI);