<template>
  <div>
    <el-form
      ref="ruleForm"
      :rules="rules"
      :model="ruleForm"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item label="门详头图" required>
        <el-link>状态:</el-link>
        <el-button size="mini" style="margin-left:80px" @click="approvalStatus()">流程状态</el-button>
        <div style="display:flex;">
          <el-upload
            ref="upload"
            :accept="accept"
            action
            list-type="picture-card"
            :on-success="handleSuccess"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-change="UploadImage"
            :limit="1"
            :file-list="fileList"
            :auto-upload="false"
            :before-upload="beforeAvatarUpload"
          >
            <div class="el-content">
              <i class="el-icon-plus" />
              <span class="el-text">
                点击上传头图
              </span>
            </div>
            <div slot="tip" class="el-upload__tip">只能上传jpg文件，且在2M以内</div>
          </el-upload>
          <div v-if="approvalProcessVisible" class="approval-process">
            <h5>审批流编号:</h5>
            <el-timeline>
              <el-timeline-item
                v-for="(activity, index) in activities"
                :key="index"
                :icon="activity.icon"
                :type="activity.type"
                :color="activity.color"
                :size="activity.size"
              >
                <span style="padding-right:20px;">{{ activity.title }}</span>
                <span>{{ activity.timestamp }}</span>
                <div>
                  <span style="padding-right:20px;">{{ activity.approvedBy }}</span>
                  <span>{{ activity.approvedName }}</span>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
      </el-form-item>
      <el-form-item class="store-tag" label="认证标签" prop="storeTag">
        <el-checkbox-group v-model="checkList">
          <el-checkbox label="金牌门店" />
          <el-checkbox label="售后无忧" />
          <el-checkbox label="全国联保" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="基础服务">
        <div class="base-service">
          <el-switch
            v-model="value1"
            inactive-text="安全服务"
          />
          <el-input type="text" />
          <el-switch
            v-model="value2"
            inactive-text="答谢有礼"
          />
        </div>

      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm('ruleForm')">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
// import { ElMessage } from 'element-plus'
export default {
  name: 'UploadImage',

  data() {
    return {
      approvalProcessVisible: false,
      // 回显图片的路径
      photoList: [{ url: '' }],
      // 放大图片的路径
      dialogImageUrl: '',
      // 上传图片放大弹出框
      dialogVisible: false,

      fileList: [],
      localPhoto: [],
      accept: '.jpg,.png',
      value1: '',
      value2: '',
      checkList: ['金牌门店'],
      ruleForm: {
        name: '',
        image: '',
        summary: '',
        issue: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入标题',
            trigger: 'blur'
          }
        ],
        summary: [
          {
            required: true,
            message: '请输入简介',
            trigger: 'blur'
          }
        ]
      },
      activities: [{
        title: '图片上传',
        content: '支持使用图标',
        timestamp: '2018-04-12 20:46',
        approvedBy: '审批人',
        approvedName:'张三',
        size: 'large',
        type: 'success',
        icon: 'el-icon-circle-check'
      }, {
        title: '一级审批',
        content: '支持自定义颜色',
        timestamp: '2018-04-03 20:46',
        color: '#0bbd87'
      }, {
        title: '二级审批',
        content: '支持自定义尺寸',
        timestamp: '2018-04-03 20:46',
        size: 'large'
      }, {
        title: '三级审批',
        content: '默认样式的节点',
        timestamp: '2018-04-03 20:46'
      },
      {
        title: '四级审批',
        content: '默认样式的节点',
        timestamp: '2018-04-03 20:46'
      }
      ]
    }
  },
  methods: {
    handlePreview(file) {
      // console.log(file);
      // 放大图片的路径
      this.dialogImageUrl = file.url
      // 上传图片放大弹出框显示
      this.dialogVisible = true
    },

    handleSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    removeImage() {
      this.$confirm(`确定移除已上传的图片？`, '提示').then(() => {
        this.emitInput('')
      })
    },
    approvalStatus() {
      this.approvalProcessVisible = !this.approvalProcessVisible
    },
    // 上传图片的方法
    UploadImage(file, filelist) {
      // console.log(file);
      const fd = new FormData()
      fd.append('file', file.raw) // 传给后台接收的名字 file
      axios.post('/upload/image', fd, { headers: { 'Content-Type': 'multipart/form-data' }}).then(response => {
        // 上传成功后返回的数据,
        console.log('上传图片到:' + response.data)
        // 将图片地址给到表单.
        this.ruleForm.image = response.data
      })
    },
    // 移除图片功能
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    // 预览图片功能
    handlePictureCardPreview(file) {
      console.log(file.url)
      this.dialogVisible = true
      this.dialogImageUrl = file.url
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 提交后重置上传界面表单
    resetForm(formName) {
      this.$refs.upload.clearFiles()
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.hide >>> .el-upload--picture-card {
  display: none;
}
::v-deep .el-upload--picture-card{
  width: 198px;
  height: 198px;
}
.el-content{
  display: grid;
   i{
    padding-top: 28px;
  }
  span{
    font-size: 14px;color: #919191;
  }
}
.approval-process{
  width: 400px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-left: 50px;
  padding: 0 18px;

}
::v-deep .el-timeline-item__wrapper{
  top: -14px;
}
::v-deep .el-checkbox-group{
  display:grid;
}
.store-tag ::v-deep .el-form-item__content{
  width: 10%;
}
.base-service{
  width: 20%;
  display: flex;
  flex-direction: column;
  padding-top: 10px;
}
</style>
