<template>
  <el-dialog :visible.sync="dialogPhotoGalleryVisible">
    <div class="photo-gallery">
      <el-row class="photo-wrapper">
        <el-col :span="4" style="background:#82848a;text-align:center;min-height:50vh;">
          <aside style="color: #fff;font-weight: 700;font-size: 20px;">图片库</aside>
          <aside :class="[!showTag ? 'active' : '']" @click="showTag=true">我的图片</aside>
          <aside :class="[!showTag ? 'active' : '']" @click="showTag=false">本地上传</aside>
        </el-col>
        <el-col :span="20">
          <div v-if="showTag">
            <template v-for="(photo, index) in imgList">
              <img
                :key="index"
                class="img-style"
                :src="photo.fileId"
                @click="photo.isSelected = !photo.isSelected"
              >
              <el-checkbox
                :key="index"
                v-model="photo.isSelected"
                style="position: relative;left: -16px;bottom: 6px;"
              />
            </template>
          </div>
          <div v-else style="display:flex;align-items: center;justify-content:flex-start;">
            <el-row :span="24" style="margin-left: 10px;">
              <el-upload
                class="image-uploader"
                action
                :auto-upload="false"
                :show-file-list="false"
                :on-change="onFileChange"
              >
                <el-button style="width: 36vw;line-height: 35px;" type="info" plain>+ 上传图片</el-button>
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
            </el-row>
          </div>
        </el-col>
        <el-button @click="sureSubmit">确认</el-button>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'PhotoGallery',
  props: {
    msg: String
  },
  data() {
    return {
      showTag: true,
      isViewMaterielFrom: false,
      dialogPhotoGalleryVisible: true,
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      fileId: this.fileId,
      imgList: [
        {
          id: 1,
          isSelected: false,
          fileId:
            'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1422346891,2025256173&fm=11&gp=0.jpg'
        },
        {
          id: 2,
          isSelected: false,
          fileId:
            'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2852872551,755197164&fm=26&gp=0.jpg'
        }
      ],
      localPhoto: []
    }
  },
  mounted() {
    this.getPhotoGalleryUrl()
  },
  methods: {
    picModeSelect(id) {
      this.picMode = id
    },
    dialogCancel() {
      this.dialogPhotoGalleryVisible = false
    },
    handleRemove(file) {
      console.log(file)
    },
    handlePictureCardPreview(file) {},
    handleDownload(file) {
      console.log(file)
    },
    sureSubmit() {
      const res = []
      this.imgList.forEach((photo) => {
        if (photo.isSelected) {
          res.push(photo)
        }
      })
      this.localPhoto.forEach((photo) => {
        if (photo.isSelected) {
          res.push(photo)
        }
      })
      this.$emit('updatePhoto', res)
      this.dialogPhotoGalleryVisible = false
    },
    onFileChange(file) {
      console.log('onFileChange')
      console.log(file)
      const fileItem = {
        isSelected: true,
        fileId: URL.createObjectURL(file.raw)
      }
      console.log(fileItem)
      this.localPhoto.push(fileItem)
    },
    async getPhotoGalleryUrl() {
      try {
        const result = await this.$api.photoGallery.getPhotoGalleryUrl()
        if (result.code === '000000' && result.data) {
          this.imgList = result.data
        }
      } catch (err) {}
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep.el-dialog {
  position: relative;
  margin: 0 auto 0px;
  background: #ffffff;
  border-radius: 2px;
  box-sizing: border-box;
  width: 50%;
  height: 70%;
}
::v-deep.el-dialog__body {
  max-height: 85% im !important;
  min-height: 70%;
  overflow-y: auto;
}
::v-deep.el-dialog__body::-webkit-scrollbar {
  width: 5px;
  background-color: #ccc;
  border-radius: 50%;
}
::v-deep.el-dialog__body::-webkit-scrollbar-thumb {
  background-color: #ddd;
}
::v-deep.el-dialog__body::-webkit-scrollbar-track {
  background-color: #ccc;
}
.photo-wrapper {
  font-size: 14px;
  color: #fff;
  cursor: pointer;
}
.active {
  color: #fff;
  background-color: #606266;
}
aside {
  padding: 5px 0 5px 0;
}
.img-style {
  width: 160px;
  height: 226px;
  margin-left: 10px;
  margin-bottom: 10px;
  border: 1px solod #ddd;
  border-radius: 2px;
}
.select_img-style {
  width: 50px;
  height: 50px;
  display: inline;
  position: relative;
  bottom: -96px;
  right: 20px;
}
</style>
