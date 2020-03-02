<template>
  <el-dialog title="多选题" :visible.sync="multiple_show" :show-close="false" center width="30%">
    <div style="width:100%;height:1px; margin:20px 0 10px 0; background:#0a6659;"></div>
    <label for="题目">题目：</label>
    <el-input v-model="topic_details.question" style="width:89%;"></el-input>
    <div style="width:100%;height:1px; margin:20px 0; background:transparent;"></div>
    <div>
      <label for="问题">问题：</label>
      <div v-for="n in choice_counts" :key="n" style="margin:10px 0;">
        <el-checkbox-group v-model="answers">
          <el-checkbox
            :label="base_choice_marks[n-1]"
            style=" float:left;width:50px;"
          >{{base_choice_marks[n-1]}}.</el-checkbox>
        </el-checkbox-group>
        <el-input v-model="base_choice_contents[n-1]" style="width:80%;margin-left:10px;"></el-input>
      </div>
      <div style="width:100%;height:1px; margin:10px 0; background:transparent;"></div>
    </div>
    <div style="width:100%;height:1px; margin:20px 0; background:transparent;"></div>
    <div>
      <label for="题目类型" style="whith:50%; margin-right:15px;">考察范围:</label>
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
    <el-button type="primary" @click="addChoice" class="button-style">添加选项</el-button>
    <el-button type="primary" @click="submitTopic" class="button-style">提交</el-button>
  </el-dialog>
</template>

<script>
export default {
  inject: ["reload"],
  name: "EditMultiple",
  props: {
    topic_details: {
      type: Object,
      required: true
    },
    base_choices: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      multiple_show: false,
      answers: [],
      base_choice_marks: [],
      add_choice_marks: ["E", "F", "G", "H"],
      base_choice_contents: [],
      max_choices: 8,
      choice_counts: 4,

      //提交的数据
      answer: "",
      choices: [],
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
  /*
  监测父组件的值是否传入，并在传入时作相应数据处理
  */
  watch: {
    topic_details() {
      this.choice_counts = this.base_choices.length;
      for (let i = 0; i < this.base_choices.length; i++) {
        this.base_choice_marks.push(String.fromCharCode(65 + i));
      }
      for (let i = 0; i < this.base_choice_marks.length; i++) {
        for (let j = 0; j < this.base_choices.length; j++) {
          if (this.base_choices[j].mark === this.base_choice_marks[i]) {
            this.base_choice_contents.push(this.base_choices[j].content);
          }
        }
      }
      this.multiple_show = true;
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
      let is_content_finish = true;
      for (let i = 0; i < this.base_choice_contents.length; i++) {
        if (this.base_choice_contents[i] === "") {
          is_content_finish = false;
          break;
        }
      }
      for (let i = 0; i < this.answers.length; i++) {
        this.answer += this.answers[i];
      }
      if (
        !this.topic_details.topic_type ||
        !this.topic_details.question ||
        !this.answer ||
        !is_content_finish
      ) {
        this.$message.warning("还有数据未完成，不能提交！");
      } else {
        /* 
      发送数据
      */
        let title_params = {
          type: "多选题",
          topic_type: this.topic_details.topic_type,
          question: this.topic_details.question,
          answer: this.answer,
          degree: this.topic_details.degree
        };
        this.axios
          .patch("/exam/topic/" + this.topic_details.id + "/", title_params)
          .then(resp => {
            if (resp.result) {
              for (let i = 0; i < this.base_choice_marks.length; i++) {
                let choices = {};
                choices.belongs_topic = this.topic_details.id;
                choices.mark = this.base_choice_marks[i];
                choices.content = this.base_choice_contents[i];
                if (i < 4) {
                  this.axios
                    .patch(
                      "/exam/choice/" + this.topic_details.choices[i].id + "/",
                      choices
                    )
                    .then(resp => {
                      if (!resp.result) {
                        this.$message.error("更新题目失败！");
                      }
                    });
                } else if (i > 3) {
                  this.axios.post("/exam/choice/", choices).then(resp => {
                    if (!resp.result) {
                      this.$message.error("更新题目失败！");
                    }
                  });
                }
              }
              this.$message.success("更新题目成功！");
              this.multiple_show = !this.multiple_show;
              this.reload();
            } else {
              this.$message.error("更新题目失败！");
            }
          });
      }
    },

    /* 
    添加选项
    */
    addChoice() {
      if (this.choice_counts < this.max_choices) {
        this.base_choice_marks.push(
          this.add_choice_marks[this.choice_counts - 4]
        );
        this.base_choice_contents.push("");
        this.choice_counts++;
      } else {
        this.$message.warning("选项数量最多只能为八项！");
      }
    }
  }
};
</script>

<style>
.el-checkbox__input.is-focus .el-checkbox__inner {
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
.el-checkbox__input.is-checked + .el-checkbox__label {
  color: #0b634d;
}
</style>


<style scoped>
#editMultiple {
  overflow-y: auto;
  z-index: 1;
  width: 500px;
  max-height: 600px;
  background: #f2f2f2;
  padding: 10px;
  border: 0;
}
.button-style {
  border: 0;
  background: #0a6659;
}
.center-in-center {
  position: absolute;
  margin-top: 200px;
  left: 47%;
}
</style>