<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <div>
      <label for="">用户名：<input type='text' v-model = 'user.name' /></label><br />
      <label for="">密&emsp;码：<input type='text'  v-model = 'user.passw' /></label><br />
      <label for="">邮&emsp;箱：<input type='text'  v-model = 'user.email' /></label><br />
      <button @click='reg'>注&emsp;册</button>
    </div>
    <ul>
      <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
      <li><a href="https://gitter.im/vuejs/vue" target="_blank">Gitter Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
      <br>
      <li><a href="http://vuejs-templates.github.io/webpack/" target="_blank">Docs for This Template</a></li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
      <li><a href="javascript:;" @click='test'>vuex</a></li>
      <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      user:{
        name:'',
        passw:'',
        email:'',
      }
    }
  },
  methods:{
    test:function(){
      this.$http.get('http://localhost:3000/api/test').then(resp=>{
        console.log(resp.data);
      })
    },
    reg:function(){
      var u=this.user;
      for(var k in u){
        if(u[k]==''){
          return alert(k+'is empty！！');
        }
      }
      this.$http.post('http://localhost:3000/api/reg',u).then(resp=>{
        console.log(resp.data);
      })
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
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
