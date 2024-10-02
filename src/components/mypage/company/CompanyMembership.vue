<template>
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
            </tr>
          </tbody>
        </table>
      </div>
      <!-- footer -->
      <!-- <div class="mt-5">페이지 네이션?</div> -->
    </div>
    <div v-else>
      <p>처음 멤버십을 가입하는 업체에게 보여주는 화면.</p>
      <p>가입한 내역이 있다면 멤버십 내역이 보임.</p>
      <button @click="this.$router.push('/payment')" class="bg-midGreen text-white rounded-lg py-2 px-4 font-medium">
        멤버십 가입
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

    const getMembershipHistory = async () => {
      try {
        const response = await authInstance.get('/api/memberships');
        memberships.value = response.data;
        console.log('안녕');
        console.log(memberships.value);
      } catch (error) {
        console.log('실패', error);
      }
    };

    const isActive = (startDate, endDate) => {
      const now = new Date(); // 현재 날짜
      const start = new Date(startDate);
      const end = new Date(endDate);
      return now >= start && now <= end; // 현재 날짜가 기간 내에 있는지 비교
    };

    onMounted(getMembershipHistory);

    return {
      memberships,
      isActive,
      getMembershipHistory,
    };
  },
};
</script>

<style scoped>
th {
  border-bottom: 2px solid gray;
}
</style>
