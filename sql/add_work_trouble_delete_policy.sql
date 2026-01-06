-- 为工作烦恼记录表添加 DELETE 权限
-- 修复删除功能无法工作的问题

-- 允许匿名用户删除工作烦恼记录
CREATE POLICY "Allow anonymous delete work trouble records"
  ON work_trouble_records
  FOR DELETE
  TO anon
  USING (true);

-- 添加注释
COMMENT ON POLICY "Allow anonymous delete work trouble records" ON work_trouble_records
  IS '允许匿名用户删除工作烦恼记录（用于减号按钮功能）';
