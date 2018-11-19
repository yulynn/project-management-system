<template>
  <section class="developer-table">
    <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Realname</th>
            <th>Email Address</th>
            <th>Operations</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(developer, index) in developerList">
            <tr :key="developer.id.S">
              <td>{{ index + 1 }}</td>
              <td>{{ developer.realname }}</td>
              <td>{{ developer.email }}</td>
              <td>
                <button class="btn-default btn-delete" @click="deleteDeveloper(developer.id, developer.role, index)">Delete this developer</button>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
  </section>
</template>

<script>
// import moment from 'moment'
import api from '../fetch/api'

export default {
  props: {
    projectid: String,
    developerList: Array
  },
  filters: {
  },
  methods: {
    deleteDeveloper: async function (developerId, developerType, index) {
      let that = this
      this.$msgBox.showMsgBox({
        title: 'Delete Developer',
        content: 'This operation cannot be revoke, confirm delete developer?'
      }).then(async () => {
        let res = await api.project.deleteDeveloperFromProject(that.projectid, developerId)
        if (res.success === true) {
          this.developerList.splice(index, 1)
          this.$message.showMessage({
            type: 'success',
            content: 'Delete developer successfully!'
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
.developer-table {
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
