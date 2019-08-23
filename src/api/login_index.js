// 引入封装好的axios
import axios from '@/utils/myaxios.js'

// 实现登录验证
export const login = (data) => {
  return axios({
    url: 'login',
    method: 'post',
    // 传递的数据,如果是get方式就需要使用params,如果是post方式就需要用data
    data
  })
}
