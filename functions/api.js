// Netlify函数用于处理API请求
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const bodyParser = require('body-parser');
const mailchimp = require('@mailchimp/mailchimp_marketing');
const crypto = require('crypto');

const app = express();

// 中间件设置
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 配置Mailchimp
mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_DATA_CENTER,
});

// 获取部分隐藏的API密钥(仅用于调试)
const getMaskedApiKey = (apiKey) => {
  if (!apiKey) return 'undefined';
  if (apiKey.length <= 8) return '******';
  return apiKey.substring(0, 4) + '****' + apiKey.substring(apiKey.length - 4);
};

// 创建路由
const router = express.Router();

// 测试连接
router.get('/test-mailchimp', async (req, res) => {
  try {
    console.log('测试Mailchimp连接...');
    console.log(`Mailchimp配置: API密钥=${getMaskedApiKey(process.env.MAILCHIMP_API_KEY)}, 数据中心=${process.env.MAILCHIMP_DATA_CENTER}`);
    
    const response = await mailchimp.ping.get();
    console.log('Mailchimp连接成功!', response);
    res.json({
      success: true,
      message: 'Mailchimp API连接成功!',
      response
    });
  } catch (error) {
    console.error('Mailchimp连接失败:', error);
    res.status(500).json({
      success: false,
      message: '无法连接到Mailchimp API',
      error: error.message
    });
  }
});

// 获取列表信息
router.get('/list-info', async (req, res) => {
  try {
    const listId = process.env.MAILCHIMP_LIST_ID;
    console.log(`获取列表信息，列表ID: ${listId}`);
    
    const response = await mailchimp.lists.getList(listId);
    res.json({
      success: true,
      message: '成功获取列表信息',
      list: response
    });
  } catch (error) {
    console.error('获取列表信息失败:', error);
    res.status(500).json({
      success: false,
      message: '获取列表信息失败',
      error: error.message
    });
  }
});

// 添加订阅
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: '缺少电子邮件地址'
      });
    }

    const listId = process.env.MAILCHIMP_LIST_ID;
    
    // 检查邮件是否已存在
    const subscriberHash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
    
    try {
      // 尝试获取订阅者信息，如果存在则会成功
      await mailchimp.lists.getListMember(listId, subscriberHash);
      
      // 如果成功获取，说明邮件已存在
      return res.json({
        success: true,
        message: '您已经成功订阅了我们的通讯!'
      });
    } catch (error) {
      // 如果获取失败，说明邮件不存在，继续添加订阅流程
      if (error.status !== 404) {
        throw error; // 如果不是404错误，表示有其他问题，继续抛出
      }

      // 添加新订阅者
      const response = await mailchimp.lists.addListMember(listId, {
        email_address: email,
        status: 'subscribed'
      });

      console.log('成功添加订阅者:', email);
      return res.json({
        success: true,
        message: '感谢您的订阅!'
      });
    }
  } catch (error) {
    console.error('添加订阅失败:', error);
    res.status(500).json({
      success: false,
      message: '订阅失败',
      error: error.message
    });
  }
});

app.use('/.netlify/functions/api', router);

// 导出serverless函数
module.exports.handler = serverless(app); 