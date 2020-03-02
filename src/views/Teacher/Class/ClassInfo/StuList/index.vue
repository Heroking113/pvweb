<template>
  <div>
    <div class="button-bar">
      <el-button type="primary" class="button-style" @click="checkTest">查看试卷</el-button>
      <el-button type="primary" class="button-style" @click="checkTestCurrency">查看题目准确率</el-button>
    </div>
    <div class="center-in-center">
      <el-table :data="tableContent" border style="width:601px;">
        <el-table-column prop="name" label="姓名" width="200" align="center"></el-table-column>
        <el-table-column prop="finish_status" label="完成情况" width="200" align="center"></el-table-column>
        <el-table-column label="试卷详情" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              :disabled="scope.row.finish_status == '未完成'"
              @click="CheckTestDetail(scope.row)"
              type="text"
              size="small"
            >查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="题目正确率" center width="800px" :visible.sync="accuracyDialogVisible">
      <div>
        <el-table :data="topicAccuracy" style="width:100%" :height="370" border>
          <el-table-column fixed="left" prop="question" label="题目" width="200" align="center"></el-table-column>
          <el-table-column prop="degree" label="难度" width="200" align="center"></el-table-column>
          <el-table-column prop="accuracy_rate" label="正确率" width="200" align="center"></el-table-column>
          <el-table-column prop="type" label="类型" width="200" align="center"></el-table-column>
          <el-table-column prop="topic_type" label="考察范围" width="200" align="center"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableContent: [],
      thisTestInfo: {},
      stuFinishTest: [],
      topicAccuracy: [],
      accuracyDialogVisible: false
    };
  },
  created() {
    this.initData();
  },
  methods: {
    /*
    查看试卷题目准确率
    */
    checkTestCurrency() {
      this.topicAccuracy = [];
      let params = {
        class_id: this.$store.state.classId
      };
      let accuracyList = [];
      let topicList = [];
      this.axios
        .post(
          "/exam/basic_test/" +
            this.$store.state.testId +
            "/get_accuracy_rate/",
          params
        )
        .then(resp => {
          if (resp.result) {
            accuracyList = resp.data;
            for (let i = 0; i < accuracyList.length; i++) {
              this.axios
                .get("/exam/topic/" + accuracyList[i].topic_id + "/")
                .then(resp => {
                  if (resp.result) {
                    topicList.push(resp.data);
                    if (topicList.length === accuracyList.length) {
                      for (let j = 0; j < accuracyList.length; j++) {
                        for (let k = 0; k < topicList.length; k++) {
                          if (accuracyList[j].topic_id === topicList[k].id) {
                            let everyTopicShow = {};
                            everyTopicShow.question = topicList[k].question;
                            everyTopicShow.type = topicList[k].type;
                            everyTopicShow.topic_type = topicList[k].topic_type;
                            everyTopicShow.degree = topicList[k].degree;
                            everyTopicShow.accuracy_rate =
                              accuracyList[j].accuracy_rate;
                            this.topicAccuracy.push(everyTopicShow);
                          }
                        }
                      }
                      this.accuracyDialogVisible = true;
                    }
                  } else {
                    this.$message.error("获取单个题目信息失败！");
                  }
                });
            }
          } else {
            this.$message.error("获取试卷准确率失败！");
          }
        });
    },
    /*
    查看已完成试卷的学生的试卷完成情况
    */
    CheckTestDetail(row) {
      this.$router.push({
        name: "finish_test",
        params: { id: row.test_id, student_id: row.student_id }
      });
    },
    /*
    查看试卷情况
    */
    checkTest() {
      this.$router.push({
        name: "show_test",
        params: { id: this.$store.state.testId }
      });
    },
    /*
    数据初始化
    */
    initData() {
      this.thisTestInfo = this.$route.query.params;
      let params = {
        test_id: this.$store.state.testId
      };
      this.axios
        .post(
          "/class/classinfo/" +
            this.$store.state.classId +
            "/test_finish_status/",
          params
        )
        .then(resp => {
          if (resp.result) {
            this.tableContent = [];
            this.stuFinishTest = resp.data;
            let thisClassStu = [];
            for (let i = 0; i < this.stuFinishTest.length; i++) {
              thisClassStu.push(this.stuFinishTest[i].id);
            }
            for (let j = 0; j < this.stuFinishTest.length; j++) {
              let ObjContent = {};
              if (thisClassStu.indexOf(this.stuFinishTest[j].id) > -1) {
                ObjContent.student_id = this.stuFinishTest[j].student_id;
                ObjContent.test_id = this.$store.state.testId;
                ObjContent.name = this.stuFinishTest[j].name;
                if (this.stuFinishTest[j].finish_status === true) {
                  ObjContent.finish_status = "已完成";
                } else {
                  ObjContent.finish_status = "未完成";
                }
                this.tableContent.push(ObjContent);
              }
            }
          } else {
            this.$message.error("获取学生试卷完成情况失败！");
          }
        });
    }
  }
};
</script>

<style scoped>
.button-style {
  font-size: 15px;
  float: right;
  max-width: 200px;
  height: 40px;
  margin: 5px;
  border: 0;
  border-radius: 0;
  background: #13876a;
}
.button-bar {
  width: 100%;
  height: 50px;
}
.center-in-center {
  position: absolute;
  top: 210px;
  left: 47%;
  transform: translate(-50%, -50%);

  /* 不同浏览器的兼容设置 */
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
}
</style>