# 支付系统集成说明

## 概述
本项目实现了与Flask后端的支付系统集成，支持Paypal和Payoneer两种支付方式。用户可以通过支付10美元获得40美元的折扣券。

## 前端实现

### 页面结构
- `/pages/buy.jsx` - 立即购买页面
- `/pages/api/payment.js` - 支付API端点
- `/pages/payment/success.jsx` - 支付成功页面
- `/pages/payment/cancel.jsx` - 支付取消页面

### 功能特性
1. **双语支持** - 支持中英文界面
2. **支付方式选择** - Paypal和Payoneer两种支付方式
3. **表单验证** - 邮箱和支付方式验证
4. **响应式设计** - 适配移动端和桌面端
5. **错误处理** - 完善的错误提示和状态管理

### 设计风格
- 保持与现有网站一致的设计语言
- 使用相同的颜色方案和字体
- 圆角卡片式布局
- 渐变按钮和悬停效果

### 支付结果页面
#### 成功页面 (`/payment/success`)
- **功能**：显示支付成功确认
- **特性**：
  - 成功图标和确认消息
  - 折扣券说明
  - 下一步操作指南
  - 5秒倒计时自动返回首页
  - 手动返回按钮
- **多语言**：支持中英文界面

#### 取消页面 (`/payment/cancel`)
- **功能**：处理支付取消情况
- **特性**：
  - 取消原因说明
  - 重新支付按钮
  - 返回首页选项
  - 10秒倒计时自动返回
- **多语言**：支持中英文界面

## 支付流程差异

### PayPal支付流程
1. **用户点击"使用Paypal支付"** → 前端发送请求到`/api/payment`
2. **后端创建PayPal支付** → Flask调用PayPal API创建支付
3. **PayPal返回支付URL** → 用户重定向到PayPal结账页面
4. **用户在PayPal完成支付** → PayPal处理支付
5. **PayPal重定向回网站** → 用户返回成功/取消页面
6. **后端验证支付** → Flask验证PayPal支付状态
7. **发送确认邮件** → 用户收到折扣券邮件

### Payoneer支付流程
1. **用户点击"使用Payoneer支付"** → 前端发送请求到`/api/payment`
2. **后端创建Payoneer支付** → Flask调用Payoneer API创建支付
3. **Payoneer返回支付URL** → 支付链接在新标签页打开
4. **用户在Payoneer完成支付** → Payoneer处理支付
5. **Payoneer发送webhook** → Payoneer通知后端支付状态
6. **后端处理webhook** → Flask更新支付状态并发送邮件
7. **发送确认邮件** → 用户收到折扣券邮件

## 后端集成

### Flask API要求
Flask后端需要提供以下API端点：

#### POST `/api/payment/create`
处理支付请求，接收以下参数：

```json
{
  "email": "user@example.com",
  "payment_method": "Paypal" | "Payoneer",
  "amount": 10.0,
  "currency": "USD",
  "language": "en" | "zh",
  "product_type": "early_bird_discount",
  "description": "Unicorn Blocks Early Bird Discount - $10 for $40 voucher"
}
```

#### 响应格式
成功响应：
```json
{
  "success": true,
  "message": "Payment processed successfully",
  "payment_url": "https://Paypal.com/checkout/...",
  "payment_id": "unique_payment_id"
}
```

错误响应：
```json
{
  "success": false,
  "message": "Error message",
  "error": "detailed_error_info"
}
```

#### POST `/api/payment/paypal/webhook`
处理PayPal IPN（即时支付通知）或webhook回调。

#### POST `/api/payment/payoneer/webhook`
处理Payoneer支付状态通知。

### 环境变量配置
在`.env.local`文件中添加：
```
FLASK_BACKEND_URL=http://localhost:5000
```

## 折扣券逻辑

### 业务规则
1. 用户支付10美元购买早鸟折扣券
2. 折扣券价值40美元，在产品发布时使用
3. 产品原价140美元，使用折扣券后用户只需支付100美元
4. 总节省：30美元（140 - 110 = 30）

### 价格明细
- **现在支付**：$10
- **产品发布时支付**：$100（使用$40折扣券）
- **总计**：$110
- **原价**：$140
- **节省**：$30

## 部署说明

### 开发环境
1. 确保Flask后端运行在`http://localhost:5000`
2. 设置环境变量`FLASK_BACKEND_URL`
3. 启动Next.js开发服务器

### 生产环境
1. 更新`FLASK_BACKEND_URL`为生产环境URL
2. 确保CORS配置正确
3. 测试支付流程完整性

## 测试建议

### 功能测试
1. 测试邮箱验证
2. 测试支付方式选择
3. 测试表单提交
4. 测试错误处理

### 集成测试
1. 测试与Flask API的连接
2. 测试支付流程
3. 测试多语言支持
4. 测试响应式设计

## 安全考虑

### 前端安全
- 输入验证和清理
- XSS防护
- CSRF保护

### 后端安全
- 支付信息加密传输
- 敏感数据不存储在前端
- 支付验证和防重放攻击

## 扩展功能

### 未来可添加的功能
1. 支付状态查询
2. 折扣券管理
3. 用户订单历史
4. 邮件通知系统
5. 支付失败重试机制
