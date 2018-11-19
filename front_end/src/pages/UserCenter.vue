<template>
  <section class="post-list right-container">
    <back-menu :user-role='userRole'></back-menu>
    <back-header></back-header>
    <div class="tag-header">
      <Button v-if="userRole === 'developer'" @click="addSkill">
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
      <i-col span="12">
        <Card class='profile-card'>
            <p slot="title">Private Profile</p>
            <p class="list-item">realname：{{ profile.realname || '' }}</p>
            <p class="list-item">email address：{{ profile.email || '' }}</p>
            <p class="list-item skill" v-if="userRole == 'developer'">skills：
              <button v-for='(skill, index) in profile.skills' :key='skill' @click='deleteSkill(index)'>{{ skill }}</button>
            </p>
            <p class="list-item">password: ***********</p>
        </Card>
      </i-col>
    </Row>
  </section>
</template>

<script>
import api from '../fetch/api'
import Menu from '../components/Menu'
import Header from '../components/Header'
import DBMarkdown from '../components/DB-Markdown'
import DBSelect from '../components/DB-Select'

export default {
  components: {
    'back-menu': Menu,
    'back-header': Header,
    'db-markdown': DBMarkdown,
    'db-select': DBSelect
  },
  data () {
    return {
      userRole: 'developer',
      profile: {},
      new_profile: {}
    }
  },
  watch: {
  },
  created () {
    this.userRole = localStorage.getItem('role')
    this.getProfile()
  },
  methods: {
    getProfile: async function () {
      let res = await api[localStorage.getItem('role')].getProfile()
      console.log(res)
      if (res.success === true) {
        this.profile = res.data
        this.new_profile = res.data
      }
    },
    updateProfile: function () {
      this.$msgBox.showMsgBox({
        title: 'Update Profile',
        content: 'May I have your new name ?',
        content2: 'May I have your new email ?',
        isShowInput: true,
        isShowInput2: true
      }).then(async (val) => {
        console.log(val)
        this.new_profile.realname = val.inputValue
        this.new_profile.email = val.inputValue2
        let res = await api[this.userRole].putProfile(this.new_profile)
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
        content: 'What password would you perfer ?',
        isShowInput: true
      }).then(async (val) => {
        console.log(val)
        let res = await api.updatePwd(val.inputValue, that.profile, localStorage.getItem('role'))
        if (res.success === true) {
          this.$message.showMessage({
            type: 'success',
            content: 'Update password successfully!'
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
        let res = await api.developer.putProfile(that.profile)
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
        let res = await api.developer.putProfile(that.profile)
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
    },
    signOut: function () {
      localStorage.removeItem('x-access-token')
      localStorage.removeItem('role')
      this.$router.push({ path: '/signin' })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/sass/app';
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
}
.edit {
  position: relative;

  .post-form {
    margin: 0 -1em 5em;

    .no-overflow {
      overflow: visible;
    }
    .tag-list {
      float: left;
    }
    .tag-group {
      position: relative;
      width: 100%;
      border: 1px solid #ccc;
      border-radius: 0.2em;
      outline: none;
      box-sizing: border-box;
      span {
        position: relative;
        float: left;
        margin: 0.5em 0 0 1em;
        padding: 0 1.6em 0 0.5em;
        line-height: 2em;
        background: $base-color;
        color: #fff;
        border-radius: 0.2em;
        .icon {
          position: absolute;
          top: 0.7em;
          right: 0.2em;
          width: 0.6em;
          height: 0.6em;
          color: red;
          vertical-align: -0.05em;
          margin-right: 0.2em;
        }
      }
      input {
        border: none;
        width: auto;
        min-width: 20em;
      }
      .search-tag-list {
        position: absolute;
        top: 100%;
        left: 1em;
        margin-top: 0.15em;
        padding-left: 1em;
        color: #555;
        line-height: 2;
        min-width: 15em;
        z-index: 999;
        background: #eff2f7;
        box-shadow: 0 0.4em 0.8em 0 rgba(0,0,0,0.18);
      }
    }
    .category {
      width: calc(100% - 9em);
    }
    .add-category {
      position: absolute;
      top: 0.15em;
      right: 0.7em;
    }
  }

  .btn-group {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    z-index: 999;
    padding: 1em 0;
    button {
      float: right;
      margin-right: 1em;
    }
  }
}
</style>
