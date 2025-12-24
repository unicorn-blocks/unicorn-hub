# Google Sheets 邮箱收集设置指南

## 概述

本项目使用Google Apps Script和Google Sheets来收集用户邮箱地址。所有邮箱提交都会统一存储到一个Google Sheets文档中，便于管理和导出。

## 设置步骤

### 1. 创建Google Sheets文档

1. 访问 [Google Sheets](https://sheets.google.com)
2. 创建一个新的空白表格
3. 将表格重命名为 "Unicorn Blocks Email Subscriptions"
4. 复制表格URL中的ID（在 `/d/` 和 `/edit` 之间的长字符串）

### 2. 设置Google Apps Script

1. 在Google Sheets中，点击 **扩展程序** > **Apps Script**
2. 删除默认的 `myFunction()` 代码
3. 将 `google-apps-script/Code.gs` 文件中的代码完整复制粘贴到编辑器中
4. 在代码第6行，将 `YOUR_GOOGLE_SHEETS_ID_HERE` 替换为步骤1中复制的表格ID
5. 保存项目（Ctrl+S 或 Cmd+S）

### 3. 部署Web应用

1. 在Apps Script编辑器中，点击右上角的 **部署** 按钮
2. 选择 **新建部署**
3. 在"类型"中选择 **Web应用**
4. 设置以下配置：
   - **描述**: "Unicorn Blocks Email Collection"
   - **执行身份**: "我"
   - **访问权限**: "任何人"
5. 点击 **部署**
6. 复制生成的Web应用URL（格式类似：`https://script.google.com/macros/s/AKfycby.../exec`）

### 4. 更新项目配置

1. 在项目的 `lib/googleSheets.js` 文件中
2. 将第4行的 `GOOGLE_SHEET_URL` 替换为步骤3中复制的Web应用URL

### 5. 测试功能

1. 在Apps Script编辑器中，选择 `testEmailSubmission` 函数
2. 点击 **运行** 按钮进行测试
3. 检查Google Sheets是否自动创建了 "EmailSubscriptions" 工作表
4. 确认测试数据已正确添加

## 数据结构

Google Sheets将自动创建以下列：

| 列名 | 描述 | 示例 |
|------|------|------|
| Email | 用户邮箱地址 | user@example.com |
| Timestamp | 提交时间 | 2025-01-15 10:30:00 |
| Source | 来源页面/组件 | index-footer, popup-modal |
| Note | 备注信息 | notify-at-launch, vip-reservation |
| Status | 状态 | active |

## 来源标识说明

不同组件使用不同的来源标识：

- `index-footer`: 主页底部邮箱输入
- `popup-modal`: VIP预订弹窗
- `floating-bar`: 浮动邮箱收集条
- `global-notify-bar`: 全局通知栏
- `shop-page`: 商店页面
- `checkout-page`: 结账页面

## 错误排查

### 常见错误及解决方案

1. **"找不到脚本函数:doGet"**
   - 确保Apps Script代码中包含 `doGet()` 函数
   - 重新部署Web应用

2. **"权限被拒绝"**
   - 检查Web应用的访问权限设置为"任何人"
   - 重新授权Apps Script访问Google Sheets

3. **"无法访问Google Sheets"**
   - 确认SHEET_ID正确
   - 检查Google Sheets的共享权限

4. **邮箱重复添加**
   - 系统会自动检测重复邮箱，只更新时间戳和来源

## 数据导出

1. 在Google Sheets中选择所有数据
2. 点击 **文件** > **下载** > **逗号分隔值(.csv)**
3. 可导入到Mailchimp或其他邮件营销平台

## 安全注意事项

- Web应用URL包含敏感信息，不要公开分享
- 定期检查Google Sheets的访问权限
- 考虑设置数据备份策略
- 遵守GDPR和其他数据保护法规

## 维护建议

- 定期清理测试数据
- 监控Apps Script的执行配额
- 备份重要的邮箱数据
- 更新部署时记得测试所有邮箱收集点