<template>
  <div>
    <Row>
      <i-col span="11">
        <Card class='profile-card'>
            <p slot="title">Project Profile</p>
            <p class="list-item">Project Name：{{ project.realname || '' }}</p>
            <p class="list-item">Project Process：{{ project.state }}</p>
            <p class="list-item" v-if='userRole=="admin"'>Project Manager：{{ manager.realname }}</p>
            <p class="list-item">Project Introduce：{{ project.intro || '' }}</p>
        </Card>
      </i-col>
      <i-col span="11" offset="2" v-if='userRole=="admin"'>
        <Card class='profile-card'>
            <p slot="title">Project Manager Profile</p>
            <p class="list-item">Realname：{{ manager.realname || '' }}</p>
            <p class="list-item">Email address：{{ manager.email }}</p>
            <p class="list-item" v-if="manager.projects">Owned Project：{{ manager.projects.length }}</p>
        </Card>
      </i-col>
      <i-col span="24" v-if='userRole=="admin" || userRole=="manager"'>
        <Divider />
      </i-col>
      <i-col span="24" v-if='userRole=="admin" || userRole=="manager"'>
        <Card class='profile-card'>
            <p slot="title">Developer joined</p>
            <developer-table :projectid="project.id" :developer-list="developerList"></developer-table>
            <pagination :page-size="pageSize"
                        :total="total"
                        :current-page="page"
                        @change-page="changePage">
            </pagination>
        </Card>
      </i-col>
      <i-col span="24" v-if='userRole=="admin" || userRole=="manager"'>
        <Divider />
      </i-col>
      <i-col span="24" v-if='userRole=="admin" || userRole=="manager"'>
        <Card class='profile-card'>
            <p slot="title">Apply List</p>
            <apply-table :projectid="project.id" :apply-list="applyList"></apply-table>
            <pagination :page-size="applyPageSize"
                        :total="applyTotal"
                        :current-page="applyPage"
                        @change-page="applyChangePage">
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
import DeveloperTable from '../../components/DeveloperTable'
import ApplyTable from '../../components/ApplyTable'
import Pagination from '../../components/Pagination'

export default {
  components: {
    'back-menu': Menu,
    'back-header': Header,
    DeveloperTable,
    ApplyTable,
    Pagination
  },
  data () {
    return {
      project: {},
      manager: {},
      developerList: [],
      applyList: [],
      page: 1,
      pageSize: 10,
      total: 0,
      applyPage: 1,
      applyPageSize: 10,
      applyTotal: 0,
      role: 'admin',
      userRole: 'developer'
    }
  },
  created () {
    this.userRole = localStorage.getItem('role')
    this.role = this.userRole
    this.getProject()
  },
  methods: {
    switchRole: async function () {
      if (localStorage.getItem('role') === 'admin') {
        this.role = this.role === 'admin' ? 'manager' : 'admin'
        this.getProjectList()
      }
    },
    getProject: async function () {
      let res = await api.project.getProjectProfile(this.$route.params.projectid)
      console.log(res)
      if (res.success === true) {
        this.project = res.data
      }
      if (this.userRole === 'manager' || this.userRole === 'admin') {
        this.getManager(this.project.manager)
        this.getDeveloperList(this.project.developers)
        this.getApplyList(this.project.applies)
      }
    },
    getManager: async function (managerid) {
      if (this.userRole === 'manager') {
        return
      }
      let res = await api.admin.getManager(managerid)
      console.log(res)
      if (res.success === true) {
        this.manager = res.data
      }
    },
    getDeveloperList: async function (developers) {
      let res = await api.manager.getDeveloperByIds({
        'ids': developers
      })
      console.log('developers')
      console.log(res)
      if (res.success === true) {
        this.developerList = res.data
      }
    },
    getApplyList: async function (applies) {
      let res = await api.manager.getDeveloperByIds({
        'ids': applies
      })
      console.log('developers')
      console.log(res)
      if (res.success === true) {
        this.applyList = res.data
      }
    },
    changePage: function (newPage) {
      this.page = newPage
      this.getDeveloperList()
    },
    applyChangePage: function (newPage) {
      this.applyPage = newPage
      this.getApplyList()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/sass/app';
.profile-card {
  p.list-item {
    height: 50px;
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
