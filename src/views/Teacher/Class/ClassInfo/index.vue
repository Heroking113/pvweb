<template>
  <div>
    <div class="button-tool">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="试卷" name="first"></el-tab-pane>
        <el-tab-pane label="文件" name="second"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="list" v-show="isshowTestCardList">
      <div class="content-box" v-for="(item, index) in testInterface" :key="index">
        <div @click="ToStuList(item)">
          <el-card class="box-card">
            <span class="testname">
              {{item.name}}
              <br />
              <div style="height:10px; width:100%;"></div>
            </span>
            <span>
              出题人：
              {{item.author}}
              <br />
              <div style="height:10px;"></div>
            </span>
            <span>试卷类型：{{item.testtype}}</span>
          </el-card>
        </div>
      </div>
    </div>
    <div v-show="isshowFiles">
      <div class="button-bar">
        <div class="informationbar-left-content">
          <el-button
          type="primary"
          @click="createChapter"
          class="button-group"
          style="margin-right:0px;"
          >新建单元</el-button>
        </div>
      </div>
      <el-table
        :data="chapterList"
        border
        style="width:100%"
      >
      <el-table-column prop="chapter_name" label="单元名称" width="300" align="center"></el-table-column>
      <el-table-column prop="created_by" label="上传者" width="300" align="center"></el-table-column>
      <el-table-column prop="file_name" label="设置的文件名" width="300" align="center"></el-table-column>
      <el-table-column prop="already_handle" label="已交" width="300" align="center"></el-table-column>
      <el-table-column prop="should_handle" label="应交" width="300" align="center"></el-table-column>
      <el-table-column fixed="right" label="操作" width="400" align="center">
        <template slot-scope="scope">
          <el-button @click="clickChapter(scope.row)" type="primary" size="mini" class="list-operation-button">查看</el-button>
          <el-button @click="showDeleteChapter(scope.row)" type="primary" size="mini" class="list-operation-button">删除</el-button>
        </template>
      </el-table-column>
      </el-table>
    </div>
    <!-- 创建单元 -->
    <CreateChapter v-bind:displayCreateChapterDialog="isshowCreateChapter"></CreateChapter>
    <el-dialog
    title="提醒！"
    :visible.sync = "isshowDeleteChapter"
    width="30%">
    <span>是否确定要删除这一个单元？</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="isshowDeleteChapter=false">取消</el-button>
      <el-button type="primary" @click="deleteChapter()">确定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
import CreateChapter from "./components/CreateChapter/CreateChapter.vue";
export default {
  inject: ["reload"],
  components: {
    CreateChapter
  },
  data() {
    return {
      thisClassInfo: {},
      activeName: "first",
      isshowTestCardList: true,
      isshowFiles: false,
      testInterface: [],
      chapterList: [],
      isshowCreateChapter: false,
      isshowDeleteChapter: false,
      deleteChapterElem: '',
    };
  },
  created() {
    this.getClassInfo();
    this.getChapterList();
  },
  methods: {
    /*
    跳转到学生列表界面
    */
    ToStuList(item) {
      let thisTestInfo = this.thisClassInfo;
      thisTestInfo.test_id = item.test_id;
      this.$store.commit("setTestID", item.test_id);
      this.$router.push({
        path: "/teacher/class/class_info/stu_list"
      });
    },

    /*
    获取班级信息
    */
    getClassInfo() {
      let classInfo = [];
      this.axios.get("/class/classinfo/").then(resp => {
        if (resp.result) {
          classInfo = resp.data.results;
          for (let i = 0; i < classInfo.length; i++) {
            if (classInfo[i].id === this.$store.state.classId) {
              this.thisClassInfo = classInfo[i];
              for (
                let i = 0;
                i < this.thisClassInfo.contains_tests.length;
                i++
              ) {
                let testInterfaceShow = {};
                testInterfaceShow.author = this.thisClassInfo.contains_tests[
                  i
                ].author.name;
                testInterfaceShow.name = this.thisClassInfo.contains_tests[
                  i
                ].name;
                testInterfaceShow.testtype = this.thisClassInfo.contains_tests[
                  i
                ].testtype;
                testInterfaceShow.test_id = this.thisClassInfo.contains_tests[
                  i
                ].id;
                this.testInterface.push(testInterfaceShow);
              }
            }
          }
        } else {
          this.$message.error("获取班级信息失败！");
        }
      });
    },
    /*
    点击按钮栏的按钮进行切换
    */
    getChapterList() {
      this.axios.get("/class/chapter/?class_id=" + this.$store.state.classId).then(resp => {
        if (resp.result) {
          this.chapterList = resp.data
          for (let i=0; i<this.chapterList.length; i++) {
            this.chapterList[i].created_by = this.chapterList[i].created_by.name
          }
        } else {
          this.$message.error(resp.error)
        }
      })
    },
    /*
    查看章节详情
    */
    clickChapter(chapter) {
      this.$store.commit('setChapterID', chapter.id)
      this.$router.push({ path:'/teacher/class/class_info/file' })
    },
    /*
    创建章节详情
    */
    createChapter(chapter) {
      this.isshowCreateChapter = true
    },
    /*
    显示删除章节
    */
    showDeleteChapter(row) {
      this.isshowDeleteChapter = true
      this.deleteChapterElem = row.id
    },
    /*
    删除章节
    */
    deleteChapter() {
      this.axios.delete("/class/chapter/" + this.deleteChapterElem + "/").then(resp => {
        if (resp.result) {
          this.$message.success('删除成功!')
          this.isshowDeleteChapter = false
          this.reload()
        }
      })
    },
    /*
    点击按钮栏的按钮进行切换
    */
    handleClick(tab, event) {
      if (tab.label === "试卷") {
        this.isshowTestCardList = true;
        this.isshowFiles = false;
      } else if (tab.label === "文件") {
        this.isshowTestCardList = false;
        this.isshowFiles = true;
      }
    }
  }
};
</script>

<style scoped>
.upload-demo {
  margin-left: 70px;
}
.input-file-description {
  width: 359px;
  margin-top: 10px;
}
.input-file-name {
  width: 359px;
  margin-top: 10px;
  margin-left: 13px;
}
.file-part {
  margin-left: 30px;
  background: red;
}
.button-group {
  border-radius: 0;
  border: 0;
  margin-left: 20px;
  background: #13876a;
}
.button-group:hover {
  background-color: #0a6659;
}
.box-card {
  margin-left: 20px;
  margin-bottom: 20px;
}
.box-card:hover {
  box-shadow: 0 0 15px rgba(48, 207, 247, 0.3);
}
.testname {
  font-size: 22px;
  color: #08304c;
  margin-bottom: 15px;
  background: transparent;
}
.list {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 96%;
}
.content-box {
  display: block;
  background: transparent;
  width: 270px;
  max-height: 200px;
}
.button-tool {
  background: transparent;
  width: 100%;
  height: 60px;
}
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
.informationbar-left-content {
  float: left;
  background: transparent;
  height: 50px;
  width: 700px;
}
</style>