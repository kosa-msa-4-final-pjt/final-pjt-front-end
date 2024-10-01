<template>
  <div class="container w-[850px] mx-auto p-8">
    <div class="mb-8 flex justify-center">
      <img
        class="w-[650px] h-[300px] rounded-lg object-cover"
        :src="require('@/assets/logo.png')"
        alt="공지사항 이미지"
      />
    </div>

    <!-- 공지사항 제목 -->
    <div class="bg-white p-6 mb-8 border-b-[1px] border-gray-200">
      <h2 class="text-3xl font-bold text-gray-900 mb-4">{{ notice.title }}</h2>
      <div class="flex justify-between items-center text-gray-600">
        <div>
          <p class="text-md text-gray-600 mb-1 font-semibold">{{ notice.authorName }}</p>
          <p class="text-sm text-gray-400 font-medium">{{ notice.updateDate }}</p>
        </div>
      </div>
    </div>

    <!-- 공지사항 내용 섹션 -->
    <div class="bg-white p-6 pb-20 rounded-lg border-b-[1px] border-gray-200">
      <div class="text-gray-700 leading-relaxed">{{ notice.content }}</div>
    </div>
  </div>
</template>

<script>
import authInstance from '@/utils/axiosUtils';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

export default {
  setup() {
    const route = useRoute(); // 라우터에서 현재 경로 정보를 가져옴
    const notice = ref([]);

    const getNoticeDetail = async (noticeId) => {
      try {
        const response = await authInstance.get(`/api/admin/notice/${noticeId}`);
        notice.value = response.data;
      } catch (error) {
        console.log('공지사항을 가져오지 못했습니다.', error);
      }
    };

    onMounted(() => {
      const noticeId = route.params.id; // URL에서 ID 추출
      getNoticeDetail(noticeId); // 공지사항 불러오기
    });

    return {
      notice,
    };
  },
};
</script>

<style scoped>
.container {
  max-width: 850px;
  margin: 0 auto;
}
</style>
