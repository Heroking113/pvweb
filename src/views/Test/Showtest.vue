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
                <span>{{ choice.mark }}:&nbsp;&nbsp;{{ choice.content }}</span>
              </div>
            </div>
            <div v-else-if="topic.type == '多选题' " v-cloak>
              <div v-for="choice in topic.choices" :key="choice.id">
                <span>{{ choice.mark }}:&nbsp;&nbsp;{{ choice.content }}</span>
              </div>
            </div>
            <div v-else-if="topic.type == '判断题' ">
              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;True&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;False</span>
            </div>
            <div v-else-if="topic.type == '填空题' ">
              <span>答案是________</span>
            </div>
            <div v-else-if="topic.type == '简答题' ">
              <el-input
                type="textarea"
                style="width: 80%"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入答案">
              </el-input>
            </div>
            <div class="answer" v-if="showAnswer[index]">
              <span>答案：</span>
              <template v-if="topic.type == '判断题'">
                <template v-if="topic.answer == 1">
                  <span>True</span>
                </template>
                <template v-else>
                  <span>False</span>
                </template>
              </template>
              <template v-else><span>{{ topic.answer }}</span></template>
            </div>
            <div v-else class="answer">
              <el-button class="button-group" @click="getAnswer(index)">查看答案</el-button>
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
      testInfo: '',
      topicIdList: [],
      showAnswer: [],
    }
  },
  mounted () {
    this.getTest()
  },
  methods: {
    getTest () {
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
        } else {
          this.$message.error('访问失败！')
          this.$router.back(-1)
        }
      })
      this.$forceUpdate()
    },
    getAnswer (index) {
      this.showAnswer[index] = true
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
</style>
