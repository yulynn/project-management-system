<template>
  <section class="user-table">
    <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Realname</th>
            <th>Email Address</th>
            <th>User Type</th>
            <th>Operations</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(user, index) in userList">
            <tr :key="user.id.S">
              <td>{{ index + 1 }}</td>
              <td>{{ user.realname.S }}</td>
              <td>{{ user.email.S }}</td>
              <td>{{ user.role }}</td>
              <td>
                <button class="btn-default btn-delete" @click="gotoUser(user.id.S)">User Profile</button>
                <button class="btn-default btn-delete" @click="gotoUser(user.id.S)">Add To Project</button>
                <button v-if='userRole == "admin"' class="btn-default btn-delete" @click="deleteUser(user.id.S, user.role, index)">Delete User</button>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
  </section>
</template>

<script>
import api from '../fetch/api'

export default {
  props: {
    role: String,
    userRole: String,
    userList: Array
  },
  methods: {
    gotoUser: function (userid) {
      this.$router.push({ path: '/user/' + userid, query: { userType: this.role } })
    },
    deleteUser: async function (userId, userType, index) {
      this.$msgBox.showMsgBox({
        title: 'Delete User',
        content: 'This operation cannot be revoke, confirm to delete user?'
      }).then(async () => {
        let res = await api.admin.deleteUser(userType, userId)
        if (res.success === true) {
          this.userList.splice(index, 1)
          this.$message.showMessage({
            type: 'success',
            content: 'Delete user successfully!'
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
@import "../assets/sass/app";
.user-table {
  table {
    width: 100%;
    thead {
      background: #eef1f6;
    }
    tr {
      line-height: 3;
      &:hover {
        background: #eef1f6;
      }
      th,
      td {
        text-align: left;
        padding-left: 1em;
        border: 1px solid #dfe6ec;
      }
      button {
        padding: 0.4em 1em;
        margin-left: 1em;

        &.btn-offline {
          background-color: #eb9e05;
          color: #fff;
          border-color: #eb9e05;
          &:hover {
            opacity: .8;
          }
        }
        &.btn-publish {
          background-color: $base-color;
          color: #fff;
          border-color: $base-color;
          &:hover {
            opacity: .8;
          }
        }
        &.btn-delete {
          background-color: #fa5555;
          border-color: #fa5555;
          color: #fff;
          &:hover {
            opacity: .8;
          }
        }
      }
    }
  }
}
</style>
