/* ========================================
   给熊印的小空间 - 主逻辑文件
   ======================================== */

// ========================================
// 密码保护
// ========================================

const CORRECT_PASSWORD = '920229'; // 密码
const AUTH_KEY = 'bearHugAuth'; // localStorage key

/**
 * 检查是否已授权
 */
function checkAuth() {
  const isAuthed = localStorage.getItem(AUTH_KEY);
  if (isAuthed === 'true') {
    unlockContent();
  }
}

/**
 * 验证密码
 */
function verifyPassword() {
  const input = document.getElementById('password-input');
  const errorMsg = document.getElementById('password-error');
  const password = input.value.trim();

  if (password === CORRECT_PASSWORD) {
    // 密码正确，保存到localStorage
    localStorage.setItem(AUTH_KEY, 'true');
    unlockContent();
  } else {
    // 密码错误，显示错误信息
    if (errorMsg) {
      errorMsg.style.display = 'block';
    }
    input.value = '';
    input.focus();

    // 3秒后隐藏错误信息
    setTimeout(() => {
      if (errorMsg) errorMsg.style.display = 'none';
    }, 3000);
  }
}

/**
 * 解锁内容
 */
function unlockContent() {
  const overlay = document.getElementById('password-overlay');
  const mainContent = document.getElementById('main-content');

  if (overlay) {
    overlay.classList.add('hidden');
  }

  if (mainContent) {
    mainContent.classList.add('unlocked');
  }

  console.log('✓ Content unlocked');
}

/**
 * 绑定密码输入事件
 */
function bindPasswordEvents() {
  const submitBtn = document.getElementById('btn-password-submit');
  const passwordInput = document.getElementById('password-input');

  if (submitBtn) {
    submitBtn.onclick = verifyPassword;
  }

  if (passwordInput) {
    // 回车键提交
    passwordInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        verifyPassword();
      }
    });
    // 自动聚焦
    passwordInput.focus();
  }
}

// 页面加载时检查授权状态
document.addEventListener('DOMContentLoaded', () => {
  bindPasswordEvents();
  checkAuth();
});

// ========================================
// 照片池配置
// ========================================

const photoPool = [
  { src: 'images/工作🐰.png', label: '工作中的胖🐰' },
  { src: 'images/🐻柯南.jpeg', label: '🐻柯南' },
  { src: 'images/双猫.jpeg', label: '双猫咪' },
  { src: 'images/双猫凝视.jpeg', label: '双猫凝视' },
  { src: 'images/双猫猫树.jpeg', label: '猫树上的双猫' },
  { src: 'images/大阪城🐻.jpeg', label: '大阪城🐻' },
  { src: 'images/恶魔岛🐰🐻.jpeg', label: '恶魔岛🐰🐻' },
  { src: 'images/清水寺🐰🐻.jpeg', label: '清水寺🐰🐻' },
  { src: 'images/妹妹猫凝视.jpeg', label: '妹妹猫凝视' },
  { src: 'images/东大寺🐰🐻.jpeg', label: '东大寺🐰🐻' },
  { src: 'images/马里奥🐰🐻.jpeg', label: '马里奥🐰🐻' },
  { src: 'images/胖🐰摄影技巧.jpeg', label: '胖🐰的摄影技巧' },
  { src: 'images/胜尾寺.jpeg', label: '胜尾寺' },
  { src: 'images/妹妹猫握手.jpeg', label: '妹妹猫握手' },
  { src: 'images/妹妹猫勇敢.jpeg', label: '勇敢的妹妹猫' },
  { src: 'images/胜尾寺🐻.jpeg', label: '胜尾寺🐻' },
  { src: 'images/🐻和达摩.jpeg', label: '🐻和达摩' },
  { src: 'images/格力高🐻.jpeg', label: '格力高🐻' },
  { src: 'images/🐰和鹿.jpeg', label: '🐰和小鹿' },
  { src: 'images/妹妹和玩偶.jpeg', label: '妹妹和玩偶' },
  { src: 'images/大阪格力高🐰🐻.jpeg', label: '大阪格力高🐰🐻' },
  { src: 'images/漫画婚礼.png', label: '漫画婚礼' },
  { src: 'images/章鱼烧.png', label: '章鱼烧' },
  { src: 'images/平等院.png', label: '平等院' },
  { src: 'images/漫画偷吃.png', label: '漫画偷吃' },
  { src: 'images/阳光🐰7.jpeg', label: '阳光🐰' },
  { src: 'images/小A蜷缩.jpeg', label: '蜷缩的小A' },
  { src: 'images/小A猫.jpeg', label: '小A猫' },
  { src: 'images/小🐻和小A.png', label: '小🐻和小A' }
];

let currentPhotoIndex = 0;

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
  // 使用photoPool随机选择照片
  const photo = getRandomItem(photoPool);
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

  // 如果切换到搞好心态，初始化
  if (tabName === 'mindset') {
    initMindsetTab();
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

  // 护理指南按钮
  const healthGuideButton = document.getElementById('btn-health-guide');
  if (healthGuideButton) {
    healthGuideButton.onclick = toggleHealthGuide;
    console.log('✓ 绑定了护理指南按钮');
  }

  // 关闭护理指南按钮
  const closeHealthGuideButton = document.getElementById('btn-close-guide');
  if (closeHealthGuideButton) {
    closeHealthGuideButton.onclick = closeHealthGuide;
    console.log('✓ 绑定了关闭护理指南按钮');
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

  const rerollDestinationButton = document.getElementById('btn-reroll-destination');
  if (rerollDestinationButton) {
    rerollDestinationButton.onclick = randomDestination;
    console.log('✓ 绑定了重新随机目的地按钮');
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

  // Mindset Tab
  const btnRefreshMindset = document.getElementById('btn-refresh-mindset');
  if (btnRefreshMindset) {
    btnRefreshMindset.onclick = refreshMindsetArticle;
    console.log('✓ 绑定了心态文章刷新按钮');
  }

  const btnRetryMindset = document.getElementById('btn-retry-mindset');
  if (btnRetryMindset) {
    btnRetryMindset.onclick = retryLoadMindsetArticle;
    console.log('✓ 绑定了心态文章重试按钮');
  }

  // 零食拦截记录
  const btnRecordInterception = document.getElementById('btn-record-interception');
  if (btnRecordInterception) {
    btnRecordInterception.onclick = recordSnackInterception;
    console.log('✓ 绑定了零食拦截记录按钮');
  }

  const btnCancelInterception = document.getElementById('btn-cancel-interception');
  if (btnCancelInterception) {
    btnCancelInterception.onclick = cancelSnackInterception;
    console.log('✓ 绑定了取消拦截按钮');
  }

  const btnShowSnackHistory = document.getElementById('btn-show-snack-history');
  if (btnShowSnackHistory) {
    btnShowSnackHistory.onclick = showSnackHistory;
    console.log('✓ 绑定了查看拦截历史按钮');
  }

  const btnCloseSnackHistory = document.getElementById('btn-close-snack-history');
  if (btnCloseSnackHistory) {
    btnCloseSnackHistory.onclick = closeSnackHistory;
    console.log('✓ 绑定了关闭拦截历史按钮');
  }

  // 自定义目的地
  const btnAddDestination = document.getElementById('btn-add-destination');
  if (btnAddDestination) {
    btnAddDestination.onclick = addCustomDestinationHandler;
    console.log('✓ 绑定了添加目的地按钮');
  }

  const customDestinationInput = document.getElementById('custom-destination-input');
  if (customDestinationInput) {
    customDestinationInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        addCustomDestinationHandler();
      }
    });
    console.log('✓ 绑定了目的地输入框回车键');
  }

  const btnToggleDestinations = document.getElementById('btn-toggle-destinations');
  if (btnToggleDestinations) {
    btnToggleDestinations.onclick = toggleCustomDestinationsList;
    console.log('✓ 绑定了目的地列表展开/收起按钮');
  }

  console.log('事件绑定完成！');
}

// ========================================
// 心情回顾功能
// ========================================

/**
 * 切换护理指南显示
 */
function toggleHealthGuide() {
  const content = document.getElementById('health-guide-content');
  if (!content) return;

  if (content.style.display === 'none') {
    content.style.display = 'block';
    // 绑定分类展开事件
    bindHealthCategoryEvents();
  } else {
    content.style.display = 'none';
  }
}

/**
 * 关闭护理指南
 */
function closeHealthGuide() {
  const content = document.getElementById('health-guide-content');
  if (content) {
    content.style.display = 'none';
  }
}

/**
 * 绑定护理指南分类事件
 */
function bindHealthCategoryEvents() {
  document.querySelectorAll('.health-category-header').forEach(header => {
    // 移除旧的事件监听器（避免重复绑定）
    header.replaceWith(header.cloneNode(true));
  });

  // 重新获取并绑定
  document.querySelectorAll('.health-category-header').forEach(header => {
    header.onclick = () => toggleHealthCategory(header);
  });
}

/**
 * 切换护理指南分类展开/收起
 */
function toggleHealthCategory(headerElement) {
  const content = headerElement.nextElementSibling;

  if (content.classList.contains('expanded')) {
    content.classList.remove('expanded');
    headerElement.classList.remove('expanded');
  } else {
    content.classList.add('expanded');
    headerElement.classList.add('expanded');
  }
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

// 全局状态 - 历史故事索引
let currentHistoryStoryIndex = 0;
let todayHistoryStories = [];

/**
 * 加载历史上的今天（从数据库读取）
 */
async function loadHistoryToday() {
  const storyElement = document.getElementById('history-today-story');
  if (!storyElement) return;

  // 获取今天的日期
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  // 显示加载状态
  storyElement.innerHTML = '<p class="history-today-loading">正在加载历史故事...</p>';

  try {
    // 从数据库读取今日所有故事
    todayHistoryStories = await getTodayHistoryStories();

    if (!todayHistoryStories || todayHistoryStories.length === 0) {
      storyElement.innerHTML = '<p class="history-today-error">今日暂无历史故事</p>';
      return;
    }

    console.log(`✓ Loaded ${todayHistoryStories.length} stories for ${month}/${day}`);

    // 重置索引为0，显示第一个故事
    currentHistoryStoryIndex = 0;
    displayHistoryStory(todayHistoryStories[currentHistoryStoryIndex], month, day);

  } catch (error) {
    console.error('加载历史故事失败:', error);
    storyElement.innerHTML = '<p class="history-today-error">加载失败，请稍后重试</p>';
  }
}

/**
 * 显示历史故事
 */
function displayHistoryStory(storyObj, month, day) {
  const storyElement = document.getElementById('history-today-story');
  if (!storyElement) return;

  // 格式化日期
  const dateStr = `${month}月${day}日`;

  // 从数据库对象中提取故事内容
  const storyContent = storyObj.story || storyObj;

  // 处理故事文本（保留换行）
  let formattedStory;

  if (typeof storyContent === 'string') {
    // 如果是字符串，正常处理换行
    formattedStory = storyContent
      .split('\n')
      .map(paragraph => paragraph.trim())
      .filter(paragraph => paragraph.length > 0)
      .map(paragraph => `<p>${paragraph}</p>`)
      .join('');
  } else {
    // 如果不是字符串，直接显示
    console.warn('Story content不是字符串类型:', typeof storyContent);
    formattedStory = `<p>${String(storyContent)}</p>`;
  }

  // 计算当前故事的显示索引（1-based）
  const storyNumber = currentHistoryStoryIndex + 1;
  const totalStories = todayHistoryStories.length;

  // 生成按钮文本
  let buttonHTML = '';
  if (totalStories > 1) {
    buttonHTML = `
      <button class="btn-refresh-story" id="btn-refresh-story" onclick="showNextHistoryStory()">
        📖 另一个故事 (${storyNumber} / ${totalStories})
      </button>
    `;
  }

  storyElement.innerHTML = `
    <h4>${dateStr}</h4>
    ${formattedStory}
    ${buttonHTML}
  `;
}

/**
 * 显示下一个历史故事（循环切换）
 */
function showNextHistoryStory() {
  if (!todayHistoryStories || todayHistoryStories.length === 0) {
    console.warn('No stories available');
    return;
  }

  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  // 循环到下一个故事
  currentHistoryStoryIndex = (currentHistoryStoryIndex + 1) % todayHistoryStories.length;

  console.log(`Showing story ${currentHistoryStoryIndex + 1} of ${todayHistoryStories.length}`);

  // 显示下一个故事
  displayHistoryStory(todayHistoryStories[currentHistoryStoryIndex], month, day);
}

/**
 * 预加载历史上的今天（已弃用 - 使用数据库后不再需要）
 */
function preloadHistoryStory() {
  // 数据库版本无需预加载
  console.log('✅ 历史故事从数据库读取，无需预加载');
}

// ========================================
// 美食抉择功能
// ========================================

let foodOptions = { foods: [], drinks: [] };
let todayChoice = null;
let isChoiceLocked = false;
let tempChoice = null; // 临时选择，未确认前不保存数据库

// Snack Interception State
let todaySnackInterception = null;
let snackHistory = [];

// Custom Destinations State
let customDestinations = [];

// Work Troubles State
let workScenarios = [];
let currentScenario = null;
let workPhrases = [];

// Mindset State
let mindsetTopics = [];
let currentMindsetArticle = null;
let isMindsetLoading = false;

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

  // 初始化零食拦截功能
  await initSnackInterception();
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

  // 加载自定义目的地
  await loadCustomDestinations();

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

// ========================================
// 搞好心态功能
// ========================================

/**
 * 初始化搞好心态tab
 */
async function initMindsetTab() {
  console.log('=== Initializing Mindset Tab ===');

  // 显示加载状态
  showMindsetLoading();

  try {
    // 加载话题列表
    mindsetTopics = await getMindsetTopics();
    console.log('✓ Loaded', mindsetTopics.length, 'mindset topics');

    // 加载或生成今日文章
    await loadMindsetArticle();

  } catch (error) {
    console.error('Error initializing mindset tab:', error);
    showMindsetError();
  }
}

/**
 * 加载或生成今日文章（优先从数据库读取）
 */
async function loadMindsetArticle() {
  if (isMindsetLoading) {
    console.log('Already loading mindset article, skipping...');
    return;
  }

  isMindsetLoading = true;
  showMindsetLoading();

  try {
    console.log('=== Loading Mindset Article ===');

    // 首先尝试从数据库加载今日未读文章
    currentMindsetArticle = await getTodayMindsetArticle();

    if (currentMindsetArticle) {
      console.log('✓ Found today\'s unread article in database');
      displayMindsetArticle(currentMindsetArticle);
      isMindsetLoading = false;
      return;
    }

    // 如果数据库中没有今日未读文章，使用AI生成（慢）
    console.log('⚠️ No unread articles in database, generating with AI (slow)...');

    // 随机选择一个话题
    if (mindsetTopics.length === 0) {
      throw new Error('No topics available');
    }

    const randomTopic = mindsetTopics[Math.floor(Math.random() * mindsetTopics.length)];
    console.log('Selected topic:', randomTopic.title);

    // 调用AI生成文章
    const articleContent = await generateMindsetArticle(randomTopic);
    console.log('✓ Article generated, length:', articleContent.length);

    // 保存到数据库（不带display_order，使用默认值0）
    const savedArticle = await saveMindsetArticle(randomTopic.id, articleContent, 0);

    if (savedArticle) {
      currentMindsetArticle = savedArticle;
      displayMindsetArticle(savedArticle);
    } else {
      // 如果保存失败，仍然显示生成的内容
      currentMindsetArticle = {
        topic: randomTopic,
        content: articleContent
      };
      displayMindsetArticle(currentMindsetArticle);
    }

    isMindsetLoading = false;

  } catch (error) {
    console.error('Error loading mindset article:', error);
    isMindsetLoading = false;
    showMindsetError();
  }
}

/**
 * 显示文章内容
 */
function displayMindsetArticle(article) {
  const titleElement = document.getElementById('mindset-topic-title');
  const bodyElement = document.getElementById('mindset-article-body');

  if (titleElement && article.topic) {
    titleElement.textContent = article.topic.title;
  }

  if (bodyElement && article.content) {
    bodyElement.textContent = article.content;
  }

  showMindsetContent();
  console.log('✓ Article displayed');
}

/**
 * 刷新文章（换一篇）- 优先读取数据库中的未读文章
 */
async function refreshMindsetArticle() {
  try {
    console.log('=== Refreshing Mindset Article ===');

    // 标记当前文章为已读
    if (currentMindsetArticle && currentMindsetArticle.id) {
      const marked = await markMindsetArticleAsRead(currentMindsetArticle.id);
      if (marked) {
        console.log('✓ Current article marked as read');
      }
    }

    // 清空当前文章
    currentMindsetArticle = null;

    // 重新加载文章（会优先从数据库读取未读的）
    await loadMindsetArticle();

    showToast('✨ 已换一篇文章');

  } catch (error) {
    console.error('Error refreshing mindset article:', error);
    showToast('刷新失败，请稍后重试');
  }
}

/**
 * 重试加载文章
 */
async function retryLoadMindsetArticle() {
  console.log('=== Retrying Mindset Article Load ===');
  await loadMindsetArticle();
}

/**
 * 显示加载状态
 */
function showMindsetLoading() {
  const loadingDiv = document.getElementById('mindset-loading');
  const contentDiv = document.getElementById('mindset-article-content');
  const errorDiv = document.getElementById('mindset-error');

  if (loadingDiv) loadingDiv.style.display = 'block';
  if (contentDiv) contentDiv.style.display = 'none';
  if (errorDiv) errorDiv.style.display = 'none';

  console.log('✓ Showing loading state');
}

/**
 * 显示内容状态
 */
function showMindsetContent() {
  const loadingDiv = document.getElementById('mindset-loading');
  const contentDiv = document.getElementById('mindset-article-content');
  const errorDiv = document.getElementById('mindset-error');

  if (loadingDiv) loadingDiv.style.display = 'none';
  if (contentDiv) contentDiv.style.display = 'block';
  if (errorDiv) errorDiv.style.display = 'none';

  console.log('✓ Showing content');
}

/**
 * 显示错误状态
 */
function showMindsetError() {
  const loadingDiv = document.getElementById('mindset-loading');
  const contentDiv = document.getElementById('mindset-article-content');
  const errorDiv = document.getElementById('mindset-error');

  if (loadingDiv) loadingDiv.style.display = 'none';
  if (contentDiv) contentDiv.style.display = 'none';
  if (errorDiv) errorDiv.style.display = 'block';

  console.log('✓ Showing error state');
}

// ========================================
// 零食拦截记录功能
// ========================================

/**
 * 初始化零食拦截功能
 */
async function initSnackInterception() {
  console.log('=== Initializing Snack Interception ===');

  // 设置日期选择器默认值为今天
  const dateInput = document.getElementById('snack-date-input');
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.value = `${yyyy}-${mm}-${dd}`;
    console.log('✓ Date picker initialized to today:', dateInput.value);
  }
}

/**
 * 记录拦截
 */
async function recordSnackInterception() {
  const noteInput = document.getElementById('snack-note-input');
  const dateInput = document.getElementById('snack-date-input');
  const note = noteInput ? noteInput.value.trim() : '';
  const selectedDate = dateInput ? dateInput.value : null;

  if (!selectedDate) {
    showToast('请选择日期');
    return;
  }

  try {
    console.log('=== Recording Snack Interception ===');
    console.log('Selected date:', selectedDate);
    const saved = await saveSnackInterception(selectedDate, note);

    if (saved) {
      showToast('✅ 已记录拦截');

      // 清空备注输入框
      if (noteInput) noteInput.value = '';

      console.log('✓ Snack interception recorded for', selectedDate);
    } else {
      showToast('保存失败，请重试');
    }
  } catch (error) {
    console.error('Error recording snack interception:', error);
    showToast('保存失败，请重试');
  }
}

/**
 * 取消拦截记录
 */
async function cancelSnackInterception() {
  const confirmed = confirm('确定要取消今日的拦截记录吗？');
  if (!confirmed) return;

  try {
    if (!todaySnackInterception) return;

    const deleted = await deleteSnackInterception(todaySnackInterception.id);

    if (deleted) {
      todaySnackInterception = null;
      showSnackNotRecorded();
      showToast('✅ 已取消今日记录');
      console.log('✓ Snack interception cancelled');
    } else {
      showToast('取消失败，请重试');
    }
  } catch (error) {
    console.error('Error cancelling snack interception:', error);
    showToast('取消失败，请重试');
  }
}

/**
 * 显示拦截历史
 */
async function showSnackHistory() {
  const historyContent = document.getElementById('snack-history-content');
  if (!historyContent) return;

  historyContent.style.display = 'block';

  // 加载历史记录
  await loadSnackHistory();
}

/**
 * 关闭拦截历史
 */
function closeSnackHistory() {
  const historyContent = document.getElementById('snack-history-content');
  if (historyContent) {
    historyContent.style.display = 'none';
  }
}

/**
 * 加载拦截历史记录
 */
async function loadSnackHistory() {
  try {
    snackHistory = await getSnackInterceptionHistory(30);
    console.log('✓ Loaded snack history:', snackHistory.length, 'records');

    // 更新统计
    updateSnackStats();

    // 渲染历史列表
    renderSnackHistory();
  } catch (error) {
    console.error('Error loading snack history:', error);
    const listDiv = document.getElementById('snack-history-list');
    if (listDiv) {
      listDiv.innerHTML = '<p class="history-empty">加载失败，请重试</p>';
    }
  }
}

/**
 * 更新统计信息
 */
function updateSnackStats() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // 计算本周一
  const dayOfWeek = now.getDay();
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - daysFromMonday);

  // 计算本月第一天
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // 统计本周和本月的拦截次数
  let weekCount = 0;
  let monthCount = 0;

  snackHistory.forEach(record => {
    const recordDate = new Date(record.interception_date);
    if (recordDate >= monday) weekCount++;
    if (recordDate >= firstDayOfMonth) monthCount++;
  });

  // 更新显示
  const weekStat = document.getElementById('stat-week');
  const monthStat = document.getElementById('stat-month');

  if (weekStat) weekStat.textContent = weekCount;
  if (monthStat) monthStat.textContent = monthCount;
}

/**
 * 渲染历史记录列表
 */
function renderSnackHistory() {
  const listDiv = document.getElementById('snack-history-list');
  if (!listDiv) return;

  if (snackHistory.length === 0) {
    listDiv.innerHTML = '<p class="history-empty">还没有拦截记录</p>';
    return;
  }

  listDiv.innerHTML = snackHistory.map(record => {
    // Fix timezone issue: force local timezone interpretation
    const date = new Date(record.interception_date + 'T00:00:00');
    const dateStr = `${date.getMonth() + 1}月${date.getDate()}日`;
    const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const dayStr = dayNames[date.getDay()];

    let noteHtml = '';
    if (record.note && record.note.trim()) {
      noteHtml = `<div class="history-note">${escapeHtml(record.note)}</div>`;
    }

    return `
      <div class="history-item">
        <div class="history-date">${dateStr} ${dayStr}</div>
        ${noteHtml}
      </div>
    `;
  }).join('');
}

/**
 * HTML转义函数
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ========================================
// 自定义目的地功能
// ========================================

/**
 * 加载自定义目的地
 */
async function loadCustomDestinations() {
  try {
    customDestinations = await getCustomDestinations();
    console.log('✓ Loaded custom destinations:', customDestinations.length, 'items');

    renderCustomDestinations();
  } catch (error) {
    console.error('Error loading custom destinations:', error);
    const listDiv = document.getElementById('custom-destinations-list');
    if (listDiv) {
      listDiv.innerHTML = '<p class="destinations-empty">加载失败，请重试</p>';
    }
  }
}

/**
 * 渲染自定义目的地列表
 */
function renderCustomDestinations() {
  const listDiv = document.getElementById('custom-destinations-list');
  if (!listDiv) return;

  if (customDestinations.length === 0) {
    listDiv.innerHTML = '<p class="destinations-empty">还没有添加自定义目的地</p>';
    return;
  }

  listDiv.innerHTML = customDestinations.map(dest => `
    <div class="destination-item" data-id="${dest.id}">
      <span class="destination-name">${escapeHtml(dest.name)}</span>
      <button class="btn-delete-destination" data-id="${dest.id}">
        🗑️
      </button>
    </div>
  `).join('');

  // 绑定删除按钮事件
  listDiv.querySelectorAll('.btn-delete-destination').forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-id');
      deleteCustomDestinationItem(id);
    };
  });
}

/**
 * 添加自定义目的地
 */
async function addCustomDestinationHandler() {
  const input = document.getElementById('custom-destination-input');
  if (!input) return;

  const name = input.value.trim();

  if (!name) {
    showToast('请输入目的地名称');
    input.focus();
    return;
  }

  // 检查是否重复
  const exists = customDestinations.some(d => d.name === name);
  if (exists) {
    showToast('该目的地已存在');
    input.value = '';
    input.focus();
    return;
  }

  try {
    console.log('=== Adding Custom Destination ===');
    const added = await addCustomDestination(name);

    if (added) {
      customDestinations.unshift(added);
      renderCustomDestinations();
      showToast('✅ 已添加目的地');

      // 清空输入框
      input.value = '';
      input.focus();

      console.log('✓ Custom destination added:', name);
    } else {
      showToast('添加失败，请重试');
    }
  } catch (error) {
    console.error('Error adding custom destination:', error);
    showToast('添加失败，请重试');
  }
}

/**
 * 删除自定义目的地
 */
async function deleteCustomDestinationItem(id) {
  const dest = customDestinations.find(d => d.id === id);
  if (!dest) return;

  const confirmed = confirm(`确定要删除"${dest.name}"吗？`);
  if (!confirmed) return;

  try {
    const deleted = await deleteCustomDestination(id);

    if (deleted) {
      customDestinations = customDestinations.filter(d => d.id !== id);
      renderCustomDestinations();
      showToast('✅ 已删除目的地');
      console.log('✓ Custom destination deleted:', dest.name);
    } else {
      showToast('删除失败，请重试');
    }
  } catch (error) {
    console.error('Error deleting custom destination:', error);
    showToast('删除失败，请重试');
  }
}

/**
 * 展开/收起自定义目的地列表
 */
function toggleCustomDestinationsList() {
  const listDiv = document.getElementById('custom-destinations-list');
  const btnToggle = document.getElementById('btn-toggle-destinations');

  if (!listDiv || !btnToggle) return;

  // Toggle collapsed class
  const isCollapsed = listDiv.classList.contains('collapsed');

  if (isCollapsed) {
    listDiv.classList.remove('collapsed');
    btnToggle.classList.remove('collapsed');
    console.log('✓ Expanded custom destinations list');
  } else {
    listDiv.classList.add('collapsed');
    btnToggle.classList.add('collapsed');
    console.log('✓ Collapsed custom destinations list');
  }
}

/**
 * 更新随机目的地选择（包含自定义目的地）
 */
async function randomDestination() {
  console.log('=== Random Destination Selection ===');

  // 显示骰子动画
  const diceDiv = document.getElementById('destination-dice-animation');
  const buttonsDiv = document.getElementById('destination-choice-buttons');
  const confirmSection = document.getElementById('destination-confirm-section');

  if (diceDiv) diceDiv.style.display = 'block';
  if (buttonsDiv) buttonsDiv.style.display = 'none';
  if (confirmSection) confirmSection.style.display = 'none';

  // 等待动画
  await new Promise(resolve => setTimeout(resolve, 1000));

  // 合并CONFIG中的目的地和自定义目的地
  const allDestinations = [
    ...(CONFIG.destinations || []),
    ...(customDestinations || []).map(d => d.name)
  ];

  if (allDestinations.length === 0) {
    showToast('没有可选择的目的地');
    if (diceDiv) diceDiv.style.display = 'none';
    if (buttonsDiv) buttonsDiv.style.display = 'flex';
    return;
  }

  // 获取本周历史，过滤重复
  const weekHistory = await getThisWeekDestinations();
  const usedDestinations = weekHistory.map(record => record.destination);

  // 过滤未选择过的目的地
  let availableDestinations = allDestinations.filter(d => !usedDestinations.includes(d));

  // 如果所有目的地都被选过，重置为全部
  if (availableDestinations.length === 0) {
    availableDestinations = allDestinations;
    console.log('All destinations used this week, resetting pool');
  }

  // 随机选择
  const randomIndex = Math.floor(Math.random() * availableDestinations.length);
  const selected = availableDestinations[randomIndex];

  // 保存临时选择
  tempDestination = selected;

  // 显示结果
  displayDestinationChoice(selected);

  // 隐藏动画，显示结果和确认按钮
  if (diceDiv) diceDiv.style.display = 'none';

  const resultDiv = document.getElementById('destination-choice-result');

  if (resultDiv) resultDiv.style.display = 'block';
  if (confirmSection) confirmSection.style.display = 'flex';

  console.log('✓ Selected destination:', selected);
}

// ========================================
// 秘密按钮功能
// ========================================

/**
 * 初始化秘密按钮
 */
function initSecretButton() {
  const secretBtn = document.getElementById('secret-heart-button');
  const secretModal = document.getElementById('secret-modal');
  const modalClose = document.getElementById('secret-modal-close');
  const modalOverlay = document.getElementById('secret-modal-overlay');

  // 打开模态框
  if (secretBtn) {
    secretBtn.addEventListener('click', () => {
      console.log('💝 Opening secret modal...');
      if (secretModal) {
        secretModal.style.display = 'flex';
        // 添加淡入动画
        setTimeout(() => {
          secretModal.style.opacity = '1';
        }, 10);
      }
    });
  }

  // 关闭模态框的函数
  const closeModal = () => {
    console.log('💝 Closing secret modal...');
    if (secretModal) {
      secretModal.style.opacity = '0';
      setTimeout(() => {
        secretModal.style.display = 'none';
      }, 300);
    }
  };

  // 点击关闭按钮
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  // 点击背景遮罩
  if (modalOverlay) {
    modalOverlay.addEventListener('click', closeModal);
  }

  // ESC键关闭
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && secretModal && secretModal.style.display === 'flex') {
      closeModal();
    }
  });

  console.log('✓ Secret button initialized');
}

// 页面加载完成后初始化秘密按钮
document.addEventListener('DOMContentLoaded', () => {
  initSecretButton();
});

