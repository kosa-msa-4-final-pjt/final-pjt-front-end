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
    <div class="bg-white p-6 rounded-lg shadow-lg">
      <h2 class="text-lg font-semibold mb-4">환불이 완료되었습니다.</h2>
      <button @click="closeRefundCompleteModal" class="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">확인</button>
    </div>
  </div>


  <div class="p-4 max-w-screen-lg mx-auto">
    <div class="mb-6">
      <h3 class="font-bold text-2xl text-gray-800">멤버십 내역</h3>
    </div>
    <div v-if="memberships.length > 0" class="flex-col">
      <!-- header -->
      <div class="mb-10 p-5 bg-white rounded-lg">
        <ul class="flex justify-between">
          <li>
            <div>
              <span class="mr-2 font-bold">{{ memberships[0]?.companyName }} 님</span>
              <span class="border-solid border-2 border-secondary rounded-lg px-2 text-secondary whitespace-nowrap">
                {{ memberships[0]?.typeName }}
              </span>
              <p class="mt-1">{{ memberships[0]?.email }}</p>
            </div>
          </li>
          <li>
            <button
              @click="this.$router.push('/payment')"
              class="bg-midGreen text-white rounded-lg py-2 px-4 font-medium"
            >
              {{ isActive(memberships[0]?.startDate, memberships[0]?.endDate) ? '멤버십 변경' : '멤버십 갱신' }}
            </button>
          </li>
        </ul>
      </div>
      <!-- center -->
      <div>
        <table class="table border-2 border-solid border-gray-300 border-collapse w-full">
          <thead>
          <tr>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">멤버십명</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">결제금액</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">이용기간</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">상태</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">환불</th>
          </tr>
          </thead>
          <tbody v-for="(membership, index) in memberships" :key="index">
          <tr>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              {{ membership.typeName }}
            </td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              {{ membership.price }}
            </td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              {{ membership.startDate }} ~ {{ membership.endDate }}
            </td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              {{ isActive(membership.startDate, membership.endDate) ? '구독중' : '만료' }}
            </td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              <button
                v-if="isActive(membership.startDate, membership.endDate)"
                class="text-red border-red border-solid hover:border-gray-500 rounded-lg px-2 hover:text-gray-500 whitespace-nowrap border-2"
                @click="openModal(membership.id)"
              >
                환불
              </button>
              <p v-else class="border-solid border-red rounded-lg px-2 text-gray-500 whitespace-nowrap">만료</p>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 멤버십이 없는 경우 -->
    <div v-else class="flex flex-col items-center justify-center py-16 bg-gray-100 rounded-lg">
      <p class="text-lg font-semibold text-gray-700 mb-4">아직 멤버십에 가입하지 않으셨습니다.</p>
      <p class="text-sm text-gray-500 mb-8">멤버십에 가입하시면 다양한 혜택을 누리실 수 있습니다.</p>
      <button
        @click="this.$router.push('/payment')"
        class="bg-midGreen text-white rounded-lg py-3 px-6 font-medium hover:bg-green-600 transition duration-200"
      >
        멤버십 가입하기
      </button>
    </div>
  </div>
</template>

<script>
import { authInstance } from '@/utils/axiosUtils';
import { onMounted, ref } from 'vue';

export default {
  setup() {
    const memberships = ref([]);

    const isModalOpen = ref(false);
    const refundCompanyId = ref(0);
    const isRefundComplete = ref(false);


    const openModal = (companyId) => {
      isModalOpen.value = true;
      console.log(companyId)
      refundCompanyId.value = companyId;
    };

    const closeModal = () => {
      isModalOpen.value = false;
    };

    const closeRefundCompleteModal = () => {
      isRefundComplete.value = false;
    };

    const confirmRefund = async () => {
      console.log(refundCompanyId)
      const refundResult = await authInstance.patch(`/api/memberships/${refundCompanyId.value}/refund`);
      console.log(refundResult.data);
      isModalOpen.value = false;
      isRefundComplete.value = true;
        window.location.reload();
    };

    const getMembershipHistory = async () => {
      try {
        const response = await authInstance.get('/api/memberships');
        memberships.value = response.data;
      } catch (error) {
        console.log('실패', error);
      }
    };

    const isActive = (startDate, endDate) => {
      const now = new Date();
      const start = new Date(startDate);
      const end = new Date(endDate);
      return now >= start && now <= end;
    };

    onMounted(getMembershipHistory);

    return {
      memberships,
      isActive,
      isModalOpen,
      refundCompanyId,
      isRefundComplete,
      openModal,
      closeModal,
      closeRefundCompleteModal,
      confirmRefund,
    };
  },
};
</script>

<style scoped>
th {
  border-bottom: 2px solid gray;
}
</style>
