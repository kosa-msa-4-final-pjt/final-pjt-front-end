<template>
  <div class="w-full mx-auto px-6 py-8">
    <p class="text-2xl font-semibold text-center pb-6">멤버십 등록</p>

    <form
      @submit.prevent="insertMembership"
      class="max-w-[720px] mx-auto bg-white p-6 border-[1px] border-gray-300 rounded-lg"
    >
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label for="name" class="block text-sm font-medium mb-2">멤버십명</label>
          <input
            v-model="name"
            class="w-full h-[44px] text-sm p-3 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-midGreen"
            type="text"
            placeholder="멤버십명을 입력해주세요."
            required
          />
        </div>
        <div>
          <label for="price" class="block text-sm font-medium mb-2">가격</label>
          <input
            v-model="price"
            class="w-full h-[44px] text-sm p-3 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-midGreen"
            type="number"
            placeholder="가격을 입력해주세요."
            required
          />
        </div>
      </div>

      <div class="mb-6">
        <label for="desc" class="block text-sm font-medium mb-2">소개</label>
        <textarea
          v-model="description"
          class="w-full h-[150px] text-sm p-3 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-midGreen resize-none"
          placeholder="멤버십에 대한 설명을 입력해주세요."
          required
        ></textarea>
      </div>

      <!-- 버튼 공간 -->
      <div class="flex gap-12">
        <button
          class="bg-midGreen hover:bg-[#2a692d] text-white w-1/2 h-[44px] rounded text-[16px] font-medium mt-6"
          type="submit"
        >
          등록하기
        </button>
        <button
          class="bg-midGreen hover:bg-[#2a692d] text-white w-1/2 h-[44px] rounded text-[16px] font-medium mt-6"
          @click="goBack"
        >
          되돌아가기
        </button>
      </div>
    </form>
  </div>
</template>
<script>
import authInstance from '@/utils/axiosUtils';

export default {
  data() {
    return {
      name: '',
      description: '',
      price: '',
    };
  },
  methods: {
    async insertMembership() {
      const membershipData = {
        name: this.name,
        // description: this.description,
        price: this.price,
      };

      try {
        await authInstance.post('/api/admin/membership', membershipData);
        alert('멤버십이 성공적으로 등록되었습니다.');
        this.$router.push('/mypage/admin/adminMembershipList');
      } catch (error) {
        console.error('멤버십 등록 실패:', error);
        alert('멤버십 등록에 실패하였습니다.');
      }
    },
    goBack() {
      this.$router.back();
    },
  },
};
</script>
