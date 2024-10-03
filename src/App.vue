<template>
  <div>
    <div class="w-[1100px] mx-auto height pb-20">
      <header-compo></header-compo>
      <div class="mt-[85px]">
        <router-view></router-view>
      </div>
      <to-top-compo></to-top-compo>
    </div>

    <footer-compo v-if="this.role !== 'ADMIN'"></footer-compo>
  </div>
</template>

<script>
import FooterCompo from './components/common/FooterCompo.vue';
import HeaderCompo from './components/common/HeaderCompo.vue';
import ToTopCompo from './components/common/ToTopCompo.vue';
import { computed } from 'vue';
import { useUserStore } from './stores/userStore';

export default {
  name: 'App',
  components: {
    HeaderCompo,
    ToTopCompo,
    FooterCompo,
  },
  setup() {
    const userStore = useUserStore();
    const role = computed(() => userStore.role);

    return {
      role,
    };
  },
};
</script>

<style scoped>
.height {
  min-height: calc(100vh - 276px);
}
</style>
