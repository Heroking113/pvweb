<template>
  <div>
    <!-- 按钮功能栏 -->
    <div class="button-bar">
      <el-button @click="createClassDialog" type="primary" class="button-group">创建班级</el-button>
    </div>

    <!-- 显示班级信息 -->
    <div style="margin-top:5px;">
      <el-table :data="class_info" border height="500" style="width:100%;">
        <el-table-column prop="class_id" label="班级编号" width="200" align="center"></el-table-column>
        <el-table-column prop="classname" label="班级名称" width="200" align="center"></el-table-column>
        <el-table-column prop="classmajor" label="主要上课班级" width="200" align="center"></el-table-column>
        <el-table-column prop="belongs_teachers[0].name" label="任课老师" width="200" align="center"></el-table-column>
        <el-table-column prop="student_count" label="学生人数" width="200" align="center"></el-table-column>
        <el-table-column prop="contains_tests.length" label="试卷数量" width="200" align="center"></el-table-column>
        <el-table-column fixed="left" align="center" label="班级管理" width="310">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              class="list-operation-button"
              @click="handleDisplayDetails(scope.$index, scope.row)"
            >学生名单</el-button>
            <el-button
              size="mini"
              type="primary"
              class="list-operation-button"
              @click="handleCheckTest(scope.$index, scope.row)"
            >班级详情</el-button>
            <el-button
              size="mini"
              type="primary"
              class="list-operation-button"
              @click="handleChangeClassInfo(scope.$index, scope.row)"
            >更改</el-button>
            <el-button
              size="mini"
              type="primary"
              class="list-operation-button"
              @click="handleDeleteClass(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 创建班级 -->
    <CreateClass v-bind:display_create_class_dialog="isshow_create_class"></CreateClass>

    <!-- 修改班级信息 -->
    <ChangeClassInfo v-bind:exist_class_info="base_class_info"></ChangeClassInfo>

    <!-- 显示学生名单 -->
    <el-dialog :visible.sync="isshow_class_details" :show-close="false">
      <label for="学生信息" style="font-size:30px;margin-left:43%;">学生信息</label>
      <el-table border :data="this_class_info.contains_students" :height="300">
        <el-table-column fixed="left" prop="name" label="姓名" width="183‬" align="center"></el-table-column>
        <el-table-column prop="user.username" label="学号" width="183" align="center"></el-table-column>
        <el-table-column prop="college" label="学院" width="183" align="center"></el-table-column>
        <el-table-column prop="major" label="专业" width="183‬" align="center"></el-table-column>
        <el-table-column prop="classid" label="班级" width="183‬" align="center"></el-table-column>
      </el-table>
      <br />
      <br />
    </el-dialog>
  </div>
</template>

<script>
import CreateClass from "./components/CreateClass/CreateClass.vue";
import ChangeClassInfo from "./components/ChangeClassInfo/ChangeClassInfo.vue";
import { finished } from "stream";
import { setTimeout } from "timers";
export default {
  inject: ["reload"],
  components: {
    ChangeClassInfo,
    CreateClass
  },
  data() {
    return {
      isshow_create_class: false,
      isshow_class_details: false,
      class_info: [],
      stuLists: [],
      testLists: [],
      this_class_info: {},
      base_class_info: {},
    };
  },
  created() {
    this.getClassInfo();
  },
  methods: {
    /*
    查看作业完成情况,函数的链式执行
    */
    handleCheckTest(index, row) {
      this.$store.commit('setClassID', row.id);
      this.$router.push({
        path:'/teacher/class/class_info'
      });
    },

    /*
    查看班级详情
    */
    handleDisplayDetails(index, row) {
      this.this_class_info = row;
      for (let i = 0; i < this.this_class_info.contains_tests.length; i++) {
        if (this.this_class_info.contains_tests[i].is_public === true) {
          this.this_class_info.contains_tests[i].is_public = "公开";
        } else {
          this.this_class_info.contains_tests[i].is_public = "未公开";
        }
      }

      this.isshow_class_details = true;
    },
    /*
    更改班级信息
    */
    handleChangeClassInfo(index, row) {
      this.base_class_info = row;
    },
    /*
    删除班级
    */
    handleDeleteClass(index, row) {
      this.$confirm("确认删除该班级吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.axios.delete("/class/classinfo/" + row.id).then(resp => {
          if (resp.result) {
            this.$message.success("删除班级成功！");
            this.reload();
          } else {
            this.$message.error(resp.error);
          }
        });
      });
    },
    /*
  创建创建班级
  */
    createClassDialog() {
      this.isshow_create_class = true;
    },
    /*
    获取班级信息
    */
    getClassInfo() {
      this.axios.get("/class/classinfo?username=" + this.$store.state.username).then(resp => {
        if (resp.result) {
          this.class_info = resp.data.results;
          for (let i = 0; i < this.class_info.length; i++) {
            this.stuLists[i] = this.class_info[i].contains_students;
            this.testLists[i] = this.class_info[i].contains_tests;
          }
        } else {
          this.$message.error(resp.error);
        }
      });
    },
    /*
    判断是否是数组
    */
    isArray(o) {
      return Object.prototype.toString.call(o) == "[object Array]";
    }
  }
};
</script>

<style>
/* 改变创建班级对话框原有样式 */
.el-input__inner:focus {
  border-color: #13876a;
}
.el-select .el-input.is-focus .el-input__inner {
  border-color: #067d57;
}
.el-select .el-input__inner:focus {
  border-color: #067d57;
}
.el-select-dropdown__item.selected {
  color: #067d57;
  font-weight: 700;
}
</style>

<style lang="scss" scoped>
.list-operation-button {
  margin: 2px;
  border: 0;
  border-radius: 0;
  color: white;
  background: #0a6659;
}
.list-operation-button:hover {
  background-color: hsl(172, 64%, 22%);
}
.button-bar {
  height: 50px;
  width: 100%;
  background-color: transparent;
}
.button-group {
  height: 40px;
  border: 0;
  font-size: 15px;
  margin-top: 10px;
  border-radius: 0;
  margin-right: 10px;
  background: hsl(172, 64%, 22%);
}
.button-group:hover {
  background-color: hsl(172, 64%, 22%);
}
</style>
