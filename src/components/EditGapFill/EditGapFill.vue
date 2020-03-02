<template>
  <div @click="editAnswer">
    <el-dialog title="填空题" :visible.sync="editgap_show" :show-close="false" center width="30%">
      <div style="width:100%;height:1px; margin:20px 0 10px 0; background:#0a6659;"></div>
      <label for="题目">
        题目(设空的地方直接敲击空格即可)：
        <br />
      </label>
      <div>
        <textarea
          class="edit-matter"
          v-model="gapfill_topic_details.question"
          name="gapfill_topic_details.question"
          id="set_question"
          rows="6"
        ></textarea>
      </div>
      <div>
        <label for="答案">请按照设空的顺序依次输入答案</label>
        <ol v-for="(item,index) in answers" :key="index" ref="answers" :model="answers">
          <label for="顺序">{{index+1}}、&nbsp;&nbsp;&nbsp;</label>
          <el-input v-model="answers[index]" style="width:54%;"></el-input>
        </ol>
      </div>
      <div style="margin:20px 0;">
        <label for="题目类型" style="margin-right:15px;">考察范围:</label>
        <el-select v-model="gapfill_topic_details.topic_type" placeholder="请选择" style="width:50%;">
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
        <el-select v-model="gapfill_topic_details.degree" placeholder="请选择" style="width:50%;">
          <el-option
            v-for="item in degrees"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitTopic" class="button-style">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  inject: ["reload"],
  name: "EditGapFill",
  props: {
    gapfill_topic_details: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editgap_show: false,
      base_answer: [],
      answers: [],
      answer: "",
      is_edit_answer: true,

      // 考察范围
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
  created() {
    let _this = this;
    document.onkeydown = function(e) {
      let key = event.keyCode || window.event.keyCode;
      /*
      敲击空格调用“setNull”函数 
      */
      if (key == 32) {
        _this.setNull();
      }
    };
  },
  watch: {
    gapfill_topic_details() {
      this.base_answer = this.gapfill_topic_details.answer.split(",");
      this.editgap_show = true;
    }
  },
  methods: {
    /*
    提交数据
      */
    submitTopic() {
      /* 
    去掉问题字符串中的空格
    */
      this.gapfill_topic_details.question = this.gapfill_topic_details.question.replace(
        /\s*/g,
        ""
      );

      /* 
      拼接answer字符串，每个空的答案以逗号“,”分隔开
      */
      if (this.answers.length === 1) {
        this.answer = this.answers[0];
      } else {
        for (let i = 0; i < this.answers.length; i++) {
          if (i === this.answers.length - 1) {
            this.answer += this.answers[i];
          } else {
            this.answer += this.answers[i] + ",";
          }
        }
      }

      /* 
      如果题目信息没有填写完整，则触发warning提醒
      */
      if (
        !this.gapfill_topic_details.topic_type ||
        !this.gapfill_topic_details.question ||
        !this.gapfill_topic_details.answer ||
        !this.gapfill_topic_details.degree
      ) {
        this.$message.warning("还有内容未完成，不能提交该题目！");
      } else {
        /* 
      填写完题目信息，向后台发送数据
      */
        let params = {
          topic_type: this.gapfill_topic_details.topic_type,
          question: this.gapfill_topic_details.question,
          answer: this.answer,
          degree: this.gapfill_topic_details.degree
        };
        this.axios
          .patch("/exam/topic/" + this.gapfill_topic_details.id + "/", params)
          .then(resp => {
            if (resp.result) {
              this.$message.success("题目更新成功！");
              this.editgap_show = !this.editgap_show;
              this.reload();
            } else {
              this.$message.error("题目更新失败！");
            }
          });
      }
    },

    /*  
    给问题设空
    */
    setNull() {
      this.gapfill_topic_details.question += "__";
    },
    /*  
    鼠标点击题目框以外的区域:生成答案编辑框
    */
    editAnswer() {
      if (this.is_edit_answer === true) {
        var out_question = document.getElementById("set_question");
        if (out_question) {
          if (!out_question.contains(event.target)) {
            for (
              let i = 0;
              i < this.gapfill_topic_details.question.length;
              i++
            ) {
              if (
                this.gapfill_topic_details.question[i] === "_" &&
                this.gapfill_topic_details.question[i - 1] !== "_" &&
                this.gapfill_topic_details.question[i - 1] !== " "
              ) {
                this.answers.push("");
              }
            }
            let min_length =
              this.base_answer.length < this.answers.length
                ? this.base_answer.length
                : this.answers.length;
            for (let i = 0; i < min_length; i++) {
              this.answers[i] = this.base_answer[i];
            }
            this.is_edit_answer = false;
          } else {
            this.is_edit_answer = true;
          }
        }
      }
    }
  }
};
</script>

<style scoped>
textarea {
  border: 1px solid #0a6659;
  outline: none;
}
.button-style {
  border: 0;
  background: #0a6659;
  border-radius: 0;
}
.edit-matter {
  margin-top: 5px;
  width: 95%;
}
.center-in-center {
  position: absolute;
  margin-top: 200px;
  left: 47%;
}
</style>
