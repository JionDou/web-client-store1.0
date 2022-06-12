<template>
  <section class="ces-custom-template">
    <component :is="customTemplate.name" ref="customTemplate"></component>
  </section>
</template>
<script>
import CustomTemplate from "@/components/Custom-template/Custom-template";
export default {
  components: {
    CustomTemplate,
  },
  data() {
    return {
      customTemplate: {
        name: "CustomTemplate",
      },
    };
  },
};
</script>
