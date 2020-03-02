<template>
  <div>
    <el-dialog
    style="width:1000px;"
    title="创建单元"
    :visible.sync="show"
    center
    :before-close="handleBeforeClose"
    >
    <el-form :model="params" ref="params" label-position="left" label-width="100px">
      <el-form-item label="单元名称">
        <el-input v-model="params.chapter_name" style="width:300px;"></el-input>
      </el-form-item>
      <el-form-item label="单元描述">
        <el-input v-model="params.description" style="width:300px;"></el-input>
      </el-form-item>
      <el-form-item label="设置文件名">
        <el-input v-model="params.file_name" style="width:300px;"></el-input>
      </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createChapter" type="primary" class="button-group">创建</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  inject: ["reload"],
  name: "CreateClass",
  props: {
    displayCreateChapterDialog: {
      type: Boolean,
      required: true,
    }
  },
  data() {
    return {
      show: false,
      params: {
        class_id: this.$store.state.classId,
        chapter_name: "",
        description: "",
        file_name: "",
      }
    };
  },
  watch: {
    displayCreateChapterDialog() {
      if (this.displayCreateChapterDialog) {
        this.show = true
      }
    }
  },
  methods: {
    createChapter() {
      /*数据验证*/
     if (
      !this.params.chapter_name ||
      !this.params.description ||
      !this.params.file_name
      ) {
        this.$message.warning("还有数据未完成，不能创建！");
      } else {
      /*发送数据 */
        this.axios.post("/class/chapter/", this.params).then(resp => {
          if (resp.result) {
            this.$message.success("创建成功")
            this.show = false
            this.reload()
          } else {
            this.$message.error(resp.error)
          }
        })
      }
    },
    handleBeforeClose() {
      this.reload()
    }
  }
}
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