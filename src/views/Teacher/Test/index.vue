<template>
  <div>
    <!-- 按钮功能栏 -->
    <div class="button-bar">
      <div class="informationbar-left-content">
        <el-button @click="isshow_create_test_dialog = true" type="primary" class="button-group">创建试卷</el-button>
        <el-button @click="handlePublicTest" type="primary" class="button-group">批量公开试卷</el-button>
        <el-button @click="handlePrivateTest" type="primary" class="button-group">批量取消公开试卷</el-button>
        <el-button @click="handleTestToClass" type="primary" class="button-group">分发试卷到班级</el-button>
      </div>
    </div>
    <div style="width:100%;height:1px; background:#E0E0E0; margin:1px 0 10px 0;"></div>
    <!-- 试卷列表栏 -->
    <div>
      <el-table
        :data="displayTest"
        border
        style="width: 100%;"
        @selection-change="handleSelectionTestChange"
      >
        <el-table-column type="selection" fixed="left" align="center"></el-table-column>
        <el-table-column prop="name" label="试卷名" width="300" align="center"></el-table-column>
        <el-table-column prop="testtype" label="试卷类型" width="300" align="center"></el-table-column>
        <el-table-column prop="is_public" label="是否公开" width="300" align="center"></el-table-column>
        <el-table-column prop="singles" label="单选题" width="300" align="center"></el-table-column>
        <el-table-column prop="multiples" label="多选题" width="300" align="center"></el-table-column>
        <el-table-column prop="gapfills" label="填空题" width="300" align="center"></el-table-column>
        <el-table-column prop="truefalses" label="判断题" width="300" align="center"></el-table-column>
        <el-table-column prop="shortanswers" label="简答题" width="300" align="center"></el-table-column>
        <el-table-column fixed="right" align="center" label="试卷管理" width="410">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              class="list-operation-button"
              @click="handleDisplayDetails(scope.$index, scope.row)"
            >详情</el-button>
            <template v-if="scope.row.is_assign">
              <el-button
                disabled
                size="mini"
                type="primary"
                class="list-operation-button"
                @click="handleAddTopics(scope.$index, scope.row)"
              >添加题目</el-button>
              <el-button
                disabled
                size="mini"
                type="primary"
                class="list-operation-button"
                @click="handleCutTopics(scope.$index, scope.row)"
              >删减题目</el-button>
            </template>
            <template v-if="scope.row.is_assign === false">
              <el-button
                size="mini"
                type="primary"
                class="list-operation-button"
                @click="handleAddTopics(scope.$index, scope.row)"
              >添加题目</el-button>
              <el-button
                size="mini"
                type="primary"
                class="list-operation-button"
                @click="handleCutTopics(scope.$index, scope.row)"
              >删减题目</el-button>
            </template>
            <el-button
              size="mini"
              type="primary"
              class="list-operation-button"
              @click="handleUpdateTest(scope.$index, scope.row)"
            >更新试卷</el-button>
            <el-button
              size="mini"
              type="primary"
              class="list-operation-button"
              @click="handleDeleteTest(scope.$index, scope.row)"
            >删除试卷</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 试卷的题目详情 -->
    <CreateTest v-bind:display_create_test_dialog="isshow_create_test_dialog"></CreateTest>
    <el-dialog lock-scroll :style="dialogsizes" close-on-press-escape :visible.sync="isshow_details" center width="100%">
        <span style="font-size:30px;margin-left:43%;">
          题目详情
          <br/>
          <br />
        </span>
        <div>
          <el-table height="300" width="300" border :data="showDetails.contains_topics">
            <el-table-column fixed prop="question" label="题目" width="300" align="center"></el-table-column>
            <el-table-column prop="answer" label="答案" width="300" align="center"></el-table-column>
            <el-table-column prop="type" label="类型" width="300" align="center"></el-table-column>
            <el-table-column prop="topic_type" label="考查范围" width="300" align="center"></el-table-column>
            <el-table-column prop="degree" label="题目难度" width="300" align="center"></el-table-column>
          </el-table>
      </div>
    </el-dialog>

    <!-- 添加题目 -->
    <div v-show="isshow_topics">
      <AddTopics v-bind:testid="test_id"></AddTopics>
    </div>

    <!-- 更新题目 -->
    <div v-show="isshow_update_test">
      <UpdateTest v-bind:base_test="this_test"></UpdateTest>
    </div>
    <!-- 删减题目 -->
    <div v-show="isshow_this_test_topics">
      <DeleteTopics v-bind:thisTestDetail="thisTestDetails"></DeleteTopics>
    </div>

    <!-- 发布试卷到班级 -->
    <el-dialog
      :center="true"
      title="请选择想要分发试卷的班级"
      :visible.sync="isshow_batch_add_in_class"
      width="250"
      height="400"
      :show-close="false"
    >
      <el-table
        :data="class_info"
        border
        height="300"
        width="100%"
        style="width:100%;"
        @selection-change="handleSelectionDistributeClassChange"
      >
        <el-table-column type="selection" fixed="left" align="center"></el-table-column>
        <el-table-column prop="class_id" label="班级编号" width="100" align="center"></el-table-column>
        <el-table-column prop="classname" label="班级名称" width="150" align="center"></el-table-column>
        <el-table-column prop="classmajor" label="主要上课班级" width="200" align="center"></el-table-column>
        <el-table-column prop="belongs_teachers[0].name" label="任课老师" width="100" align="center"></el-table-column>
        <el-table-column prop="student_count" label="学生人数" width="100" align="center"></el-table-column>
        <el-table-column prop="contains_tests.length" label="试卷数量" width="100" align="center"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="comfirmDistrite" class="button-group">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/* 
调用"添加题目"和“删除题目”的组件
*/
import CreateTest from "./components/CreateTest/CreateTest.vue";
import DeleteTopics from "./components/DeleteTopics/DeleteTopics.vue";
import AddTopics from "./components/AddTopics/AddTopics.vue";
import UpdateTest from "./components/UpdateTest/UpdateTest.vue";

export default {
  inject: ["reload"],
  components: {
    CreateTest,
    DeleteTopics,
    AddTopics,
    UpdateTest
  },
  data() {
    return {
      isshow_create_test_dialog: false,
      isshow_this_test_topics: false,
      isshow_details: false,
      isshow_topics: false,
      isshow_batch_add_in_class: false,
      isshow_update_test: false,
      showDetails: [],
      this_test: {},
      testList: [],
      class_info: [],
      distribute_test_ids: [],
      distribute_class_ids: [],
      displayTest: [],
      thisTestDetails: {},
      pitchedTests: [],
      test_id: 0,

      // 获取屏幕长和宽
      dialogsizes: {
        height: "",
        width: "",
        margin: "0 100px"
      }
    };
  },
  created() {
    window.addEventListener("resize", this.getSizes);
    this.getTestList();
    this.getClassInfo();
    this.getSizes();
  },
  destroyed() {
    window.removeEventListener("resize", this.getSizes);
  },
  methods: {
    /*
    获取屏幕长和宽
    */
    getSizes() {
      this.dialogsizes.height = window.innerHeight + "px";
      this.dialogsizes.width = window.innerWidth * 0.8 + "px";
    },
    /*
    更新试卷
    */
    handleUpdateTest(index, row) {
      this.this_test = row;
      this.isshow_update_test = true;
    },
    /*
    确认分发试卷
    */
    comfirmDistrite() {
      if (!this.distribute_class_ids.length) {
        this.$message.warning("请选择想要分发的班级！");
      } else {
        let params = {
          test_id: this.distribute_test_ids,
          class_id: this.distribute_class_ids
        };
        this.axios
          .post("/exam/basic_test/batch_add_in_class/", params)
          .then(resp => {
            if (resp.result) {
              this.$message.success("分发试卷成功！");
              this.isshow_batch_add_in_class = false;
            } else {
              this.$message.error("分发失败！");
            }
          });
      }
    },
    /*
   获取想要分发试卷的班级的id
   */
    handleSelectionDistributeClassChange(val) {
      for (let i = 0; i < val.length; i++) {
        this.distribute_class_ids[i] = val[i].id;
      }
    },
    /* 
    显示试卷题目列表
    */
    handleDisplayDetails(index, row) {
      this.$router.push({ name: "show_test", params: { id: row.id } });
    },
    /*
    添加题目,弹出添加题目对话框
    */
    handleAddTopics(index, row) {
      this.isshow_topics = true;
      this.test_id = row.id;
    },
    /*
    删减题目
    */
    handleCutTopics(index, row) {
      for (let i = 0; i < this.testList.length; i++) {
        if (
          row.name === this.testList[i].name &&
          this.testList[i].contains_topics.length
        ) {
          this.thisTestDetails = this.testList[i];
          this.isshow_this_test_topics = true;
          break;
        } else if (
          row.name === this.testList[i].name &&
          !this.testList[i].contains_topics.length
        ) {
          this.$message.warning("该试卷还未添加任何题目，无法删减！");
          break;
        } else {
          continue;
        }
      }
    },
    /* 
    批量公开试卷
    */
    handlePublicTest() {
      if (this.pitchedTests.length === 0) {
        this.$message.warning("请选择想要公开的试卷！");
      } else {
        this.$confirm("确认公开这批试卷吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let public_id = [];
          for (let i = 0; i < this.pitchedTests.length; i++) {
            public_id[i] = this.pitchedTests[i].id;
          }
          let params = {
            public_id: public_id
          };
          this.axios.post("/exam/basic_test/set_public/", params).then(resp => {
            if (resp.result) {
              this.$message.success("批量公开试卷成功！");
              this.reload();
            } else {
              this.$message.error(resp.error);
            }
          });
        });
      }
    },
    /* 
    批量取消公开试卷
    */
    handlePrivateTest() {
      if (this.pitchedTests.length === 0) {
        this.$message.warning("请选择想要取消公开的试卷！");
      } else {
        this.$confirm("确认取消公开这批试卷吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let public_id = [];
          for (let i = 0; i < this.pitchedTests.length; i++) {
            public_id[i] = this.pitchedTests[i].id;
          }
          let params = {
            public_id: public_id
          };
          this.axios
            .post("/exam/basic_test/reset_public/", params)
            .then(resp => {
              if (resp.result) {
                this.$message.success("批量取消公开试卷成功！");
                this.reload();
              } else {
                this.$message.error(resp.error);
              }
            });
        });
      }
    },
    /* 
    发布试卷到班级
    */
    handleTestToClass() {
      if (!this.distribute_test_ids.length) {
        this.$message.warning("请选择想要分发的试卷！");
      } else {
        this.isshow_batch_add_in_class = true;
      }
    },
    /*
    删除试卷
    */
    handleDeleteTest(index, row) {
      this.$confirm("确认删除该试卷吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.axios.delete("/exam/basic_test/" + row.id).then(resp => {
          if (resp.result) {
            this.$message.success("删除试卷成功！");
            this.reload();
          } else {
            this.$message.error("删除试卷失败！");
          }
        });
      });
    },
    /*
    处理试卷复选框选中的情况
    */
    handleSelectionTestChange(val) {
      this.pitchedTests = val;
      for (let i = 0; i < val.length; i++) {
        this.distribute_test_ids[i] = val[i].id;
      }
    },
    /*
    获取试卷列表
    */
    getTestList() {
      this.loading = true;
      this.axios.get("/exam/basic_test?username=" + this.$store.state.username).then(resp => {
        if (resp.result) {
          this.testList = resp.data.results || [];
          this.getDisplayTest();
        } else {
          this.testList = [];
          this.$message.error(resp.error);
        }
      });
    },
    /*
    处理数据，生成显示在表格里面的数组
    */
    getDisplayTest() {
      for (let i = 0; i < this.testList.length; i++) {
        let thisList = {};
        let singles = 0;
        let multiples = 0;
        let truefalses = 0;
        let gapfills = 0;
        let shortanswers = 0;
        thisList.name = this.testList[i].name;
        thisList.testtype = this.testList[i].testtype;
        thisList.id = this.testList[i].id;
        thisList.is_assign = this.testList[i].is_assign;
        if (this.testList[i].is_public) {
          thisList.is_public = "公开";
        } else {
          thisList.is_public = "未公开";
        }
        for (let j = 0; j < this.testList[i].contains_topics.length; j++) {
          if (this.testList[i].contains_topics[j].type === "单选题") {
            singles++;
          } else if (this.testList[i].contains_topics[j].type === "多选题") {
            multiples++;
          } else if (this.testList[i].contains_topics[j].type === "填空题") {
            gapfills++;
          } else if (this.testList[i].contains_topics[j].type === "判断题") {
            truefalses++;
          } else if (this.testList[i].contains_topics[j].type === "简答题") {
            shortanswers++;
          }
        }
        thisList.singles = singles;
        thisList.multiples = multiples;
        thisList.truefalses = truefalses;
        thisList.gapfills = gapfills;
        thisList.shortanswers = shortanswers;
        this.displayTest.push(thisList);
      }
    },
    /*
    获取班级信息
    */
    getClassInfo() {
      this.axios.get("/class/classinfo/").then(resp => {
        if (resp.result) {
          this.class_info = resp.data.results;
        } else {
          this.$message.error(resp.error);
        }
      });
    }
  }
};
</script>

<style>
/* 修改原有样式 */
.el-input.is-active .el-input__inner,
.el-input__inner:focus {
  border-color: #1a9c7d;
  outline: 0;
}
.el-select .el-input.is-focus .el-input__inner {
  border-color: #13876a;
}
.el-select .el-input__inner:focus {
  border-color: #13876a;
}
.el-select-dropdown__item.selected {
  color: grey;
  font-weight: 700;
}
.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #0b634d;
  border-color: #0b634d;
}
.el-checkbox__inner:hover {
  border-color: #0b634d;
}
.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #0b634d;
  border-color: #0b634d;
}
</style>

<style lang="scss" scoped>
.el-dialog-details {
  border-radius: 0;
  // margin: 100px;
  overflow-y:hidden;
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
  width: 800px;
}
.informationbar-right-content {
  float: right;
  background: transparent;
  height: 50px;
  width: 390px;
}
.button-group {
  height: 40px;
  border: 0;
  font-size: 15px;
  margin-top: 10px;
  border-radius: 0;
  margin-right: 5px;
  background: hsl(172, 64%, 22%);
}
.button-group:hover {
  background-color: hsl(172, 64%, 22%);
}
</style>
