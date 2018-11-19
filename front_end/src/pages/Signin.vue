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
          <input type="email" class="email" v-model="email"  placeholder="email">
        </div>
        <div class="form-group">
          <input type="password" class="passowrd" v-model="password"  @keyup.enter="login" placeholder="password">
        </div>
        <div class="form-group">
          <button class="btnSign" ref="signin" @click="signin">Signin</button>
        </div>
        <router-link to="/signup" exact class="no-underline">Signup</router-link>
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
      email: '',
      password: '',
      role: 'developer',
      errMsg: ''
    }
  },
  methods: {
    signin: async function () {
      if (this.email === '') {
        this.errMsg = 'Email cannot be null'
        return false
      }
      if (this.password === '') {
        this.errMsg = 'Password cannot be null'
        return false
      }
      let res = await api.signin(this.email, this.password, this.role)
      if (res.success === true) {
        this.errMsg = ''
        console.log(res)
        localStorage.setItem('x-access-token', res.token)
        localStorage.setItem('role', this.role)
        this.$router.push({ path: '/usercenter' })
      } else {
        this.errMsg = res.message
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
