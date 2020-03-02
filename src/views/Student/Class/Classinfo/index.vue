<template>
  <div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="试卷" name="tests">
        <div class="list">
          <div class="box" v-for="test in testList" :key="test.id" @click="goTest(test)">
            <div class="content_box">
              <a><div class="name">{{ test.name }}</div></a>
              <div class="info">
                <span>试卷类型：{{ test.testtype }}</span><br>
                <span>出题老师：{{ test.author.name }}</span><br>
                <template v-if="test.finish_status == true">
                  <span class="finish_span">完成情况：已完成</span>
                </template>
                <template v-else>
                  <span class="unfinish_span">完成情况：未完成</span>
                </template>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="文件管理">
        <div class="chapter_list">
          <el-table :data="chapterList" style="width: 98%" @cell-click="clickCell" highlight-current-row>
            <el-table-column label="单元名称" width="180">
              <template slot-scope="scope">
                <span>{{ scope.row.chapter_name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="创建者">
              <template slot-scope="scope">
                <span>{{ scope.row.created_by }}</span>
              </template>
            </el-table-column>
            <el-table-column label="创建时间">
              <template slot-scope="scope">
                <span>{{ scope.row.created_at }}</span>
              </template>
            </el-table-column>
            <el-table-column label="是否已经提交">
              <template v-if="isHandleFile">
                <span class="finish_span">已提交</span>
              </template>
              <template v-else>
                <span class="unfinish_span">未提交</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  inject: ["reload"],
  data () {
    return {
      testList: [],
      chapterList: [],
      activeName: 'tests',
      studentId: '',
      isshowUpFileDialog: false,
      isHandleFile: false,
    }
  },
  mounted () {
    this.getClassInfo()
    this.getChapterList()
  },
  methods: {
    /*
    获取班级信息
    */
    getClassInfo () {
      this.axios.get('/class/classinfo/' + this.$store.state.classId + '/student_tests_status/').then(resp => {
        if (resp.result) {
          this.testList = resp.data
          this.axios.get('class/classinfo/' + this.$store.state.classId).then(resp => {
          })
          let params = { class_id: this.$store.state.classId }
          this.axios.get('/files/files/', { params: params }).then(resp => {
            if (resp.result) {
              this.fileList = resp.data
            } else {
              this.$message.error('获取文件失败')
              this.$router.back(-1)
            }
          })
        } else {
          this.$router.back(-1)
        }
      })
    },
    /*
    转换
    */
    handleClick(tab, event) {},
    /*
    获取试卷界面
    */
    goTest (test) {
      if (test.finish_status == true) {
        this.$router.push({ name: 'finish_test', params: { id:test.id, student_id: this.$store.state.username } })
      } else {
        this.$router.push({ name: 'unfinish_test', params: { id:test.id } })
      }
    },
    /*
    获取单元列表
    */
    getChapterList() {
      this.axios.get("/class/chapter/?class_id=" + this.$store.state.classId).then(resp => {
        if (resp.result) {
          this.chapterList = resp.data
          for (let i=0; i<this.chapterList.length; i++) {
            this.chapterList[i].created_by = this.chapterList[i].created_by.name
            this.axios.get("/files/files/?chapter=" + this.chapterList[i].id + "&username=" + this.$store.state.username).then(resp => {
              if (resp.result) {
                if (resp.data.length) {
                  this.isHandleFile = true
                } else {
                  this.isHandleFile = false
                }
              } else {
                this.$message.error("获取完成情况失败")
              }
            })
          }
        } else {
          this.$message.error(resp.error)
        }
      })
    },
    /*
    进入单元
    */
    clickCell (row, column, cell, event) {
      this.$store.commit('setChapterID', row.id)
      this.$router.push({ name: 'studentFiles' })
    }
  }
};
</script>

<style lang="scss" scoped>
.list {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 96%;
  margin: 1% 2% 0 2%;
}
.list :hover {
  box-shadow: 0 0 15px rgba(48, 207, 247, 0.3);
}
.box {
  margin: 1% 2.5%;
  width: 20%;
  height: 160px;
  box-shadow: 0 0 15px rgba(152,152,152,0.3);
}
.box :hover {
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
.name {
  font-size: 22px;
  color: #08304c;
  margin-bottom: 15px;
}
.info {
  margin-top: 3px;
  font-size: 14px;
  color: #808080;
  line-height: 21px;
  text-align: justify;
  width: 220px;
}
.finish_span {
  color:#2cfa60;
}
.unfinish_span {
  color:#ec3939
}
.chapter_list {
  margin-left: 20px;
  margin-top: 20px;
}
</style>
