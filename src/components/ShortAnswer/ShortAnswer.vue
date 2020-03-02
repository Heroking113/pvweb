
<template>
  <el-dialog title="简答题" :visible.sync="show" center width="30%" :before-close="handleClose">
    <div style="width:100%;height:1px; margin:10px 0; background:#f5f5f5;"></div>
    <div>
      <label for="题目">题目：</label>
      <el-input v-model="question" style="width:92%;"></el-input>
    </div>
    <div style="width:100%;height:1px; margin:20px 0 20px 0; background:#f5f5f5;"></div>
    <div class="edit-matter">
      <textarea v-model="answer" name="question" id="question" rows="6" placeholder="答案或答案范围"></textarea>
    </div>
    <div style="width:100%;height:1px; margin:5px 0 5px 0; background:#f5f5f5;"></div>
    <div>
      <div style="margin:20px 0;">
        <label for="题目类型" style="margin-right:15px;">考察范围:</label>
        <el-select v-model="topic_type" placeholder="请选择">
          <el-option
            v-for="item in type_options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div>
        <label for="题目难度" style="margin-right:15px;">题目难度:</label>
        <el-select v-model="degree" placeholder="请选择">
          <el-option
            v-for="item in degrees"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <!-- <el-button @click="addAttachment" class="topic-button-style">添加附件</el-button> -->
      <el-button @click="submitThisTopic" class="topic-button-style">提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "ShortAnswer",
  inject: ["reload"],
  data() {
    return {
      show: true,
      // 题目数据
      type: "简答题",
      topic_type: "",
      question: "",
      answer: "",
      degree: "",

      //  考察范围
      type_options: [
        {
          value: "数据结构",
          label: "数据结构"
        },
        {
          value: "指针",
          label: "指针"
        }
      ],
      // 题目难度
     degrees: [
        {
          value: "simple",
          label: "simple"
        },
        {
          vulue: "medium",
          label: "medium"
        },
        {
          value: "hard",
          label: "hard"
        }
      ],
    };
  },
  created() {
    var lett = this;
    document.onkeydown = function(e) {
      var key = window.event.keyCode;
      if (key == 13) {
        lett.submitThisTopic();
      }
    };
  },
  methods: {
    /*
    关闭按钮
    */
   handleClose(){
     this.show=!this.show;
   },
    /*
   提交数据
   */
    submitThisTopic() {
      /* 
      如果题目信息没有填写完整，则触发warning提醒
      */
      if (!this.topic_type || !this.question || !this.answer) {
        this.$message.warning("还有内容未完成，不能提交该题目！");
      } else {
        /* 
      填写完题目信息，向后台发送数据
      */
        let params = {
          type: this.type,
          topic_type: this.topic_type,
          question: this.question,
          answer: this.answer,
          degree: this.degree
        };
        this.axios.post("/exam/topic/", params).then(resp => {
          if (resp.result) {
            this.$message.success("提交题目成功！");
            this.show = !this.show;
            this.reload();
          } else {
            this.$message.error("题目提交失败！");
          }
        });
      }
    }
  }
};
</script>

<style scoped>
textarea {
  width: 100%;
}

.edit-matter {
  margin-top: 5px;
}
.topic-button-style {
  border: 0;
  border-radius: 0;
  color: white;
  background: #016d60;
}
.topic-button-style:hover {
  color: white;
  background: #0a6659;
}
</style>
