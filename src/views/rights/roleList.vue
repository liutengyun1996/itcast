<template>
  <div class="rolesList">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 按钮添加 -->
    <el-button type="success" @click="adddialogFormVisible=true">添加角色</el-button>
    <!-- 表格 -->
    <el-table :data="roleList" border style="width: 100%;margin-top:15px">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 这个内容在我们的项目中需要我们自己来生成 -->
          <el-row
            v-for="first in scope.row.children"
            :key="first.id"
            style="margin-bottom:15px;border-bottom:1px dashed #f00;"
          >
            <el-col :span="4">
              <el-tag
                closable
                :type="'success'"
                @close="cnt=0;delRight(scope.row,first.id)"
              >{{first.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row v-for="second in first.children" :key="second.id" style="margin-bottom:10px;">
                <el-col :span="4">
                  <el-tag
                    closable
                    :type="'info'"
                    @close="cnt=0;delRight(scope.row,second.id)"
                  >{{second.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    closable
                    :type="'error'"
                    v-for="third in second.children"
                    :key="third.id"
                    style="margin-right:5px;margin-bottom:5px"
                    @close="cnt=0;delRight(scope.row,third.id)"
                  >{{third.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" v-show="scope.row.children.length === 0">还没有任何的权限，先分配！！</el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="描述"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="角色授权" placement="top">
            <el-button type="success" icon="el-icon-share" @click="showGrantDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="warning" icon="el-icon-delete"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配权限对话框 -->
    <el-dialog title="权限分配" :visible.sync="grantdialogTableVisible">
      <el-tree
        :data="rightList"
        ref="tree"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="chkedArr"
        :props="defaultProps"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="grantdialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantRole">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="adddialogFormVisible">
      <el-form :model="addForm" :label-width="'100px'">
        <el-form-item label="角色名称">
          <el-input v-model="addForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="adddialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click='addRoleSubmit'>确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getAllRoleList, delRightByRoleId, grantRoleById, addRole } from '@/api/role_index.js'
import { getAllRightList } from '@/api/right_index.js'
export default {
  data () {
    return {
      adddialogFormVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },

      roleId: '',
      cnt: 0,
      defaultProps: {
        label: 'authName',
        children: 'children'
      },
      grantdialogTableVisible: false,
      roleList: [],
      rightList: [],
      chkedArr: []
    }
  },
  methods: {
    // 新增角色
    async addRoleSubmit () {
      let res = await addRole(this.addForm)
      console.log(res)
      if (res.data.meta.status === 201) {
        this.$message({
          type: 'success',
          message: res.data.meta.msg
        })
        this.adddialogFormVisible = false
        this.roleInit()
      }
    },
    async grantRole () {
      let arr = this.$refs.tree.getCheckedNodes()
      console.log(arr)
      let temp = []
      for (var i = 0; i < arr.length; i++) {
        temp.push(arr[i].id + ',' + arr[i].pid)
      }
      temp = temp.join(',').split(',')
      temp = [...new Set(temp)]
      let res = await grantRoleById(this.roleId, temp.join(','))
      console.log(res)
      if (res.data.meta.status === 200) {
        this.$message.success(res.data.meta.msg)
        this.grantdialogTableVisible = false
        this.init()
      } else {
        this.$message.error(res.data.meta.msg)
      }
    },
    // 弹出角色授权对话框
    showGrantDialog (row) {
      // 这里进行数据的存储是为了后期角色授权能够正确的获取角色id
      this.roleId = row.id
      // 1.让对话框展示
      // 2.加载树形组件的数据
      // 3.获取权限id，让节点默认被选择
      this.grantdialogTableVisible = true
      // 加载树形组件的数据
      getAllRightList('tree').then(res => {
        console.log(res)
        this.rightList = res.data.data
      })
      this.chkedArr.length = 0
      // 获取当前角色的权限id,添加到chkedaArr
      row.children.forEach(first => {
        if (first.children.length > 0) {
          first.children.forEach(second => {
            if (second.children.length > 0) {
              second.children.forEach(third => {
                this.chkedArr.push(third.id)
              })
            }
          })
        }
      })
    },
    delRight (row, rightId) {
      console.log(row.id, rightId)
      delRightByRoleId(row.id, rightId)
        .then(res => {
          console.log(res)
          if (this.cnt === 0) {
            this.$message.success('删除角色权限成功')
            this.cnt++
          }
          row.children = res.data.data
          row.children.forEach((v1, in1) => {
            if (v1.children.length === 0) {
              this.delRight(row, v1.id)
            } else {
              v1.children.forEach((v2, in2) => {
                if (v2.children.length === 0) {
                  this.delRight(row, v2.id)
                }
              })
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    init () {
      // 角色列表
      getAllRoleList().then(res => {
        console.log(res)
        if (res.data.meta.status === 200) {
          this.roleList = res.data.data
        }
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang="less" scoped>
</style>
