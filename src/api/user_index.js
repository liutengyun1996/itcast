// 1.引入封装好的axios
import axios from '@/utils/myaxios.js'

// 1.获取所有用户数据
export const getAllUsers = (params) => {
  return axios({
    url: 'users',
    params
  })
}
// 2.实现用户数据的新增
export const addUser = (data) => {
  return axios({

  })
}

// 3.实现用户数据的编辑
export const editUser = (data) => {
  return axios({
    url: `users/${data.id}`,
    method: 'put',
    data
  })
}

// 4.实现用户角色的分配
export const grantUserRole = (data) => {
  return axios({
    url: `users/$(data.id)/role`,
    method: 'put',
    data: { rid: data.rid }
  })
}
