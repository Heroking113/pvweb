<template>
  <!-- 学生注册/教师注册/管理员注册 -->
  <div>
    <el-button-group class="stu-teach-manage">
      <el-button @click="stuShow" type="primary" class="choose-style">注册学生</el-button>
      <el-button @click="teachShow" type="primary" class="choose-style">注册老师</el-button>
      <el-button @click="manageShow" type="primary" class="choose-style">注册管理员</el-button>
    </el-button-group>
    <StuRegist v-show="stu_show"></StuRegist>
    <TeachRegist v-show="teach_show"></TeachRegist>
    <ManageRegist v-show="manage_show"></ManageRegist>
  </div>
</template>

<script>
export default {
  /*
调用组件
*/
  components: {
    StuRegist: () => import("./components/StuRegist.vue"),
    TeachRegist: () => import("./components/TeachRegist.vue"),
    ManageRegist: () => import("./components/ManageRegist.vue")
  },

  /*
返回数据
*/
  data() {
    return {
      stu_show: false,
      teach_show: false,
      manage_show: false
    };
  },

  /*
  根据用户身份判断注册类型
  */
  methods: {
    stuShow() {
      (this.stu_show = true),
        (this.teach_show = false),
        (this.manage_show = false);
    },
    teachShow() {
      (this.stu_show = false),
        (this.teach_show = true),
        (this.manage_show = false);
    },
    manageShow() {
      (this.stu_show = false),
        (this.teach_show = false),
        (this.manage_show = true);
    }
  }
};
</script>

<style lang="scss" scoped>
.choose-style {
  width: 130px;
  height: 60px;
  padding: 0;
  border:0;
  font-size: 20px;
  background: #13876a;
}
.choose-style:hover {
  background-color: #0a6659;
}
.stu-teach-manage {
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
</style>
