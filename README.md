# MS Copilot Proxy

**Cloudflare Worker 的 Microsoft Copilot 代理**

Fork 自 [jianjianai/microsoft-copilot-proxy](https://github.com/jianjianai/microsoft-copilot-proxy)

## 优点
- 🎉 可在国内直接使用
- 🚀 Cloudflare Worker 一键部署无需其他操作, 完全免费无限制
- ⚡ 高速访问, Cloudflare 是全球最大的 CDN

## 登录方式

> [!CAUTION]
> **重要的安全使用法则**
> 1. 不要轻易在代理站输入自己的账号和密码, **站点部署者可以轻易得到你的账号密码!**
> 2. 请保证, 只在信任的代理站使用密码登录!
> 3. 输入密码前一定要确认代理站域名是你信任的域名!
> 4. 如果一定要在不信任的代理站登录, 可以使用邮件验证码或者 Authenticator 登录
> 5. 使用完不信任的代理站后, 第一时间退出登录
> 6. 如果已经在不信任的代理站使用密码登录过, 请立即修改微软账号密码

> [!TIP]
> **如果你需要经常使用, 建议自己部署代理站, 这样是最安全的选择**

## 部署

### 自动部署

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/fontlos/ms-copilot-proxy)

### 手动部署

克隆仓库, 执行

```sh
npm install
npm run deploy
```