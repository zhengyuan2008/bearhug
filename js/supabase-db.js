/* ========================================
   Supabase 数据库操作
   ======================================== */

// 生成或获取session ID
function getSessionId() {
  let sessionId = localStorage.getItem('bearHugSessionId');
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('bearHugSessionId', sessionId);
  }
  return sessionId;
}

// ========================================
// 用户互动记录
// ========================================

async function logInteraction(eventType, eventData = {}) {
  const client = getSupabase();
  if (!client) return;

  try {
    const { data, error } = await client
      .from('user_interactions')
      .insert([{
        session_id: getSessionId(),
        event_type: eventType,
        event_data: eventData
      }]);

    if (error) throw error;
    console.log('✓ Logged interaction:', eventType);
  } catch (error) {
    console.error('Error logging interaction:', error);
  }
}

// ========================================
// 姨妈周期数据
// ========================================

async function savePeriodToCloud(startDate) {
  const client = getSupabase();
  if (!client) return;

  try {
    const { data, error } = await client
      .from('period_records')
      .insert([{
        session_id: getSessionId(),
        start_date: startDate
      }]);

    if (error) throw error;
    console.log('✓ Saved period record to cloud');
  } catch (error) {
    console.error('Error saving period record:', error);
  }
}

async function getPeriodHistory(limit = 12) {
  const client = getSupabase();
  if (!client) return [];

  try {
    const { data, error } = await client
      .from('period_records')
      .select('*')
      // 移除session_id过滤，全局共享数据
      .order('start_date', { ascending: false })
      .limit(limit);

    if (error) throw error;
    console.log('✓ Loaded period history:', data?.length || 0, 'records');
    return data || [];
  } catch (error) {
    console.error('Error fetching period history:', error);
    return [];
  }
}

// 删除最新的姨妈记录
async function deleteLatestPeriodRecord() {
  const client = getSupabase();
  if (!client) {
    console.warn('Supabase client not available');
    return false;
  }

  try {
    console.log('=== 开始删除最新记录 ===');

    // 先获取最新的记录（按创建时间排序）
    // 移除session_id过滤，全局共享数据
    const { data: latest, error: fetchError } = await client
      .from('period_records')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError) {
      console.error('获取最新记录失败:', fetchError);
      throw fetchError;
    }

    if (!latest) {
      console.warn('没有找到要删除的记录');
      return false;
    }

    console.log('找到最新记录:', {
      id: latest.id,
      start_date: latest.start_date,
      created_at: latest.created_at
    });

    // 删除这条记录
    const { error: deleteError } = await client
      .from('period_records')
      .delete()
      .eq('id', latest.id);

    if (deleteError) {
      console.error('删除记录失败:', deleteError);
      throw deleteError;
    }

    console.log('✓ 已成功从数据库删除记录 ID:', latest.id);

    // 验证删除
    const { data: verify, error: verifyError } = await client
      .from('period_records')
      .select('id')
      .eq('id', latest.id);

    if (!verifyError && verify && verify.length === 0) {
      console.log('✓ 验证成功：记录已从数据库删除');
    } else {
      console.warn('⚠️ 验证警告：记录可能仍然存在');
    }

    return true;
  } catch (error) {
    console.error('删除期间发生错误:', error);
    return false;
  }
}

// ========================================
// 签到记录
// ========================================

async function saveCheckinToCloud(date) {
  const client = getSupabase();
  if (!client) return;

  try {
    const { data, error } = await client
      .from('survival_checkins')
      .insert([{
        session_id: getSessionId(),
        checkin_date: date
      }]);

    if (error) throw error;
    console.log('✓ Saved checkin to cloud');
  } catch (error) {
    console.error('Error saving checkin:', error);
  }
}

async function getCheckinHistory(days = 30) {
  const client = getSupabase();
  if (!client) return [];

  try {
    const { data, error } = await client
      .from('survival_checkins')
      .select('*')
      // 移除session_id过滤，全局共享数据
      .gte('checkin_date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('checkin_date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching checkin history:', error);
    return [];
  }
}

// ========================================
// 情绪记录
// ========================================

/**
 * 获取过去N天的情绪记录
 */
async function getEmotionHistory(days = 7) {
  const client = getSupabase();
  if (!client) return [];

  try {
    const { data, error } = await client
      .from('user_interactions')
      .select('*')
      // 移除session_id过滤，全局共享数据
      .eq('event_type', 'emotion_click')
      .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;
    console.log('✓ Loaded emotion history:', data?.length || 0, 'records');
    return data || [];
  } catch (error) {
    console.error('Error fetching emotion history:', error);
    return [];
  }
}

// ========================================
// 温暖语录库
// ========================================

async function loadWarmMessages() {
  const client = getSupabase();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('warm_messages')
      .select('*')
      .eq('is_active', true);

    if (error) throw error;

    // 按类别组织消息
    const messages = {
      general: [],
      tired: [],
      sad: [],
      scared: [],
      okay: [],
      survival: [],
      period: []
    };

    data.forEach(msg => {
      if (messages[msg.category]) {
        messages[msg.category].push(msg.message);
      }
    });

    console.log('✓ Loaded warm messages from database');
    return messages;
  } catch (error) {
    console.error('Error loading warm messages:', error);
    return null;
  }
}

// ========================================
// 初始化函数
// ========================================

async function initDatabaseSync() {
  const client = getSupabase();
  if (!client) {
    console.warn('Supabase not initialized, using local storage only');
    return;
  }

  console.log('=== Initializing database sync ===');

  // 可选：从云端加载消息覆盖本地配置
  const cloudMessages = await loadWarmMessages();
  if (cloudMessages) {
    // 更新CONFIG对象（如果需要的话）
    Object.keys(cloudMessages).forEach(category => {
      const key = 'messages' + category.charAt(0).toUpperCase() + category.slice(1);
      if (CONFIG[key] && cloudMessages[category].length > 0) {
        // 可以选择合并或替换
        // CONFIG[key] = cloudMessages[category];
      }
    });
  }

  console.log('=== Database sync initialized ===');
}

// ========================================
// 心情记录
// ========================================

/**
 * 保存心情记录到云端
 */
async function saveEmotionLog(emotionType) {
  const client = getSupabase();
  if (!client) {
    console.warn('Supabase not available, emotion not saved to cloud');
    return;
  }

  try {
    const { data, error } = await client
      .from('emotion_logs')
      .insert([{
        emotion_type: emotionType
      }]);

    if (error) throw error;
    console.log('✓ Emotion logged to cloud:', emotionType);
  } catch (error) {
    console.error('Error saving emotion log:', error);
  }
}

/**
 * 获取最近的心情记录
 */
async function getRecentEmotions(days = 7) {
  const client = getSupabase();
  if (!client) return [];

  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await client
      .from('emotion_logs')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error loading emotion logs:', error);
    return [];
  }
}

// ========================================
// 美食选择
// ========================================

/**
 * 获取所有可用的美食选项
 */
async function getFoodOptions() {
  const client = getSupabase();
  if (!client) return { foods: [], drinks: [] };

  try {
    const { data, error } = await client
      .from('food_options')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;

    const foods = data.filter(item => item.category === 'food');
    const drinks = data.filter(item => item.category === 'drink');

    return { foods, drinks };
  } catch (error) {
    console.error('Error loading food options:', error);
    return { foods: [], drinks: [] };
  }
}

/**
 * 获取今日已选择的美食
 */
async function getTodayFoodChoice() {
  const client = getSupabase();
  if (!client) return null;

  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const { data, error } = await client
      .from('food_choices')
      .select('*')
      .eq('choice_date', today)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) throw error;
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error loading today food choice:', error);
    return null;
  }
}

/**
 * 保存美食选择
 */
async function saveFoodChoice(foodName, drinkName = null, isLocked = false) {
  const client = getSupabase();
  if (!client) {
    console.warn('Supabase not available, food choice not saved');
    return null;
  }

  try {
    const { data, error } = await client
      .from('food_choices')
      .insert([{
        food_name: foodName,
        drink_name: drinkName,
        is_locked: isLocked
      }])
      .select()
      .single();

    if (error) throw error;
    console.log('✓ Food choice saved:', foodName, drinkName, 'locked:', isLocked);
    return data;
  } catch (error) {
    console.error('Error saving food choice:', error);
    return null;
  }
}

/**
 * 获取最近的美食选择历史（不包括今天）
 */
/**
 * 获取本周的美食选择历史（每周一重置）
 */
async function getThisWeekFoodChoices() {
  const client = getSupabase();
  if (!client) return [];

  try {
    const today = new Date();

    // 计算本周一的日期
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Sunday算作上周末
    const monday = new Date(today);
    monday.setDate(today.getDate() - daysFromMonday);
    monday.setHours(0, 0, 0, 0);

    const mondayStr = monday.toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];

    const { data, error } = await client
      .from('food_choices')
      .select('*')
      .gte('choice_date', mondayStr)  // >= 本周一
      .lt('choice_date', todayStr)    // < 今天（排除今天）
      .order('created_at', { ascending: false });

    if (error) throw error;
    console.log(`✓ 获取本周历史记录（${mondayStr}至今，不含今天）:`, data?.length || 0, '条');
    return data || [];
  } catch (error) {
    console.error('Error loading this week food choices:', error);
    return [];
  }
}

/**
 * 获取过去N天的美食选择历史（保留用于其他功能）
 */
async function getRecentFoodChoices(days = 7) {
  const client = getSupabase();
  if (!client) return [];

  try {
    const today = new Date().toISOString().split('T')[0]; // 今天的日期
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days); // 往前推N天
    const startDateStr = startDate.toISOString().split('T')[0];

    const { data, error } = await client
      .from('food_choices')
      .select('*')
      .gte('choice_date', startDateStr)  // >= 开始日期
      .lt('choice_date', today)          // < 今天（排除今天）
      .order('created_at', { ascending: false });

    if (error) throw error;
    console.log(`✓ 获取到过去${days}天的历史记录（不含今天）:`, data?.length || 0, '条');
    return data || [];
  } catch (error) {
    console.error('Error loading food choice history:', error);
    return [];
  }
}

// ========================================
// 工作烦恼
// ========================================

/**
 * 获取所有工作烦恼场景
 */
async function getWorkScenarios() {
  const client = getSupabase();
  if (!client) return [];

  try {
    const { data, error } = await client
      .from('work_scenarios')
      .select('*')
      .eq('is_active', true)
      .order('display_order');

    if (error) throw error;
    console.log('✓ Loaded work scenarios:', data?.length || 0, 'items');
    return data || [];
  } catch (error) {
    console.error('Error loading work scenarios:', error);
    return [];
  }
}

/**
 * 获取指定场景的所有话术
 */
async function getWorkPhrases(scenarioId) {
  const client = getSupabase();
  if (!client) return [];

  try {
    const { data, error } = await client
      .from('work_phrases')
      .select('*')
      .eq('scenario_id', scenarioId)
      .eq('is_active', true)
      .order('phrase_type')
      .order('display_order');

    if (error) throw error;
    console.log('✓ Loaded phrases for scenario:', scenarioId, data?.length || 0, 'phrases');
    return data || [];
  } catch (error) {
    console.error('Error loading work phrases:', error);
    return [];
  }
}

/**
 * 保存工作烦恼记录
 */
async function saveWorkTroubleLog(scenarioId, phraseIds = [], aiResponse = null) {
  const client = getSupabase();
  if (!client) {
    console.warn('Supabase not available, log not saved');
    return null;
  }

  try {
    const { data, error} = await client
      .from('work_trouble_logs')
      .insert([{
        session_id: getSessionId(),
        scenario_id: scenarioId,
        selected_phrase_ids: phraseIds,
        ai_enhanced: !!aiResponse,
        ai_response: aiResponse
      }])
      .select()
      .single();

    if (error) throw error;
    console.log('✓ Work trouble log saved');
    return data;
  } catch (error) {
    console.error('Error saving work trouble log:', error);
    return null;
  }
}

// ========================================
// 去哪儿
// ========================================

/**
 * 获取今日已选择的目的地
 */
async function getTodayDestinationChoice() {
  const client = getSupabase();
  if (!client) return null;

  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const { data, error } = await client
      .from('destination_choices')
      .select('*')
      .eq('choice_date', today)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) throw error;
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error loading today destination choice:', error);
    return null;
  }
}

/**
 * 保存目的地选择
 */
async function saveDestinationChoice(destinationName, isLocked = false) {
  const client = getSupabase();
  if (!client) {
    console.warn('Supabase not available, destination choice not saved');
    return null;
  }

  try {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await client
      .from('destination_choices')
      .insert([{
        session_id: getSessionId(),
        choice_date: today,
        destination: destinationName,
        is_locked: isLocked
      }])
      .select()
      .single();

    if (error) throw error;
    console.log('✓ Destination choice saved:', destinationName);
    return data;
  } catch (error) {
    console.error('Error saving destination choice:', error);
    return null;
  }
}

/**
 * 解锁今日目的地选择
 */
async function unlockTodayDestination() {
  const client = getSupabase();
  if (!client) {
    console.warn('Supabase not available, cannot unlock');
    return false;
  }

  try {
    const today = new Date().toISOString().split('T')[0];

    const { error } = await client
      .from('destination_choices')
      .delete()
      .eq('choice_date', today);

    if (error) throw error;
    console.log('✓ Today destination unlocked');
    return true;
  } catch (error) {
    console.error('Error unlocking destination:', error);
    return false;
  }
}

/**
 * 获取本周的目的地选择历史（每周一重置）
 */
async function getThisWeekDestinations() {
  const client = getSupabase();
  if (!client) return [];

  try {
    const today = new Date();

    // 计算本周一的日期
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Sunday算作上周末
    const monday = new Date(today);
    monday.setDate(today.getDate() - daysFromMonday);
    monday.setHours(0, 0, 0, 0);

    const mondayStr = monday.toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];

    const { data, error } = await client
      .from('destination_choices')
      .select('*')
      .gte('choice_date', mondayStr)  // >= 本周一
      .lt('choice_date', todayStr)    // < 今天（排除今天）
      .order('created_at', { ascending: false });

    if (error) throw error;
    console.log(`✓ 获取本周目的地历史（${mondayStr}至今，不含今天）:`, data?.length || 0, '条');
    return data || [];
  } catch (error) {
    console.error('Error loading this week destinations:', error);
    return [];
  }
}


