<template>
  <div>
    <el-dialog
      style="width:1000px;"
      title="创建班级"
      :visible.sync="show"
      center
      :before-close="handleBeforeClose"
    >
      <el-form :model="params" ref="params" label-position="left" label-width="100px">
        <el-form-item label="班级编号">
          <el-input v-model="params.class_id" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item label="课程名称">
          <el-input v-model="params.classname" style="width:300px;"></el-input>
        </el-form-item>
        <el-form-item label="主要上课班级">
          <el-input v-model="params.classmajor" style="width:300px;"></el-input>
          <label for="提示"><br/>>>>输入格式: 2017级生物医学工程02>>></label>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createClass" type="primary" class="button-group">创建</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  inject: ["reload"],
  name: "CreateClass",
  props: {
    display_create_class_dialog: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      show: false,
      params: {
        class_id: "",
        classname: "",
        classmajor: ""
      }
    };
  },
  watch: {
    display_create_class_dialog() {
      if (this.display_create_class_dialog) {
        this.show = true;
      }
    }
  },
  methods: {
    createClass() {
      /*
        数据验证
        */
      if (
        !this.params.class_id ||
        !this.params.classname ||
        !this.params.classmajor
      ) {
        this.$message.warning("还有数据未完成，不能创建！");
      } else {
        /*
          发送数据
          */
        this.axios.post("/class/classinfo/", this.params).then(resp => {
          if (resp.result) {
            this.$message.success("班级创建成功！");
            this.show = false;
            this.reload();
          } else {
            this.$message.error(resp.error);
          }
        });
      }
    },
    /*
    监听关闭按钮
    */
    handleBeforeClose() {
      this.reload();
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
  margin-right: 10px;
  background: hsl(172, 64%, 22%);
}
</style>
