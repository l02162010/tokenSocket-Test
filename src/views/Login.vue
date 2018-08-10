<template>
  <div class="login">
  <el-row>
    <el-col :offset="8" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
      <div class="grid-content">
        <div class="loginBox">
          <el-form ref="form" label-width="80px">
            <el-form-item label="帳號" >
              <el-input v-model="acc" placeholder="請輸入帳號" required></el-input>
            </el-form-item>
            <el-form-item label="密碼" >
              <el-input type="password" v-model="pwd" placeholder="請輸入密碼" required></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click.prevent="handleLogin">登入</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-col>
  </el-row>
  </div>
</template>

<script>

import {mapGetters, mapActions, mapMutations} from 'vuex'

export default {
  name: 'login',
  data() {
    return {
      acc: "",
      pwd: ""
    }
  },
  methods:{
    ...mapActions([
      'doLogin',
    ]),
    ...mapMutations([
      'updateToken'
    ]),
    async handleLogin() {
      var data = {
        login: this.acc,
        password: this.pwd
      }
      var res = await this.doLogin(data)
     
      if(res){
        this.updateToken(res.data);
        alert('登入成功');
        this.$router.push({ path: 'about' })
      }
    },
  }
}
</script>
<style>
  .el-col {
    border-radius: 4px;
  }
 
</style>