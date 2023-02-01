import axios from 'axios'
// 创建一个 axios 实例
const request = axios.create({
    baseURL: 'http://127.0.0.1:5173', // 所有的请求地址前缀部分
    timeout: 60000, // 请求超时时间毫秒
    withCredentials: true, // 异步请求携带cookie
})
// 添加请求拦截器
request.interceptors.request.use(
    function (config) {
        // 在发送请求之前做些什么
        return config
    },
    function (error) {
        // 对请求错误做些什么
        console.error('请求错误', error)
        return Promise.reject(error)
    }
)
// 添加响应拦截器
request.interceptors.response.use(
    function (response) {
        // 对响应数据做点什么
        return response.data
    },
    function (error) {
        return Promise.reject(error)
    }
)
 
export default request 