<template>
  <div>
    <el-form>
      <el-form-item label="门详头图" required="true">
        <el-link>状态:</el-link>
        <!-- <el-button @click="unloadPhotoGallery">+上传图片</el-button> -->
        <el-upload
          class="avatar-uploader"
          action="#"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
          <h3>点击上传头图</h3>
        </el-upload>
        <template v-for="(photo,index) in localPhoto" class="grid-content bg-purple">
          <img
            :key="index"
            class="img-style"
            :src="photo.fileId"
            style="border:none;margin-top: 10px;"
            @click="photo.isSelected = !photo.isSelected"
          >
          <el-checkbox
            :key="index"
            v-model="photo.isSelected"
            style="position: relative;left: -16px;bottom: 6px;"
          />
        </template>
      </el-form-item>
      <!-- <el-dialog v-model="dialogVisible" style="line-height: 0;">
          <img style="width: 100%;height: 100%" :src="dialogImageUrl" alt="">
        </el-dialog> -->
      <!-- <div class="el-upload-list el-upload-list--text">
          <div class="el-upload-list__item is-success">
            <label class="el-upload-list__item-status-label">
              <i class="el-icon-upload-success el-icon-circle-check" />
            </label>
            <i class="el-icon-close" @click="removeImage" />
          </div>
        </div> -->
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imageUrl: '',
      localPhoto: []
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
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
    }
  }
}
</script>

<style lang="scss" >
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader{
    h3{
      position: relative;
      bottom: 57px;
      font-size: 14px;
      font-weight: 400;
      color: #999;
    }
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
