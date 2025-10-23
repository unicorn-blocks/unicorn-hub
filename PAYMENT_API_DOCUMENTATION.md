# 支付接口文档 (Python Flask + MongoDB)

## 概述
本文档描述了独角兽积木项目后端需要提供的支付相关API接口，使用Python Flask框架和MongoDB数据库，支持PayPal、信用卡和Payoneer三种支付方式。

**架构说明**：前后端分离架构，前端Next.js应用通过HTTP API调用后端Flask服务。

## 系统架构

### 前后端分离架构
```
┌─────────────────┐    HTTP API    ┌─────────────────┐
│   前端 Next.js   │ ──────────────► │   后端 Flask     │
│                 │                │                 │
│ - React组件     │                │ - REST API      │
│ - 支付表单      │                │ - 支付处理      │
│ - 状态管理      │                │ - 数据库操作    │
│ - 用户界面      │                │ - 第三方集成    │
└─────────────────┘                └─────────────────┘
                                              │
                                              ▼
                                    ┌─────────────────┐
                                    │    MongoDB       │
                                    │                 │
                                    │ - 订单数据      │
                                    │ - 支付日志      │
                                    │ - 用户信息      │
                                    └─────────────────┘
```

### API调用流程
1. **前端**：用户在checkout页面填写支付信息
2. **前端**：通过HTTP POST请求发送支付数据到后端API
3. **后端**：验证数据，调用第三方支付服务（PayPal/Payoneer）
4. **后端**：保存订单信息到MongoDB
5. **后端**：返回支付结果给前端
6. **前端**：根据返回结果显示成功/失败页面

## 环境配置

### Python依赖
```bash
pip install flask flask-cors pymongo paypalrestsdk requests python-dotenv cerberus
```

### 环境变量配置
```bash
# .env 文件
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox  # 或 production

PAYONEER_CLIENT_ID=your_payoneer_client_id
PAYONEER_CLIENT_SECRET=your_payoneer_client_secret
PAYONEER_MODE=sandbox  # 或 production

MONGODB_URI=mongodb://localhost:27017/unicorn_hub
SECRET_KEY=your_secret_key
```

## API接口

> **注意**：以下所有接口都是后端Flask API端点，前端通过HTTP请求调用。

### 1. 创建PayPal订单
**后端接口**: `POST /api/payment/create-order`
**前端调用**: `fetch('http://backend-url/api/payment/create-order', {...})`

**请求体**:
```json
{
  "amount": "10.00",
  "currency": "USD",
  "email": "user@example.com",
  "shipping": {
    "country": "United States",
    "firstName": "John",
    "lastName": "Doe",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "phone": "+1234567890"
  },
  "language": "en",
  "productType": "early_bird_discount"
}
```

**响应**:
```json
{
  "success": true,
  "orderID": "PAYPAL_ORDER_ID",
  "order": {
    "intent": "CAPTURE",
    "purchase_units": [...],
    "application_context": {...}
  }
}
```

**实现建议**:
```javascript
// 使用PayPal SDK创建订单
const paypal = require('@paypal/checkout-server-sdk');

const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
const client = new paypal.core.PayPalHttpClient(environment);

const request = new paypal.orders.OrdersCreateRequest();
request.prefer("return=representation");
request.requestBody({
  intent: 'CAPTURE',
  purchase_units: [{
    amount: {
      currency_code: 'USD',
      value: amount
    },
    description: 'Unicorn Blocks VIP Pre-order Reservation - $10 deposit for $129 VIP price'
  }]
});

const response = await client.execute(request);
```

### 2. 处理信用卡支付
**后端接口**: `POST /api/payment/credit-card`
**前端调用**: `fetch('http://backend-url/api/payment/credit-card', {...})`

**请求体**:
```json
{
  "amount": "10.00",
  "currency": "USD",
  "email": "user@example.com",
  "cardDetails": {
    "number": "4111111111111111",
    "expiry": "12/25",
    "cvv": "123",
    "name": "John Doe"
  },
  "billingAddress": {
    "country": "United States",
    "firstName": "John",
    "lastName": "Doe",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "phone": "+1234567890"
  },
  "shipping": {
    "country": "United States",
    "firstName": "John",
    "lastName": "Doe",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "phone": "+1234567890"
  },
  "language": "en",
  "productType": "early_bird_discount"
}
```

**响应**:
```json
{
  "success": true,
  "orderId": "INTERNAL_ORDER_ID",
  "transactionId": "CARD_TRANSACTION_ID",
  "message": "Credit card payment processed successfully"
}
```

**实现建议**:
```python
@app.route('/api/payment/credit-card', methods=['POST'])
def process_credit_card():
    try:
        data = request.get_json()
        
        # 验证信用卡数据
        card_details = data.get('cardDetails', {})
        billing_address = data.get('billingAddress', {})
        
        if not all([card_details.get('number'), card_details.get('expiry'), 
                   card_details.get('cvv'), card_details.get('name')]):
            return jsonify({'success': False, 'message': 'Missing card details'}), 400
        
        # 创建内部订单ID
        import uuid
        order_id = str(uuid.uuid4())
        
        # 保存订单到MongoDB
        order_data = {
            '_id': order_id,
            'email': data.get('email'),
            'amount': float(data.get('amount', 10)),
            'currency': data.get('currency', 'USD'),
            'status': 'pending',
            'payment_method': 'credit_card',
            'card_details': {
                'last_four': card_details['number'][-4:],
                'expiry': card_details['expiry'],
                'name': card_details['name']
                # 注意：不存储完整卡号和CVV
            },
            'billing_address': billing_address,
            'shipping_info': data.get('shipping', {}),
            'language': data.get('language', 'en'),
            'product_type': 'vip_preorder',
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        db.orders.insert_one(order_data)
        
        # 使用PayPal处理信用卡支付（推荐方式）
        payment = paypalrestsdk.Payment({
            "intent": "sale",
            "payer": {
                "payment_method": "credit_card",
                "funding_instruments": [{
                    "credit_card": {
                        "number": card_details['number'],
                        "type": detect_card_type(card_details['number']),
                        "expire_month": card_details['expiry'].split('/')[0],
                        "expire_year": "20" + card_details['expiry'].split('/')[1],
                        "cvv2": card_details['cvv'],
                        "first_name": billing_address.get('firstName', ''),
                        "last_name": billing_address.get('lastName', ''),
                        "billing_address": {
                            "line1": billing_address.get('address', ''),
                            "city": billing_address.get('city', ''),
                            "state": billing_address.get('state', ''),
                            "postal_code": billing_address.get('zipCode', ''),
                            "country_code": get_country_code(billing_address.get('country', ''))
                        }
                    }
                }]
            },
            "transactions": [{
                "amount": {
                    "total": data['amount'],
                    "currency": data.get('currency', 'USD')
                },
                "description": "Unicorn Blocks Early Bird Discount"
            }]
        })
        
        if payment.create():
            # 更新订单状态
            db.orders.update_one(
                {'_id': order_id},
                {
                    '$set': {
                        'status': 'completed',
                        'paypal_transaction_id': payment.transactions[0].related_resources[0].sale.id,
                        'completed_at': datetime.utcnow(),
                        'updated_at': datetime.utcnow()
                    }
                }
            )
            
            return jsonify({
                'success': True,
                'orderId': order_id,
                'transactionId': payment.transactions[0].related_resources[0].sale.id,
                'message': 'Credit card payment processed successfully'
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Credit card payment failed',
                'error': payment.error
            }), 400
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Internal server error',
            'error': str(e)
        }), 500

def detect_card_type(number):
    """检测信用卡类型"""
    number = number.replace(' ', '').replace('-', '')
    if number.startswith('4'):
        return 'visa'
    elif number.startswith('5') or number.startswith('2'):
        return 'mastercard'
    elif number.startswith('3'):
        if number.startswith('34') or number.startswith('37'):
            return 'amex'
        elif number.startswith('35'):
            return 'jcb'
        else:
            return 'diners'
    elif number.startswith('6'):
        if number.startswith('6011') or number.startswith('65'):
            return 'discover'
        elif number.startswith('62'):
            return 'unionpay'
        else:
            return 'maestro'
    else:
        return 'visa'  # 默认

def get_country_code(country_name):
    """获取国家代码"""
    country_codes = {
        'United States': 'US',
        'Canada': 'CA',
        'United Kingdom': 'GB',
        'Australia': 'AU',
        'Germany': 'DE',
        'France': 'FR',
        'China': 'CN'
    }
    return country_codes.get(country_name, 'US')
```

### 3. 确认PayPal支付
**后端接口**: `POST /api/payment/confirm`
**前端调用**: `fetch('http://backend-url/api/payment/confirm', {...})`

**请求体**:
```json
{
  "orderID": "PAYPAL_ORDER_ID",
  "paymentData": {
    "method": "paypal",
    "transactionId": "PAYPAL_TRANSACTION_ID",
    "payerId": "PAYPAL_PAYER_ID"
  },
  "email": "user@example.com",
  "shipping": {...},
  "amount": 10,
  "language": "en",
  "productType": "early_bird_discount"
}
```

**响应**:
```json
{
  "success": true,
  "orderId": "INTERNAL_ORDER_ID",
  "message": "Payment confirmed successfully"
}
```

**实现建议**:
```javascript
// 捕获PayPal订单
const request = new paypal.orders.OrdersCaptureRequest(orderID);
request.requestBody({});

const response = await client.execute(request);

// 保存订单到数据库
const order = await saveOrderToDatabase({
  orderId: generateInternalOrderId(),
  paypalOrderId: orderID,
  paypalTransactionId: response.result.purchase_units[0].payments.captures[0].id,
  email: email,
  amount: amount,
  status: 'completed',
  paymentMethod: 'paypal',
  shipping: shipping,
  createdAt: new Date()
});
```

### 4. 处理Payoneer支付
**后端接口**: `POST /api/payment/payoneer`
**前端调用**: `fetch('http://backend-url/api/payment/payoneer', {...})`

**请求体**:
```json
{
  "email": "user@example.com",
  "amount": 10,
  "currency": "USD",
  "shipping": {...},
  "language": "en"
}
```

**响应**:
```json
{
  "success": true,
  "paymentUrl": "https://payoneer.com/payment/...",
  "orderId": "INTERNAL_ORDER_ID"
}
```

**实现建议**:
```javascript
// 创建Payoneer支付会话
const payoneerResponse = await fetch('https://api.payoneer.com/v1/payments', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${payoneerAccessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    amount: amount,
    currency: currency,
    return_url: `${process.env.BASE_URL}/payment/success`,
    cancel_url: `${process.env.BASE_URL}/payment/cancel`,
    description: 'Unicorn Blocks VIP Pre-order Reservation - $10 deposit for $129 VIP price'
  })
});

const payoneerData = await payoneerResponse.json();
```

### 5. 支付状态查询
**后端接口**: `GET /api/payment/status/:orderId`
**前端调用**: `fetch('http://backend-url/api/payment/status/ORDER_ID')`

**响应**:
```json
{
  "success": true,
  "order": {
    "orderId": "INTERNAL_ORDER_ID",
    "status": "completed",
    "paymentMethod": "paypal",
    "amount": 10,
    "email": "user@example.com",
    "createdAt": "2024-01-01T00:00:00Z",
    "completedAt": "2024-01-01T00:01:00Z"
  }
}
```

## 数据库设计

### MongoDB集合结构

#### 订单集合 (orders)
```python
# MongoDB文档结构
{
    "_id": ObjectId("..."),  # MongoDB自动生成的ID
    "paypal_payment_id": "PAYPAL_PAYMENT_ID",  # PayPal支付ID
    "paypal_transaction_id": "PAYPAL_TRANSACTION_ID",  # PayPal交易ID
    "payoneer_payment_id": "PAYONEER_PAYMENT_ID",  # Payoneer支付ID
    "email": "user@example.com",
    "amount": 10.00,
    "currency": "USD",
    "status": "pending",  # pending, completed, failed, cancelled
    "payment_method": "paypal",  # paypal, credit_card, payoneer
    "card_details": {  # 仅信用卡支付时存在
        "last_four": "1111",
        "expiry": "12/25",
        "name": "John Doe",
        "type": "visa"  # visa, mastercard, amex, jcb, unionpay, diners, discover, maestro
    },
    "billing_address": {  # 信用卡支付时的账单地址
        "country": "United States",
        "firstName": "John",
        "lastName": "Doe",
        "address": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001",
        "phone": "+1234567890"
    },
    "shipping_info": {
        "country": "United States",
        "firstName": "John",
        "lastName": "Doe",
        "address": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001",
        "phone": "+1234567890"
    },
    "language": "en",
    "product_type": "vip_preorder",
    "created_at": datetime.utcnow(),
    "updated_at": datetime.utcnow(),
    "completed_at": null
}
```

#### 支付日志集合 (payment_logs)
```python
{
    "_id": ObjectId("..."),
    "order_id": "ORDER_ID",
    "action": "create_order",  # create_order, confirm_payment, process_card, etc.
    "status": "success",  # success, failed
    "request_data": {...},
    "response_data": {...},
    "error_message": null,
    "created_at": datetime.utcnow()
}
```

## 安全建议

### 1. 数据验证
```python
from cerberus import Validator

def validate_payment_data(data):
    schema = {
        'email': {'type': 'string', 'regex': r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', 'required': True},
        'amount': {'type': 'float', 'min': 0.01, 'max': 1000, 'required': True},
        'currency': {'type': 'string', 'allowed': ['USD', 'EUR', 'GBP'], 'required': True},
        'shipping': {
            'type': 'dict',
            'schema': {
                'country': {'type': 'string', 'required': True},
                'firstName': {'type': 'string', 'required': True},
                'lastName': {'type': 'string', 'required': True},
                'address': {'type': 'string', 'required': True},
                'city': {'type': 'string', 'required': True},
                'zipCode': {'type': 'string', 'required': True},
                'phone': {'type': 'string', 'required': True}
            },
            'required': True
        }
    }
    
    validator = Validator(schema)
    if validator.validate(data):
        return True, None
    else:
        return False, validator.errors

def validate_card_data(card_details):
    """验证信用卡数据"""
    schema = {
        'number': {'type': 'string', 'regex': r'^\d{13,19}$', 'required': True},
        'expiry': {'type': 'string', 'regex': r'^\d{2}/\d{2}$', 'required': True},
        'cvv': {'type': 'string', 'regex': r'^\d{3,4}$', 'required': True},
        'name': {'type': 'string', 'minlength': 2, 'required': True}
    }
    
    validator = Validator(schema)
    if validator.validate(card_details):
        return True, None
    else:
        return False, validator.errors
```

### 2. 防重复支付
```python
from datetime import datetime, timedelta

def check_duplicate_payment(email, amount, time_window_minutes=5):
    """检查是否在指定时间窗口内有重复支付"""
    time_threshold = datetime.utcnow() - timedelta(minutes=time_window_minutes)
    
    recent_order = db.orders.find_one({
        'email': email,
        'amount': amount,
        'status': 'completed',
        'completed_at': {'$gte': time_threshold}
    })
    
    return recent_order is not None
```

### 3. 日志记录
```python
def log_payment_attempt(order_id, action, status, data, error=None):
    """记录支付尝试日志"""
    log_entry = {
        'order_id': order_id,
        'action': action,
        'status': status,
        'request_data': data,
        'response_data': None if error else data,
        'error_message': str(error) if error else None,
        'created_at': datetime.utcnow()
    }
    
    db.payment_logs.insert_one(log_entry)
```

### 4. 信用卡数据安全
```python
def sanitize_card_data(card_details):
    """清理信用卡数据，只保留必要信息"""
    return {
        'last_four': card_details['number'][-4:],
        'expiry': card_details['expiry'],
        'name': card_details['name'],
        'type': detect_card_type(card_details['number'])
        # 不存储完整卡号和CVV
    }

def validate_card_number(number):
    """使用Luhn算法验证信用卡号"""
    def luhn_checksum(card_num):
        def digits_of(n):
            return [int(d) for d in str(n)]
        digits = digits_of(card_num)
        odd_digits = digits[-1::-2]
        even_digits = digits[-2::-2]
        checksum = sum(odd_digits)
        for d in even_digits:
            checksum += sum(digits_of(d*2))
        return checksum % 10
    
    return luhn_checksum(number) == 0

# 信用卡类型检测规则
CARD_TYPE_RULES = {
    'visa': ['4'],
    'mastercard': ['5', '2'],
    'amex': ['34', '37'],
    'jcb': ['35'],
    'diners': ['30', '36', '38'],
    'discover': ['6011', '65'],
    'unionpay': ['62'],
    'maestro': ['6']
}
```

## 错误处理

### 常见错误码
- `400`: 请求参数错误
- `401`: 认证失败
- `402`: 支付失败
- `409`: 重复支付
- `500`: 服务器内部错误

### 错误响应格式
```json
{
  "success": false,
  "error": {
    "code": "PAYMENT_FAILED",
    "message": "Payment processing failed",
    "details": "Insufficient funds"
  }
}
```

## 测试建议

### 1. PayPal测试
```javascript
// 使用PayPal沙箱环境
const testPayPalOrder = {
  amount: "10.00",
  currency: "USD",
  // 使用测试邮箱
  email: "test@example.com"
};
```

### 2. 单元测试
```python
import unittest
from unittest.mock import patch, MagicMock
import json

class TestPaymentAPI(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True
    
    def test_create_paypal_order_success(self):
        """测试创建PayPal订单成功"""
        with patch('paypalrestsdk.Payment') as mock_payment:
            mock_payment_instance = MagicMock()
            mock_payment_instance.create.return_value = True
            mock_payment_instance.id = "PAYPAL_ORDER_ID"
            mock_payment_instance.links = [None, MagicMock(href="approval_url")]
            mock_payment.return_value = mock_payment_instance
            
            response = self.app.post('/api/payment/create-order', 
                                  json=valid_payment_data)
            
            self.assertEqual(response.status_code, 200)
            data = json.loads(response.data)
            self.assertTrue(data['success'])
            self.assertEqual(data['orderID'], "PAYPAL_ORDER_ID")
    
    def test_credit_card_payment_success(self):
        """测试信用卡支付成功"""
        with patch('paypalrestsdk.Payment') as mock_payment:
            mock_payment_instance = MagicMock()
            mock_payment_instance.create.return_value = True
            mock_payment_instance.transactions = [MagicMock()]
            mock_payment_instance.transactions[0].related_resources = [MagicMock()]
            mock_payment_instance.transactions[0].related_resources[0].sale = MagicMock()
            mock_payment_instance.transactions[0].related_resources[0].sale.id = "CARD_TRANSACTION_ID"
            mock_payment.return_value = mock_payment_instance
            
            response = self.app.post('/api/payment/credit-card', 
                                  json=valid_card_payment_data)
            
            self.assertEqual(response.status_code, 200)
            data = json.loads(response.data)
            self.assertTrue(data['success'])
            self.assertEqual(data['transactionId'], "CARD_TRANSACTION_ID")
    
    def test_create_paypal_order_validation_error(self):
        """测试创建PayPal订单验证错误"""
        response = self.app.post('/api/payment/create-order', 
                               json={'amount': ''})
        
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertFalse(data['success'])

if __name__ == '__main__':
    unittest.main()
```

## 前端集成说明

### 前端API调用示例
```javascript
// 前端调用后端API的通用函数
const callBackendAPI = async (endpoint, data) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// 调用PayPal支付
const createPayPalOrder = async (paymentData) => {
  return await callBackendAPI('/api/payment/create-order', paymentData);
};

// 调用信用卡支付
const processCreditCard = async (cardData) => {
  return await callBackendAPI('/api/payment/credit-card', cardData);
};

// 调用Payoneer支付
const processPayoneer = async (payoneerData) => {
  return await callBackendAPI('/api/payment/payoneer', payoneerData);
};
```

### 环境变量配置
```bash
# 前端 .env.local 文件
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000  # 开发环境
# NEXT_PUBLIC_BACKEND_URL=https://api.yourdomain.com  # 生产环境
```

### CORS配置
后端需要配置CORS以允许前端跨域请求：
```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=[
    "http://localhost:3000",  # 前端开发环境
    "https://yourdomain.com"  # 前端生产环境
])
```

## 前端信用卡支付集成

### 前端实现特点
前端已经实现了完整的信用卡支付表单，包括：

1. **信用卡输入字段**：
   - 卡号格式化（每4位添加空格）
   - 过期日期格式化（MM/YY）
   - CVV安全码输入
   - 持卡人姓名

2. **支持的卡类型**：
   - Visa
   - Mastercard
   - American Express
   - JCB
   - UnionPay
   - Diners Club
   - Discover
   - Maestro

3. **用户体验优化**：
   - 实时表单验证
   - 安全码提示工具提示
   - 账单地址自动填充选项
   - 响应式设计

### 前端发送的数据格式
```javascript
// 前端发送给后端的信用卡支付数据
const paymentData = {
  amount: "10.00",
  currency: "USD",
  email: "user@example.com",
  cardDetails: {
    number: "4111111111111111",  // 已格式化为 "4111 1111 1111 1111"
    expiry: "12/25",             // 已格式化为 MM/YY
    cvv: "123",
    name: "John Doe"
  },
  billingAddress: {
    country: "United States",
    firstName: "John",
    lastName: "Doe",
    address: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    phone: "+1234567890"
  },
  shipping: {
    // 配送地址信息
  },
  language: "en",
  productType: "early_bird_discount"
};
```

### 前端验证规则
```javascript
// 前端信用卡验证
const validateCardNumber = (number) => {
  const cleaned = number.replace(/\D/g, '');
  return cleaned.length >= 13 && cleaned.length <= 19;
};

const validateExpiryDate = (expiry) => {
  const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  return regex.test(expiry);
};

const validateCVV = (cvv) => {
  return /^\d{3,4}$/.test(cvv);
};
```

## 部署注意事项

### 前后端分离部署
1. **后端部署**：
   - 部署Flask应用到服务器（如AWS EC2, DigitalOcean等）
   - 配置MongoDB数据库
   - 设置环境变量（PayPal、Payoneer凭据）
   - 配置HTTPS和域名

2. **前端部署**：
   - 部署Next.js应用到CDN（如Vercel, Netlify等）
   - 配置后端API URL环境变量
   - 设置域名和HTTPS

3. **环境变量配置**：
   - **后端**：确保生产环境使用正确的PayPal和Payoneer凭据
   - **前端**：配置正确的后端API URL

4. **CORS配置**：
   - 后端需要允许前端域名的跨域请求
   - 生产环境需要更新CORS白名单

### 安全注意事项
1. **HTTPS**: 支付接口必须使用HTTPS
2. **API密钥**: 不要在代码中硬编码API密钥
3. **日志**: 记录所有支付相关的操作，但不记录敏感信息
4. **监控**: 设置支付成功率和响应时间的监控
5. **备份**: 定期备份订单数据

## 联系信息

如有技术问题，请联系开发团队或参考：
- PayPal开发者文档: https://developer.paypal.com/
- Payoneer API文档: https://developer.payoneer.com/
