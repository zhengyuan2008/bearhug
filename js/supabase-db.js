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
      .eq('session_id', getSessionId())
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
    const { data: latest, error: fetchError } = await client
      .from('period_records')
      .select('*')
      .eq('session_id', getSessionId())
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
      .eq('session_id', getSessionId())
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
