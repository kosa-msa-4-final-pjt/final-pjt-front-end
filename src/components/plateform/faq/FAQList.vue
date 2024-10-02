<template>
  <div class="w-full">
    <!-- 페이지 제목 및 FAQ 개수 -->
    <div class="mx-auto w-full rounded-2xl bg-white p-4">
      <div class="pb-10">
        <strong class="text-xl">총 {{ faqs.length }}개의 자주 묻는 질문 (FAQ)</strong>
      </div>

      <!-- FAQ 항목이 있을 경우 렌더링 -->
      <div v-if="faqs.length > 0">
        <div v-for="(faq, index) in faqs" :key="index" class="mb-4">
          <Disclosure v-slot="{ open }">
            <DisclosureButton
              class="flex w-full justify-between items-center rounded-lg px-4 py-2 text-left text-md font-semibold bg-gray-100 text-black hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-gray-500/75"
            >
              <span>{{ faq.title }}</span>
              <font-awesome-icon
                :icon="['fas', 'chevron-down']"
                :class="open ? 'rotate-180 transform' : ''"
                class="h-3 w-3 text-gray-500"
                aria-hidden="true"
              />
            </DisclosureButton>
            <DisclosurePanel class="mt-2 px-4 pb-2 pt-4 text-sm text-gray-700 bg-white border-t border-gray-200">
              <div class="whitespace-pre-line mb-2">{{ faq.content }}</div>
              <div class="flex justify-between text-xs text-gray-500">
                <span>작성자: {{ faq.authorName }}</span>
                <span>수정일: {{ formatDate(faq.updateDate) }}</span>
              </div>
            </DisclosurePanel>
          </Disclosure>
        </div>
      </div>

      <!-- FAQ 항목이 없을 경우 -->
      <div v-else>
        <p class="text-center text-gray-500">FAQ 목록이 없습니다.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { instance } from '@/utils/axiosUtils';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';

export default {
  components: {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
  },
  setup() {
    // FAQ 리스트를 저장할 변수
    const faqs = ref([]);

    // FAQ 데이터를 가져오는 함수
    const fetchFAQs = async () => {
      try {
        const response = await instance.get('/api/faq/list');
        faqs.value = response.data; // API에서 받은 데이터를 faqs 변수에 저장
      } catch (error) {
        console.error('FAQ 리스트를 가져오는 데 실패했습니다.', error);
      }
    };

    // 날짜 형식을 "YYYY-MM-DD"로 변환하는 함수
    const formatDate = (date) => {
      const d = new Date(date);
      return d.toISOString().split('T')[0];
    };

    // 컴포넌트가 마운트될 때 FAQ 데이터를 불러옵니다.
    onMounted(() => {
      fetchFAQs();
    });

    return {
      faqs,
      formatDate,
    };
  },
};
</script>

<style scoped>
/* 스타일 커스터마이징이 필요할 경우 여기에 추가 */
</style>
