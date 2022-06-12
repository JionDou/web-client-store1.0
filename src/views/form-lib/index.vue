<template>
  <el-form>
    <el-form-item label="图片上传">
      <el-button @click="unloadPhotoGallery">+上传图片</el-button>
      <photo-gallery ref="photoDialog" @updatePhoto="updatePhoto" />
    </el-form-item>
    <el-form-item>
      <div v-for="(photo,index) in photos" :key="index" class="grid-content bg-purple">
        <img :src="photo.fileId" style="width:140px;height:130px;">
      </div>
    </el-form-item>
    <el-form-item label="物料跳转链接">
      <el-select>
        <option>h5</option>
      </el-select>
      <el-input />
    </el-form-item>
    <SelfDfined />
  </el-form>
</template>

<script>
import SelfDfined from '@/components/PhotoGallery/SelfDfined'
import PhotoGallery from '@/components/PhotoGallery/PhotoGallery.vue'
export default {
  components: {
    PhotoGallery,
    SelfDfined
  },
  data() {
    return {
      photos: []
    }
  },
  methods: {
    unloadPhotoGallery() {
      console.log(1)
      this.$refs.photoDialog.dialogPhotoGalleryVisible = true
    },
    updatePhoto(photos) {
      this.photos = this.photos.concat(photos)
      console.log(this.photos)
    }
  }
}
</script>

<style>

</style>
