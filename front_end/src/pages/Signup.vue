<template>
  <section class="login">
    <div class="login-section">
      <h2>Project Manage Platform</h2>
      <div class="login-form">
        <div class="form-group">
          <RadioGroup v-model="role" type="button" size="large">
            <Radio label="developer">developer</Radio>
            <Radio label="manager">manager</Radio>
            <Radio label="admin">admin</Radio>
          </RadioGroup>
        </div>
        <div class="form-group">
          <input type="text" class="text" v-model="realname"  placeholder="realname">
        </div>
        <div class="form-group">
          <input type="email" class="email" v-model="email"  placeholder="email">
        </div>
        <div class="form-group">
          <input type="password" class="passowrd" v-model="password"  @keyup.enter="login" placeholder="password">
        </div>
        <div class="form-group" v-if="role != 'developer'">
          <input type="text" class="passowrd" v-model="code"  @keyup.enter="login" placeholder="invite code">
        </div>
        <div class="form-group">
          <button class="btnSign" ref="signup" @click="signup">Signup</button>
        </div>
        <router-link to="/signin" exact class="no-underline">Signin</router-link>
        <p class="error">{{ errMsg }}</p>
      </div>
    </div>
  </section>
</template>

<script>
import api from '../fetch/api'

export default {
  data () {
    return {
      realname: '',
      email: '',
      password: '',
      code: '',
      role: 'developer',
      errMsg: ''
    }
  },
  methods: {
    signup: async function () {
      if (this.realname === '') {
        this.errMsg = 'Realname cannot be null'
        return false
      }
      if (this.email === '') {
        this.errMsg = 'Email cannot be null'
        return false
      }
      if (this.password === '') {
        this.errMsg = 'Password cannot be null'
        return false
      }
      if (this.role !== 'developer' && this.code === '') {
        this.errMsg = 'Invite Code cannot be null'
        return false
      }
      let params = {
        email: this.email,
        realname: this.realname,
        password: this.password
      }
      if (this.role === 'developer') {
        params.skills = []
      } else {
        params.code = this.code
      }
      let res = await api.signup(params, this.role)
      if (res.success === true) {
        this.errMsg = ''
        console.log(res)
        this.$router.push({ path: '/signin' })
      } else {
        this.errMsg = res.msg
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/sass/app';
.login {
  position: relative;
  min-height: 100%;
  background-color: #324057;
  .login-section {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -60%);
  }
  h2 {
    font-size: 2.5em;
    color: #fff;
    text-align: center;
    margin-bottom: 1.5em;
  }
  .login-form {
    padding: 2em;
    background-color: #fff;
    border-radius: 0.2em;
  }
  .form-group {
    margin-bottom: 1.5em;
    input, button {
      width: 100%;
      font-size: 1em;
      line-height: 2;
      margin: 0;
      padding: 0.6em 1em;
      border: 1px solid #ddd;
      border-radius: 4em;
      box-sizing: border-box;

      &:focus {
        border-color: $base-color;
      }
    }
    .btnSign {
      color: #fff;
      cursor: pointer;
      border-color: $base-color;
      background-color: $base-color;
    }
  }
  .error {
    position: absolute;
    left: 50%;
    bottom: 1em;
    transform: translateX(-50%);
    font-size: 1em;
    color: red;
    text-align: center;
  }
}
</style>
