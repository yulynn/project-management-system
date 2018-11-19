<template>
  <section class="tag">
    <div class="tag-header">
      <Input v-model="search_name" placeholder="Search by realname" style="width: 300px" />
      <!-- <Button type="primary" shape="circle" class="circle" icon="ios-search" @click='search'></Button> -->
      <Button @click="search">search</Button>
      <Button v-if='userRole === "manager"' @click="newProject">
        Create New Project
      </Button>
      <Button v-if='userRole === "admin"' @click="switchRole">
        Switch Role(current role {{ role }})
      </Button>
    </div>
    <project-table :user-role="userRole" :project-list="projectList"></project-table>
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
import ProjectTable from '../../components/ProjectTable'
import Pagination from '../../components/Pagination'

export default {
  components: {
    'back-menu': Menu,
    'back-header': Header,
    ProjectTable,
    Pagination
  },
  data () {
    return {
      search_name: '',
      projectList: [],
      allProjects: [],
      page: 1,
      pageSize: 10,
      total: 0,
      role: 'manager',
      userRole: 'developer'
    }
  },
  created () {
    this.userRole = localStorage.getItem('role')
    this.role = this.userRole
    this.search_name = this.$route.query.name
    this.getProjectList()
  },
  methods: {
    search: function () {
      this.projectList = this.projectFilter()
    },
    projectFilter: function () {
      console.log('filter')
      let list = []
      if (this.search_name && this.search_name.length > 0) {
        for (let i = 0; i < this.allProjects.length; i++) {
          if (this.allProjects[i].realname.S.indexOf(this.search_name) !== -1) {
            list.push(this.allProjects[i])
          }
        }
        return list
      } else {
        return this.allProjects
      }
    },
    switchRole: async function () {
      // switch role
      if (localStorage.getItem('role') === 'admin') {
        this.role = this.role === 'admin' ? 'manager' : 'admin'
        this.getProjectList()
      }
    },
    getProjectList: async function () {
      // admin developer: get all
      // manager: get projects published by itself
      let res = null
      if (this.role === 'manager') {
        res = await api.project.getProjectList(this.page, this.pageSize)
      } else {
        res = await api.project.getAllProject(this.page, this.pageSize)
      }
      console.log(res)
      if (res.success === true) {
        this.allProjects = res.data
        this.projectList = this.projectFilter()
      }
    },
    changePage: function (newPage) {
      this.page = newPage
      this.getProjectList()
    },
    newProject: function () {
      this.$msgBox.showMsgBox({
        title: 'Create New Project',
        content: 'Project Name',
        content2: 'Porject Introduce',
        isShowInput: true,
        isShowInput2: true
      }).then(async (val) => {
        console.log(val)
        let res = await api.project.createProject({
          'realname': val.inputValue,
          'intro': val.inputValue2,
          'state': 'begin'
        })
        if (res.success === true) {
          this.$message.showMessage({
            type: 'success',
            content: 'Create projectsuccessfully!'
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
