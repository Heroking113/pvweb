<template>
  <el-dialog
    style="width:1000px;"
    title="更新试卷"
    :visible.sync="show"
    :show-close="false"
    center
  >
    <el-form :model="base_test">
      <el-form-item label="试卷名:">
        <el-input v-model="base_test.name" style="width:80%;"></el-input>
      </el-form-item>
      <el-form-item label="试卷类型">
        <el-input v-model="base_test.testtype" style="width:77%;"></el-input>
      </el-form-item>
      <el-form-item label="是否公开">
        <el-select v-model="base_test.is_public" style="width:77%;">
          <el-option label="公开" value="公开"></el-option>
          <el-option label="未公开" value="未公开"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="updateThisTest" class="button-group">更新</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  inject: ["reload"],
  name: "UpdateTest",
  props: {
    base_test: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      show: false
    };
  },
  watch: {
    base_test() {
      this.show = true;
    }
  },
  methods: {
    updateThisTest() {
      let is_public = null;
      if (this.base_test.is_public === "公开") {
        is_public = true;
      } else {
        is_public = false;
      }
      let params = {
        name: this.base_test.name,
        testtype: this.base_test.testtype,
        is_public: is_public
      };
      this.axios
        .patch("/exam/basic_test/" + this.base_test.id + "/", params)
        .then(resp => {
          if (resp.result) {
            this.$message.success("更新试卷信息成功！");
            this.show = false;
            this.reload();
          } else {
            this.$message.error(resp.error);
          }
        });
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
