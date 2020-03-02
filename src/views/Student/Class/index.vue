<template>
  <div>
    <div class="title">
      <span>班级</span>
      <el-button class="search_class" @click="clickSearchClass">搜索班级</el-button>
    </div>
    <div class="class_list">
      <el-table :data="classList" style="width: 98%" @cell-click="clickCell" highlight-current-row>
        <el-table-column label="班级编号" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.class_id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="班级名称">
          <template slot-scope="scope">
            <span>{{ scope.row.classname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="上课专业">
          <template slot-scope="scope">
            <span>{{ scope.row.classmajor }}</span>
          </template>
        </el-table-column>
        <el-table-column label="负责老师">
          <template slot-scope="scope">
            <div v-for="teacher in scope.row.belongs_teachers" :key="teacher.id">
              <span>{{ teacher.name }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="搜索班级" :visible.sync="dialogSearchClass">
      <span>请输入课程编号或者课程名</span>
      <el-input v-model="searchInput" style="margin-top: 20px;"></el-input>
      <div v-if="showSearch" style="margin-top: 20px;">
        <el-table
        ref="multipleTable"
        :data="searchClassList"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="班级编号"
          width="120">
          <template slot-scope="scope">{{ scope.row.class_id }}</template>
        </el-table-column>
        <el-table-column
          label="班级名称">
          <template slot-scope="scope">{{ scope.row.classname }}</template>
        </el-table-column>
        <el-table-column
          label="上课老师"
          width="120">
          <template slot-scope="scope">{{ scope.row.belongs_teachers[0].name }}</template>
        </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="attendClass" v-if="showSearch">加 入</el-button>
        <el-button type="primary" @click="searchClass">搜 索</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  inject: ["reload"],
  data () {
    return {
      classList: [],
      dialogSearchClass: false,
      searchInput: '',
      searchClassList: [],
      showSearch: false,
    }
  },
  created () {
    this.getClassList()
  },
  methods: {
    clickSearchClass () {
      this.searchInput = ''
      this.showSearch = false
      this.dialogSearchClass = true
    },
    searchClass () {
      let params
      params = {
        search: this.searchInput
      }
      this.axios.get('/class/classinfo/', { params: params }).then(resp => {
        if (resp.result) {
          this.searchClassList = resp.data.results
          this.showSearch = true
        } else {
          this.$message.error('搜索失败')
        }
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    attendClass () {
      for (var i in this.multipleSelection) {
        let count = i
        let class_id = this.multipleSelection[i].id
        this.axios.post('/class/classinfo/add_class/', {class_id:class_id} ).then(resp => {
          if (resp.result) {
            this.$message.success('加入班级'+ this.multipleSelection[i].classname + '成功' )
            this.reload()
          } else {
            this.$message.error(resp.error)
          }
        })
      }
      this.dialogSearchClass = false
    },
    getClassList () {
      this.axios.get('/account/user_info/').then(resp => {
        if (resp.result) {
          let params
          params = {
            student: resp.data.username
          }
          this.axios.get('/class/classinfo/', { params:params }).then(resp => {
            if (resp.result) {
              this.classList = resp.data.results
            } else {
              this.$$message.error(resp.error)
            }
          })
        } else {
          this.$message.error(resp.error)
        }
      })
    },
    clickCell (row, column, cell, event) {
      this.$store.commit('setClassID', row.id)
      this.$router.push({ name: 'studentClassInfo' })
    }
  }
};
</script>

<style lang="scss" scoped>
.title {
  font-size: 36px;
  margin: 10px 20px;
}
.search_class {
  float: right;
  margin: 10px 30px 0 0;
  background: hsl(172, 64%, 22%);
  color: white;
  height: 40px;
  font-size: 15px;
}
.class_list {
  margin-left: 20px;
  margin-top: 20px;
}
</style>
