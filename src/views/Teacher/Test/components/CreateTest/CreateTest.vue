<template>
  <el-dialog
    style="width:1000px; float:right; margin-right:400px;"
    title="创建试卷"
    :visible.sync="show"
    :show-close="false"
    center
  >
    <el-form :model="params">
      <el-form-item label="试卷名:">
        <el-input v-model="params.name" style="width:80%;"></el-input>
      </el-form-item>
      <el-form-item label="试卷类型">
        <el-input v-model="params.testtype" style="width:77%;"></el-input>
      </el-form-item>
      <el-form-item label="是否公开">
        <el-select v-model="params.is_public" style="width:77%;">
          <el-option label="true" value="true"></el-option>
          <el-option label="false" value="false"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="createTest" class="button-group">创建</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  inject: ["reload"],
  props: {
    display_create_test_dialog: {
      type: Boolean,
      required: true
    }
  },
  name: "UpdateTest",
  data() {
    return {
      show: false,
      params: {
        name: "",
        testtype: "",
        is_public: ""
      }
    };
  },
  watch: {
    display_create_test_dialog() {
      if (this.display_create_test_dialog) {
        this.show = true;
      }
    }
  },
  methods: {
    createTest() {
      if (
        !this.params.name ||
        !this.params.testtype ||
        !this.params.is_public
      ) {
        this.$message.warning("还有内容未完成，不能创建！");
      } else {
        this.axios.post("/exam/basic_test/", this.params).then(resp => {
          if (resp.result) {
            this.$message.success("试卷创建成功！");
            this.show=false;
            this.reload();
          } else {
            this.$message.error(resp.error);
          }
        });
      }
    }
  }
};
</script>

<style scoped>
.button-group {
  height: 40px;
  border: 0;
  font-size: 15px;
  margin-top: 10px;
  border-radius: 0;
  margin-right: 5px;
  background: hsl(172, 64%, 22%);
}
</style>
