<template>
  <!-- 学生注册界面 -->
    <el-card id="register" class="box-card center-in-center">
      <div slot="header" class="clearfix" style="text-align:center;">
        <label style="font-size:20px; margin-left:20px;">学生注册</label>
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
          <div style="height:500px; width:450px;overflow-y:auto;">
            <el-form-item label="姓名：" prop="name">
              <el-input v-model="registerForm.name" style="width:310px;"></el-input>
            </el-form-item>
            <el-form-item label="学号：" prop="username">
              <el-input v-model="registerForm.username" style="width:310px;"></el-input>
            </el-form-item>
            <el-form-item label="密码：" prop="password">
              <el-input type="password" v-model="registerForm.password" style="width:310px;"></el-input>
            </el-form-item>
            <el-form-item label="确认密码：" prop="password1">
              <el-input type="password" v-model="registerForm.password1" style="width:310px;"></el-input>
            </el-form-item>
            <el-form-item label="学院：" prop="college">
              <el-select v-model="registerForm.college" placeholder="请选择" style="width:310px;">
                <el-option label="医学院" value="医学院"></el-option>
                <el-option label="其他学院" value="其他学院"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="专业：" prop="major">
              <el-select v-model="registerForm.major" placeholder="请选择" style="width:310px;">
                <el-option label="生物医学工程" value="生物医学工程"></el-option>
                <el-option label="口腔医学" value="口腔医学"></el-option>
                <el-option label="临床医学" value="临床医学"></el-option>
                <el-option label="药学" value="药学"></el-option>
                <el-option label="护理" value="护理"></el-option>
                <el-option label="其他专业" value="其他专业"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="班级：" prop="classeid">
              <el-select v-model="registerForm.classid" placeholder="请选择" style="width:310px;">
                <el-option label="1" value="1"></el-option>
                <el-option label="2" value="2"></el-option>
                <el-option label="3" value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="性别：" prop="sex">
              <el-select v-model="registerForm.sex" placeholder="请选择" style="width:310px;">
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="邮箱：" prop="email">
              <el-input v-model="registerForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号：" prop="phone">
              <el-input v-model="registerForm.phone"></el-input>
            </el-form-item>
          </div>
      </el-form>
      <el-button type="primary" @click="clickRegister()" class="bottom-in-center">注册</el-button>
    </el-card>
</template>

<script>
export default {
  /* 
  学生注册组件化
  */
  name: "StuRegist",

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
    学号验证
    */
    var validateStuId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入学号"));
      } else {
        if (value !== "") {
          var reg = /^\d{10}$/;
          if (!reg.test(value)) {
            callback(new Error("请输入正确的学号"));
          }
        }
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
    手机号验证
    */
    var validateMobilePhone = (rule, value, callback) => {
      if (value !== "") {
        var reg = /^1[3456789]\d{9}$/;
        if (!reg.test(value)) {
          callback(new Error("请输入有效的手机号码"));
        }
      }
      callback();
    };

    /* 
    表单注册项
    */
    return {
      registerForm: {
        name: "",
        username: "",
        college: "",
        major: "",
        classid: "",
        sex: "",
        email: "",
        phone: "",
        password: "",
        password1: "",
        status: "Student"
      },

      rules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 1, max: 10, message: "长度在1到10个字符之间", trigger: "blur" }
        ],
        username: [
          { required: true, trigger: "blur" },
          { validator: validateStuId, trigger: "blur" }
        ],
        college: [{ required: true, message: "请选择学院", trigger: "change" }],
        major: [{ required: true, message: "请选择专业", trigger: "change" }],
        classid: [{ required: true, message: "请选择班级", trigger: "change" }],
        sex: [{ required: true, message: "请选择性别", trigger: "change" }],

        password: [
          { validator: validatePass, trigger: "blur" },
          { required: true, message: "请输入密码", trigger: "blur" }
        ],
        password1: [
          { validator: validatePass1, trigger: "blur" },
          { required: true, message: "请再次输入密码", trigger: "blur" }
        ],
        email: [
          { validator: validateEmail, trigger: "blur" },
          { required: true, message: "请输入邮箱", trigger: "blur" }
        ],
        phone: [
          { validator: validateMobilePhone, trigger: "blur" },
          { message: "请输入手机号(选填)", trigger: "blur" }
        ]
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

<style lang="scss">
// 修改原有表单输入框的边框样式,并且应用于所有的表单样式
.el-input__inner:focus {
  border-color: #13876a;
}
.el-select .el-input.is-focus .el-input__inner {
  border-color: #13876a;
}
.el-select .el-input__inner:focus {
  border-color: #13876a;
}
</style>

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
  background: #13876a;
  border: none;
}
.bottom-in-center:hover {
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
