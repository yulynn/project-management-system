<template>
<div class="message-box" v-show="isShowMessageBox">
  <div class="mask" @click="cancel"></div>
  <div class="message-content">
    <svg class="icon" aria-hidden="true" @click="cancel">
      <use xlink:href="#icon-delete"></use>
    </svg>
    <h3 class="title">{{ title }}</h3>
    <p class="content">{{ content }}</p>
    <div>
      <input type="text" v-model="inputValue" v-if="isShowInput" ref="input" @keyup.enter="confirm">
    </div>
    <p class="content">{{ content2 }}</p>
    <div>
      <input type="text" v-model="inputValue2" v-if="isShowInput2" ref="input2" @keyup.enter="confirm">
    </div>
    <div class="btn-group">
      <button class="btn-default" @click="cancel" v-show="isShowCancelBtn">{{ cancelBtnText }}</button>
      <button class="btn-primary btn-confirm" @click="confirm" v-show="isShowConfimrBtn">{{ confirmBtnText }}</button>
    </div>
  </div>
</div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'title'
    },
    content: {
      type: String,
      default: 'Default content.'
    },
    content2: {
      type: String,
      default: ''
    },
    isShowInput: false,
    isShowInput2: false,
    inputValue: '',
    inputValue2: '',
    isShowCancelBtn: {
      type: Boolean,
      default: true
    },
    isShowConfimrBtn: {
      type: Boolean,
      default: true
    },
    cancelBtnText: {
      type: String,
      default: 'cancel'
    },
    confirmBtnText: {
      type: String,
      default: 'confirm'
    }
  },
  data () {
    return {
      isShowMessageBox: false,
      resolve: '',
      reject: '',
      promise: '' // save a promise object
    }
  },
  methods: {
    confirm: function () {
      this.isShowMessageBox = false
      if (this.isShowInput) {
        this.resolve({
          inputValue: this.inputValue,
          inputValue2: this.inputValue2
        })
      } else {
        this.resolve('confirm')
      }
      this.remove()
    },
    cancel: function () {
      this.isShowMessageBox = false
      this.reject('cancel')
      this.remove()
    },
    showMsgBox: function () {
      this.isShowMessageBox = true
      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
      // return a promise object
      return this.promise
    },
    remove: function () {
      setTimeout(() => {
        this.destroy()
      }, 300)
    },
    destroy: function () {
      this.$destroy()
      document.body.removeChild(this.$el)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/sass/app.scss';
.message-box {
  position: relative;

  .message-content {
    position: fixed;
    box-sizing: border-box;
    padding: 1em;
    min-width: 30em;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 0.4em;
    background: #fff;
    z-index: 50001;
    .icon {
      position: absolute;
      top: 1em;
      right: 1em;
      width: 0.9em;
      height: 0.9em;
      color: #878d99;
      cursor: pointer;

      &:hover {
        color: $base-color;
      }
    }
    .title {
      font-size: 1.2em;
      font-weight: 600;
      margin-bottom: 1em;
    }
    .content {
      font-size: 1em;
      line-height: 2em;
      color: #555;
    }
    input {
      width: 100%;
      margin: 1em 0;
      background-color: #fff;
      border-radius: 0.4em;
      border: 1px solid #d8dce5;
      box-sizing: border-box;
      color: #5a5e66;
      display: inline-block;
      font-size: inherit;
      height: 3em;
      line-height: 1;
      outline: none;
      padding: 0 1em;

      &:focus {
        border-color: $base-color;
      }
    }
    .btn-group {
      margin-top: 1em;
      float: right;
      overflow: hidden;

      .btn-confirm {
        margin-left: 1em;
      }
    }
  }
}
</style>
