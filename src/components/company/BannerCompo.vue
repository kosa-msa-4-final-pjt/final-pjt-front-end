<template>
  <div class="my-carousel mt-[150px]">
    <swiper
      :modules="[Navigation, Pagination, Autoplay]"
      :navigation="true"
      :pagination="{ clickable: true }"
      :loop="true"
      :autoplay="{ delay: 4000, disableOnInteraction: false }"
      class="h-[200px] rounded-[8px] custom-swiper"
    >
      <swiper-slide>
        <img class="w-[1100px] object-cover" :src="require('/public/imgs/banner1.png')" alt="banner1" />
      </swiper-slide>
      <swiper-slide>
        <img class="w-[1100px] object-cover" :src="require('/public/imgs/banner2.png')" alt="banner2" />
      </swiper-slide>
      <swiper-slide>
        <img class="w-[1100px] object-cover" :src="require('/public/imgs/banner3.png')" alt="banner3" />
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper';

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    return {
      Navigation,
      Pagination,
      Autoplay,
    };
  },
};
</script>

<style scoped>
.custom-swiper {
  --swiper-navigation-color: #eee;
  --swiper-pagination-color: #eee;
}
</style>
