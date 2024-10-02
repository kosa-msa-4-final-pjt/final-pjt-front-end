<template>
  <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
    <div class="bg-white p-6 rounded-lg shadow-lg">
      <h2 class="text-lg font-semibold mb-4">정말 환불하시겠습니까?</h2>

      <div class="flex justify-end space-x-4">
        <button @click="confirmRefund" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">예</button>
        <button @click="closeModal" class="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">아니요</button>
      </div>
    </div>
  </div>

  <div class="flex-col">
    <!-- header -->
    <div class="mb-10 p-5 bg-white rounded-lg">
      <h2 class="font-semibold text-xl mb-4">멤버십 가입자 관리</h2>
      <ul class="flex gap-4">
        <li>
          <label for="" class="font-medium">총 가입자수</label>
          <p class="text-red">{{ totalmembershipCompany.length }}명</p>
        </li>
        <li>
          <label for="" class="font-medium">신규 가입자수</label>
          <p class="text-red">?명</p>
        </li>
        <li>
          <label for="" class="font-medium">총 가입비</label>
          <p class="text-red">?원</p>
        </li>
        <li>
          <label for="" class="font-medium">환불 처리수</label>
          <p class="text-red">?개</p>
        </li>
        <li>
          <label for="" class="font-medium">환불 처리금액</label>
          <p class="text-red">?원</p>
        </li>
      </ul>
    </div>
    <!-- center -->
    <div class="flex-col">
      <table class="table border-2 border-solid border-gray-300 border-collapse w-full">
        <thead>
          <tr>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">업체명</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">멤버십 종류</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">멤버십 금액</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">멤버십 가입일</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">멤버십 만료일</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">상태</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">환불 상태</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">환불</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="company in membershipCompany" :key="company.companyId">
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              {{ company.companyName }}
            </td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              {{ company.membershipName }}
            </td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              {{ company.membershipPrice }}원
            </td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">{{ company.startDate }}</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">{{ company.endDate }}</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              <p
                class="border-solid border-secondary rounded-lg px-2 text-secondary whitespace-nowrap"
                :class="{ 'border-2': company.validMembership, 'border-red': !company.validMembership }"
              >
                {{ company.validMembership ? '진행' : '정지' }}
              </p>
            </td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">X</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              <button
                class="px-2 rounded-lg whitespace-nowrap bg-gray-200 cursor-pointer hover:bg-gray-300"
                @click="openModal"
              >
                환불처리
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
        :page-count="totalPage"
        :page-range="3"
        :margin-pages="2"
        :click-handler="fetchMembershipList"
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
import { defineComponent, onMounted, ref, watch } from 'vue';
import { VuePaginate } from '@svifty7/vue-paginate';
import { authInstance } from '@/utils/axiosUtils';

export default defineComponent({
  components: {
    VuePaginate,
  },

  setup() {
    const page = ref(1);
    const pageSize = ref(5);
    const totalPage = ref();

    const membershipCompany = ref([]);
    const totalmembershipCompany = ref([]);
    const isModalOpen = ref(false);

    const openModal = () => {
      console.log(isModalOpen.value);
      isModalOpen.value = true;
    };

    const closeModal = () => {
      isModalOpen.value = false;
    };

    const fetchMembershipList = async () => {
      const response = await authInstance.get(`/api/admin/memberships?page=${page.value - 1}&size=${pageSize.value}`);
      console.log(response.data);
      membershipCompany.value = response.data.slice || [];
      totalmembershipCompany.value = response.data.list || [];

      totalPage.value = response.data.totalPage;
    };

    // 페이지 변경 시 데이터 다시 가져오기
    watch(page, () => {
      fetchMembershipList();
    });

    // 컴포넌트가 마운트될 때 데이터 불러오기
    onMounted(() => {
      fetchMembershipList();
    });

    return {
      membershipCompany,
      page,
      pageSize,
      totalPage,
      totalmembershipCompany,
      isModalOpen,
      fetchMembershipList,
      openModal,
      closeModal,
    };
  },
});
</script>

<style scoped></style>
