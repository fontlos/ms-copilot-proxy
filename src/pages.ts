import { bingProxyWorker } from "./proxy/bingProxyWorker";

export async function onRequest(context:EventContext<Env,string,any>):Promise<Response>{
    const { request, env } = context;
    return bingProxyWorker(request, env);
}