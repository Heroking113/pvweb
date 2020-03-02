<template>
  <el-dialog
    center
    style="width:1000px;"
    title="修改班级信息"
    :visible.sync="show"
    width="300"
    :before-close="handleBeforeClose"
  >
    <el-form
      :model="exist_class_info"
      ref="exist_class_info"
      label-position="left"
      label-width="100px"
    >
      <el-form-item label="班级编号">
        <el-input v-model="exist_class_info.class_id" style="width:300px;"></el-input>
      </el-form-item>
      <el-form-item label="课程名称">
        <el-input v-model="exist_class_info.classname" style="width:300px;"></el-input>
      </el-form-item>
      <el-form-item label="主要上课班级">
        <el-input v-model="exist_class_info.classmajor" style="width:300px;"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="changeInfo" type="primary" class="button-group">修改</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  inject: ["reload"],
  name: "ChangeClassInfo",
  props: {
    exist_class_info: {
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
    exist_class_info() {
      this.show = true;
    }
  },
  methods: {
    /*
    修改班级信息
    */
    changeInfo() {
      if (!this.exist_class_info.classname) {
        this.$message.warning("还有数据未完成，不能修改！");
      } else {
        this.$confirm("确认修改吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let params = {
            class_id: this.exist_class_info.class_id,
            classname: this.exist_class_info.classname,
            classmajor: this.exist_class_info.classmajor
          };
          this.axios
            .patch("/class/classinfo/" + this.exist_class_info.id + "/", params)
            .then(resp => {
              if (resp.result) {
                this.$message.success("修改成功!");
                this.show = false;
                this.reload();
              } else {
                this.$message.error(resp.error);
              }
            });
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
