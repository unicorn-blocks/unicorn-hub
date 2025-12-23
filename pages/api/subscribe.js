// pages/api/subscribe.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email address is required' });
  }
  // 这里只模拟
  return res.status(200).json({ success: true, message: 'API订阅入口已废弃，请直接前端用Google表单提交' });
}
