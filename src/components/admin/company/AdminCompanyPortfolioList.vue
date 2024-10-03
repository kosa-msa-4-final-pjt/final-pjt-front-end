<template>
  <div class="flex-col">
    <!-- header -->
    <div class="mb-10 p-5 bg-white rounded-lg">
      <h2 class="font-semibold text-xl mb-4">시공사례 관리</h2>
      <ul class="flex gap-4">
        <li>
          <label for="" class="font-medium">총 시공 사례수</label>
          <p class="text-red">{{ totalPortfolio.length }}명</p>
        </li>
      </ul>
    </div>
    <!-- center -->
    <div>
      <table class="table border-2 border-solid border-gray-300 border-collapse w-full">
        <thead>
          <tr>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">제목</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">업체명</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">게시일</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">상세보기</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="portfolio in portfolios" :key="portfolio.id">
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              {{ portfolio.title }}
            </td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              {{ portfolio.companyName }}
            </td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              {{ formatDate(portfolio.createdAt) }}
            </td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              <button
                class="px-2 rounded-lg whitespace-nowrap bg-gray-200 cursor-pointer hover:bg-gray-300"
                @click="adminPortfolioDetail(portfolio.id)"
              >
                상세보기
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- footer -->
    <div class="mt-5" v-if="totalPage > 1">
      <vue-paginate
        :model-value="page"
        :page-count="totalPage"
        :page-range="3"
        :margin-pages="2"
        :click-handler="fetchPortfolioList"
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
import { defineComponent, onMounted, ref } from 'vue';
import { VuePaginate } from '@svifty7/vue-paginate';
import { useRouter } from 'vue-router';
import { authInstance } from '@/utils/axiosUtils';
import { watch } from 'vue';

export default defineComponent({
  components: {
    VuePaginate,
  },

  setup() {
    const page = ref(1);
    const pageSize = ref(5);
    const totalPage = ref();

    const portfolios = ref([]);
    const totalPortfolio = ref([]);
    const router = useRouter();

    const adminPortfolioDetail = (id) => {
      router.push(`/mypage/admin/adminCompanyPortfolioDetail/${id}`);
    };

    const fetchPortfolioList = async () => {
      try {
        const response = await authInstance.get(`/api/admin/portfolios?page=${page.value - 1}&size=${pageSize.value}`);
        console.log(response.data);
        portfolios.value = response.data.slice || [];
        totalPortfolio.value = response.data.list || [];

        totalPage.value = response.data.totalPage;
      } catch (error) {
        console.error('Failed to fetch portfolio data', error);
      }
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; // Returns the date part only in YYYY-MM-DD format
    };

    // 페이지 변경 시 데이터 다시 가져오기
    watch(page, () => {
      fetchPortfolioList();
    });

    // 컴포넌트가 마운트될 때 데이터 불러오기
    onMounted(() => {
      fetchPortfolioList();
    });

    return {
      portfolios,
      page,
      pageSize,
      totalPage,
      totalPortfolio,
      adminPortfolioDetail,
      fetchPortfolioList,
      formatDate,
    };
  },
});
</script>

<style scoped>
th {
  border-bottom: 2px solid gray;
}
</style>
