<template>
  <div>
    <div class="tag-header">
      <Button v-if="role === 'developer'" @click="addSkill">
        Add Skill
      </Button>
      <Button @click="updatePwd">
        Update Password
      </Button>
      <Button @click="updateProfile">
        Update Profile
      </Button>
    </div>
    <Row>
      <i-col span="11">
        <Card class='profile-card'>
            <p slot="title">Developer Profile</p>
            <p class="list-item">Realname: {{ profile.realname || '' }}</p>
            <p class="list-item">Email Address: {{ profile.email }}</p>
            <p class="list-item skill" v-if="role=='developer'">Skills:
              <button v-for='(skill, index) in profile.skills' :key='skill' @click='deleteSkill(index)'>{{ skill }}</button>
            </p>
        </Card>
      </i-col>
      <i-col span="24" v-if="role=='developer'">
        <Divider />
      </i-col>
      <i-col span="24" v-if="role=='developer'">
        <Card class='profile-card'>
            <p slot="title">Avaliable Projects</p>
            <project-avaliable-table :developeremail="profile.email" :developerid="profile.id" :project-list="projectList"></project-avaliable-table>
            <pagination :page-size="pageSize"
                        :total="total"
                        :current-page="page"
                        @change-page="changePage">
            </pagination>
        </Card>
      </i-col>
    </Row>
  </div>
</template>

<script>
import api from '../../fetch/api'
import Menu from '../../components/Menu'
import Header from '../../components/Header'
import ProjectAvaliableTable from '../../components/ProjectAvaliableTable'
import Pagination from '../../components/Pagination'

export default {
  components: {
    'back-menu': Menu,
    'back-header': Header,
    ProjectAvaliableTable,
    Pagination
  },
  data () {
    return {
      profile: {},
      new_profile: {},
      manager: {},
      projectList: [],
      page: 1,
      pageSize: 10,
      total: 0,
      role: 'manager',
      userRole: 'developer'
    }
  },
  created () {
    this.userRole = localStorage.getItem('role')
    this.role = this.$route.query.userType
    this.getUser()
  },
  methods: {
    getUser: async function () {
      let res = null
      if (this.role === 'developer') {
        res = await api.manager.getDeveloperById(this.$route.params.userid)
      } else if (this.role === 'manager') {
        res = await api.admin.getManager(this.$route.params.userid)
      }
      console.log('developer')
      console.log(res)
      if (res && res.success === true) {
        this.profile = res.data
        this.new_profile = res.data
        this.getProjectList()
      }
    },
    getProjectList: async function () {
      // manager get projects managered by itself
      // admin get all
      let res = null
      if (this.userRole === 'admin') {
        res = await api.project.getAllProject(this.page, this.pageSize)
        if (res.success === true) {
          this.projectList = res.data
        }
      } else if (this.userRole === 'manager') {
        res = await api.project.getProjectList(this.page, this.pageSize)
        if (res.success === true) {
          this.projectList = res.data
        }
      }
      console.log(this.projectList)
    },
    changePage: function (newPage) {
      this.page = newPage
      this.getDeveloperList()
    },
    applyChangePage: function (newPage) {
      this.applyPage = newPage
      this.getApplyList()
    },
    newUser: function (userType) {
      console.log(userType)
      this.$msgBox.showMsgBox({
        title: 'Create New User',
        content: 'Realname',
        content2: 'Email Address',
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
            content: 'Add user successfully, initial password is 123456'
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
    updateProfile: function () {
      this.$msgBox.showMsgBox({
        title: 'Update Profile',
        content: 'New Name',
        content2: 'New Email',
        isShowInput: true,
        isShowInput2: true
      }).then(async (val) => {
        console.log(val)
        this.new_profile.realname = val.inputValue
        this.new_profile.email = val.inputValue2
        let res = null
        if (this.role === 'developer') {
          res = await api.manager.updateDeveloperProfile(this.new_profile)
        } else {
          res = await api.admin.updateManagerProfile(this.new_profile, this.new_profile.id)
        }
        if (res.success === true) {
          this.profile.realname = this.new_profile.realname
          this.profile.email = this.new_profile.email
          this.$message.showMessage({
            type: 'success',
            content: 'Update profile successfully!'
          })
        } else {
          this.$message.showMessage({
            type: 'error',
            content: res.error
          })
        }
      }).catch(() => {
        console.log('cancel')
      })
    },
    updatePwd: function () {
      let that = this
      this.$msgBox.showMsgBox({
        title: 'Update Password',
        content: 'Password',
        isShowInput: true
      }).then(async (val) => {
        console.log(val)
        let res = null
        that.new_profile.password = val.inputValue
        if (that.role === 'developer') {
          res = await api.manager.updateDeveloperProfile(that.new_profile)
        } else {
          res = await api.admin.updateManagerProfile(that.new_profile, that.new_profile.id)
        }
        if (res.success === true) {
          that.$message.showMessage({
            type: 'success',
            content: 'Update password successfully!'
          })
        } else {
          that.$message.showMessage({
            type: 'error',
            content: res.message
          })
        }
      }).catch(() => {
        console.log('cancel')
      })
    },
    addSkill: function () {
      let that = this
      this.$msgBox.showMsgBox({
        title: 'Add Skills',
        content: 'Please input your new skill',
        isShowInput: true
      }).then(async (val) => {
        console.log(val)
        if (!that.new_profile.skills) {
          that.new_profile.skills = []
        }
        that.new_profile.skills.push(val.inputValue)
        let res = await api.manager.updateDeveloperProfile(this.new_profile)
        if (res.success === true) {
          that.profile.skills = this.new_profile.skills
          this.$message.showMessage({
            type: 'success',
            content: 'Add skill successfully!'
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
    deleteSkill: function (index) {
      let that = this
      this.$msgBox.showMsgBox({
        title: 'Delete Skills',
        content: 'This operation cannot be revoke, delete skill?'
      }).then(async () => {
        that.new_profile.skills.splice(index, 1)
        let res = await api.manager.updateDeveloperProfile(this.new_profile)
        if (res.success === true) {
          that.profile.skills = this.new_profile.skills
          this.$message.showMessage({
            type: 'success',
            content: 'Delete skill successfully!'
          })
        } else {
          this.$message.showMessage({
            type: 'error',
            content: res.message
          })
        }
      }).catch(() => {
        return false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/sass/app';
.tag-header {
  position: relative;
  min-height: 3em;
  button {
    height: 39px;
    padding: 0 10px;
  }
}
.profile-card {
  p.list-item {
    height: 50px;
  }
  p.skill {
    button {
      font-size: 16px;
      background: none;
      border: 1px solid blue;
      line-height: 25px;
      border-radius: 8px;
      color: blue;
      height: 30px;
      padding: 3px 8px;
      margin: 0 5px;
    }
  }
}
.dropdown {
  ul {
    width: 100%;
    left: 0;
    li {
      text-align: center;
      // font-size: 30px;
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
    .btn-add {
      position: absolute;
      top: 0;
      right: 0;
      color: $base-color;
      border-color: $base-color;
      .icon {
        width: 0.9em;
        height: 0.9em;
        vertical-align: -0.05em;
        margin-right: 0.4em;
      }
    }
    .btn-add-2 {
      right: 12em;
    }
    .btn-add-3 {
      right: 24em;
    }
    .btn-add-4 {
      right: 36em;
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
