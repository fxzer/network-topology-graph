import request from './request'
//请求网络拓扑数据
export const getTopoData = () => request.get('/getTopoData') as Promise<TopoResult>
// new Promise((resolve,reject) => setTimeout(() => {
//   resolve(request.get('/getTopoData'))
// }, 2000 ))
export const getVpeTopoData = (uuid) => request.get(`/getVpeTopo?uuid=${uuid}` ) as Promise<TopoResultCpe>
export const getHubTopoData = (uuid) => request.get(`/getHubTopo?uuid=${uuid}` ) as Promise<TopoResultCpe>
