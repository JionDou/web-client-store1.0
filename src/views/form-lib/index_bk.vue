<template>
  <el-form>
    <el-form-item label="图片上传">
      <el-button @click="unloadPhotoGallery">+上传图片</el-button>
      <photo-gallery ref="photoDialog" @updatePhoto="updatePhoto" />
    </el-form-item>
    <el-form-item>
      <div class="grid-content bg-purple" v-for="(photo,index) in photos" :key="index">
        <img :src="photo.url" style="width:140px;height:130px;" />
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
import PhotoGallery from "@/components/PhotoGallery/PhotoGallery.vue";
export default {
  components: {
    PhotoGallery,
  },
  data() {
    return {
      photos: [],
      PhotoGallery,
    };
  },
  methods: {
    unloadPhotoGallery() {
      console.log(1);
      this.$refs.photoDialog.dialogPhotoGalleryVisible = true;
    },
    updatePhoto(photos) {
      this.photos = this.photos.concat(photos);
      console.log(this.photos);
    },
  },
};
</script>

<style>
</style>
