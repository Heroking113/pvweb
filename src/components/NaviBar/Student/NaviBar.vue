<template>
  <!--导航栏-->
  <el-container>
    <el-header class="head-left-content">
      <el-button @click="getBack" class="teacher-home-page">首页</el-button>
      <el-button @click="toClass" class="class-management">班级</el-button>
      <el-button @click="toTest" class="test-management">试卷</el-button>
      <el-button @click="toTopic" class="topic-management">题库</el-button>
      <el-button @click="toInfo" class="info-management">个人信息</el-button>
      <div class="head-right-content">
        <el-button @click="clickLogout" class="logout-button">注销</el-button>
        <span class="username-display" for="username">{{userInfo.name}}</span>
      </div>
    </el-header>
  </el-container>
</template>

<script>
import { userInfo } from "os";
export default {
  name: "NaviBar",
  data() {
    return {
      userInfo: ""
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    /* 
    返回首页
    */
    getBack() {
      this.$router.push({ path: "/student/index" });
    },

    /* 
    跳转到班级界面
    */
    toClass() {
      this.$router.push({path:'/student/class'});
    },

    /* 
    跳转到试卷界面
    */
    toTest() {
      this.$router.push({path:'/student/test'});
    },

    /* 
    跳转到题库界面
    */
    toTopic() {
      this.$router.push({path:'/student/topic'});
    },
    /* 
    跳转到个人信息界面
    */
    toInfo() {
      this.$router.push({path:'/student/info'});
    },
    /* 
    点击注销按钮，调用注销函数
    */
    clickLogout() {
      this.handleLogout();
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
    获取用户信息
    */
    getUserInfo() {
      this.axios.get("/account/user_info/").then(resp => {
        if (resp.result) {
          this.userInfo = resp.data;
        } else {
          this.$message.error(resp.error);
        }
      });
    }
  }
};
</script>

<style scoped>
.teacher-home-page {
  position: relative;
  height: 50px;
  width: 100px;
  border-radius: 0;
  font-size: 23px;
  font-weight: 300;
  bottom: 0px;
  color: white;
  background: transparent;
  border: 0;
}
.teacher-home-page:hover {
  background-color: #0a6659;
}
.class-management {
  position: relative;
  height: 50px;
  width: 100px;
  border-radius: 0;
  font-size: 23px;
  font-weight: 300;
  bottom: 0px;
  color: white;
  background: transparent;
  border: 0;
}
.class-management:hover {
  background-color: #0a6659;
}
.test-management {
  position: relative;
  height: 50px;
  width: 100px;
  border-radius: 0;
  font-size: 23px;
  font-weight: 300;
  bottom: 0px;
  color: white;
  background: transparent;
  border: 0;
}
.test-management:hover {
  background-color: #0a6659;
}
.topic-management {
  position: relative;
  height: 50px;
  width: 100px;
  border-radius: 0;
  font-size: 23px;
  font-weight: 300;
  bottom: 0px;
  color: white;
  background: transparent;
  border: 0;
}
.topic-management:hover {
  background-color: #0a6659;
}
.info-management {
  position: relative;
  height: 50px;
  width: 150px;
  border-radius: 0;
  font-size: 23px;
  font-weight: 300;
  bottom: 0px;
  color: white;
  background: transparent;
  border: 0;
}
.info-management:hover {
  background-color: #0a6659;
}
.logout-button {
  float: right;
  height: 50px;
  margin: 0;
  border: 0;
  max-width: 80px;
  border: 0;
  font-size: 23px;
  font-weight: 300;
  color: white;
  background: transparent;
}

.logout-button:hover {
  background-color: #0a6659;
}

.username-display {
  float: right;
  height: 50px;
  margin: 8.5px 10px 0 0;
  border: 0;
  max-width: 100px;
  border: 0;
  font-size: 23px;
  font-weight: 300;
  color: white;
  background: transparent;
}
.head-right-content {
  float: right;
  max-height: 50px;
  width: 400px;
}
.head-left-content {
  overflow: hidden;
  background: #000;
  max-height: 50px;
  padding: 0;
  float: left;
}

.el-button-back {
  max-height: 50px;
  max-width: 100px;
  border-radius: 0;
  font-size: 30px;
  font-weight: 300;
  color: white;
  background: transparent;
  border: 0;
}
.el-button-back:hover {
  background-color: #0a6659;
}
</style>
