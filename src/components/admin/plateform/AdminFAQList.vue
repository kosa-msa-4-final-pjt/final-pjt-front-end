<template>
  <div class="flex-col">
    <!-- header -->
    <div class="mb-10 p-5 bg-white rounded-lg">
      <h2 class="font-semibold text-xl mb-4">FAQ 관리</h2>
      <ul class="flex justify-between">
        <li>
          <label for="" class="font-medium">현재 등록된 FAQ 관리수</label>
          <p class="text-red">{{ totalFAQ.length }}개</p>
        </li>
        <li>
          <button
            class="px-2 py-1 bg-midGreen hover:bg-[#2a692d] text-white rounded-lg text-[16px] font-medium mt-6"
            @click="$router.push('/mypage/admin/admincreatefaq')"
          >
            등록하기
          </button>
        </li>
      </ul>
    </div>
    <!-- center -->
    <div>
      <table class="table border-2 border-solid border-gray-300 border-collapse w-full">
        <thead>
          <tr>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">제목</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">관리자명</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">게시일</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">상세보기</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="FAQ in FAQList" :key="FAQ.id">
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              {{ truncateTitle(FAQ.title) }}
            </td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">{{ FAQ.authorName }}</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">{{ FAQ.updateDate }}</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              <button
                class="px-2 rounded-lg whitespace-nowrap bg-gray-200 cursor-pointer hover:bg-gray-300"
                @click="adminFAQDetail(FAQ.id)"
              >
                상세보기
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- footer -->
    <div class="mt-5">
      <vue-paginate
        :model-value="page"
        :page-count="totalPages"
        :page-range="3"
        :margin-pages="2"
        :click-handler="getFAQs"
        prev-text="<"
        next-text=">"
        :container-class="'flex justify-center font-sans cursor-pointer'"
        :page-link-class="'m-3 hover:bg-accent '"
        :prev-link-class="'m-3'"
        :next-link-class="'m-3'"
        active-class="bg-accent rounded-md"
        @update:model-value="page = $event"
      />
    </div>
  </div>
</template>

<script>
import authInstance from '@/utils/axiosUtils';
import { VuePaginate } from '@svifty7/vue-paginate';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

export default {
  components: {
    VuePaginate,
  },
  setup() {
    const page = ref(1);
    const pageSize = ref(5);
    const totalPage = ref();

    const FAQList = ref([]);
    const totalFAQ = ref([]);
    const router = useRouter(); // 라우터 객체

    const getFAQs = async () => {
      try {
        const response = await authInstance.get(`/api/admin/faq/list?page=${page.value - 1}&size=${pageSize.value}`);
        console.log(response);

        FAQList.value = response.data.slice || [];
        totalFAQ.value = response.data.list || [];

        totalPage.value = response.data.totalPage;
      } catch (error) {
        console.log('FAQ를 가져오지 못했습니다.', error);
      }
    };

    const truncateTitle = (title) => {
      return title.length > 24 ? title.substring(0, 24) + '...' : title;
    };

    // FAQ 상세 페이지로 이동하는 함수
    const adminFAQDetail = (id) => {
      router.push(`/mypage/admin/adminfaqdetail/${id}`);
    };

    // 페이지 변경 시 데이터 다시 가져오기
    watch(page, () => {
      getFAQs();
    });

    onMounted(() => {
      getFAQs();
    });

    return {
      page,
      pageSize,
      totalPage,
      FAQList,
      totalFAQ,

      getFAQs,
      truncateTitle,
      adminFAQDetail,
    };
  },
};
</script>

<style scoped>
th {
  border-bottom: 2px solid gray;
}
</style>
