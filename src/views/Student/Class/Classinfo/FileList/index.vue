<template>
  <div>
    <el-button @click="isshowUpFileDialog=true" type="primary" class="button-group" style="margin: 20px 20px">上传文件</el-button>
    <el-table
      :data="fileList"
      border
      style="width:100%"
    >
    <el-table-column prop="file_name" label="文件名" width="300" align="center"></el-table-column>
    <el-table-column prop="created_by" label="上传者" width="300" align="center"></el-table-column>
    <el-table-column prop="file_size_value" label="文件大小" width="300" align="center"></el-table-column>
    <el-table-column prop="file_size_unit" label="文件大小单位" width="300" align="center"></el-table-column>
    <el-table-column fixed="right" label="操作" width="400" align="center">
      <template slot-scope="scope">
        <el-button @click="downloadFile(scope.row)" type="primary" size="mini" class="list-operation-button">下载文件</el-button>
      </template>
    </el-table-column>
    </el-table>
    <el-dialog title="上传文件" :visible.sync="isshowUpFileDialog" center style="width:1000px">
      <el-upload
        class="upload-demo"
        drag
        ref="upload"
        :data="fileForm"
        action="/files/files/"
        multiple
        accept=""
        :show-file-list="true"
        :on-change="handleChange"
        :on-success="handleUpload"
        :auto-upload="false"
        :headers="{'X-CSRFToken': csrfToken}"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或点击上传</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadFile" type="primary" class="button-group">上传</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Cookies from "js-cookie";
export default {
  inject: ['reload'],
  data() {
    return {
      fileList: [],
      isshowUpFileDialog: false,

      // 创建文件
      fileForm: {
        class_id: 0,
        chapter_id: 0,
      }
    }
  },
  created() {
    this.getFileList()
  },
  computed: {
    csrfToken() {
      return Cookies.get("csrftoken");
    }
  },
  methods: {
    /*
    获取文件列表
    */
    getFileList() {
      this.axios.get("/files/files?chapter_id=" + this.$store.state.chapterId + "&status=Teacher").then(resp => {
        if (resp.result) {
          for (let i=0; i<resp.data.length; i++) {
            this.fileList.push(resp.data[i])
          }
        } else {
          this.$message.error(resp.error)
        }
      })
      this.axios.get("/files/files?chapter_id=" + this.$store.state.chapterId + "&username=" + this.$store.state.username).then(resp => {
        if (resp.result) {
          if (resp.data.length) {
            this.fileList.push(resp.data[0])
          }
        } else {
          this.$message.error(resp.error)
        }
      })
    },
    /*
    文件下载
    */
    downloadFile(file) {
      return (window.location.href =
        "http://localhost:9123/files/files/" + file.id + "/download/");
    },
    /*
    判断文件上传是否成功
    */
    handleUpload(response, fileList) {
      if (response.result) {
        this.$message.success("文件上传成功！");
        this.reload();
      } else {
        this.$message.error(response.data.detail);
      }
    },
    handleChange(file, fileList) {
      this.fileForm.class_id = this.$store.state.classId
      this.fileForm.chapter_id = this.$store.state.chapterId
    },
    /*
    上传文件
    */
    uploadFile() {
      this.$refs.upload.submit()
    },
  }
}
</script>

<style scoped>
.button-group {
  border-radius: 0;
  border: 0;
  margin-left: 20px;
  background: #13876a;
}
.button-group:hover {
  background-color: #0a6659;
}
.list-operation-button {
  margin: 2px;
  border: 0;
  border-radius: 0;
  color: white;
  background: #0a6659;
}
.list-operation-button:hover {
  background-color: hsl(172, 64%, 22%);
}
.upload-demo {
  margin-left: 70px;
}
.input-file-name {
  width: 359px;
  margin-top: 10px;
  margin-left: 13px;
}
.input-file-description {
  width: 359px;
  margin-top: 10px;
}
</style>