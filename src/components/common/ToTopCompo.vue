<template>
  <div
    class="w-[64px] h-[64px] fixed right-4 bottom-[80px] transition-all duration-300 cursor-pointer bg-no-repeat bg-cover"
    data-nav="true"
    @click="scrollToTop"
  >
    <img :src="require('/public/imgs/ic_arrow_top.svg')" alt="Scroll to Top" />
  </div>
</template>

<script>
export default {
  methods: {
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    },
  },
};
</script>

<style></style>
