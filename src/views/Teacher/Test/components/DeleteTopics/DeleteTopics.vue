<template>
  <div>
    <el-dialog
      title="删减题目"
      :visible.sync="isshow_dialog"
      :center="true"
      :show-close="false"
    >
      <el-table
        height="280"
        border
        :data="thisTestDetail.contains_topics"
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
        <el-button @click="deleteTopics" type="primary" class="button-group">删除</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  inject: ["reload"],
  name: "DeleteTopics",
  props: {
    thisTestDetail: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isshow_dialog: false,
      topic_id: [],
      test_id: 0
    };
  },
  watch: {
    thisTestDetail() {
      this.isshow_dialog = true;
      for(let i=0;i<this.thisTestDetail.contains_topics.length;i++){
        if(this.thisTestDetail.contains_topics[i].is_public===true){
          this.thisTestDetail.contains_topics[i].is_public='公开';
        }else{
          this.thisTestDetail.contains_topics[i].is_public='未公开';
        }
      }
      this.test_id = this.thisTestDetail.id;
    }
  },
  methods: {
    /* 
    处理复选框选中事件
    */
    handleSelectionChange(val) {
      for (let i = 0; i < val.length; i++) {
        this.topic_id[i] = val[i].id;
      }
    },
    /*
    删除
    */
    deleteTopics() {
      this.$confirm("确认从改试卷中删除这批题目吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let params = {
          test_id: this.test_id,
          topic_id: this.topic_id
        };
        this.axios
          .post("/exam/topic/bacth_destroy_from_test/", params)
          .then(resp => {
            if (resp.result) {
              this.$message.success("题目删除成功！");
              this.isshow_dialog = false;
              this.reload();
            } else {
              this.$message.error(resp.error);
            }
          });
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
