<template>
  <div>
    <div class="title">
      <span>个人信息</span>
    </div>
    <div class="userinfo">
      <el-table :data="tableData" border style="width: 52.2%; left:25%; margin-top: 20px;">
        <el-table-column prop="key" label="属性" width="400"></el-table-column>
        <el-table-column prop="value" label="信息" width="400"></el-table-column>
      </el-table>
    </div>
    <div class="changeInfo">
      <el-button class="button-group" @click="dialogVisible=true">修改资料</el-button>
    </div>
    <el-dialog title="修改资料" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <span>邮箱：</span>
      <el-input style="margin: 10px 0px;" placeholder="请输入邮箱" v-model="changeForm.email" clearable></el-input>
      <span style="margin-top: 5px;">手机：</span>
      <el-input
        style="margin: 10px 0px;"
        placeholder="请输入手机号码"
        v-model="changeForm.phone"
        clearable
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleChangeInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  inject: ["reload"],
  data() {
    return {
      dialogVisible: false,
      studentId: "",
      changeForm: {
        email: "",
        phone: ""
      },
      tableData: [
        {
          key: "学号",
          value: ""
        },
        {
          key: "姓名",
          value: ""
        },
        {
          key: "性别",
          value: ""
        },
        {
          key: "学院",
          value: ""
        },
        {
          key: "专业",
          value: ""
        },
        {
          key: "班级",
          value: ""
        },
        {
          key: "邮箱",
          value: ""
        },
        {
          key: "手机",
          value: ""
        }
      ]
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      this.axios.get("/account/user_info/").then(resp => {
        if (resp.result) {
          this.studentId = resp.data.student_id;
          this.tableData[0].value = resp.data.username;
          this.tableData[1].value = resp.data.name;
          this.tableData[2].value = resp.data.sex;
          this.tableData[3].value = resp.data.college;
          this.tableData[4].value = resp.data.major;
          this.tableData[5].value = resp.data.classid;
          this.tableData[6].value = resp.data.email;
          this.tableData[7].value = resp.data.phone;
        } else {
          this.$message.error(resp.error);
        }
      });
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    handleChangeInfo() {
      this.dialogVisible = false;
      this.axios
        .patch("/account/student/" + this.studentId + "/", this.changeForm)
        .then(resp => {
          if (resp.result) {
            this.$message.success("修改成功！");
            this.reload();
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
  position: relative;
  left: 45%;
  width: 300px;
  margin: 20px 0px;
  font-size: 42px;
}
.button-group {
  height: 40px;
  font-size: 15px;
  margin-top: 30px;
  margin-right: 10px;
  background: hsl(172, 64%, 22%);
  color: white;
}
.button-group:hover {
  background-color: hsl(172, 64%, 22%);
}
.changeInfo {
  position: relative;
  left: 47.6%;
  width: 80px;
}
</style>
