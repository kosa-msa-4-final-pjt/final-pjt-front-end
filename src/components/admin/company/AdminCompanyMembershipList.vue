<template>
  <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-opacity-75">
    <div class="bg-white p-6 rounded-lg shadow-lg">
      <h2 class="text-lg font-semibold mb-4">정말 환불하시겠습니까?</h2>

      <div class="flex justify-between">
        <button @click="confirmRefund" class="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">예</button>
        <button @click="closeModal" class="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">아니요</button>
      </div>
    </div>
  </div>

  <div v-if="isRefundComplete" class="fixed inset-0 flex items-center justify-center bg-opacity-75">
    <div class="bg-white p-6 rounded-lg shadow-lg flex-column">
      <h2 class="text-lg font-semibold mb-4">환불이 완료되었습니다.</h2>
      <div class="w-full text-center">
        <button @click="closeRefundCompleteModal" class="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">확인</button>
      </div>
    </div>
  </div>

  <div class="flex-col">
    <!-- header -->
    <div class="mb-10 p-5 bg-white rounded-lg">
      <h2 class="font-semibold text-xl mb-4">멤버십 관리</h2>
      <ul class="flex gap-4">
        <li>
          <label for="" class="font-medium">총 가입자수</label>
          <p class="text-red">{{ totalmembershipCompany }}명</p>
        </li>
        <li>
          <label for="" class="font-medium">총 가입비</label>
          <p class="text-red">{{ totalMembershipFee }}원</p>
        </li>
        <li>
          <label for="" class="font-medium">환불 처리수</label>
          <p class="text-red">{{ refundCount }}개</p>
        </li>
        <li>
          <label for="" class="font-medium">환불 처리금액</label>
          <p class="text-red">{{ refundAmount }}원</p>
        </li>
      </ul>
    </div>
    <!-- center -->
    <div>
      <table class="table border-2 border-solid border-gray-300 border-collapse w-full">
        <thead>
          <tr>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">업체명</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">멤버십 종류</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">멤버십 금액</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">멤버십 가입일</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">멤버십 만료일</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap"></th>
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
              <button
                v-if="company.validMembership"
                class="text-red border-red border-solid hover:border-gray-500 rounded-lg px-2 hover:text-gray-500 whitespace-nowrap border-2"
                @click="openModal(company.membershipId)"
              >
                환불
              </button>
              <p v-else class="border-solid border-red rounded-lg px-2 text-red whitespace-nowrap">만료</p>
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
import { defineComponent, onMounted, ref, watch, computed } from 'vue';
import { VuePaginate } from '@svifty7/vue-paginate';
import { authInstance } from '@/utils/axiosUtils';

export default defineComponent({
  components: {
    VuePaginate,
  },

  setup() {
    const page = ref(1);
    const pageSize = ref(6);
    const totalPage = ref();
    const refundCompanyId = ref(0);
    const isRefundComplete = ref(false); // 환불 완료 모달 상태
    const membershipCompany = ref([]);
    const totalmembershipCompany = ref(0);
    const isModalOpen = ref(false);

    const openModal = (companyId) => {
      isModalOpen.value = true;
      refundCompanyId.value = companyId;
    };

    const closeModal = () => {
      isModalOpen.value = false;
    };

    const closeRefundCompleteModal = () => {
      isRefundComplete.value = false;
    };

    const confirmRefund = async () => {
      await authInstance.post(`/api/admin/memberships/${refundCompanyId.value}/refund`);
      isModalOpen.value = false;
      isRefundComplete.value = true;
      fetchMembershipList(); // 환불 후 목록을 새로고침
    };

    const fetchMembershipList = async () => {
      const response = await authInstance.get(`/api/admin/memberships?page=${page.value - 1}&size=${pageSize.value}`);
      membershipCompany.value = response.data.slice || [];
      totalmembershipCompany.value = response.data.list.length;
      totalPage.value = response.data.totalPage;
    };

    // 총 가입비 계산하는 computed 속성
    const totalMembershipFee = computed(() => {
      return membershipCompany.value.reduce((acc, company) => acc + company.membershipPrice, 0);
    });

    // 환불 처리 건수를 계산하는 computed 속성
    const refundCount = computed(() => {
      return membershipCompany.value.filter((company) => !company.validMembership).length;
    });

    // 환불 처리 금액을 계산하는 computed 속성
    const refundAmount = computed(() => {
      return membershipCompany.value
        .filter((company) => !company.validMembership)
        .reduce((acc, company) => acc + company.membershipPrice, 0);
    });

    // 페이지 변경 시 데이터를 다시 가져오기
    watch(page, () => {
      fetchMembershipList();
    });

    // 컴포넌트가 마운트될 때 데이터를 불러오기
    onMounted(async () => {
      await fetchMembershipList();
    });

    return {
      totalmembershipCompany,
      membershipCompany,
      page,
      confirmRefund,
      pageSize,
      totalPage,
      isModalOpen,
      fetchMembershipList,
      openModal,
      closeModal,
      isRefundComplete,
      closeRefundCompleteModal,
      totalMembershipFee,
      refundCount,
      refundAmount,
    };
  },
});
</script>

<style scoped>
th {
  border-bottom: 2px solid gray;
}
</style>
