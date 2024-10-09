import { bingProxyWorker } from './proxy/bingProxyWorker';

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		return bingProxyWorker(request, env);
	}
};

