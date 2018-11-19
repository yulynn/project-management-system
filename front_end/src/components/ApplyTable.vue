<template>
  <section class="apply-table">
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
          <template v-for="(apply, index) in applyList">
            <tr :key="apply.id.S">
              <td>{{ index + 1 }}</td>
              <td>{{ apply.realname }}</td>
              <td>{{ apply.email }}</td>
              <td>
                <button class="btn-default btn-delete" @click="passApply(apply.id, index)">Pass Apply</button>
                <button class="btn-default btn-delete" @click="rejectApply(apply.id, index)">Reject Apply</button>
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
    projectid: String,
    applyList: Array
  },
  filters: {
  },
  methods: {
    passApply: async function (developerId, index) {
      let that = this
      this.$msgBox.showMsgBox({
        title: 'Pass Apply',
        content: 'Pass apply?'
      }).then(async () => {
        let res = await api.manager.examineDeveloperApplies({
          'projectid': that.projectid,
          'developerid': developerId,
          'state': 'pass'
        })
        if (res.success === true) {
          this.applyList.splice(index, 1)
          this.$message.showMessage({
            type: 'success',
            content: 'developer joined successfully!'
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
    rejectApply: async function (developerId, index) {
      let that = this
      this.$msgBox.showMsgBox({
        title: 'Reject Apply',
        content: 'Reject apply?'
      }).then(async () => {
        let res = await api.manager.examineDeveloperApplies({
          'projectid': that.projectid,
          'developerid': developerId,
          'state': 'reject'
        })
        if (res.success === true) {
          this.applyList.splice(index, 1)
          this.$message.showMessage({
            type: 'success',
            content: 'This apply rejects successfully.'
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
.apply-table {
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
