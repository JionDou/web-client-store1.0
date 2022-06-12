<template>
  <el-dialog :visible.sync="dialogPhotoGalleryVisible">
    <el-row>
      <el-col :span="6">
        <div class="grid-content">
          <el-menu
            default-active="2"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            style="min-height:50vh;"
          >
            <el-menu-item style="font-size:20px;font-weight:700;color:#fff;">图片库</el-menu-item>
            <el-menu-item
              v-for="item in menuPhoto"
              :key="item.id"
              :index="item.id"
              @click="picModeSelect(item.id)"
            >
              <template slot="title">
                <span>{{item.label}}</span>
              </template>
            </el-menu-item>
          </el-menu>
        </div>
      </el-col>
      <el-col :span="18">
        <template v-if="picMode == 2">
          <div class="grid-content bg-purple" v-for="(photo,index) in myPhoto" :key="index">
            <img :src="photo.url" style="width:140px;height:130px;" />
            <el-checkbox
              v-model="photo.isSelected"
              style="position: relative;left: -16px;bottom: 6px;"
            ></el-checkbox>
          </div>
        </template>
        <template v-else-if="picMode == 3">
          <el-upload
            action="#"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="onFileChange"
          >+上传图片</el-upload>
          <div class="grid-content bg-purple" v-for="(photo,index) in localPhoto" :key="index">
            <img :src="photo.url" style="width:140px;height:130px;" />
            <el-checkbox
              v-model="photo.isSelected"
              style="position: relative;left: -16px;bottom: 6px;"
            ></el-checkbox>
          </div>
        </template>
      </el-col>
      <el-button @click="ensureSelect">确认</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      picMode: 2, // 2我的图片,3本地图片
      dialogPhotoGalleryVisible: true,
      tabPosition: "left",
      menuPhoto: [
        // {
        //   id: "1",
        //   label: "图片库",
        // },
        {
          id: "2",
          label: "我的图片",
        },
        {
          id: "3",
          label: "本地图片",
        },
      ],
      myPhoto: [
        {
          isSelected: false,
          url:
            "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1422346891,2025256173&fm=11&gp=0.jpg",
        },
        {
          isSelected: false,
          url:
            "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2852872551,755197164&fm=26&gp=0.jpg",
        },
        {
          isSelected: false,
          url:
            "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fdik.img.kttpdq.com%2Fpic%2F40%2F27690%2F0330b457c398978a_1280x1024.jpg&refer=http%3A%2F%2Fdik.img.kttpdq.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1622215561&t=c5b0a6107fbd1e19e9d38c93ef3e9ec6",
        },
        {
          isSelected: false,
          url:
            "https://gimg2.baidu.com/image_search/src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20190803%2Fa0e0304ab64b4169a8ca9d4babf474c0.jpeg&refer=http%3A%2F%2F5b0988e595225.cdn.sohucs.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1622215561&t=0ceafca1bb1c58ca05393bdb48d1d761",
        },
      ],
      localPhoto: [
        {
          isSelected: false,
          url:
            "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Ffile.digitaling.com%2FeImg%2Fimage%2F20140905%2F20140905153513_15418.gif&refer=http%3A%2F%2Ffile.digitaling.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1622215561&t=eaa7ec69a73fb26c460d5165dcfd7f4d",
        },
      ],
    };
  },
  mounted() {},
  methods: {
    picModeSelect(id) {
      this.picMode = id;
    },
    ensureSelect() {
      let res = [];
      this.myPhoto.forEach((photo) => {
        if (photo.isSelected) {
          res.push(photo);
        }
      });
      this.localPhoto.forEach((photo) => {
        if (photo.isSelected) {
          res.push(photo);
        }
      });
      this.$emit("updatePhoto", res);
      this.dialogPhotoGalleryVisible = false;
    },
    onFileChange(file) {
      console.log("onFileChange");
      console.log(file);
      let fileItem = { isSelected: false, url: URL.createObjectURL(file.raw) };
      console.log(fileItem);
      this.localPhoto.push(fileItem);
    },
  },
};
</script>

<style lang="scss" scoped>
.el-row {
  // margin-bottom: 20px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  // background: #d3dce6;
}
.el-submenu > .el-submenu__title .el-submenu__icon-arrow {
  -webkit-transform: rotateZ(0deg);
  -ms-transform: rotate(0deg);
  transform: rotateZ(0deg);
}
</style>
