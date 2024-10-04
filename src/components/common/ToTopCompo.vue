<template>
  <div
    class="fixed right-4 bottom-[80px] transition-all duration-300 cursor-pointer bg-gray-200 rounded-full"
    data-nav="true"
    @click="scrollToTop"
  >
    <font-awesome-icon class="text-[30px] text-gray-500 px-5 py-4" :icon="['fas', 'arrow-up']" />
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
