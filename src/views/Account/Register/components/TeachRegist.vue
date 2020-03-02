<template>
  <!-- 教师注册界面 -->
  <el-card id="register" class="box-card center-in-center" style="position:center;">
    <div slot="header" class="clearfix" style="text-align:center;">
      <label style="font-size:20px;">教师注册</label>
      <el-button type="text" class="back-login" @click="redirectLogin">登录</el-button>
    </div>
    <!-- 分隔符 -->
    <div style="margin:10px; "></div>
    <el-form
      :model="registerForm"
      :rules="rules"
      ref="registerForm"
      style="margin-right:30px; font-size:25px;"
      label-width="100px"
    >
      <el-form-item label="姓名：" prop="name">
        <el-input v-model="registerForm.name"></el-input>
      </el-form-item>
      <el-form-item label="账号：" prop="username">
        <el-input v-model="registerForm.username"></el-input>
      </el-form-item>
      <el-form-item label="邮箱：" prop="email">
        <el-input v-model="registerForm.email"></el-input>
      </el-form-item>
      <el-form-item label="密码：" prop="password">
        <el-input type="password" v-model="registerForm.password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码：" prop="password1">
        <el-input type="password" v-model="registerForm.password1"></el-input>
      </el-form-item>
      <el-button type="primary" @click="clickRegister()" class="bottom-in-center">注册</el-button>
    </el-form>
  </el-card>
</template>

<script>
export default {
  /* 
  教师注册组件化
  */
  name: "TeachRegist",

  data() {
    /* 
    密码验证
    */
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.registerForm.password !== "") {
          this.$refs.registerForm.validateField("password1");
        }
        callback();
      }
    };
    var validatePass1 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.registerForm.password) {
        callback(new Error("两次输入的密码不一致！"));
      } else {
        callback();
      }
    };

    /*
    邮箱验证
    */
    var validateEmail = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请正确填写邮箱"));
      } else {
        if (value !== "") {
          var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
          if (!reg.test(value)) {
            callback(new Error("请输入有效的邮箱"));
          }
        }
        callback();
      }
    };

    /* 
    表单注册项
    */
    return {
      registerForm: {
        name: "",
        username: "",
        email: "",
        password: "",
        password1: "",
        status: "Teacher"
      },

      rules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 1, max: 10, message: "长度在1到10个字符之间", trigger: "blur" }
        ],
        username: [
          { required: true, message: "请输入账号(邮箱或手机号)", trigger: "blur" },
          { min: 1, max: 20, message: "长度在1到20个字符之间", trigger: "blur" }
        ],
        email: [
          { validator: validateEmail, trigger: "blur" },
          { required: true, message: "请输入邮箱", trigger: "blur" }
        ],
        password: [
          { validator: validatePass, trigger: "blur" },
          { required: true, message: "请输入密码", trigger: "blur" }
        ],
        password1: [
          { validator: validatePass1, trigger: "blur" },
          { required: true, message: "请再次输入密码", trigger: "blur" }
        ],
      }
    };
  },

  methods: {
    /*
    点击注册按钮
    */
    clickRegister() {
      this.$refs.registerForm.validate(result => {
        if (result) {
          this.handleRegistForm();
        }
      });
    },
    /*
    提交注册请求
    */
    handleRegistForm() {
      this.axios
        .post("/account/user/register/", this.registerForm)
        .then(resp => {
          if (resp.result) {
            this.$message.success("注册成功");
            this.$router.push({ path: "/login" });
          } else {
            this.$message.error(resp.error);
          }
        });
    },

    /* 
  返回登录页面
  */
    redirectLogin: function() {
      this.$router.push({ path: "/login" });
    }
  }
};
</script>

<style lang="scss" scoped>
.back-login {
  color: black;
  font-size: 18px;
  float: right;
  padding: 3px 0;
}
.bottom-in-center {
  position: relative;
  bottom: 1%;
  left: 50%;
  transform: translate(-30%, 0);
  border: none;
  background: #13876a;
}
.bottom-in-center:hover{
  background: #0a6659;
}
.center-in-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  /* 不同浏览器的兼容设置 */
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
}
.user-register {
  outline: 0;
  border: 0;
  border-bottom: 1px red solid;
  padding: 0 0 3px 3px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 480px;
}
</style>
