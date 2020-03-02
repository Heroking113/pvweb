<template>
  <div>
    <el-dialog
      title="增加题目"
      :visible.sync="isshow_topics"
      :before-close="handleBeforeClose"
      :center="true"
      :show-close="false"
    >
      <el-table
        height="280"
        border
        close-on-press-escape
        :data="topicList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" fixed="left" align="center"></el-table-column>
        <el-table-column prop="question" label="题目" width="300" align="center"></el-table-column>
        <el-table-column prop="answer" label="答案" width="300" align="center"></el-table-column>
        <el-table-column prop="type" label="类型" width="300" align="center"></el-table-column>
        <el-table-column prop="topic_type" label="考查范围" width="300" align="center"></el-table-column>
        <el-table-column prop="degree" label="题目难度" width="300" align="center"></el-table-column>
        <el-table-column prop="is_public" label="是否公开" width="300" align="center"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addTopics" type="primary" class="button-group">添加</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  inject: ["reload"],
  name: "AddTopics",
  props: {
    testid: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      isshow_topics: false,
      topicList: [],
      pitchedTopicIds: []
    };
  },
  created() {
    this.getTopicList();
  },
  watch: {
    testid() {
      this.isshow_topics = true;
    }
  },
  methods: {
    /* 
    处理复选框选中的情况
    */
    handleSelectionChange(val) {
      for (let i = 0; i < val.length; i++) {
        this.pitchedTopicIds[i] = val[i].id;
      }
    },
    /* 
    监听关闭按钮
    */
    handleBeforeClose() {
      this.reload();
    },
    /* 
    添加题目
    */
    addTopics() {
      if (this.pitchedTopicIds.length === 0) {
        this.$message.warning("请选择想要添加到试卷的题目！");
      } else {
        let params = {
          test_id: this.testid,
          topic_id: this.pitchedTopicIds
        };
        this.axios
          .post("/exam/topic/add_topics_in_test/", params)
          .then(resp => {
            if (resp.result) {
              this.$message.success("给试卷添加题目成功！");
              this.isshow_topics = false;
              this.reload();
            } else {
              this.$message.error(resp.error);
            }
          });
      }
    },
    /* 
    获取题目列表
    */
    getTopicList() {
      this.axios.get("/exam/topic/").then(resp => {
        if (resp.result) {
          this.topicList = resp.data.results || [];
          /*
          重新赋予”题目公开的标识“
          */
          for (let i = 0; i < this.topicList.length; i++) {
            if (this.topicList[i].is_public) {
              this.topicList[i].is_public = "公开";
            } else {
              this.topicList[i].is_public = "未公开";
            }
          }
        } else {
          this.topicList = [];
          this.$message.error(resp.error);
        }
      });
    }
  }
};
</script>

<style scoped>
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