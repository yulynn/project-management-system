<template>
  <section class="project-table">
    <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Project Name</th>
            <th>Project Introduce</th>
            <th>Project Process</th>
            <th>Operations</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(project, index) in projectList">
            <tr :key="project.id.S">
              <td>{{ index + 1 }}</td>
              <td>{{ project.realname.S }}</td>
              <td>{{ project.intro.S }}</td>
              <td>{{ project.state.S }}</td>
              <td>
                <button class="btn-default btn-delete" v-if='userRole=="admin" || userRole=="manager"' @click="deleteProject(project.id.S, project.role, index)">Delete the Project</button>
                <button class="btn-default btn-delete" @click="gotoProject(project.id.S)">Project Profile</button>
                <button class="btn-default btn-delete" v-if='userRole=="developer" && project.state.S !== "finished"' @click="applyProject(project.id.S)">Apply the Project</button>
                <button class="btn-default btn-delete" v-if="project.state.S == 'begin' && (userRole=='admin' || userRole=='manager')" @click="projectStart(project.id.S, index)">Porject Begin to Processing</button>
                <button class="btn-default btn-delete" v-if="project.state.S == 'processing' && (userRole=='admin' || userRole=='manager')" @click="projectFinish(project.id.S, index)">Project Finished</button>
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
    userRole: String,
    projectList: Array
  },
  methods: {
    gotoProject: function (projectid) {
      this.$router.push({ path: '/project/' + projectid })
    },
    applyProject: function (projectid) {
      this.$msgBox.showMsgBox({
        title: 'Confirm Apply',
        content: 'Confirm apply this project?'
      }).then(async () => {
        let res = await api.developer.applyProject(projectid)
        if (res.success === true) {
          this.$message.showMessage({
            type: 'success',
            content: 'Apply project successfully! Please wait for examine.'
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
    deleteProject: async function (userId, userType, index) {
      let that = this
      that.$msgBox.showMsgBox({
        title: 'Confirm Delete',
        content: 'Confirm delete this project?'
      }).then(async () => {
        let res = await api.project.deleteProject(that.projectList[index].id.S)
        if (res.success === true) {
          that.projectList.splice(index, 1)
          that.$message.showMessage({
            type: 'success',
            content: 'Delete project successfully!'
          })
        } else {
          that.$message.showMessage({
            type: 'error',
            content: res.message
          })
        }
      }).catch(() => {
        return false
      })
    },
    projectStart: async function (projectId, index) {
      this.$msgBox.showMsgBox({
        title: 'Confirm Start',
        content: 'Confirm start this project? This operation cannot be revoke.'
      }).then(async () => {
        let res = await api.project.updateProjectState(projectId, 'processing')
        if (res.success === true) {
          this.$message.showMessage({
            type: 'success',
            content: 'Project now processing!'
          })
          this.projectList[index].state = { S: 'processing' }
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
    projectFinish: async function (projectId, index) {
      this.$msgBox.showMsgBox({
        title: 'Confirm finished',
        content: 'Confirm '
      }).then(async () => {
        let res = await api.project.updateProjectState(projectId, 'finished')
        if (res.success === true) {
          this.$message.showMessage({
            type: 'success',
            content: 'Project now finished! This operation cannot be revoke.'
          })
          this.projectList[index].state = { S: 'finished' }
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
.project-table {
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
