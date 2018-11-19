<template>
  <section class="tag">
    <div class="tag-header">
      <Input v-model="search_name" placeholder="Search by realname" style="width: 300px" />
      <!-- <Button type="primary" shape="circle" class="circle" icon="ios-search" @click='search'></Button> -->
      <Button @click="search">search</Button>
      <Button v-if='userRole == "admin"' @click="switchRole">
        Switch User Type
      </Button>
      <Dropdown class="btn-default dropdown" v-if='userRole == "admin"'>
          <a href="javascript:void(0)">
              Create new User
              <Icon type="ios-arrow-down"></Icon>
          </a>
          <DropdownMenu slot="list">
              <li @click="newUser('admin')">admin</li>
              <li @click="newUser('manager')">manager</li>
              <li @click="newUser('developer')">developer</li>
          </DropdownMenu>
      </Dropdown>
      <Dropdown class="btn-default dropdown" v-if='userRole == "admin"'>
          <a href="javascript:void(0)">
              Generate Invitation code
              <Icon type="ios-arrow-down"></Icon>
          </a>
          <DropdownMenu slot="list">
              <li @click="generateCode('admin')">admin</li>
              <li @click="generateCode('manager')">manager</li>
          </DropdownMenu>
      </Dropdown>
    </div>
    <user-table :role="role" :userRole="userRole" :user-list="userList"></user-table>
    <!-- <pagination :page-size="pageSize"
                :total="total"
                :current-page="page"
                @change-page="changePage">
    </pagination> -->
  </section>
</template>

<script>
import api from '../../fetch/api'
import Menu from '../../components/Menu'
import Header from '../../components/Header'
import UserTable from '../../components/UserTable'
import Pagination from '../../components/Pagination'

export default {
  components: {
    'back-menu': Menu,
    'back-header': Header,
    UserTable,
    Pagination
  },
  data () {
    return {
      search_name: '',
      userRole: 'manager',
      userList: [],
      allUsers: [],
      page: 1,
      pageSize: 10,
      total: 0,
      role: 'developer'
    }
  },
  created () {
    this.userRole = localStorage.getItem('role')
    this.search_name = this.$route.query.name
    this.getUserList()
  },
  methods: {
    search: function () {
      this.userList = this.userFilter()
    },
    userFilter: function () {
      console.log('filter')
      let list = []
      if (this.search_name && this.search_name.length > 0) {
        for (let i = 0; i < this.allUsers.length; i++) {
          if (this.allUsers[i].realname.S.indexOf(this.search_name) !== -1) {
            list.push(this.allUsers[i])
          }
        }
        return list
      } else {
        return this.allUsers
      }
    },
    switchRole: async function () {
      this.role = this.role === 'developer' ? 'manager' : 'developer'
      this.getUserList()
    },
    getUserList: async function () {
      // to see developer, get by api.manager
      // to see manager, get by api.admin
      let res = null
      if (this.role === 'developer') {
        res = await api.manager.getUserList(this.page, this.pageSize)
      } else if (this.role === 'manager') {
        res = await api.admin.getUserList(this.page, this.pageSize)
      }
      console.log(res)
      if (res.success === true) {
        this.allUsers = res.data
        this.allUsers.map(val => {
          val.role = this.role
          return val
        })
        this.userList = this.userFilter()
      }
    },
    changePage: function (newPage) {
      this.page = newPage
      this.getUserList()
    },
    newUser: function (userType) {
      console.log(userType)
      this.$msgBox.showMsgBox({
        title: 'Add ' + userType,
        content: 'Realname',
        content2: 'Email address',
        isShowInput: true,
        isShowInput2: true
      }).then(async (val) => {
        console.log(val)
        let res = await api.admin.newUser({
          'realname': val.inputValue,
          'password': '123456',
          'email': val.inputValue2,
          'userType': userType
        })
        if (res.success === true) {
          this.$message.showMessage({
            type: 'success',
            content: 'Add' + userType + 'successfully, initial password is 123456'
          })
        } else {
          this.$message.showMessage({
            type: 'error',
            content: res.message
          })
        }
      }).catch(() => {
        console.log('cancel')
      })
    },
    updatePwd: function () {
      this.$msgBox.showMsgBox({
        title: 'Update Password',
        content: 'New Password',
        isShowInput: true
      }).then(async (val) => {
        console.log(val)
        let res = await api.updatePwd(val.inputValue)
        if (res.success === true) {
          this.$message.showMessage({
            type: 'success',
            content: 'Update Password successfully!'
          })
        } else {
          this.$message.showMessage({
            type: 'error',
            content: res.message
          })
        }
      }).catch(() => {
        console.log('cancel')
      })
    },
    generateCode: async function (userType) {
      let res = await api.admin.generateCode(userType)
      console.log(res)
      if (res.success === true) {
        this.$msgBox.showMsgBox({
          title: 'The code for' + userType,
          content: res.code.code
        })
      } else {
        this.$message.showMessage({
          type: 'error',
          content: res.message
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/sass/app';
.dropdown {
  ul {
    width: 100%;
    left: 0;
    li {
      text-align: center;
      color: black;
      line-height: 40px;
      height: 40px;
    }
  }
}
.tag {
  .tag-header {
    position: relative;
    min-height: 3em;
    button {
      height: 39px;
      padding: 0 10px;
    }
    .circle {
      width: 39px;
    }
  }
  .tag-list {
    overflow: hidden;
    margin-right: 6em;

    .tag-item {
      float: left;

      button {
        position: relative;
        margin: 0 1em 1em 0;
        padding-right: 2em;
        .icon {
          position: absolute;
          top: 1em;
          right: 0.2em;
          width: 0.6em;
          height: 0.6em;
          color: red;
          vertical-align: -0.05em;
          margin-right: 0.4em;
        }
      }
    }
  }
}
</style>
