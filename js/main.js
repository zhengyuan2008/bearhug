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
    // 保存到云端（Supabase）
    saveEmotionLog(emotionType);

    // 同时保存到本地作为备份
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

    // 同时记录到云端
    logInteraction('emotion_click', {
      emotion_type: emotionType,
      timestamp: new Date().toISOString()
    });
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

  // 如果切换到美食抉择，初始化
  if (tabName === 'food') {
    initFoodTab();
  }

  // 如果切换到去哪儿，初始化
  if (tabName === 'destination') {
    initDestinationTab();
  }

  // 如果切换到工作烦恼，初始化
  if (tabName === 'work-troubles') {
    initWorkTroublesTab();
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

  // 预加载历史上的今天（后台异步加载，不阻塞页面）
  preloadHistoryStory();
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

  // 心情回顾按钮
  const moodReviewButton = document.getElementById('btn-mood-review');
  if (moodReviewButton) {
    moodReviewButton.onclick = toggleMoodReview;
    console.log('✓ 绑定了心情回顾按钮');
  }

  // 关闭心情回顾按钮
  const closeMoodReviewButton = document.getElementById('btn-close-review');
  if (closeMoodReviewButton) {
    closeMoodReviewButton.onclick = closeMoodReview;
    console.log('✓ 绑定了关闭心情回顾按钮');
  }

  // 历史上的今天按钮
  const historyTodayButton = document.getElementById('btn-history-today');
  if (historyTodayButton) {
    historyTodayButton.onclick = toggleHistoryToday;
    console.log('✓ 绑定了历史上的今天按钮');
  }

  // 关闭历史上的今天按钮
  const closeHistoryButton = document.getElementById('btn-close-history');
  if (closeHistoryButton) {
    closeHistoryButton.onclick = closeHistoryToday;
    console.log('✓ 绑定了关闭历史按钮');
  }

  // 随机全餐按钮
  const randomAllButton = document.getElementById('btn-random-all');
  if (randomAllButton) {
    randomAllButton.onclick = () => checkLockAndRandomize('all');
    console.log('✓ 绑定了随机全餐按钮');
  }

  // 随机选吃的按钮
  const randomFoodButton = document.getElementById('btn-random-food');
  if (randomFoodButton) {
    randomFoodButton.onclick = () => checkLockAndRandomize('food');
    console.log('✓ 绑定了选个吃的按钮');
  }

  // 随机选喝的按钮
  const randomDrinkButton = document.getElementById('btn-random-drink');
  if (randomDrinkButton) {
    randomDrinkButton.onclick = () => checkLockAndRandomize('drink');
    console.log('✓ 绑定了选个喝的按钮');
  }

  // 确认选择按钮
  const confirmButton = document.getElementById('btn-confirm-choice');
  if (confirmButton) {
    confirmButton.onclick = confirmFoodChoice;
    console.log('✓ 绑定了确认选择按钮');
  }

  // 解锁按钮
  const unlockButton = document.getElementById('btn-unlock');
  if (unlockButton) {
    unlockButton.onclick = requestUnlock;
    console.log('✓ 绑定了解锁按钮');
  }

  // 去哪儿Tab按钮
  const randomDestinationButton = document.getElementById('btn-random-destination');
  if (randomDestinationButton) {
    randomDestinationButton.onclick = randomDestination;
    console.log('✓ 绑定了随机目的地按钮');
  }

  const confirmDestinationButton = document.getElementById('btn-confirm-destination');
  if (confirmDestinationButton) {
    confirmDestinationButton.onclick = confirmDestinationChoice;
    console.log('✓ 绑定了确认目的地按钮');
  }

  const unlockDestinationButton = document.getElementById('btn-unlock-destination');
  if (unlockDestinationButton) {
    unlockDestinationButton.onclick = unlockDestination;
    console.log('✓ 绑定了解锁目的地按钮');
  }

  // Work Troubles Tab
  const btnWorkBack = document.getElementById('btn-work-back');
  if (btnWorkBack) {
    btnWorkBack.onclick = backToScenarios;
    console.log('✓ 绑定了工作烦恼返回按钮');
  }

  const aiModalClose = document.getElementById('ai-modal-close');
  if (aiModalClose) {
    aiModalClose.onclick = closeAIModal;
    console.log('✓ 绑定了AI模态框关闭按钮');
  }

  const aiModalOverlay = document.getElementById('ai-modal-overlay');
  if (aiModalOverlay) {
    aiModalOverlay.onclick = closeAIModal;
    console.log('✓ 绑定了AI模态框遮罩层');
  }

  const btnCopyAI = document.getElementById('btn-copy-ai');
  if (btnCopyAI) {
    btnCopyAI.onclick = copyAIEnhancedText;
    console.log('✓ 绑定了AI复制按钮');
  }

  console.log('事件绑定完成！');
}

// ========================================
// 心情回顾功能
// ========================================

/**
 * 切换心情回顾显示
 */
async function toggleMoodReview() {
  const content = document.getElementById('mood-review-content');
  if (!content) return;

  if (content.style.display === 'none') {
    content.style.display = 'block';
    await loadMoodReview();
  } else {
    content.style.display = 'none';
  }
}

/**
 * 关闭心情回顾
 */
function closeMoodReview() {
  const content = document.getElementById('mood-review-content');
  if (content) {
    content.style.display = 'none';
  }
}

/**
 * 加载并显示心情回顾
 */
async function loadMoodReview() {
  const listElement = document.getElementById('mood-review-list');
  if (!listElement) return;

  // 显示加载中
  listElement.innerHTML = '<p class="mood-review-loading">正在加载...</p>';

  try {
    // 从Supabase获取过去7天的情绪记录
    const records = await getEmotionHistory(7);

    if (!records || records.length === 0) {
      listElement.innerHTML = '<p class="mood-review-empty">还没有心情记录哦，点击上面的情绪按钮记录你的心情吧 💝</p>';
      return;
    }

    // 按天分组
    const groupedByDay = groupRecordsByDay(records);

    // 生成HTML
    listElement.innerHTML = generateMoodReviewHTML(groupedByDay);
  } catch (error) {
    console.error('加载心情回顾失败:', error);
    listElement.innerHTML = '<p class="mood-review-empty">加载失败，请稍后重试</p>';
  }
}

/**
 * 按天分组记录
 */
function groupRecordsByDay(records) {
  const groups = {};
  const today = getTodayString();

  records.forEach(record => {
    // 解析时间（Supabase返回的是UTC时间）
    const date = new Date(record.created_at);
    const dateString = formatDate(date);

    if (!groups[dateString]) {
      groups[dateString] = {
        date: dateString,
        isToday: dateString === today,
        records: []
      };
    }

    groups[dateString].records.push({
      time: date,
      emotionType: record.event_data?.emotion_type || 'unknown'
    });
  });

  // 排序记录（每天内按时间倒序）
  Object.values(groups).forEach(group => {
    group.records.sort((a, b) => b.time - a.time);
  });

  // 按日期倒序排列
  return Object.values(groups).sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * 生成心情回顾HTML
 */
function generateMoodReviewHTML(groupedData) {
  const emotionConfig = {
    tired: { emoji: '💙', text: '累' },
    sad: { emoji: '🖤', text: '难过' },
    scared: { emoji: '🌧', text: '有点怕' },
    okay: { emoji: '🧡', text: '还好' },
    fight: { emoji: '💔', text: '和胖🐰吵架了' }
  };

  let html = '';

  groupedData.forEach(day => {
    const dateObj = new Date(day.date + 'T00:00:00');
    const monthDay = `${dateObj.getMonth() + 1}月${dateObj.getDate()}日`;
    const dayTitle = day.isToday ? `📊 今天 (${monthDay})` : monthDay;
    const titleClass = day.isToday ? 'mood-review-day-title today' : 'mood-review-day-title';

    // 统计每种情绪的次数
    const stats = {};
    day.records.forEach(record => {
      stats[record.emotionType] = (stats[record.emotionType] || 0) + 1;
    });

    // 生成统计文本
    const statsText = Object.entries(stats)
      .map(([type, count]) => {
        const config = emotionConfig[type] || { emoji: '❓', text: '未知' };
        return `${config.emoji}×${count}`;
      })
      .join('  ');

    html += `
      <div class="mood-review-day">
        <div class="mood-review-day-header">
          <div class="${titleClass}">${dayTitle}</div>
          <div class="mood-review-day-stats">${statsText}</div>
        </div>
        <div class="mood-review-timeline">
    `;

    // 生成时间线
    day.records.forEach(record => {
      const time = `${String(record.time.getHours()).padStart(2, '0')}:${String(record.time.getMinutes()).padStart(2, '0')}`;
      const config = emotionConfig[record.emotionType] || { emoji: '❓', text: '未知' };

      html += `
        <div class="mood-review-item">
          <div class="mood-review-time">${time}</div>
          <div class="mood-review-emotion">
            <span>${config.emoji}</span>
            <span>${config.text}</span>
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;
  });

  return html;
}

// ========================================
// 历史上的今天功能
// ========================================

/**
 * 切换历史上的今天显示
 */
async function toggleHistoryToday() {
  const content = document.getElementById('history-today-content');
  if (!content) return;

  if (content.style.display === 'none') {
    content.style.display = 'block';
    await loadHistoryToday();
  } else {
    content.style.display = 'none';
  }
}

/**
 * 关闭历史上的今天
 */
function closeHistoryToday() {
  const content = document.getElementById('history-today-content');
  if (content) {
    content.style.display = 'none';
  }
}

/**
 * 获取localStorage缓存的故事
 */
function getCachedStory(month, day) {
  const cacheKey = `history_story_${month}_${day}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      const data = JSON.parse(cached);
      // 检查是否是今天的缓存（防止跨年问题）
      const year = new Date().getFullYear();
      if (data.year === year) {
        return data.story;
      }
    } catch (e) {
      console.error('解析缓存失败:', e);
    }
  }
  return null;
}

/**
 * 保存故事到localStorage
 */
function cacheStory(month, day, story) {
  const cacheKey = `history_story_${month}_${day}`;
  const year = new Date().getFullYear();
  localStorage.setItem(cacheKey, JSON.stringify({ year, story }));
}

// 全局加载状态标记
let isLoadingHistoryStory = false;
let currentLoadingPromise = null;

/**
 * 加载历史上的今天（从缓存或API）
 */
async function loadHistoryToday(forceRefresh = false) {
  const storyElement = document.getElementById('history-today-story');
  if (!storyElement) return;

  // 获取今天的日期
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  // 如果不是强制刷新，先检查缓存
  if (!forceRefresh) {
    const cachedStory = getCachedStory(month, day);
    if (cachedStory) {
      console.log('📖 使用缓存的历史故事');
      displayHistoryStory(cachedStory, month, day);
      return;
    }

    // 如果正在预加载，等待预加载完成
    if (isLoadingHistoryStory && currentLoadingPromise) {
      console.log('⏳ 正在预加载中，等待完成...');
      storyElement.innerHTML = '<p class="history-today-loading">正在加载中...</p>';
      try {
        await currentLoadingPromise;
        // 预加载完成后，从缓存读取
        const cachedStory = getCachedStory(month, day);
        if (cachedStory) {
          displayHistoryStory(cachedStory, month, day);
        } else {
          storyElement.innerHTML = '<p class="history-today-error">加载失败，请稍后重试</p>';
        }
        return;  // 无论成功失败都返回，不再继续执行
      } catch (error) {
        console.error('预加载失败:', error);
        storyElement.innerHTML = '<p class="history-today-error">加载失败，请稍后重试</p>';
        return;  // 失败后也返回，不再继续
      }
    }
  }

  // 如果正在加载且是强制刷新，先取消之前的加载（强制刷新优先级高）
  if (isLoadingHistoryStory && forceRefresh) {
    console.log('🔄 强制刷新，取消之前的加载');
    // 标记会在新的Promise中重新设置
  }

  // 显示加载中（带时间提示）
  if (forceRefresh) {
    storyElement.innerHTML = '<p class="history-today-loading">🔄 正在寻找新故事...<br><small>可能需要10-60秒，请稍候</small></p>';
  } else {
    storyElement.innerHTML = '<p class="history-today-loading">AI正在为你讲故事...<br><small>首次加载可能需要10-60秒</small></p>';
  }

  // 设置加载状态
  isLoadingHistoryStory = true;
  currentLoadingPromise = (async () => {
    try {
      // 调用AI生成故事
      const story = await generateHistoryStory(month, day);

      // 保存到缓存
      cacheStory(month, day, story);

      // 显示故事
      displayHistoryStory(story, month, day);

    } catch (error) {
      console.error('加载历史故事失败:', error);
      storyElement.innerHTML = '<p class="history-today-error">加载失败，请稍后重试</p>';
      throw error;
    } finally {
      // 清除加载状态
      isLoadingHistoryStory = false;
      currentLoadingPromise = null;
    }
  })();

  await currentLoadingPromise;
}

/**
 * 显示历史故事
 */
function displayHistoryStory(story, month, day) {
  const storyElement = document.getElementById('history-today-story');
  if (!storyElement) return;

  // 格式化日期
  const dateStr = `${month}月${day}日`;

  // 处理故事文本（保留换行）
  let formattedStory;

  if (typeof story === 'string') {
    // 如果是字符串，正常处理换行
    formattedStory = story
      .split('\n')
      .map(paragraph => paragraph.trim())
      .filter(paragraph => paragraph.length > 0)
      .map(paragraph => `<p>${paragraph}</p>`)
      .join('');
  } else {
    // 如果不是字符串，直接显示
    console.warn('Story不是字符串类型:', typeof story);
    formattedStory = `<p>${String(story)}</p>`;
  }

  storyElement.innerHTML = `
    <h4>${dateStr}</h4>
    ${formattedStory}
    <button class="btn-refresh-story" id="btn-refresh-story" onclick="refreshHistoryStory()">
      🔄 换一个故事
    </button>
  `;
}

/**
 * 刷新历史故事（重新调用API）
 */
async function refreshHistoryStory() {
  await loadHistoryToday(true);  // forceRefresh = true
}

/**
 * 预加载历史上的今天（页面加载时后台执行）
 */
async function preloadHistoryStory() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  // 检查是否已有缓存
  const cachedStory = getCachedStory(month, day);
  if (cachedStory) {
    console.log('✅ 历史故事已缓存，无需预加载');
    return;
  }

  // 如果已经在加载中，不要重复预加载
  if (isLoadingHistoryStory) {
    console.log('⚠️ 已经在加载中，跳过预加载');
    return;
  }

  // 后台加载故事
  console.log('🔄 开始预加载历史上的今天...');

  // 设置加载状态和Promise（与loadHistoryToday共享）
  isLoadingHistoryStory = true;
  currentLoadingPromise = (async () => {
    try {
      const story = await generateHistoryStory(month, day);
      cacheStory(month, day, story);
      console.log('✅ 历史故事预加载完成');
    } catch (error) {
      console.error('❌ 预加载历史故事失败:', error);
      throw error;
    } finally {
      isLoadingHistoryStory = false;
      currentLoadingPromise = null;
    }
  })();

  // 静默失败，不阻塞页面初始化
  await currentLoadingPromise.catch(() => {});
}

// ========================================
// 美食抉择功能
// ========================================

let foodOptions = { foods: [], drinks: [] };
let todayChoice = null;
let isChoiceLocked = false;
let tempChoice = null; // 临时选择，未确认前不保存数据库

// Work Troubles State
let workScenarios = [];
let currentScenario = null;
let workPhrases = [];

/**
 * 初始化美食抉择Tab
 */
async function initFoodTab() {
  // 更新日期显示
  updateFoodDate();

  // 加载美食选项
  await loadFoodOptions();

  // 检查今日选择状态
  await checkTodayChoice();
}

/**
 * 更新日期显示
 */
function updateFoodDate() {
  const dateElement = document.getElementById('food-date');
  if (!dateElement) return;

  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  dateElement.textContent = `${month}月${day}日`;
}

/**
 * 加载美食选项
 */
async function loadFoodOptions() {
  try {
    // 从数据库加载美食选项
    foodOptions = await getFoodOptions();
    console.log('✓ 加载美食选项:', foodOptions.foods.length, '种食物,', foodOptions.drinks.length, '种饮品');
  } catch (error) {
    console.error('加载美食数据失败:', error);
    showToast('加载美食选项失败，请刷新重试');
  }
}

/**
 * 检查今日选择状态
 */
async function checkTodayChoice() {
  try {
    // 从数据库加载今日选择
    todayChoice = await getTodayFoodChoice();

    const resultDiv = document.getElementById('food-choice-result');
    const buttonsDiv = document.getElementById('food-choice-buttons');
    const confirmSection = document.getElementById('food-confirm-section');
    const lockedSection = document.getElementById('food-locked-section');

    if (todayChoice && todayChoice.is_locked) {
      // 已锁定状态
      isChoiceLocked = true;
      displayFoodChoice(todayChoice.food_name, todayChoice.drink_name);
      if (resultDiv) resultDiv.style.display = 'block';
      if (buttonsDiv) buttonsDiv.style.display = 'none';
      if (confirmSection) confirmSection.style.display = 'none';
      if (lockedSection) lockedSection.style.display = 'block';
    } else if (todayChoice) {
      // 已选择但未锁定
      isChoiceLocked = false;
      displayFoodChoice(todayChoice.food_name, todayChoice.drink_name);
      if (resultDiv) resultDiv.style.display = 'block';
      if (buttonsDiv) buttonsDiv.style.display = 'flex';
      if (confirmSection) confirmSection.style.display = 'block';
      if (lockedSection) lockedSection.style.display = 'none';
    } else {
      // 还没有选择
      isChoiceLocked = false;
      if (resultDiv) resultDiv.style.display = 'none';
      if (buttonsDiv) buttonsDiv.style.display = 'flex';
      if (confirmSection) confirmSection.style.display = 'none';
      if (lockedSection) lockedSection.style.display = 'none';
    }
  } catch (error) {
    console.error('检查今日选择失败:', error);
  }
}

/**
 * 检查锁定状态并随机选择
 */
async function checkLockAndRandomize(type) {
  if (isChoiceLocked) {
    // 如果已锁定，询问是否重新来过
    const confirmed = confirm('今日选择已确认，确定要重新来过吗？\n重新选择后需要再次确认才能锁定。');
    if (!confirmed) {
      return;
    }

    // 删除数据库中的记录
    const client = getSupabase();
    if (client && todayChoice && todayChoice.id) {
      const { error } = await client
        .from('food_choices')
        .delete()
        .eq('id', todayChoice.id);

      if (error) {
        console.error('删除记录失败:', error);
        showToast('解锁失败，请重试');
        return;
      }
    }

    // 解锁
    isChoiceLocked = false;
    todayChoice = null;
    tempChoice = null;

    const lockedSection = document.getElementById('food-locked-section');
    const buttonsDiv = document.getElementById('food-choice-buttons');
    if (lockedSection) lockedSection.style.display = 'none';
    if (buttonsDiv) buttonsDiv.style.display = 'flex';
  }

  // 执行随机选择
  if (type === 'all') {
    await randomFullMeal();
  } else if (type === 'food') {
    await randomFood();
  } else if (type === 'drink') {
    await randomDrink();
  }
}

/**
 * 确认选择并锁定
 */
async function confirmFoodChoice() {
  if (!tempChoice && !todayChoice) {
    showToast('请先进行选择');
    return;
  }

  console.log('=== 开始确认选择 ===');
  console.log('tempChoice:', tempChoice);
  console.log('todayChoice:', todayChoice);

  try {
    // 使用临时选择或今日选择
    const choice = tempChoice || todayChoice;

    // 保存到数据库并锁定
    const newChoice = await saveFoodChoice(choice.food_name, choice.drink_name, true);

    if (!newChoice) {
      throw new Error('保存失败');
    }

    console.log('✓ 数据库返回的记录:', newChoice);

    // 更新本地状态
    isChoiceLocked = true;
    todayChoice = newChoice;
    tempChoice = null; // 清空临时选择

    console.log('✓ 已更新 todayChoice:', todayChoice);
    console.log('✓ todayChoice.id:', todayChoice.id);

    // 更新UI
    const buttonsDiv = document.getElementById('food-choice-buttons');
    const confirmSection = document.getElementById('food-confirm-section');
    const lockedSection = document.getElementById('food-locked-section');

    if (buttonsDiv) buttonsDiv.style.display = 'none';
    if (confirmSection) confirmSection.style.display = 'none';
    if (lockedSection) lockedSection.style.display = 'block';

    showToast('✅ 今日选择已确认锁定');
    console.log('✓ 选择已锁定并保存到数据库');

  } catch (error) {
    console.error('锁定选择失败:', error);
    showToast('锁定失败，请重试');
  }
}

/**
 * 请求解锁
 */
async function requestUnlock() {
  const confirmed = confirm('确定要重新来过吗？\n这将取消今日的确认状态，允许重新选择。');
  if (!confirmed) {
    return;
  }

  console.log('=== 开始解锁流程 ===');
  console.log('todayChoice:', todayChoice);

  try {
    // 删除数据库中的记录
    const client = getSupabase();
    if (!client) {
      console.error('❌ Supabase client 未初始化');
      throw new Error('数据库连接失败');
    }

    if (!todayChoice) {
      console.warn('⚠️ todayChoice 为空，无需删除数据库记录');
    } else if (!todayChoice.id) {
      console.error('❌ todayChoice.id 不存在:', todayChoice);
      throw new Error('记录ID缺失');
    } else {
      console.log('🗑️ 准备删除记录 ID:', todayChoice.id);

      const { data, error } = await client
        .from('food_choices')
        .delete()
        .eq('id', todayChoice.id)
        .select(); // 返回被删除的记录

      if (error) {
        console.error('❌ 删除失败:', error);
        throw error;
      }

      console.log('✅ 删除成功，被删除的记录:', data);
    }

    // 更新本地状态
    isChoiceLocked = false;
    todayChoice = null;
    tempChoice = null;

    // 更新UI
    const resultDiv = document.getElementById('food-choice-result');
    const buttonsDiv = document.getElementById('food-choice-buttons');
    const confirmSection = document.getElementById('food-confirm-section');
    const lockedSection = document.getElementById('food-locked-section');

    if (resultDiv) resultDiv.style.display = 'none';
    if (buttonsDiv) buttonsDiv.style.display = 'flex';
    if (confirmSection) confirmSection.style.display = 'none';
    if (lockedSection) lockedSection.style.display = 'none';

    showToast('🔓 已解锁，可以重新选择');
    console.log('✓ 解锁完成');

  } catch (error) {
    console.error('❌ 解锁失败:', error);
    showToast('解锁失败：' + error.message);
  }
}

/**
 * 随机选择（避免今日重复）
 */
function randomPick(items, excludeRecent = []) {
  if (!items || items.length === 0) return null;

  // 过滤掉最近选过的
  let available = items.filter(item => !excludeRecent.includes(item.name));

  // 如果全部都选过了，就从全部中选
  if (available.length === 0) {
    available = items;
  }

  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex];
}

/**
 * 获取本周已选择的食物名单（用于避免重复）每周一重置
 */
async function getThisWeekChoiceNames() {
  const thisWeekChoices = await getThisWeekFoodChoices();
  const foodNames = thisWeekChoices.map(c => c.food_name).filter(Boolean);
  const drinkNames = thisWeekChoices.map(c => c.drink_name).filter(Boolean);
  console.log('✓ 本周已选择:', { foodNames, drinkNames });
  return { foodNames, drinkNames };
}

/**
 * 随机全餐
 */
async function randomFullMeal() {
  // 显示骰子动画
  showDiceAnimation();

  try {
    const recent = await getThisWeekChoiceNames();

    const food = randomPick(foodOptions.foods, recent.foodNames);
    const drink = randomPick(foodOptions.drinks, recent.drinkNames);

    if (!food || !drink) {
      throw new Error('没有可用的选项');
    }

    // 等待1秒让动画播放
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 保存到临时变量，不保存数据库
    tempChoice = {
      food_name: food.name,
      drink_name: drink.name,
      is_locked: false
    };

    // 隐藏骰子动画
    hideDiceAnimation();

    // 显示结果
    displayFoodChoice(food.name, drink.name);

    // 显示确认按钮
    const confirmSection = document.getElementById('food-confirm-section');
    if (confirmSection) confirmSection.style.display = 'block';

  } catch (error) {
    console.error('随机选择失败:', error);
    hideDiceAnimation();
    showToast('选择失败，请稍后重试');
  }
}

/**
 * 只选吃的
 */
async function randomFood() {
  // 显示骰子动画
  showDiceAnimation();

  try {
    const recent = await getThisWeekChoiceNames();
    const food = randomPick(foodOptions.foods, recent.foodNames);

    if (!food) {
      throw new Error('没有可用的选项');
    }

    // 等待1秒让动画播放
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 保留已有的drink，或者为null
    const drinkName = tempChoice?.drink_name || todayChoice?.drink_name || null;

    // 保存到临时变量，不保存数据库
    tempChoice = {
      food_name: food.name,
      drink_name: drinkName,
      is_locked: false
    };

    // 隐藏骰子动画
    hideDiceAnimation();

    // 显示结果
    displayFoodChoice(food.name, drinkName);

    // 显示确认按钮
    const confirmSection = document.getElementById('food-confirm-section');
    if (confirmSection) confirmSection.style.display = 'block';

  } catch (error) {
    console.error('随机选择失败:', error);
    hideDiceAnimation();
    showToast('选择失败，请稍后重试');
  }
}

/**
 * 只选喝的
 */
async function randomDrink() {
  // 显示骰子动画
  showDiceAnimation();

  try {
    const recent = await getThisWeekChoiceNames();
    const drink = randomPick(foodOptions.drinks, recent.drinkNames);

    if (!drink) {
      throw new Error('没有可用的选项');
    }

    // 等待1秒让动画播放
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 保留已有的food，或者为null
    const foodName = tempChoice?.food_name || todayChoice?.food_name || null;

    // 保存到临时变量，不保存数据库
    tempChoice = {
      food_name: foodName,
      drink_name: drink.name,
      is_locked: false
    };

    // 隐藏骰子动画
    hideDiceAnimation();

    // 显示结果
    displayFoodChoice(foodName, drink.name);

    // 显示确认按钮
    const confirmSection = document.getElementById('food-confirm-section');
    if (confirmSection) confirmSection.style.display = 'block';

  } catch (error) {
    console.error('随机选择失败:', error);
    hideDiceAnimation();
    showToast('选择失败，请稍后重试');
  }
}

/**
 * 显示骰子动画
 */
function showDiceAnimation() {
  const diceDiv = document.getElementById('dice-animation');
  const resultDiv = document.getElementById('food-choice-result');

  if (diceDiv) diceDiv.style.display = 'block';
  if (resultDiv) resultDiv.style.display = 'none';
}

/**
 * 隐藏骰子动画
 */
function hideDiceAnimation() {
  const diceDiv = document.getElementById('dice-animation');
  if (diceDiv) diceDiv.style.display = 'none';
}

/**
 * 显示美食选择结果
 */
function displayFoodChoice(foodName, drinkName) {
  const resultDiv = document.getElementById('food-choice-result');
  const foodSpan = document.getElementById('choice-food');
  const drinkSpan = document.getElementById('choice-drink');

  if (!resultDiv || !foodSpan || !drinkSpan) return;

  foodSpan.textContent = foodName || '未选择';
  drinkSpan.textContent = drinkName || '未选择';

  resultDiv.style.display = 'block';
}

// ========================================
// 页面加载完成后初始化
// ========================================

document.addEventListener('DOMContentLoaded', initUI);
// ========================================
// 工作烦恼功能
// ========================================

/**
 * 初始化工作烦恼tab
 */
async function initWorkTroublesTab() {
  console.log('=== Initializing Work Troubles Tab ===');

  // Load scenarios
  workScenarios = await getWorkScenarios();

  // Render scenario grid
  renderScenarioGrid();

  // Ensure detail view is hidden
  const detailView = document.getElementById('work-scenario-detail');
  if (detailView) detailView.style.display = 'none';

  const scenariosGrid = document.getElementById('work-scenarios-grid');
  if (scenariosGrid) scenariosGrid.style.display = 'grid';
}

/**
 * 渲染场景网格
 */
function renderScenarioGrid() {
  const grid = document.getElementById('work-scenarios-grid');
  if (!grid) return;

  if (workScenarios.length === 0) {
    grid.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">暂无可用场景</p>';
    return;
  }

  grid.innerHTML = workScenarios.map(scenario => `
    <div class="scenario-card" data-scenario-id="${scenario.id}">
      <div class="scenario-icon">${scenario.icon}</div>
      <p class="scenario-name">${scenario.name}</p>
    </div>
  `).join('');

  // Bind click events
  grid.querySelectorAll('.scenario-card').forEach(card => {
    card.onclick = () => {
      const scenarioId = card.getAttribute('data-scenario-id');
      selectScenario(scenarioId);
    };
  });

  console.log('✓ Rendered', workScenarios.length, 'scenarios');
}

/**
 * 选择场景
 */
async function selectScenario(scenarioId) {
  console.log('=== Selecting scenario:', scenarioId);

  // Find scenario
  currentScenario = workScenarios.find(s => s.id === scenarioId);
  if (!currentScenario) {
    showToast('场景加载失败');
    return;
  }

  // Load phrases
  workPhrases = await getWorkPhrases(scenarioId);

  // Update UI
  const title = document.getElementById('scenario-detail-title');
  const desc = document.getElementById('scenario-detail-desc');

  if (title) title.textContent = `${currentScenario.icon} ${currentScenario.name}`;
  if (desc) desc.textContent = currentScenario.description || '';

  // Render phrases
  renderPhraseCategories();

  // Show detail view
  document.getElementById('work-scenarios-grid').style.display = 'none';
  document.getElementById('work-scenario-detail').style.display = 'block';

  // Log interaction
  saveWorkTroubleLog(scenarioId, [], null);
}

/**
 * 渲染话术分类
 */
function renderPhraseCategories() {
  const container = document.getElementById('phrase-categories-container');
  if (!container) return;

  // Group phrases by type
  const phrasesByType = {
    comfort: workPhrases.filter(p => p.phrase_type === 'comfort'),
    strategy: workPhrases.filter(p => p.phrase_type === 'strategy'),
    script: workPhrases.filter(p => p.phrase_type === 'script'),
    support: workPhrases.filter(p => p.phrase_type === 'support')
  };

  const categoryNames = {
    comfort: { icon: '💝', name: '情感安慰' },
    strategy: { icon: '💡', name: '应对策略' },
    script: { icon: '💬', name: '对话话术' },
    support: { icon: '🌟', name: '鼓励支持' }
  };

  container.innerHTML = Object.entries(phrasesByType).map(([type, phrases]) => {
    if (phrases.length === 0) return '';

    const category = categoryNames[type];
    return `
      <div class="phrase-category">
        <button class="category-header" data-category="${type}">
          <span><span class="category-icon">${category.icon}</span>${category.name}</span>
          <span class="category-arrow">▼</span>
        </button>
        <div class="category-content">
          ${phrases.map(phrase => `
            <div class="phrase-item" data-phrase-id="${phrase.id}">
              <p class="phrase-text">${phrase.content}</p>
              <div class="phrase-actions">
                <button class="btn-copy" data-action="copy" data-phrase-id="${phrase.id}">
                  📋 复制
                </button>
                <button class="btn-ai-polish" data-action="ai" data-phrase-id="${phrase.id}">
                  ✨ AI润色
                </button>
                <button class="btn-helpful" data-action="helpful" data-phrase-id="${phrase.id}">
                  ♥ 有用
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');

  // Bind events
  bindPhraseEvents();
}

/**
 * 绑定话术事件
 */
function bindPhraseEvents() {
  // Category toggle
  document.querySelectorAll('.category-header').forEach(header => {
    header.onclick = () => toggleCategory(header);
  });

  // Phrase actions
  document.querySelectorAll('.phrase-actions button').forEach(btn => {
    const action = btn.getAttribute('data-action');
    const phraseId = btn.getAttribute('data-phrase-id');

    if (action === 'copy') {
      btn.onclick = () => copyPhrase(phraseId);
    } else if (action === 'ai') {
      btn.onclick = () => requestAIPolish(phraseId);
    } else if (action === 'helpful') {
      btn.onclick = (e) => markPhraseHelpful(phraseId, e.target);
    }
  });
}

/**
 * 切换分类展开/收起
 */
function toggleCategory(headerElement) {
  const content = headerElement.nextElementSibling;

  if (content.classList.contains('expanded')) {
    content.classList.remove('expanded');
    headerElement.classList.remove('expanded');
  } else {
    content.classList.add('expanded');
    headerElement.classList.add('expanded');
  }
}

/**
 * 复制话术到剪贴板
 */
async function copyPhrase(phraseId) {
  const phrase = workPhrases.find(p => p.id === phraseId);
  if (!phrase) return;

  try {
    await navigator.clipboard.writeText(phrase.content);
    showToast('✅ 已复制到剪贴板');
  } catch (error) {
    console.error('Copy failed:', error);
    showToast('复制失败，请手动选择文字复制');
  }
}

/**
 * 请求AI润色
 */
async function requestAIPolish(phraseId) {
  const phrase = workPhrases.find(p => p.id === phraseId);
  if (!phrase || !currentScenario) return;

  // Show modal
  const modal = document.getElementById('ai-modal');
  const loading = document.getElementById('ai-loading');
  const result = document.getElementById('ai-result');

  if (modal) modal.style.display = 'flex';
  if (loading) loading.style.display = 'block';
  if (result) result.style.display = 'none';

  try {
    const enhanced = await enhancePhraseWithAI(
      phrase.content,
      currentScenario.name,
      currentScenario.description || ''
    );

    // Show result
    const textEl = document.getElementById('ai-enhanced-text');
    if (textEl) textEl.textContent = enhanced;

    if (loading) loading.style.display = 'none';
    if (result) result.style.display = 'block';

    // Log with AI response
    saveWorkTroubleLog(currentScenario.id, [phraseId], enhanced);

  } catch (error) {
    console.error('AI enhancement failed:', error);
    closeAIModal();
    showToast('AI润色失败，请稍后重试');
  }
}

/**
 * 标记话术为有用
 */
function markPhraseHelpful(phraseId, buttonElement) {
  buttonElement.classList.toggle('marked');
  const isMarked = buttonElement.classList.contains('marked');

  if (isMarked) {
    showToast('❤️ 已标记为有用');
  }
}

/**
 * 返回场景选择
 */
function backToScenarios() {
  document.getElementById('work-scenario-detail').style.display = 'none';
  document.getElementById('work-scenarios-grid').style.display = 'grid';
  currentScenario = null;
  workPhrases = [];
}

/**
 * 关闭AI模态框
 */
function closeAIModal() {
  const modal = document.getElementById('ai-modal');
  if (modal) modal.style.display = 'none';
}

/**
 * 复制AI润色后的文本
 */
async function copyAIEnhancedText() {
  const textEl = document.getElementById('ai-enhanced-text');
  if (!textEl) return;

  try {
    await navigator.clipboard.writeText(textEl.textContent);
    showToast('✅ 已复制到剪贴板');
    closeAIModal();
  } catch (error) {
    console.error('Copy failed:', error);
    showToast('复制失败，请手动选择文字复制');
  }
}

// ========================================
// 去哪儿功能
// ========================================

// 地点选项列表
const destinationOptions = [
  'Westfield',
  'Stanford Shopping Center',
  'Great Mall',
  'Santana Row',
  'SF Chinatown',
  'SF Hermes',
  'Crumble Cookie',
  'Whole Foods',
  "Trader Joe's",
  'Simply Cake',
  'Uji Matcha',
  'Cupertino Main Street',
  'Fremont Food',
  'Palo Alto Downtown',
  'Hiking 1 - Rancho San Antonio',
  'Hiking 2 - Stevens Creek',
  'Hiking 3 - Villa Montalvo'
];

let todayDestination = null;
let isDestinationLocked = false;
let tempDestination = null; // 临时选择，未确认前不保存数据库

/**
 * 初始化去哪儿Tab
 */
async function initDestinationTab() {
  console.log('=== Initializing Destination Tab ===');

  // 更新日期显示
  updateDestinationDate();

  // 检查今日选择状态
  await checkTodayDestination();
}

/**
 * 更新日期显示
 */
function updateDestinationDate() {
  const dateElement = document.getElementById('destination-date');
  if (!dateElement) return;

  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  dateElement.textContent = `${month}月${day}日`;
}

/**
 * 检查今日目的地状态
 */
async function checkTodayDestination() {
  try {
    // 从数据库加载今日选择
    todayDestination = await getTodayDestinationChoice();

    const resultDiv = document.getElementById('destination-choice-result');
    const buttonsDiv = document.getElementById('destination-choice-buttons');
    const confirmSection = document.getElementById('destination-confirm-section');
    const lockedSection = document.getElementById('destination-locked-section');

    if (todayDestination && todayDestination.is_locked) {
      // 已锁定状态
      isDestinationLocked = true;
      displayDestinationChoice(todayDestination.destination);
      if (resultDiv) resultDiv.style.display = 'block';
      if (buttonsDiv) buttonsDiv.style.display = 'none';
      if (confirmSection) confirmSection.style.display = 'none';
      if (lockedSection) lockedSection.style.display = 'block';
    } else if (todayDestination) {
      // 已选择但未锁定
      isDestinationLocked = false;
      displayDestinationChoice(todayDestination.destination);
      if (resultDiv) resultDiv.style.display = 'block';
      if (buttonsDiv) buttonsDiv.style.display = 'flex';
      if (confirmSection) confirmSection.style.display = 'block';
      if (lockedSection) lockedSection.style.display = 'none';
    } else {
      // 还没有选择
      isDestinationLocked = false;
      if (resultDiv) resultDiv.style.display = 'none';
      if (buttonsDiv) buttonsDiv.style.display = 'flex';
      if (confirmSection) confirmSection.style.display = 'none';
      if (lockedSection) lockedSection.style.display = 'none';
    }
  } catch (error) {
    console.error('检查今日目的地失败:', error);
  }
}

/**
 * 随机选择目的地
 */
async function randomDestination() {
  if (isDestinationLocked) {
    showToast('今日已确认，请先解锁');
    return;
  }

  // 显示骰子动画
  const diceDiv = document.getElementById('destination-dice-animation');
  const resultDiv = document.getElementById('destination-choice-result');
  const confirmSection = document.getElementById('destination-confirm-section');

  if (diceDiv) diceDiv.style.display = 'block';
  if (resultDiv) resultDiv.style.display = 'none';
  if (confirmSection) confirmSection.style.display = 'none';

  try {
    // 获取本周已选择的目的地（避免重复）
    const thisWeekChoices = await getThisWeekDestinations();
    const selectedDestinations = thisWeekChoices.map(c => c.destination).filter(Boolean);
    console.log('✓ 本周已选择目的地:', selectedDestinations);

    // 过滤掉本周已选择的
    const availableDestinations = destinationOptions.filter(d => !selectedDestinations.includes(d));

    if (availableDestinations.length === 0) {
      // 如果所有地点都选过了，重置为全部可选
      console.log('⚠️ 本周所有地点都选过了，重置为全部可选');
      availableDestinations.push(...destinationOptions);
    }

    // 等待1秒让动画播放
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 从可用选项中随机选择
    const randomIndex = Math.floor(Math.random() * availableDestinations.length);
    const selectedDestination = availableDestinations[randomIndex];

    // 保存临时选择
    tempDestination = selectedDestination;

    // 隐藏骰子，显示结果
    if (diceDiv) diceDiv.style.display = 'none';
    displayDestinationChoice(selectedDestination);
    if (resultDiv) resultDiv.style.display = 'block';
    if (confirmSection) confirmSection.style.display = 'block';

    console.log('✓ 随机选择目的地:', selectedDestination);
  } catch (error) {
    console.error('随机选择失败:', error);
    if (diceDiv) diceDiv.style.display = 'none';
    showToast('选择失败，请稍后重试');
  }
}

/**
 * 显示目的地选择
 */
function displayDestinationChoice(destination) {
  const destinationEl = document.getElementById('choice-destination');
  if (destinationEl) {
    destinationEl.textContent = destination || '--';
  }
}

/**
 * 确认目的地选择并锁定
 */
async function confirmDestinationChoice() {
  const destinationToSave = tempDestination || (todayDestination ? todayDestination.destination : null);

  if (!destinationToSave) {
    showToast('请先进行选择');
    return;
  }

  try {
    // 保存到数据库并锁定
    const saved = await saveDestinationChoice(destinationToSave, true);

    if (saved) {
      isDestinationLocked = true;
      todayDestination = saved;
      tempDestination = null;

      // 更新UI显示锁定状态
      const buttonsDiv = document.getElementById('destination-choice-buttons');
      const confirmSection = document.getElementById('destination-confirm-section');
      const lockedSection = document.getElementById('destination-locked-section');

      if (buttonsDiv) buttonsDiv.style.display = 'none';
      if (confirmSection) confirmSection.style.display = 'none';
      if (lockedSection) lockedSection.style.display = 'block';

      showToast('✅ 今日目的地已确认！');
      console.log('✓ 目的地已锁定:', destinationToSave);
    } else {
      showToast('保存失败，请重试');
    }
  } catch (error) {
    console.error('确认目的地失败:', error);
    showToast('保存失败，请重试');
  }
}

/**
 * 解锁今日目的地
 */
async function unlockDestination() {
  const confirmed = confirm('确定要重新选择吗？');
  if (!confirmed) return;

  try {
    const unlocked = await unlockTodayDestination();

    if (unlocked) {
      isDestinationLocked = false;
      todayDestination = null;
      tempDestination = null;

      // 更新UI
      const resultDiv = document.getElementById('destination-choice-result');
      const buttonsDiv = document.getElementById('destination-choice-buttons');
      const confirmSection = document.getElementById('destination-confirm-section');
      const lockedSection = document.getElementById('destination-locked-section');

      if (resultDiv) resultDiv.style.display = 'none';
      if (buttonsDiv) buttonsDiv.style.display = 'flex';
      if (confirmSection) confirmSection.style.display = 'none';
      if (lockedSection) lockedSection.style.display = 'none';

      // 清空显示
      displayDestinationChoice('--');

      showToast('✅ 已解锁，可以重新选择');
      console.log('✓ 目的地已解锁');
    } else {
      showToast('解锁失败，请重试');
    }
  } catch (error) {
    console.error('解锁失败:', error);
    showToast('解锁失败，请重试');
  }
}
