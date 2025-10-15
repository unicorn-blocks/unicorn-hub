# AI独角兽玩具订阅系统

简单的网站和API，用于收集用户电子邮件并添加到Mailchimp列表中。

## 功能

- 静态网站展示
- 电子邮件订阅表单
- Mailchimp集成
- Next.js静态生成支持

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制`.env.example`文件为`.env`并填写您的Mailchimp配置:

```bash
cp .env.example .env
```

然后编辑`.env`文件。

### 3. 运行服务器

```bash
npm start
```

服务器将在 http://localhost:3001 运行。

### 4. 开发模式

```bash
npm run dev
```

### 5. 构建静态站点

```bash
npm run netlify-build
```

这将在`out`目录中生成静态文件，可用于部署到Netlify等静态托管服务。

## API接口

- `GET /api/test-mailchimp` - 测试Mailchimp连接
- `POST /api/subscribe` - 订阅电子邮件到Mailchimp列表

## 文件结构

- `server.js` - Node.js后端服务器
- `public/index.html` - 主页面HTML文件
- `pages/` - Next.js页面目录
- `next.config.js` - Next.js配置文件
- `.env.example` - 环境变量示例

## Netlify部署

1. 确保项目根目录包含`netlify.toml`文件
2. 设置好所有环境变量
3. 连接GitHub仓库到Netlify
4. 部署时会自动执行`npm run netlify-build`