<template>
  <div class="hello">
    <img src="../assets/logo.png">
    <h1>{{ msg }}</h1>
    <h2>pless login</h2>
    <label v-if="errorMsg" class="error_msg">{{errorMsg}}</label>
    <div class="form-inline">
      <label for="">用户名：<input type='text'  class="form-control"  v-model = 'user.name' /></label><br />
      <label for="">密&emsp;码：<input type='password'  class="form-control"   v-model = 'user.passw' /></label><br />
      <button @click='reg' class="btn btn-primary">登&emsp;录</button>
      <router-link to='/register' class="btn btn-link">注册>>></router-link>
    </div>
    <loading :show='loading'></loading>
  </div>
</template>

<script>
  import loading from './loading.vue'
  export default {
    name: 'hello',
    components:{"loading":loading},
    beforeCreate(){
      if(sessionStorage.getItem('userId')){
        this.$router.push('/home');
      }
    },
    data() {
      return {
        msg: 'Welcome to Your TODO',
        user: {
          name: '',
          passw: '',
        },
        loading:false,
        errorInput:false,
        errorMsg:false
      }
    },
    methods: {
      reg() {
        var u = this.user;
        if(!this.check())return;
        this.$http.post('http://localhost:3000/api/login', u).then(resp => {
          console.log(resp.data);
          if(resp.data.code>0){
            sessionStorage.setItem('userId',resp.data.userId);
            this.$router.push('/home');
          }else{
            this.errorMsg=resp.data.msg;
          }
        })
      },
      check(){
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
              default:
                str=false;
                break;
            }
            this.errorMsg=str;
            return false;
          }
        }
        return true;
      }
  
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1,
  h2 {
    font-weight: normal;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    display: inline-block;
    margin: 0 10px;
  }
  
  a {
    color: #42b983;
  }
</style>
