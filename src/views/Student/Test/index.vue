<template>
  <div>
    <div class="title">
      <span>试卷</span>
    </div>
    <div class="test_list">
      <div class="test_box" v-for="test in testList" :key="test.id" @click="goTest(test.id)">
        <div class="content_box">
          <a>
            <div class="test_name">{{ test.name }}</div>
          </a>
          <div class="test_info">
            <span>题目数量：{{ test.topic_count }}</span>
            <br />
            <span>出卷老师：{{ test.author.name }}</span>
            <br />
            <span>试卷类型：{{ test.testtype }}</span>
          </div>
        </div>
      </div>
    </div>
    <Pagination :total="count" :size="12"></Pagination>
  </div>
</template>

<script>
import { copyObj } from "@/common/utils";
import Pagination from "@/components/Pagination/index";

export default {
  name: "student_test",
  components: {
    Pagination
  },
  data() {
    return {
      testList: [],
      count: 1
    };
  },
  watch: {
    "$route.query"() {
      this.getTestList();
    }
  },
  created() {
    this.getTestList();
  },
  methods: {
    getTestList() {
      let params;
      params = {
        is_public: true,
        page: this.$route.query.page || 1,
        page_size: 12
      };
      this.axios.get("/exam/basic_test/", { params: params }).then(resp => {
        if (resp.result) {
          this.count = resp.data.count;
          this.testList = resp.data.results;
        } else {
          this.$message.error(resp.error);
        }
      });
    },
    goTest(id) {
      this.$router.push({ name: "show_test", params: { id: id } });
    }
  }
};
</script>

<style lang="scss" scoped>
.title {
  font-size: 36px;
  margin: 18px 60px 0 70px;
}
.test_list {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 96%;
  margin: 1% 2% 0 2%;
}
.test_list :hover {
  box-shadow: 0 0 15px rgba(48, 207, 247, 0.3);
}
.test_box {
  margin: 1% 2.5%;
  width: 20%;
  height: 160px;
  box-shadow: 0 0 15px rgba(152, 152, 152, 0.3);
}
.test_box :hover {
  box-shadow: none;
}
.content_box {
  display: block;
  width: 200px;
  height: 100px;
  margin: 20px 35px;
  font-size: 20px;
  a {
    background: transparent;
    text-decoration: none;
    color: #1ea0fa;
  }
}
.test_name {
  font-size: 22px;
  color: #08304c;
  margin-bottom: 15px;
}
.test_info {
  margin-top: 3px;
  font-size: 14px;
  color: #808080;
  line-height: 21px;
  text-align: justify;
  width: 220px;
}
</style>
