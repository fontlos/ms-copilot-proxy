# MS Copilot Proxy

**Cloudflare Worker 的 Microsoft Copilot 代理**

Fork 自 [jianjianai/microsoft-copilot-proxy](https://github.com/jianjianai/microsoft-copilot-proxy)

## 优点
- 🎉 可在国内直接使用
- 🚀 Cloudflare Worker 一键部署无需其他操作, 完全免费无限制
- ⚡ 高速访问, Cloudflare 是全球最大的 CDN

## 访问

- Copilot -> https://example.com/
- Copilot(新版) -> https://example.com/?dpwa=1
- Designer -> https://example.com/images/create

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

## 环境变量
| 名称 | 作用 |
| - | - |
| ```BYPASS_SERVER``` | 如果为空或者没配置则使用内置pass服务通过验证，如果配置了则使用配置的pass服务器通过验证。本项目将 [Harry-zklcdc/go-bingai-pass](Harry-zklcdc/go-bingai-pass) 打包在一起一键部署，一般情况下此环境变量无需配置。 |
| ```XForwardedForIP``` | 如果配置了此环境变量，则使用此IP作为X-Forwarded-For头部，不配置则使用随机USIP                                                                                         |
| ```MCP_PASSWD``` | 密码授权，如果配置了此环境变量则需要输入正确的密码才能使用 |
| ```LOGIN_PROMPT_MSG``` | 登录提示消息，显示在标题下方，可以是html，配置了MCP_PASSWD才起作用 |