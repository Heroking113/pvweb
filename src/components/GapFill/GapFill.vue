<template>
  <el-dialog title="填空题" :visible.sync="show" width="30%" center :before-close="handleClose">
    <div @click="editAnswer">
      <div style="width:100%;height:1px; margin:10px 0; background:#f5f5f5;"></div>
      <div>
        <label for="题目">请编辑题目：</label>
        <div class="edit-matter">
          <textarea v-model="question" name="question" id="question" rows="6" placeholder></textarea>
        </div>
        <label for="提示">(温馨提示：在想要设空的地方敲击空格键即可!)</label>
      </div>
      <div style="width:100%;height:1px; margin:20px 0 5px 0; background:#f5f5f5;"></div>
      <div v-show="edit_answer">
        <label for="答案">
          请按照设空的顺序依次输入答案:
          <br />
        </label>
        <ol v-for="(item,index) in empties" :key="index" ref="answers" :model="answers">
          <label for="顺序">{{item}}、</label>
          <el-input v-model="answers[item-1]" style="width:90%;"></el-input>
        </ol>
        <div style="width:100%;height:1px; margin:20px 0 5px 0; background:#f5f5f5;"></div>
      </div>

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
      <el-button @click="submitThisTopic" class="topic-button-style">提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "GapFill",
  inject: ["reload"],
  data() {
    return {
      show: true,
      // 题目数据
      type: "填空题",
      topic_type: "",
      question: "",
      answer: "",
      degree: "",
      edit_answer: false,

      order: 0,
      empties: [],
      answers: [],

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
      ],
      values: []
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
    order() {
      this.edit_answer = true;
    }
  },
  methods: {
    /*
    关闭按钮
    */
    handleClose() {
      this.show = !this.show;
    },
    /*  
    给问题设空
    */
    setNull() {
      this.question += "__";
    },

    /*  
    鼠标点击题目框以外的区域:生成答案编辑框
    */
    editAnswer() {
      if (!this.order) {
        var out_question = document.getElementById("question");
        if (out_question) {
          if (!out_question.contains(event.target)) {
            for (let i = 0; i < this.question.length; i++) {
              if (
                this.question[i] === "_" &&
                this.question[i - 1] !== "_" &&
                this.question[i - 1] !== " "
              ) {
                this.order += 1;
                this.empties.push(this.order.toString());
              }
            }
          }
        }
      }
    },

    /* 
    提交题目数据
    */
    submitThisTopic() {
      /* 
      去掉问题字符串中的空格
      */
      this.question = this.question.replace(/\s*/g, "");

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
      if (!this.topic_type || !this.question || !this.answer || !this.degree) {
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
            this.$message.success("题目提交成功！");
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

<style lang="scss">
.el-input__inner:focus {
  border: 1px solid #0e5e45;
}
.el-select .el-input.is-focus .el-input__inner {
  border: 1px solid #0e5e45;
  border-radius: 5px;
}
.el-select-dropdown__item.selected {
  color: grey;
  font-weight: 700;
}
textarea {
  resize: none;
  width: 99%;
  // border: 1px solid ;
  border-radius: 5px;
  padding: 5px;
  outline: none;
  border-color: #0e5e45;
}

.edit-matter {
  margin: 10px 10px 10px 4px;
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
