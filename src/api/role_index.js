// 1.引入封装好的axios
import axios from '@/utils/myaxios.js'

// 1.获取所有用户数据
export const getAllRoleList = () => {
  return axios({
    url: 'roles'
  })
}
// 2.删除角色指定的权限
export const delRightByRoleId = (roleId, rightId) => {
  return axios({
    method: 'delete',
    url: `roles/${roleId}/rights/${rightId}`
  })
}

// 3.为指定角色授权
export const grantRoleById = (roleId, rids) => {
  return axios({
    method: 'post',
    url: `roles/${roleId}/rights`,
    data: { rids }
  })
}

// 4.添加角色
export const addRole = (data) => {
  return axios({
    url: `roles`,
    method: 'post',
    data
  })
}
