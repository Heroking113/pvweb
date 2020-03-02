<template>
  <!-- 登录 -->
  <el-card class="box-card center-in-center">
    <div slot="header" class="clearfix" style="text-align:center;">
      <label style="font-size:20px;">用户登录</label>
    </div>
    <!-- 分隔符 -->
    <div style="margin:20px; "></div>
    <el-form ref="LoginForm" :model="LoginForm" :rules="rules" label-width="80px">
      <el-form-item
        label="账号: "
        prop="name"
        class="line-spacing focus-border"
        style="margin-right:42px;"
      >
        <el-input v-model="LoginForm.username"></el-input>
      </el-form-item>
      <el-form-item
        label="密码: "
        prop="password"
        class="line-spacing focus-border"
        style="margin-right:42px;"
      >
        <el-input type="password" auto-complete="off" v-model="LoginForm.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="clickLogin" class="submit-form">登录</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  data() {
    /* 
    初始化标签名称
    */
    return {
      LoginForm: {
        username: "",
        password: ""
      },

      /* 
      账户验证规则
      */
      rules: {
        username: [
          {
            required: true,
            message: "请输入你的账号",
            trigger: "blur"
          }
        ],

        /* 
      密码验证规则
      */
        password: [
          {
            required: true,
            message: "请输入你的密码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    var lett = this;
    document.onkeydown = function(e) {
      var key = window.event.keyCode;
      if (key == 13) {
        lett.clickLogin();
      }
    };
  },
  computed: {
    redirect() {
      return this.$route.query.redirect || "/register";
    }
  },
  methods: {
    /*
    点击登录按钮
    */
    clickLogin() {
      this.$refs.LoginForm.validate(result => {
        if (result) {
          this.handleLogin();
        }
      });
    },

    /*
    提交登录请求,登录之后页面暂时跳转到注册页面，后期再做相应调整
    */
    handleLogin() {
      this.axios.post("/account/user/login/", this.LoginForm).then(resp => {
        if (resp.result) {
          this.$message.success("登录成功");
          let status = resp.data.status;
          let username = resp.data.username;
          this.$store.commit("setUsername", username);
          this.$store.commit("setUserStatus", status);
          if (status == "Teacher") {
            this.$router.push({ path: "/teacher/index" });
          }
          if (status == "Student") {
            this.$router.push({ path: "/student/index" });  
          }
          if (status == "Manager") {
            this.$router.push({ path: "/manager" });
          }
        } else {
          this.$message.error("登录失败");
        }
      });
    }
  }
};
</script>

<style lang="scss">
.el-input__inner:focus {
    border: 1px solid #0e5e45;
}
</style>

<style lang="scss" scoped>
.submit-form {
  width: 25%;
  height: 10%;
  background: #1a9c7d;
  margin: 10% 18% 20px 25%;
  border-color: #1a9c7d;
}

.center-in-center {
  width: 450px;
  position: absolute;
  top: 40%;
  left: 47%;
  transform: translate(-50%, -50%);

  /* 不同浏览器的兼容设置 */
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
}
</style>
