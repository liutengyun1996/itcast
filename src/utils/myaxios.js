import axios from 'axios'
// 设置基准路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 拦截器的本质并不是来发起请求的,而是对请求报文进行处理
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么:获取token,设置请求头
  // 1.获取token
  let mytoken = localStorage.getItem('itcast_35_token')
  if (mytoken) {
    // 2.设置请求头:config.headers是一个对象,里面就包含着当前的请求头的设置
    //  console.log(config)
    // 文档中要求须使用Authorization这个键
    config.headers.Authorization = mytoken
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  // Promise.reject(error):中止本次请求
  return Promise.reject(error)
})

export default axios
