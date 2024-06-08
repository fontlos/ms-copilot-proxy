/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { proxyLinkHttp } from "./proxyLink/proxyLinkHttp";
import { usIps } from './ips/usIps';

const XForwardedForIP = usIps[Math.floor(Math.random()*usIps.length)][0];
console.log(XForwardedForIP)
export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const upgradeHeader = request.headers.get('Upgrade');
		if (upgradeHeader && upgradeHeader == 'websocket') {
			return websocketProxy(request);
		}
		const url = new URL(request.url);
		const proxyHostName = url.hostname; //域名
		const proxyOrigin = url.origin;
		const proxyPort = url.port;
		const proxyProtocol = url.protocol;
		return proxyLinkHttp(request,[
			//基础转换
			async (config)=>{
				const url = new URL(config.url);
				url.port = ""
				url.protocol = 'https:';
				config.url = url;
				config.init.headers = new Headers(config.init.headers);
				return config;
			},
			//sydney的请求
			async (config)=>{
				const url = config.url as URL;
				const p = url.pathname;
				if(!p.startsWith("/sydney/")){
					return config;
				}
				url.hostname = "sydney.bing.com";//设置链接
				return config;
			},
			//copilot的请求
			async (config)=>{
				const url = config.url as URL;
				const p = url.pathname;
				if(
					p!="/" && 
					!p.startsWith("/rp/") && 
					!p.startsWith("/fd/") &&
					!p.startsWith("/rewardsapp/") &&
					!p.startsWith("/notifications/") && 
					!p.startsWith("/sa/") &&
					!p.startsWith("/rs/") &&
					!p.startsWith("/sharing/") &&
					!p.startsWith("/sydchat/") &&
					!p.startsWith("/turing/") &&
					!p.startsWith("/th") &&
					!p.startsWith("/Identity/") &&
					!p.startsWith("/hamburger/") &&
					!p.startsWith("/secure/") &&
					p!="/bingufsync" &&
					p!="/passport.aspx" &&
					!p.startsWith("/images/")
				){
					return config;
				}
				url.hostname = "copilot.microsoft.com"
				return config;
			},
			// login请求
			async (config)=>{
				const url = config.url as URL;
				const p = url.pathname;
				if(
					p!="/GetCredentialType.srf" &&
					!p.startsWith("/ppsecure/") &&
					p!="/login.srf" &&
					p!="/GetOneTimeCode.srf" &&
					p!="/GetSessionState.srf" &&
					p!="/GetExperimentAssignments.srf" &&
					p!="/logout.srf"
				){
					return config;
				}
				url.hostname = "login.live.com"
				return config;
			},
			// XForwardedForIP 设置
			async (config)=>{
				const resHeaders = config.init.headers as Headers;
				resHeaders.set("X-forwarded-for", XForwardedForIP);
				return config;
			},
			// origin 设置
			async (config)=>{
				const resHeaders = config.init.headers as Headers;
				const origin = resHeaders.get('Origin');
				if(origin){
					const url = config.url as URL;
					const originUrl = new URL(origin);
					originUrl.protocol = "https:";
					originUrl.port = '';
					originUrl.hostname =  "copilot.microsoft.com"
					if(
						url.pathname=="/GetCredentialType.srf" ||
						url.pathname.startsWith("/ppsecure/") ||
						url.pathname=="/GetExperimentAssignments.srf" ||
						url.pathname=="/secure/Passport.aspx"
					){
						originUrl.hostname = "login.live.com"
					}
					resHeaders.set('Origin',originUrl.toString());
				}
				return config;
			},
			// Referer 设置
			async (config)=>{
				const resHeaders = config.init.headers as Headers;
				const referer = resHeaders.get('Referer');
				if(referer){
					const url = config.url as URL;
					const refererUrl = new URL(referer);
					refererUrl.protocol = "https:";
					refererUrl.port = '';
					refererUrl.hostname =  "copilot.microsoft.com"
					if(
						url.pathname=="/secure/Passport.aspx" || 
						url.pathname.startsWith("/ppsecure/") ||
						url.pathname=="/GetExperimentAssignments.srf" ||
						url.pathname=="/GetCredentialType.srf"
					){
						refererUrl.hostname =  "login.live.com"
					}
					resHeaders.set('Referer',refererUrl.toString());
				}
				return config;
			},
			// 修改登录请求 /secure/Passport.aspx 
			async (config)=>{
				const url = config.url as URL;
				const p = url.pathname;
				if(p!="/secure/Passport.aspx" && p!="/passport.aspx"){
					return config;
				}
				url.searchParams.set("requrl","https://copilot.microsoft.com/?wlsso=1&wlexpsignin=1&wlexpsignin=1&wlexpsignin=1&wlexpsignin=1&wlexpsignin=1&wlexpsignin=1");
				return config;
			},
			// 修改登录请求
			async (config)=>{
				const url = config.url as URL;
				const p = url.pathname;
				if(p!="/fd/auth/signin"){
					return config;
				}
				url.searchParams.set("return_url","https://copilot.microsoft.com/?wlsso=1&wlexpsignin=1&wlexpsignin=1&wlexpsignin=1&wlexpsignin=1&wlexpsignin=1&wlexpsignin=1");
				return config;
			},
			// 修改更新会话请求
			async (config,req)=>{
				const url = config.url as URL;
				const p = url.pathname;
				if(p!="/sydney/UpdateConversation"){
					return config;
				}
				//修改请求内容
				let bodyjson = await req.text();
				bodyjson = bodyjson.replaceAll(proxyOrigin,"https://copilot.microsoft.com");
				config.init.body = bodyjson;
				return config;
			},
			async (config)=>{
				const url = config.url as URL;
				const p = url.pathname;
				if(p!="/fd/ls/l"){
					return config;
				}
				let sdata = url.searchParams.get("DATA");
				if(sdata){
					sdata = sdata.replaceAll(proxyOrigin,"https://copilot.microsoft.com");
					url.searchParams.set("DATA",sdata);
				}
				return config;
			}
		],[
			//基本转换
			async (config)=>{
				config.init.headers = new Headers(config.init.headers);
				return config;
			},
			//set-cookie转换
			async (config)=>{
				const resHeaders = config.init.headers as Headers;
				const newheaders = new Headers();
				for (const headerPer of resHeaders) {
					const key = headerPer[0];
					let value = headerPer[1];
					if (key.toLocaleLowerCase() == 'set-cookie') {
						value = value.replace(/[Dd]omain=\.?[0-9a-z]*\.?microsoft\.com/, `Domain=.${proxyHostName}`);
						value = value.replace(/[Dd]omain=\.?[0-9a-z]*\.?live\.com/, `Domain=.${proxyHostName}`);
						value = value.replace(/[Dd]omain=\.?[0-9a-z]*\.?bing\.com/, `Domain=.${proxyHostName}`);
					}
					newheaders.append(key, value);
				}
				config.init.headers = newheaders;
				return config;
			},
			//txt文本域名替换
			async (config,res)=>{
				const resHeaders = config.init.headers as Headers;
				if (!res.headers.get("Content-Type")?.startsWith("text/")) {
					return config;
				}
				resHeaders.delete("Content-Md5");
				let retBody = await res.text();
				retBody = retBody.replace(/https?:\/\/sydney\.bing\.com(:[0-9]{1,6})?/g, `${proxyOrigin}`);
				retBody = retBody.replace(/https?:\/\/login\.live\.com(:[0-9]{1,6})?/g, `${proxyOrigin}`);
				retBody = retBody.replace(/https?:\/\/copilot\.microsoft\.com(:[0-9]{1,6})?/g, `${proxyOrigin}`);
				retBody = retBody.replace(/https?:\/\/www\.bing\.com\/images\/create\//g,`${proxyOrigin}/images/create/`);
				// retBody = retBody.replace(/https?:\\\/\\\/copilot\.microsoft\.com(:[0-9]{1,6})?/g, `${proxyOrigin.replaceAll("/",`\\/`)}`);
				// retBody = retBody.replaceAll(`"copilot.microsoft.com"`,`"${proxyHostName}"`);
				// retBody = retBody.replaceAll(`"copilot.microsoft.com/"`,`"${proxyHostName}/"`);
				config.body = retBody;
				return config;
			},
			//重定向转换
			async (config,res)=>{
				if(res.status<300 || res.status>=400){
					return config;
				}
				const resHeaders = config.init.headers as Headers;
				const loto = resHeaders.get("Location");
				if(!loto){
					return config;
				}
				if(!loto.toLowerCase().startsWith("http")){
					return config;
				}
				const lotoUrl = new URL(loto);
				lotoUrl.hostname = proxyHostName;
				lotoUrl.port = proxyPort;
				lotoUrl.protocol = proxyProtocol;
				resHeaders.set("Location",lotoUrl.toString());
				return config;
			}
		]);
	},
};


async function websocketProxy(request: Request): Promise<Response> {
	const reqUrl = new URL(request.url);
	reqUrl.hostname = 'sydney.bing.com';
	reqUrl.protocol = 'https:';
	reqUrl.port = '';
	const headers = new Headers(request.headers);
	if(headers.get("origin")){
		headers.set("origin","https://copilot.microsoft.com")
	}
	headers.append("X-forwarded-for", XForwardedForIP);
	return fetch(reqUrl, { 
		body: request.body, 
		headers: headers,
		method: request.method
	}) as any;
}

