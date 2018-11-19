<template>
  <section class="post-list right-container">
    <back-menu :user-role='userRole'></back-menu>
    <back-header></back-header>
    <Card style="width:100%">
      <div style="text-align:center">
        <img src="../assets/logo.png">
        <h3>Welcome to Our Project Manage Platform</h3>
      </div>
    </Card>
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
      userRole: 'developer'
    }
  },
  watch: {
  },
  created () {
    this.userRole = localStorage.getItem('role')
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
</style>
