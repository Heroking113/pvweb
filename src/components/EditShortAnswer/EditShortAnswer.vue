<template>
  <el-dialog title="简答题" :visible.sync="shortanswer_show" :show-close="false" width="30%">
    <div style="width:100%;height:1px; margin:20px 0 10px 0; background:#0a6659;"></div>
    <label for="题目">题目：</label>
    <el-input v-model="topic_details.question" style="width:88%;"></el-input>
    <div style="width:100%;height:1px; margin:20px 0; background:transparent;"></div>
    <div>
      <label for="答案或提示" style="margin-right:15px;">
        答案或提示:
        <br />
      </label>
      <textarea
        v-model="topic_details.answer"
        name="topic_details.question"
        id="topic_details.question"
        rows="6"
        placeholder="答案或答案范围"
      ></textarea>
    </div>
    <div style="width:100%;height:1px; margin:20px 0; background:transparent;"></div>
    <div>
      <label for="题目类型" style="margin-right:15px;">考察范围:</label>
      <el-select v-model="topic_details.topic_type" placeholder="请选择">
        <el-option
          v-for="item in type_options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <div style="width:100%;height:1px; margin:5px 0; background:transparent;"></div>
    <div>
      <label for="题目难度" style="margin-right:15px;">题目难度:</label>
      <el-select v-model="topic_details.degree" placeholder="请选择">
        <el-option
          v-for="item in degrees"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <div style="width:100%;height:1px; margin:20px 0; background:transparent;"></div>
    <el-button type="primary" @click="submitTopic" class="button-style">提交</el-button>
  </el-dialog>
</template>

<script>
export default {
  inject: ["reload"],
  name: "EditShortAnswer",
  props: {
    topic_details: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      shortanswer_show: false,

      // 考查范围
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
      ]
    };
  },
  watch: {
    topic_details() {
      this.shortanswer_show = true;
    }
  },
  methods: {
    /*
        提交数据
        */
    submitTopic() {
      /*
        验证数据
        */
      if (
        !this.topic_details.question ||
        !this.topic_details.answer ||
        !this.topic_details.topic_type ||
        !this.topic_details.degree
      ) {
        this.$message.warning("还有数据未完成，不能提交！");
      } else {
        /*
       发送数据
       */
        let params = {
          question: this.topic_details.question,
          answer: this.topic_details.answer,
          topic_type: this.topic_details.topic_type,
          degree: this.topic_details.degree
        };
        this.axios
          .patch("/exam/topic/" + this.topic_details.id + "/", params)
          .then(resp => {
            if (resp.result) {
              this.$message.success("更新题目成功！");
              this.shortanswer_show = !this.shortanswer_show;
              this.reload();
            } else {
              this.$message.error("更新题目失败！");
            }
          });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

<style scoped>
.button-style {
  border: 0;
  background: #0a6659;
}
textarea {
  margin-top: 5px;
  width: 97%;
  border: 1px solid #0a6659;
  outline: none;
}
#EditShortAnswer {
  overflow-y: auto;
  z-index: 1;
  width: 500px;
  max-height: 600px;
  background: #f2f2f2;
  padding: 10px;
  border: 0;
}

.center-in-center {
  position: absolute;
  margin-top: 200px;
  left: 47%;
}
</style>
