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
          <template v-for="(project, index) in projectList" v-if='project.state.S !== "finished"'>
            <tr :key="project.id.S">
              <td>{{ index + 1 }}</td>
              <td>{{ project.realname.S }}</td>
              <td>{{ project.intro.S }}</td>
              <td>{{ project.state.S }}</td>
              <td>
                <!-- <button class="btn-default btn-delete" @click="gotoProject(project.id.S)">Project Profile</button> -->
                <button class="btn-default btn-delete" @click="addDeveloper(project.id.S, project.realname.S)">Add to Project</button>
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
    developeremail: String,
    developerid: String,
    projectList: Array
  },
  methods: {
    gotoProject: function (projectid) {
      this.$router.push({ path: '/project/' + projectid })
    },
    addDeveloper: async function (projectId, projectname) {
      let that = this
      that.$msgBox.showMsgBox({
        title: 'Add to Project',
        content: 'Add this developer to Project?'
      }).then(async () => {
        let res = await api.project.distributeProjectToDeveloper(projectId, that.developerid)
        if (res.success === true) {
          console.log(that.developeremail)
          let emailres = await api.sendmail({
            to: that.developeremail,
            subject: 'project info',
            text: 'You have been added to the project ' + projectname + '.'
          })
          console.log('emailres')
          console.log(emailres)
          // if (emailres.success === true) {
          // }
          that.$message.showMessage({
            type: 'success',
            content: 'Add this developer to project successfully!'
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
