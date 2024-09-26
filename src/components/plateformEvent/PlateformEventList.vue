<template>
  <div class="py-5">
    <!-- <p v-if="plateformEvent && plateformEvent.length" class="text-lg font-medium mb-6"> -->
    <strong class="text-xl">총 1개의 공지사항 수</strong>
    <!-- </p> -->

    <!-- <p v-else class="pt-20 text-center text-gray-600 text-lg font-medium">공지사항이 없습니다.</p> -->
  </div>

  <div class="flex flex-col space-y-6">
    <plateformEventCard class="p-6 bg-white rounded-lg"></plateformEventCard>

    <div class="flex justify-center">
      <button
        class="py-4 px-20 my-10 font-medium text-midGreen border-[1px] border-midGreen rounded hover:bg-midGreen hover:text-white transition duration-300"
      >
        더보기
      </button>
    </div>
  </div>
</template>

<script>
// import axios from 'axios';
import PlateformEventCard from './PlateformEventCard.vue';

export default {
  data() {
    return {
      id: 1,
      plateformEvent: [],
    };
  },

  // 서버 연결 준비
  // async mounted() {
  //   const plateformEventList = await axios.get('http://localhost:8080/api/plateformEvent/list');
  //   this.plateformEvent = plateformEventList.data;
  //   console.log(this.plateformEvent);
  // },

  components: {
    PlateformEventCard,
  },
};
</script>

<style scoped></style>
