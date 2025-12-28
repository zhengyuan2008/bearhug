/* ========================================
   Supabase 配置文件
   ======================================== */

// Supabase 项目配置
const SUPABASE_CONFIG = {
  url: 'https://szwqonkwebeukqhqpyfy.supabase.co',
  anonKey: 'sb_publishable_WZbSAXtGDXBMCX1NoAXr_g_9DkRDFzf'
};

// Supabase 客户端实例
let supabaseClient = null;

function initSupabase() {
  if (typeof window.supabase === 'undefined') {
    console.warn('Supabase JS library not loaded yet');
    return null;
  }

  supabaseClient = window.supabase.createClient(
    SUPABASE_CONFIG.url,
    SUPABASE_CONFIG.anonKey
  );

  console.log('✓ Supabase initialized');
  return supabaseClient;
}

// 获取Supabase客户端
function getSupabase() {
  return supabaseClient;
}

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SUPABASE_CONFIG, initSupabase, getSupabase };
}
