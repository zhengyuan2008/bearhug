# 秘密信功能说明

## 使用方法

1. 将你的PDF文件重命名为 `our-future.pdf`
2. 放在这个 `documents` 文件夹中
3. 提交并推送到仓库

## 功能位置

在"搞好心态"标签页的底部，有一个半透明的💝按钮，鼠标悬停时会完全显示。点击后会弹出一封给🐻的信。

## 自定义内容

如果你想修改信中的文字，请编辑 `/index.html` 文件中的秘密信模态框部分（搜索 "给🐻的一封信"）。

## PDF文件名

默认链接到：`documents/our-future.pdf`

如果你想使用不同的文件名，请在 `/index.html` 中修改这一行：
```html
<a href="documents/our-future.pdf" target="_blank" class="btn-pdf-open">
```
