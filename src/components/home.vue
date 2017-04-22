<template>
  <div class="home">
    <div class="clearfix">
      <div class="btns btn-group pull-right add_btns">
        <button title="新增" v-if='!showEdit && !showSearch' @click='add' class=" btn btn-primary">
          <i class="glyphicon glyphicon-plus"></i>
          灵光乍现
        </button>
        <button title="搜索" v-if='!showSearch' @click='showSearchBox' class=" btn btn-primary">
          <i class="glyphicon glyphicon-search"></i>
          只想找找看
        </button>
      </div>
    </div> 
    <div class="main">
      <div class="form-horizontal" v-if='showSearch' @keyup.13="search">
        <div class="form-group">
          <label for="what" class="col-xs-3 control-label">想找啥：</label>
          <div class="col-xs-6">
            <input type="text" v-model="keyWord" class="form-control" id="what" placeholder="想干啥">
          </div>
          <div class="col-xs-2">
            <button @click='search' type="button" class="btn btn-default">
              <i class="glyphicon glyphicon-search"></i>
              赶紧去找!
            </button>
          </div>
        </div>
        <div class="form-group">
          <div class=" col-xs-6 text-right">
            <span class="error" v-if="error">
              {{error}}
            </span>
          </div>
        </div>
      </div>
      <transition name='fade'>
      <div class="form-horizontal" v-if='showEdit' @keyup.13="save">
        <div class="form-group">
          <label for="what" class="col-xs-4 control-label">有啥想法：</label>
          <div class="col-xs-6">
            <input type="text" v-model="op.title" class="form-control" id="what" placeholder="想干啥">
          </div>
        </div>
        <div class="form-group">
          <label for="do" class="col-xs-4 control-label">干啥去：</label>
          <div class="col-xs-6">
            <input type="text" v-model="op.content" class="form-control" id="do" placeholder="咋干">
          </div>
        </div>
        <div class="form-group">
          <div class=" col-xs-6 text-right">
            <span class="error" v-if="error">
              {{error}}
            </span>
          </div>
          <div class=" col-xs-6">
            <button @click='close' type="button" class="btn btn-danger">
              <i class="glyphicon glyphicon-remove"></i>
              我擦忘了想干啥!
            </button>
            <button @click='save' type="button" class="btn btn-default">
              <i class="glyphicon glyphicon-check"></i>
              就这酱了!
            </button>
          </div>
        </div>
      </div>
      </transition>
      <div class="empty" v-if='list.length==0'>
        <h3>列表为空哟！赶紧想想有啥要干的！</h3>
      </div>
        <div class="row" v-if='!showSearch' v-for="item,index in list" :key='item.id'>
          <div class="list text-left clearfix col-xs-offset-2 col-xs-8">
            <p class="time">{{getTimes(item.creatTime)}}</p>
            <div class="content pull-left">
              <i class="glyphicon glyphicon-ok logo" v-if="item.status==1"></i>
              <span class="detail">
                <p class="title">{{item.title}}</p>
                {{item.content}}
              </span>
            </div>
            <div class="btns btn-group pull-right">
              <a @click='done(item,index)' v-if="item.status==0" title="已完成" href="javascript:;" class="btn btn-success"> 
                <i class="glyphicon glyphicon-ok"></i>
              </a>
              <a @click='done(item,index)' v-else title="还没干完呢！" href="javascript:;" class="btn btn-info"> 
                <i class="glyphicon glyphicon-repeat"></i>
              </a>
              <a @click='edit(item,index)' title="编辑" href="javascript:;" class="btn btn-primary">
                <i class="glyphicon glyphicon-edit"></i>
              </a>
              <a @click='del(item,index)' title="删除" href="javascript:;" class="btn btn-warning">
                <i class="glyphicon glyphicon-trash"></i>
              </a>
            </div>
          </div>
        </div>
      <div class="clearfix">
        <div class="btns btn-group pull-right add_btns">
          <button title="关闭" v-if='showSearch' @click='closeSearch' class=" btn btn-primary">
            <i class="glyphicon glyphicon-remove"></i>
            不想找了
          </button>
        </div>
      </div> 
      <div class="row" v-if='showSearch' v-for="item,index in searchList" :key='item.id'>
        <div class="list text-left clearfix col-xs-offset-2 col-xs-8">
          <p class="time">{{getTimes(item.creatTime)}}</p>
          <div class="content pull-left">
            <i class="glyphicon glyphicon-ok logo" v-if="item.status==1"></i>
            <span class="detail">
              <p class="title">{{item.title}}</p>
              {{item.content}}
            </span>
          </div>
          <div class="btns btn-group pull-right">
            <a @click='done(item,index)' v-if="item.status==0" title="已完成" href="javascript:;" class="btn btn-success"> 
              <i class="glyphicon glyphicon-ok"></i>
            </a>
            <a @click='done(item,index)' v-else title="还没干完呢！" href="javascript:;" class="btn btn-info"> 
              <i class="glyphicon glyphicon-repeat"></i>
            </a>
            <a @click='edit(item,index)' title="编辑" href="javascript:;" class="btn btn-primary">
              <i class="glyphicon glyphicon-edit"></i>
            </a>
            <a @click='del(item,index)' title="删除" href="javascript:;" class="btn btn-warning">
              <i class="glyphicon glyphicon-trash"></i>
            </a>
          </div>
        </div>
      </div> 
      <div class="row">
        <a href="javascript:;" v-if="page!=1" @click='prePage' class="btn btn-link"><<上一页</a>
        <a href="javascript:;" v-if="!pageEnd" @click='nextPage' class="btn btn-link">下一页>></a>
      </div> 
    </div>
  </div>
</template>

<script>
  export default {
    name: 'home',
    beforeCreate(){
      if(!sessionStorage.getItem('userId')){
        this.$router.push('/login');
      }
    },
    created(){
      this.loadList();
    },
    mounted(){
      
    },
    data() {
      return {
        userId:sessionStorage.getItem('userId'),
        list:[],
        showEdit:false,
        op:{
          title:'',
          content:'',
          status:0,
          userId:sessionStorage.getItem('userId'),
        },
        index:null,
        error:false,
        showSearch:false,
        searchList:[],
        searchTips:false,
        keyWord:'',
        page:1,
        pageEnd:false,
      }
    },
    methods: {
      loadList(){
        if(this.userId){
          this.$http.post('http://localhost:3000/api/getList',{userId:this.userId,page:this.page}).then(spn=>{
            console.log(spn.data);
            if(spn.data.code==1){
              this.list=spn.data.list;
              this.pageEnd=spn.data.list.length<5;
            }
          })
        }
      },
      add(){
        this.showEdit=true;
        console.log('add');
      },
      del(item,index){
        console.log('del');
        this.$http.post('http://localhost:3000/api/del',{id:item.id}).then(respone=>{
          console.log(respone.data);
          if(respone.data.code==200){
            var list=this.list
            if(this.showSearch){
              list=this.searchList;
            }
            list.splice(index,1);
          }else{
            this.error=respone.data.msg;
          }
        })
      },
      edit(item,index){
        console.log('edit');
        for(var k in this.op){
          this.op[k]=item[k];
        }
        this.index=index;
        this.showEdit=true;
      },
      done(item,index){
        var val=item.status==1?0:1;
        this.$http.post('http://localhost:3000/api/done',{id:item.id,val:item.status==1?0:1}).then(respone=>{
          console.log(respone.data,index);
          if(respone.data.code==200){
            if(this.showSearch){
              this.$set(this.searchList[index],'status',val);
              console.log(this.searchList[index].status,val);
            }else{
              this.$set(this.list[index],'status',val);
              console.log(this.list[index].status,val);
            }
          }else{
            this.error=respone.data.msg;
          }
        })
        console.log('done');
      },
      save(){
        var datas=this.op;
        if(this.index==null){
          this.$http.post('http://localhost:3000/api/add',datas).then(spn=>{
            console.log(spn.data);
            if(spn.data.code==200){
              this.list.unshift(spn.data.data);
              this.resetOp();
            }else{
              this.error=spn.data.msg;
            }
          })
        }else{
          var item=this.list[this.index];
          if(item.content==this.op.content&&item.title==this.op.title)return this.resetOp();
          this.$http.post('http://localhost:3000/api/edit',{id:this.list[this.index].id,content:this.op.content,title:this.op.title}).then(respone=>{
            console.log(respone.data);
            if(respone.data.code==200){
              if(this.showSearch){
                this.$set(this.searchList,this.index,respone.data.data)
              }else{
                this.$set(this.list,this.index,respone.data.data)
              }
              this.resetOp();
            }else{
              this.error=respone.data.msg;
            }
          })
        }
        console.log('save');
      },
      search(){
        this.$http.post('http://localhost:3000/api/search',{keyWord:this.keyWord}).then(respone=>{
          console.log(respone.data);
            if(respone.data.code==200){
              this.searchList=respone.data.list;
              this.resetOp();
            }else{
              this.error=respone.data.msg;
            }
        })
        console.log('search');
      },
      showSearchBox(){
        this.showSearch=true;
        console.log('showSearch');
      },
      closeSearch(){
        this.showSearch=false;
        this.searchList=[];
        this.error=false;
        this.keyWord='';
        this.loadList();
        console.log('closeSearch');
      },
      close(){
        this.resetOp();
        this.showEdit=false;
        console.log('close');
      },
      resetOp(){
        this.op={
          title:'',
          content:'',
          status:0,
          userId:this.userId
        };
        this.error=false;
        this.index=null;
      },
      getTimes(timestamp) {
        timestamp = parseInt(timestamp, 10);
        if (isNaN(timestamp)) return false;
        var now = new Date().getTime();
        var d = new Date(timestamp); //根据时间戳生成的时间对象
        var s = (d.getFullYear()) + "-" +
            (d.getMonth() + 1) + "-" +
            (d.getDate()) + " " +
            (d.getHours()) + ":" +
            (d.getMinutes()) + ":" +
            (d.getSeconds());
        return s;
      },
      nextPage(){
        this.page++;
        this.loadList();
      },
      prePage(){
        this.page--;
        this.loadList();
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .add_btns{
    margin:  10px;
  }
  .content{
    font-size: 18px;
    padding-right: 40px;
    position: relative;
  }
  .home{
    margin: 0 auto;
    max-width: 800px;
  }
  .list{
    border-radius: 5px;
    border: 1px solid #edeeef;
    padding: 10px 15px;
    margin-bottom: 5px;
    background: rgb(240, 240, 241);
  }
  .logo{
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: #4cae4c;
    font-size: 22px;
  }
  .detail{
    display: inline-block;
    padding-left: 40px;
  }
  .title{
    font-size: 24px;
    font-weight: bold;
  }
  .error{
    color: red;
    font-weight: bold;
  }
  
</style>
