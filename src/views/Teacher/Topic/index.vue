<template>
  <div>
    <!-- 按钮功能栏 -->
    <div class="button-bar">
      <div class="informationbar-left-content">
        <el-button
          type="primary"
          @click="deleteInBatches"
          class="button-group"
          style="margin-right:0px;"
        >批量删除题目</el-button>
        <el-button
          type="primary"
          @click="publicityTopics"
          class="button-group"
          style="margin-right:0px;"
        >批量设置题目公开</el-button>
        <el-button type="primary" @click="privatyTopics" class="button-group">批量取消题目公开</el-button>
      </div>
      <div class="informationbar-right-content">
        <el-button
          @click="downloadTemplate"
          type="primary"
          class="button-group"
          style="float:left;"
        >下载出题模板</el-button>
        <div
          style="float:left;background:transparent; margin-bottom:0; margin-right: 80px; width:60px"
        >
          <el-upload
            action="/exam/topic/register_topic_in_excel/"
            accept=".xlsx, .xlsm, .xls"
            :headers="{'X-CSRFToken': csrfToken}"
            :show-file-list="false"
            :on-success="handleUpload"
          >
            <el-button type="primary" class="button-group">题目批量上传</el-button>
          </el-upload>
        </div>
        <div>
          <el-dropdown class="new-topic">
            <span class="el-dropdown-link">
              新建题目
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown" style="border-radius:0;margin-left:273px;">
              <el-button @click="singleType" class="question-type">单选题</el-button>
              <el-button @click="multipleType" class="question-type">多选题</el-button>
              <el-button @click="trueFalseType" class="question-type">判断题</el-button>
              <el-button @click="gapFillType" class="question-type">填空题</el-button>
              <el-button @click="shortAnswerType" class="question-type">简答题</el-button>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>

    <div style="width:100%;height:1px; background:#E0E0E0; margin:1px 0 10px 0;"></div>

    <!-- 主要内容显示部分 -->
    <div>
      <!-- 题目列表 -->
        <el-table
          :data="topic_list_show"
          v-model="topic_list_show"
          border
          :height="tableHeight"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" fixed="left" align="center"></el-table-column>
          <el-table-column prop="question" label="题目" width="300" align="center"></el-table-column>
          <el-table-column prop="answer" label="答案" width="300" align="center"></el-table-column>
          <el-table-column prop="is_public" label="是否公开" width="300" align="center"></el-table-column>
          <el-table-column prop="type" label="类型" width="300" align="center"></el-table-column>
          <el-table-column prop="topic_type" label="考查范围" width="300" align="center"></el-table-column>
          <el-table-column prop="degree" label="题目难度" width="300" align="center"></el-table-column>
          <el-table-column prop="created_at" label="更新时间" width="300" align="center"></el-table-column>
          <el-table-column fixed="right" label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                class="list-operation-button"
                @click="viewDetails(scope.$index, scope.row)"
              >查看详情</el-button>
              <!-- 编辑题目的接口暂停开放 -->
              <!-- <el-button
                size="mini"
                type="primary"
                class="list-operation-button"
                @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button> -->
              <el-button
                size="mini"
                type="primary"
                class="list-operation-button"
                @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>

      <!-- 题目详情页 -->
      <el-dialog
        style="width:1500px"
        title="题目详情"
        :visible.sync="isshow_this_topic_detail"
        center
        :show-close="false"
      >
        <span>题目类型：&nbsp;&nbsp;{{this_topic_detail.type}}</span>
        <br />
        <br />
        <span>问题：&nbsp;&nbsp;{{this_topic_detail.question}}</span>
        <br />
        <br />
        <div v-show="is_choice_topic" v-for="(item, index) in this_topic_choice_mark" :key="index">
          <span>{{this_topic_choice_mark[index]}}:&nbsp;&nbsp;{{this_topic_choice_content[index]}}</span>
          <br />
          <br />
        </div>
        <span>答案：&nbsp;&nbsp;{{this_topic_detail.answer}}</span>
        <br />
        <br />
        <span>考察范围：&nbsp;&nbsp;{{this_topic_detail.topic_type}}</span>
        <br />
        <br />
        <span>难度：&nbsp;&nbsp;{{this_topic_detail.degree}}</span>
        <br />
        <br />
        <span>是否公开：&nbsp;&nbsp;{{this_topic_detail.is_public}}</span>
        <br />
        <br />
        <span>题目创建时间：&nbsp;&nbsp;{{this_topic_detail.created_at}}</span>
        <br />
        <br />
        <span>题目更新时间：&nbsp;&nbsp;{{this_topic_detail.updated_at}}</span>
      </el-dialog>

      <!-- 编辑题目 -->
      <div style="z-index:22;">
        <transition name="el-zoom-in-top">
          <EditSingle
            v-show="edit_show.single_show"
            v-bind:topic_details="topic_detail.single_topic"
            v-bind:base_choices="choice_contents"
          ></EditSingle>
        </transition>
        <transition name="el-zoom-in-top">
          <EditMultiple
            v-show="edit_show.multiple_show"
            v-bind:topic_details="topic_detail.multiple_topic"
            v-bind:base_choices="choice_contents"
          ></EditMultiple>
        </transition>
        <transition name="el-zoom-in-top">
          <EditTrueFalse
            v-show="edit_show.truefalse_show"
            v-bind:topic_details="topic_detail.truefalse_topic"
          ></EditTrueFalse>
        </transition>
        <transition name="el-zoom-in-top">
          <EditGapFill
            v-show="edit_show.gapfill_show"
            v-bind:gapfill_topic_details="topic_detail.gapfill_topic"
          ></EditGapFill>
        </transition>
        <transition name="el-zoom-in-top">
          <EditShortAnswer
            v-show="edit_show.shortanswer_show"
            v-bind:topic_details="topic_detail.shortanswer_topic"
          ></EditShortAnswer>
        </transition>
      </div>

      <!-- 新建题目 -->
      <div style="width:70%; height:100%; background:#0c915a;margin-left:15%; z-index:33;">
        <transition name="el-zoom-in-center">
          <SingleChoice v-if="question_type.single_show"></SingleChoice>
        </transition>
        <transition name="el-zoom-in-center">
          <MultipleChoice v-if="question_type.mulitple_show"></MultipleChoice>
        </transition>
        <transition name="el-zoom-in-center">
          <TrueOrFalse v-if="question_type.true_false_show"></TrueOrFalse>
        </transition>
        <transition name="el-zoom-in-center">
          <ShortAnswer v-if="question_type.short_answer_show"></ShortAnswer>
        </transition>
        <transition name="el-zoom-in-center">
          <GapFill v-if="question_type.gap_fill_show"></GapFill>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
//调用编辑题目的组件
import EditSingle from "../../../components/EditSingle/EditSingle.vue";
import EditMultiple from "../../../components/EditMultiple/EditMultiple.vue";
import EditTrueFalse from "../../../components/EditTrueFalse/EditTrueFalse.vue";
import EditGapFill from "../../../components/EditGapFill/EditGapFill.vue";
import EditShortAnswer from "../../../components/EditShortAnswer/EditShortAnswer.vue";

// 调用新建题目的组件
import SingleChoice from "../../../components/SingleChoice/SingleChoice.vue";
import MultipleChoice from "../../../components/MultipleChoice/MultipleChoice.vue";
import TrueOrFalse from "../../../components/TrueOrFalse/TrueOrFalse.vue";
import ShortAnswer from "../../../components/ShortAnswer/ShortAnswer.vue";
import GapFill from "../../../components/GapFill/GapFill.vue";

import Cookies from "js-cookie";
export default {
  inject: ["reload"],
  data() {
    return {
      // 设置表格高度
      tableHeight:0,
      // 题目批量操作
      pitched: [],
      // 题目单个操作
      this_topic_detail: {},
      this_topic_choice_mark: [],
      this_topic_choice_content: [],
      this_topic: 0,
      isshow_this_topic_detail: false,
      checkboxs: [],
      topic_list_show: [],
      choice_content: [],
      is_choice_topic: false,

      topic_detail: {
        single_topic: {},
        multiple_topic: {},
        gapfill_topic: {},
        shortanswer_topic: {},
        truefalse_topic: {}
      },
      edit_show: {
        single_show: false,
        multiple_show: false,
        gapfill_show: false,
        truefalse_show: false,
        shortanswer_show: false
      },
      choice_contents: [],

      downtemplate: "",
      question_type: {
        single_show: false,
        mulitple_show: false,
        true_false_show: false,
        short_answer_show: false,
        gap_fill_show: false
      },
      topic_order: 0
    };
  },
  components: {
    EditSingle,
    EditMultiple,
    EditTrueFalse,
    EditGapFill,
    EditShortAnswer,

    SingleChoice,
    MultipleChoice,
    TrueOrFalse,
    ShortAnswer,
    GapFill
  },
  computed: {
    csrfToken() {
      return Cookies.get("csrftoken");
    }
  },
  created() {
    this.getTopicList();
     // 获取屏幕高度，让浏览器高度自适应屏幕大小
   this.tableHeight = window.innerHeight-120;
  },
  watch: {
    // 如果 `clientHeight` 发生改变，这个函数就会运行
    clientHeight: function() {
      this.changeFixed(this.clientHeight);
    }
  },
  methods: {
    /*
    批量公开题目
    */
    publicityTopics() {
      if (Object.keys(this.pitched).length === 0) {
        this.$message.warning("请先选择你要公开的题目！");
      } else {
        this.$confirm("确认公开这批题目吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let public_topic_ids = [];
          for (let i = 0; i < Object.keys(this.pitched).length; i++) {
            public_topic_ids.push(this.pitched[i].id);
          }
          let params = {
            public_id: public_topic_ids
          };
          this.axios.post("/exam/topic/set_public/", params).then(resp => {
            if (resp.result) {
              this.$message.success("题目公开成功！");
              this.reload();
            } else {
              this.$message.error("题目公开失败！");
            }
          });
        });
      }
    },

    /*
   批量取消公开题目
   */
    privatyTopics() {
      if (Object.keys(this.pitched).length === 0) {
        this.$message.warning("请先选择你要取消公开的题目！");
      } else {
        this.$confirm("确认取消公开这批题目吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let private_topic_ids = [];
          for (let i = 0; i < Object.keys(this.pitched).length; i++) {
            private_topic_ids.push(this.pitched[i].id);
          }
          let params = {
            public_id: private_topic_ids
          };
          this.axios.post("/exam/topic/reset_public/", params).then(resp => {
            if (resp.result) {
              this.$message.success("取消题目公开成功！");
              this.reload();
            } else {
              this.$message.error("取消题目公开失败！");
            }
          });
        });
      }
    },
    /*
   批量删除题目
   */
    deleteInBatches() {
      if (Object.keys(this.pitched).length === 0) {
        this.$message.warning("请先选择你要删除的题目！");
      } else {
        this.$confirm("确认删除这批题目吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let is_successfully_delete = true;
          for (let i = 0; i < Object.keys(this.pitched).length; i++) {
            this.axios
              .delete("/exam/topic/" + this.pitched[i].id)
              .then(resp => {
                if (resp.result === false) {
                  is_successfully_delete = false;
                  this.$message.error("题目删除失败！");
                }
              });
          }
          if (is_successfully_delete === true) {
            this.$message.success("题目删除成功！");
            this.reload();
          }
        });
      }
    },

    /*
    获取被选中的题目信息
    */
    handleSelectionChange(val) {
      this.pitched = val;
    },
    /* 
    查看题目详情，同时给选择题的选项排序，不然选项顺序是乱的
    */
    viewDetails(index, row) {
      this.this_topic_choice_mark = [];
      this.this_topic_choice_content = [];
      this.this_topic_detail = row;
      this.this_topic = index;
      for (let i = 0; i < Object.keys(this.choice_content[index]).length; i++) {
        this.this_topic_choice_mark.push(String.fromCharCode(65 + i));
      }
      for (let j = 0; j < Object.keys(this.choice_content[index]).length; j++) {
        this.this_topic_choice_content.push(
          this.choice_content[index][this.this_topic_choice_mark[j]]
        );
      }
      this.isshow_this_topic_detail = true;
      if (row.type === "单选题" || row.type === "多选题") {
        this.is_choice_topic = true;
      } else {
        this.is_choice_topic = false;
      }
    },
    /* 
    重新编辑题目
    */
    handleEdit(index, row) {
      this.choice_contents = row.choices;
      if (row.type === "单选题") {
        this.topic_detail.single_topic = row;
        this.edit_show.single_show = true;
      } else if (row.type === "多选题") {
        this.topic_detail.multiple_topic = row;
        this.edit_show.multiple_show = true;
      } else if (row.type === "填空题") {
        this.topic_detail.gapfill_topic = row;
        this.edit_show.gapfill_show = true;
      } else if (row.type === "判断题") {
        this.topic_detail.truefalse_topic = row;
        this.edit_show.truefalse_show = true;
      } else if (row.type === "简答题") {
        this.topic_detail.shortanswer_topic = row;
        this.edit_show.shortanswer_show = true;
      }
    },
    /*
    删除题目
    */
    handleDelete(index, row) {
      //删除题目
      this.$confirm("确认删除该题目吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.axios
            .delete("/exam/topic/" + this.topic_list_show[index].id)
            .then(resp => {
              if (resp.result) {
                this.$message.success("删除题目成功!");
                this.reload();
              } else {
                this.$message.error("删除题目失败！");
              }
            });
        })
        .catch(() => {
          this.$message.info("已取消删除!");
        });
    },
    /* 
    获取题目列表
    */
    getTopicList() {
      this.axios.get("/exam/topic?username=" + this.$store.state.username).then(resp => {
        if (resp.result) {
          this.topic_list_show = resp.data.results;
          /*
          重新赋予”题目公开的标识“
          */
          for (let i = 0; i < Object.keys(this.topic_list_show).length; i++) {
            if (this.topic_list_show[i].is_public) {
              this.topic_list_show[i].is_public = "公开";
            } else {
              this.topic_list_show[i].is_public = "未公开";
            }
          }

          this.sortOptions(this.topic_list_show);
        } else {
          this.$message.error("请求题目列表出错！");
        }
      });
    },
    /* 
    获取选项内容并整理选项顺序
    */
    sortOptions(Obj) {
      let topic_choices = [];
      let mark_conent = {};
      for (let i = 0; i < Obj.length; i++) {
        topic_choices.push(Obj[i].choices);
      }
      for (let i = 0; i < topic_choices.length; i++) {
        for (let j = 0; j < topic_choices[i].length; j++) {
          mark_conent[topic_choices[i][j].mark] = topic_choices[i][j].content;
        }
        this.choice_content.push(mark_conent);
        mark_conent = {};
      }
    },
    /* 
    下载出题模板
    */
    downloadTemplate() {
      return (window.location.href =
        "http://localhost:9123/exam/topic/get_register_topic_model/");
    },

    /* 
    判断批量上传题目是否成功
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
    显示单选题
    */
    singleType() {
      for (var i in this.question_type) {
        this.question_type[i] = false;
      }
      this.question_type.single_show = true;
    },
    /* 
    显示多选题
    */
    multipleType() {
      for (var i in this.question_type) {
        this.question_type[i] = false;
      }
      this.question_type.mulitple_show = true;
    },
    /* 
    显示判断题
    */
    trueFalseType() {
      for (var i in this.question_type) {
        this.question_type[i] = false;
      }
      this.question_type.true_false_show = true;
    },
    /* 
    显示简答题
    */
    gapFillType() {
      for (var i in this.question_type) {
        this.question_type[i] = false;
      }
      this.question_type.gap_fill_show = true;
    },
    /* 
    显示填空题
    */
    shortAnswerType() {
      for (var i in this.question_type) {
        this.question_type[i] = false;
      }
      this.question_type.short_answer_show = true;
    }
  }
};
</script>

<style scoped>
.list-operation-button {
  margin: 2px;
  border: 0;
  border-radius: 0;
  color: white;
  background: #127a5b;
}
.list-operation-button:hover {
  background-color: #0a6659;
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
  background: #0a6659;
}
.el-card-style {
  padding: 0;
  z-index: 1;
  width: 450px;
  background: #ededed;
}
.list-operation-button {
  margin: 2px;
  border: 0;
  border-radius: 0;
  color: white;
  background: #0a6659;
}
.informationbar-left-content {
  float: left;
  background: transparent;
  height: 50px;
  width: 700px;
}
.informationbar-right-content {
  float: right;
  background: transparent;
  height: 50px;
  width: 390px;
}
.el-dropdown-link {
  padding-left: 5px;
  font-size: 15px;
  color: white;
  cursor: pointer;
}

/* "新建题目"旁边的那个小三角的样式  */
.el-icon-arrow-down {
  font-size: 18px;
}
.el-dropdown-menu__item {
  padding: 0 35px;
}
.el-dropdown-menu__item:hover {
  color: #13876a;
}
.question-type {
  border: 0;
  outline: 0;
  border-radius: 0;
}
.question-type:hover {
  color: white;
  background: #0a6659;
}
.question-type:focus {
  color: grey;
}
.new-topic {
  position: fixed;
  padding: 10px 8px 8px 8px;
  height: 22px;
  border: 0;
  margin-top: 10px;
  background: #0a6659;
}
.center-in-center {
  width: 25%;
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
