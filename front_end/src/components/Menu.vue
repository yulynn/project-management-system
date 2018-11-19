<template>
  <section class="menu">
    <div class="user">
      <img src="../assets/logo.png" alt="logo image">
    </div>
    <ul class="menu-list">
      <li class="menu-item">
        <router-link to="/project" exact class="no-underline">Project Manage</router-link>
      </li>
      <li class="menu-item" v-if='userRole=="admin" || userRole=="manager"'>
        <router-link to="/user" exact class="no-underline">User Manage</router-link>
      </li>
      <li class="menu-item">
        <router-link to="/usercenter" exact class="no-underline">User Center</router-link>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  props: {
    userRole: String
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/sass/app';
.menu {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: 12em;
  background: #495060;
  z-index: 9999;

  .user {
    padding: 3em;

    img {
      width: 100%;
      height: 100%;
      transition: all .8s;
      &:hover {
        transform: scale(1.2) rotate(360deg);
      }
    }
  }
  .menu-list {
    text-align: center;

    .menu-item {
      display: block;
      width: 100%;
      font-size: 1.2em;
      line-height: 3;
    }
    a {
      color: hsla(0, 0%, 100%, .7);
      display: inline-block;
      width: 100%;
      &.router-link-exact-active {
        color: #fff;
        background: $base-color;
      }
    }
  }
}
</style>
