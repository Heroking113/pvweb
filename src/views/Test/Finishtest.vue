<template>
  <div class="body-bg">
    <div class="test-content">
      <div class="box">
        <div class="test-name">
          <span style="color: #5A83E5;">{{ testInfo.name }}</span>
        </div>
        <div class="test-topic" v-for="(topic, index) in testInfo.contains_topics" :key="topic.id">
          <el-divider></el-divider>
          <pre style="font-size: 20px;">{{ index + 1 }}. {{ topic.question }}</pre>
          <div class="answer-area">
            <div v-if="topic.type == '单选题' " v-cloak>
              <div v-for="choice in topic.choices" :key="choice.id">
                <el-radio v-model="topic.StudentAnswer" :label=choice.mark disabled>{{ choice.mark }}: {{ choice.content }}</el-radio>
              </div>
            </div>
            <div v-else-if="topic.type == '多选题' " v-cloak>
              <el-checkbox-group v-model="topic.StudentAnswer" v-for="choice in topic.choices" :key="choice.id">
                <el-checkbox :label=choice.mark disabled>{{ choice.mark }}: {{ choice.content }}</el-checkbox>
              </el-checkbox-group>
            </div>
            <div class="compareAnswer" style="margin-top: 20px;">
              <template v-if="topic.type == '简答题'">
                <div class="studentAnswer" style="margin-top: 10px;">
                  <pre>学生答案：<br>{{ topic.StudentAnswer }}</pre>
                </div>
                <div class="trueAnswer" style="margin-top: 10px;">
                  <pre>正确答案：<br>{{ topic.answer }}</pre>
                </div>
              </template>
              <template v-else-if="topic.type=='判断题'">
                <div class="studentAnswer" style="margin-top: 10px;">
                  <span v-if="topic.StudentAnswer == '1'">学生答案：True</span>
                  <span v-else>学生答案：False</span>
                </div>
                <div class="trueAnswer" style="margin-top: 10px;">
                  <span v-if="topic.answer == '1'">正确答案：True</span>
                  <span v-else>正确答案：False</span>
                </div>
              </template>
              <template v-else>
                <div class="studentAnswer" style="margin-top: 10px;">
                  <span>学生答案：{{ topic.StudentAnswer }}</span>
                </div>
                <div class="trueAnswer" style="margin-top: 10px;">
                  <span>正确答案：{{ topic.answer }}</span>
                </div>
              </template>
              <div v-if="topic.type != '简答题'" class="answerResult" style="margin-top: 10px;">
                <span v-if="topic.TrueOrFalse == true" style="color:#2cfa60">正确</span>
                <span v-else style="color:#ec3939">错误</span>
              </div>
            </div>
            <el-divider></el-divider>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      testInfo: {},
      showAnswer: [],
    }
  },
  mounted () {
    this.getStudentAnswer()
  },
  methods: {
    getStudentAnswer () {
      this.axios.get('/exam/basic_test/' + this.$route.params.id + '/').then(resp => {
        if (resp.result) {
          this.testInfo = resp.data
          for (var i in this.testInfo.contains_topics) {
            let count = i
            this.axios.get('/exam/topic/' + this.testInfo.contains_topics[i].id + '/').then(resp => {
              if (resp.result) {
                this.testInfo.contains_topics[count] = resp.data
                this.showAnswer[count] = false
                this.$set(this.testInfo, count, resp.data)
              } else {
                this.$message.error(resp.error)
              }
            })
          }
          let params = { username: this.$route.params.student_id, test_id: this.$route.params.id }
          this.axios.get('/exam/finish_topic/', { params: params }).then(resp => {
            if (resp.result) {
              for (let i=0; i<resp.data.length; i++) {
                this.testInfo[i].StudentAnswer = resp.data[i].StudentAnswer
                this.testInfo[i].TrueOrFalse = resp.data[i].TrueOrFalse
                this.$set(this.testInfo[i], i, null)
              }
            } else {
              this.$message.error('获取信息失败！')
            }
          })
        } else {
          this.$message.error('访问失败！')
          this.$router.back(-1)
        }
      })
      this.$forceUpdate()
    },
  },
  beforeCreate: function() {
      document.getElementsByTagName("body")[0].className="bg";
  },
  beforeDestroy: function() {
      document.body.removeAttribute("class","bg");
  }
};
</script>

<style lang="scss" scoped>
.body-bg {
  background-color: #F3F6FA;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow-y: auto;
}
.test-content {
  width: 920px;
  padding-top: 80px;
  padding-bottom: 80px;
  background-size: 910px 144px;
  margin: 0 auto;
}
.box {
  box-shadow: 0px 1px 6px 0px rgba(205,220,245,1);
  background: rgba(256,256,256,1);
  height: 100%;
}
.test-name {
  text-align: center;
  font-size: 32px;
  padding-top: 40px;
  padding-bottom: 10px;
}
.test-topic {
  margin: 40px 80px;
  font-size: 20px;
  font-weight: bold;
  
}
.answer-area {
  font-size: 18px;
  font-weight: normal;
}
.answer {
  margin: 20px 0;
}
.button-group {
  background: hsl(172, 64%, 22%);
  height: 40px;
  font-size: 15px;
  color: white;
}
.button-group:hover {
  background-color: hsl(172, 64%, 22%);
}
.compareAnswer {
  font-size: 16px;
}
</style>
