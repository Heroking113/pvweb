<template>
  <el-dialog title="单选题" center width="30%" :visible.sync="show" :before-close="handleClose">
    <div style="width:100%;height:1px; margin:20px 0 10px 0; background:#f5f5f5;"></div>
    <div>
      <label for="题目">题目：</label>
      <el-input v-model="question" style="width:89%;"></el-input>
    </div>
    <div style="width:100%;height:1px; margin:20px 0 5px 0; background:#f5f5f5;"></div>
    <label for="问题">问题：</label>
    <div v-for="n in choice_counts" :key="n" style="margin:10px 0;">
      <el-radio-group v-model="answer">
        <el-radio
          :label="choice_marks[n-1]"
          style="width:50px;color:black;"
        >{{choice_marks[n-1]}}.&nbsp;&nbsp;&nbsp;</el-radio>
      </el-radio-group>
      <el-input v-model="choice_contents[n-1]" style="width:88%;margin-left:0;"></el-input>
    </div>
    <div style="width:100%;height:1px; margin:5px 0 5px 0; background:#f5f5f5;"></div>
    <label for="提示">温馨提示：请选中正确答案的按钮再提交</label>
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
      <el-button @click="addChoice" type="primary" class="topic-button-style">添加选项</el-button>
      <el-button @click="submitThisTopic" type="primary" class="topic-button-style">提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "SingleChoice",
  inject: ["reload"],
  data() {
    return {
      show: true,
      // 题目数据
      type: "单选题",
      topic_type: "",
      question: "",
      answer: "",
      degree: "",

      choice_counts: 4,
      max_choice_counts: 8,
      choice_marks: ["A", "B", "C", "D"],
      add_choices: ["E", "F", "G", "H"],
      choice_contents: ["", "", "", ""],

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
    添加选项
    */
    addChoice() {
      if (this.choice_counts < this.max_choice_counts) {
        this.choice_marks.push(this.add_choices[this.choice_counts - 4]);
        this.choice_contents.push("");
        this.choice_counts++;
      } else {
        this.$message.warning("选项数量最多只能八项！");
      }
    },

    /* 
    提交题目
    */
    submitThisTopic() {
      /* 
      如果题目信息没有填写完整，则触发warning提醒
      */
      let submit_status = true;
      for (let i in this.choice_contents) {
        if (this.choice_contents[i] === "") {
          submit_status = false;
          break;
        }
      }
      if (
        !this.topic_type ||
        !this.question ||
        !this.answer ||
        !submit_status
      ) {
        this.$message.warning("还有内容未完成，不能提交该题目！");
      } else {
        /* 
      填写完题目信息，向后台发送数据
      */
        let title_params = {
          type: this.type,
          topic_type: this.topic_type,
          question: this.question,
          answer: this.answer,
          degree: this.degree
        };
        this.axios.post("/exam/topic/", title_params).then(resp => {
          if (resp.result) {
            for (let i = 0; i < this.choice_counts; i++) {
              let choice_params = {};
              choice_params["mark"] = this.choice_marks[i];
              choice_params["content"] = this.choice_contents[i];
              choice_params["belongs_topic"] = resp.data.id;
              this.axios.post("/exam/choice/", choice_params).then(resp => {
                if (!resp.result) {
                  this.$message.error("提交题目选项失败！");
                }
              });
            }
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

<style>
.el-radio__input.is-checked .el-radio__inner {
  border-color: #0b634d;
  background: #0b634d;
}
.el-radio__inner:hover {
  border-color: #0b634d;
}
.el-radio__input.is-checked + .el-radio__label {
  color: #0b634d;
}
</style>


<style>
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
.topic-button-style:focus {
  color: white;
  background: #0a6659;
}
</style>
