<template>
  <div class="hello">
    <img src="../assets/logo.png">
    <h1>{{ msg }}</h1>
    <h2>join us</h2>
    <label v-if="errorMsg" class="error_msg">{{errorMsg}}</label>
    <div class="form-inline">
      <label for="">用户名：<input type='text'  class="form-control" :class="{'error':errorInput=='name'}"  v-model = 'user.name' /></label><br />
      <label for="">密&emsp;码：<input type='password'  class="form-control"   :class="{'error':errorInput=='passw'}" v-model = 'user.passw' /></label><br />
      <label for="">邮&emsp;箱：<input type='text'   class="form-control"  :class="{'error':errorInput=='email'}" v-model = 'user.email' /></label><br />
      <router-link to='/login' class="btn btn-link"><<<登录</router-link>
      <button @click='reg' class="btn btn-primary">注&emsp;册</button>
    </div>
    <loading :show='loading'></loading>
  </div>
</template>

<script>
  import loading from './loading.vue'
  export default {
    name: 'register',
    components:{"loading":loading},
    data() {
      return {
        msg: 'Welcome to Your TODO',
        user: {
          name: '',
          passw: '',
          email: '',
        },
        loading:false,
        errorMsg:false,
        errorInput:false,
      }
    },
    methods: {
      go:function(){
        this.$router.push('/home');
      },
      reg: function() {
        var u = this.user; 
        if(!this.check())return ;
        this.$http.post('http://localhost:3000/api/reg', u).then(resp => {
          console.log(resp.data);
          if(resp.data.code>0){
            this.user={
              name: '',
              passw: '',
              email: '',
            };
            this.clearError();
            sessionStorage.setItem('userId',resp.data.userId);
            this.$router.push('/home');
          }else{
            this.errorMsg=resp.data.msg;
            this.errorInput='name';
          }
        })
      },
      check:function(){
        var u = this.user;
        for (var k in u) {
          if (u[k] == '') {
            this.errorInput=k;
            var str='';
            switch (k) {
              case 'name':
                str='请输入用户名'
                break;
              case 'passw':
                str='请输入密码'
                break;
              case 'email':
                str='请输入邮箱地址'
                break;
              default:
                str=false;
                break;
            }
            this.errorMsg=str;
            return false;
          }
        }
        this.clearError();
        return true;
      },
      clearError(){
        this.errorMsg=false;
        this.errorInput=false;
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
    color: #42b983;
  }
  
</style>
