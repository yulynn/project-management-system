<template>
  <section class="header">
    <template v-for="(item, index) in $route.meta.paths">
        <router-link class="breadcrumb no-underline" :to="item.link" :key="index + '-label'" v-if="item.link !== ''">
          {{ item.name }}
        </router-link>
        <span class="no-link" :key="index + '-label'" v-else>{{ item.name }}</span>
        <span class="separator" :key="index + '-label'" v-show="index !== $route.meta.paths.length - 1">/</span>
    </template>
    <span class="sign-out" title="Logout" @click="signOut">
      Signout
    </span>
  </section>
</template>

<script>
export default {
  methods: {
    signOut: function () {
      this.$msgBox.showMsgBox({
        title: 'Signout',
        content: 'Signout?'
      }).then(async () => {
        localStorage.removeItem('x-access-token')
        localStorage.removeItem('role')
        this.$router.push({ path: '/signin' })
      }).catch(() => {
        return false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4em;
  line-height: 4em;
  padding-left: 1em;
  background: #eff2f7;

  .no-link {
    color: #97a8be;
    cursor: text;
  }
  .separator {
    margin: 0 0.5em 0 0.3em;
  }
  .sign-out {
    position: absolute;
    top: 0;
    right: 2em;
    cursor: pointer;
    font-size: 20px;
    .icon {
      margin-top: 1em;
      width: 2em;
      height: 2em;
      color: #fa5555;
    }
  }
}
</style>
