<template>
  <div>
    <div class="title">
      <span>题库</span>
      <el-button class="random_topic" @click="randomTopic">刷题模式</el-button>
    </div>
    <div class="topic_table">
      <el-table
        border
        :data="topicList"
        style="width: 100%"
        :default-sort="{prop: 'id', order: 'descending'}"
      >
        <el-table-column :show-overflow-tooltip="true" prop="question" label="题目"></el-table-column>
        <el-table-column prop="type" label="题型" sortable width="180"></el-table-column>
        <el-table-column prop="degree" label="难度" sortable width="180"></el-table-column>
        <el-table-column prop="topic_type" label="出题类型" sortable width="180"></el-table-column>
        <el-table-column prop="author.name" label="出题老师" sortable width="180"></el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="topicInfo(scope.row)" type="text" size="medium">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <Pagination :total="count"></Pagination>
    </div>

    <el-dialog title="题目详情" :visible.sync="dialogVisible" width="900px">
      <div class="question">
        <span style="font-size:20px;">题目：</span>
        <br />
        <pre style="font-size:18px">{{ topic.question }}</pre>
      </div>
      <div class="choices" v-if="choices.length">
        <template v-for="choice in choices">
          <div
            :key="choice.id"
            style="font-size: 20px; margin-left: 10px;"
          >{{ choice.mark }}：{{ choice.content }}</div>
        </template>
      </div>
      <div class="topic_basicinfo" style="margin-top: 30px">
        <span>题型：{{ topic.type }}</span>
        <span>题目难度：{{ topic.degree}}</span>
        <span>出题老师：{{ author.name }}</span>
        <span>出题类型：{{ topic.topic_type }}</span>
      </div>
      <div class="answer" v-if="showAnswer">
        <span style="font-size:20px">答案：</span>
        <span style="font-size:20px;">{{ topic.answer }}</span>
      </div>
      <div class="showanswer">
        <div v-if="random">
          <el-button class="button-group" style="left: 640px;" @click="clickAnswer">查看答案</el-button>
          <el-button class="button-group" style="left: 640px;" @click="randomTopic">下一题</el-button>
        </div>
        <div v-else>
          <el-button class="button-group" @click="clickAnswer">查看答案</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { copyObj } from "@/common/utils";
import Pagination from "@/components/Pagination/index";

export default {
  name: "student_topic",
  components: {
    Pagination
  },
  data() {
    return {
      topicList: [],
      topic: "",
      choices: [],
      author: "",
      dialogVisible: false,
      showAnswer: false,
      random: false,
      count: 1
    };
  },
  watch: {
    "$route.query"() {
      this.getTopic();
    }
  },
  created() {
    this.getTopic();
  },
  methods: {
    getTopic() {
      let params;
      params = {
        is_public: true,
        page: this.$route.query.page || 1,
        page_size: this.$route.query.page_size || 8
      };
      this.axios.get("/exam/topic/", { params: params }).then(resp => {
        if (resp.result) {
          this.count = resp.data.count || 0;
          this.topicList = resp.data.results || [];
        } else {
          this.$message.error(resp.error);
        }
      });
    },
    topicInfo(row) {
      this.random = false;
      this.showAnswer = false;
      this.topic = row;
      this.choices = [];
      if (row.type == "判断题") {
        if (row.answer == 1) {
          this.topic.answer = "正确";
        } else {
          this.topic.answer = "错误";
        }
      }
      this.author = row.author;
      if (row.type == '单选题', '多选题') {
        for(let i=0; i<row.choices.length; i++) {
          this.choices[i] = row.choices[row.choices.length - i - 1]
        }
      } else {
        this.choices = row.choices;
      }
      this.dialogVisible = true;
    },
    clickAnswer() {
      this.showAnswer = true;
    },
    randomTopic() {
      this.axios.get("/exam/topic/random/").then(resp => {
        if (resp.result) {
          this.random = true;
          this.showAnswer = false;
          this.topic = resp.data;
          this.author = resp.data.author;
          this.choices = resp.data.choices;
          if (resp.data.type == "判断题") {
            if (resp.data.answer == 1) {
              this.topic.answer = "正确";
            } else {
              this.topic.answer = "错误";
            }
          }
          this.dialogVisible = true;
        } else {
          this.$message.error(resp.error);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.title {
  font-size: 36px;
  margin: 10px 20px;
}
.random_topic {
  float: right;
  margin: 10px 30px 0 0;
  background: hsl(172, 64%, 22%);
  color: white;
  height: 40px;
  font-size: 15px;
}
.topic_table {
  margin: 20px 10px;
}
.topic_basicinfo span {
  margin-right: 60px;
  font-size: 16px;
}
.button-group {
  height: 40px;
  font-size: 15px;
  margin-top: 20px;
  background: hsl(172, 64%, 22%);
  color: white;
  position: relative;
  left: 720px;
}
.button-group:hover {
  background-color: hsl(172, 64%, 22%);
}
.answer {
  margin-top: 30px;
}
</style>
