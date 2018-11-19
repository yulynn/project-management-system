<template>
  <section class="tag right-container">
    <back-menu :user-role='userRole'></back-menu>
    <back-header></back-header>
    <router-view></router-view>
  </section>
</template>

<script>
import Menu from '../components/Menu'
import Header from '../components/Header'

export default {
  components: {
    'back-menu': Menu,
    'back-header': Header
  },
  data () {
    return {
      userRole: 'manager'
    }
  },
  created () {
    this.userRole = localStorage.getItem('role')
  },
  methods: {
  }
}
</script>
