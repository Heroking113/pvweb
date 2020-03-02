<template>
<!-- 用户管理界面 -->
<div>
    <!--导航栏-->
    <div class="headbar-content" style="margin:0 0 10px 0;">
      <div class="headbar-left-content">
        <el-button @click="getBack" class="headbar-buttons">首页</el-button>
        <el-button type="text" class="el-user-manage">用户管理</el-button>
      </div>
      <div class="headbar-right-content">
        <el-button @click="handleLogout" class="headbar-buttons">注销</el-button>
      </div>
    </div>


    <!-- 按钮功能栏 -->
    <div class="information-bar">
      <span class="stu-info">学生信息</span>
      <div class="informationbar-right-content">
        <el-button @click="toUserRegist" type="primary" class="button-group">用户注册</el-button>
        <el-button @click="downloadTemplate" type="primary" class="button-group">下载模板</el-button>
        <div style="float:right;background:transparent; margin-bottom:0; margin-right: 80px; width:60px">
          <el-upload
            action="/account/student/register_excel/"
            accept=".xlsx, .xlsm, .xls"
            :headers="{'X-CSRFToken': csrfToken}"
            :show-file-list="false"
            :on-change="handleChange"
            :on-remove="handleRemove"
            :on-success="handleUpload"
          >
            <el-button type="primary" class="button-group">点击上传</el-button>
          </el-upload>
        </div>
      </div>
    </div>

    <div style="width:100%;height:1px; background:#E0E0E0;"></div>
    <!-- 信息展示栏 -->
    <div>
      <el-table :data="student_show" :height="tableHeight">
        <el-table-column prop="user.username" label="学号" width="200"></el-table-column>
        <el-table-column prop="name" label="姓名" width="200"></el-table-column>
        <el-table-column prop="sex" label="性别" width="200"></el-table-column>
        <el-table-column prop="college" label="学院" width="200"></el-table-column>
        <el-table-column prop="major" label="专业" width="200"></el-table-column>
        <el-table-column prop="classid" label="班级" width="200"></el-table-column>
        <el-table-column prop="user.email" label="邮箱" width="200"></el-table-column>
        <el-table-column prop="phone" label="手机号" width="200"></el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="deleteRow(scope.$index, student_show)"
              type="primary"
              size="small"
              class="button-group"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  inject: ['reload'],
  data() {
    return {
      student_show: [],
      student: [],
      fileList: [],
       // 设置表格高度
      tableHeight:0
    };
  },
  created() {
    this.getStudent();
    // 获取屏幕高度，让浏览器高度自适应屏幕大小
   this.tableHeight = window.innerHeight-158;
  },
  computed: {
    csrfToken () {
      return Cookies.get('csrftoken')
    }
  },
  methods: {
    /* 
    判断文件上传是否成功
    */
    handleUpload(response, fileList) {
      if (response.result) {
        this.$message.success("文件上传成功！");
        this.reload();
      } else {
        this.$message.error(response.data.detail);
      }
    },

    /* 
    删除对应行的学生信息
    */
    deleteRow(index, rows) {
      this.axios
        .delete("/account/student/" + this.student[index].id)
        .then(resp => {
          if (resp.result) {
            rows.splice(index, 1);
            this.$message.success('删除用户成功')
          } else {
            this.$message.error(resp.error);
          }
        });
    },

    /* 
    返回首页
    */
    getBack() {
      this.$router.push({ path: "/manager" });
    },

    /* 
    注销账户，返回登陆按钮
    */
    handleLogout() {
      this.axios.post("/account/user/logout/").then(resp => {
        if (resp.result) {
          this.$store.commit("setUserStatus", null)
          this.$router.push({ path: "/login" });
          this.$message.success("注销成功！");
        } else {
          this.$message.error("注销失败！");
        }
      });
    },

    /* 
    下载模板
    */
    downloadTemplate() {
      return (window.location.href =
        "http://localhost:9123/account/student/register_file/");
    },

    /* 
    跳转到注册界面
    */
    toUserRegist() {
      this.$router.push({ path: "/register" });
    },

    /* 
    获取学生列表
    */
    getStudent() {
      this.axios.get("/account/student/").then(resp => {
        if (resp.result) {
          this.student = resp.data;
          this.student_show = this.student;
        } else {
          this.$message.error(resp.error);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.el-scrollbar .el-scrollbar__wrap {overflow-x: hidden;}
.informationbar-right-content {
  float: right;
  margin-top: 15px;
  background: transparent;
  max-height: 120px;
  width: 375px;
  border-bottom: 0;
}
.stu-info {
  position: absolute;
  margin: 10px 0px 0 20px;
  border-radius: 0;
  font-size: 35px;
  font-weight: 500;
  color: black;
  background-color: transparent;
}
.information-bar {
  height: 80px;
  width: 100%;
  background-color: transparent;
}
.headbar-content {
  height: 50px;
  width: 100%;
  background-color: black;
}
.headbar-right-content {
  margin-right: 10px;
  height: 50px;
  width: 60px;
  float: right;
}
.headbar-center-content {
  height: 50px;
  width: 200px;
  background: black;
  left: 400%;
}
.headbar-left-content {
  float: left;
}
.el-user-manage {
  height: 50px;
  margin: 0 0 0 1px;
  width: 110px;
  border-radius: 0;
  font-size: 17px;
  font-weight: 300;
  color: white;
  background: #0a6659;
  border: 0;
}
.headbar-buttons {
  height: 50px;
  margin: 0;
  max-width: 100px;
  border-radius: 0;
  font-size: 17px;
  font-weight: 300;
  color: white;
  background: transparent;
  border: 0;
}
.headbar-buttons:hover {
  background-color: #0a6659;
}

.button-group {
  border: 0;
  margin-right: 10px;
  background: #13876a;
}
.button-group:hover {
  background-color: #0a6659;
}
</style>