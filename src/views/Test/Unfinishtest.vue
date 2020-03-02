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
                <el-radio v-model="answerList[index]" :label=choice.mark>{{ choice.mark }}: {{ choice.content }}</el-radio>
              </div>
            </div>
            <div v-else-if="topic.type == '多选题' " v-cloak>
              <el-checkbox-group v-model="answerList[index]" v-for="choice in topic.choices" :key="choice.id">
                  <el-checkbox :label=choice.mark>{{ choice.mark }}: {{ choice.content }}</el-checkbox>
              </el-checkbox-group>
            </div>
            <div v-else-if="topic.type == '判断题' ">
              <el-radio v-model="answerList[index]" label=true>True</el-radio>
              <el-radio v-model="answerList[index]" label=false>False</el-radio>
            </div>
            <div v-else-if="topic.type == '填空题' ">
              <div class="remind">
                <span>如果有多个空请用','隔开，例如(string,int)</span>
              </div>
              <el-input v-model="answerList[index]" placeholder="请输入答案" style="width:70%;margin-top:10px;"></el-input>
            </div>
            <div v-else-if="topic.type == '简答题' ">
              <el-input
                type="textarea"
                style="width: 80%"
                v-model="answerList[index]"
                :autosize="{ minRows: 8, maxRows: 16}"
                placeholder="请输入答案">
              </el-input>
            </div>
            <el-divider></el-divider>
          </div>
        </div>
        <el-button class="button-group" @click="showRemind=true">提交答案</el-button>
      </div>
    </div>

    <el-dialog
    title="提示"
    :visible.sync="showRemind"
    width="30%"
    center>
    <span>只有一次提交机会，是否确定提交。</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="showRemind=false">取消</el-button>
      <el-button type="primary" @click="handleAnswerList">确定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
import { type } from 'os';
export default {
  data () {
    return {
      testInfo: '',
      topicIdList: [],
      answerList: [],
      showRemind: false,
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
                this.$set(this.testInfo, count, resp.data)
                this.topicIdList[count] = resp.data.id
                if (resp.data.type == '多选题') {
                  this.answerList[count] = new Array()
                } else {
                  this.answerList[count] = ''
                }
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
    handleAnswerList () {
      for (let i=0; i<this.answerList.length; i++) {
        if (this.answerList[i].constructor == Array) {
          this.answerList[i] = this.answerList[i].sort()
          var str = ''
          for (let j=0; j<this.answerList[i].length; j++) {
            str += this.answerList[i][j]
          }
          this.answerList[i] = str
        }
      }
      let postFrom
      postFrom = {
        test_id: this.$route.params.id,
        topic_id: this.topicIdList,
        StudentAnswer: this.answerList
      }
      this.axios.post('/exam/finish_topic/batch_post/', postFrom).then(resp => {
        if (resp.result) {
          this.$message.success(resp.data)
          this.$router.back(-1)
        } else {
          this.$message.error(resp.error)
        }
      })
    }
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
.button-group {
  background: hsl(172, 64%, 22%);
  height: 40px;
  font-size: 15px;
  color: white;
  margin-bottom: 30px;
  position: relative;
  left: 80%;
}
.button-group:hover {
  background-color: hsl(172, 64%, 22%);
}
.remind {
  font-size: 14px;
  color: #c7c7c7;
}
</style>
