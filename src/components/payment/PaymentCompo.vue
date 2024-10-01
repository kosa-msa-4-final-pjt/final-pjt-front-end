<template>
  <div class="container mx-auto px-20 py-10">
    <!-- 멤버십 리스트 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-20 px-20">
      <div
        v-for="membership in membershipList"
        :key="membership.id"
        class="px-6 py-20 bg-white text-center shadow-sm rounded-lg border-2 border-gray-200 flex-colum"
      >
        <h3 class="text-2xl font-bold text-gray-800 mb-2">
          <font-awesome-icon :icon="['fas', 'dollar-sign']" />&nbsp;{{ membership.type }}
        </h3>
        <p class="text-4xl font-semibold text-gray-900"><span class="text-[26px]">월 </span>{{ membership.price }}원</p>

        <!-- 멤버십 설명 -->
        <div v-if="membership.type === 'BASIC'" class="my-8">
          <p class="text-gray-600 mb-2 font-medium">가장 기본적인 멤버십</p>
          <p class="text-gray-600 mb-2 font-medium">고객들의 견적 요청서 조회 가능</p>
          <p class="text-gray-600 font-medium">견적 요청 작성 가능</p>
        </div>
        <div v-else-if="membership.type === 'PREMIUM'" class="my-8">
          <p class="text-gray-600 mb-2 font-medium">광고 혜택이 주어지는 멤버십</p>
          <p class="text-gray-600 mb-2 font-medium">배너 광고 제공</p>
          <p class="text-gray-600 font-medium">업체 추천 시 페이지 상단에 위치</p>
        </div>

        <!-- 결제하기 버튼 -->
        <button
          @click="paymentRequest(membership.id)"
          class="flex items-center justify-center mt-6 text-[18px] bg-midGreen hover:bg-secondary text-white font-medium py-2 px-4 rounded w-full"
        >
          <font-awesome-icon :icon="['far', 'credit-card']" />
          <span>&nbsp;결제하기</span>
        </button>

        <!-- 환불 정책 안내 버튼 -->
        <button
          @click="showRefundPolicy"
          class="mt-4 text-[16px] bg-gray-200 text-gray-700 py-2 px-4 rounded w-full hover:bg-gray-300"
        >
          환불 정책 안내
        </button>
      </div>
    </div>

    <!-- 환불 요청 버튼 -->
    <div class="mt-8 text-right">
      <button @click="refundRequest" class="mr-20 bg-gray-400 text-white py-2 px-4 rounded hover:bg-red">
        환불 요청
      </button>
    </div>

    <!-- 환불 정책 모달 -->
    <div v-if="showPolicyModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-20">
      <div class="bg-white px-10 py-10 rounded-lg shadow-lg text-center">
        <h3 class="text-xl font-bold">환불 정책</h3>
        <p class="mt-4 text-gray-600">
          결제 후 7일 이내에 환불 요청 시 전액 환불이 가능합니다.
          <br />그 이후 환불은 불가합니다.
        </p>
        <button @click="closeRefundPolicy" class="mt-6 bg-midGreen text-white py-2 px-4 rounded">닫기</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/userStore';
import { mapState } from 'pinia';
import authInstance from '@/utils/axiosUtils';

const SERVER_BASE_URL = 'http://localhost:8080';

export default {
  data() {
    return {
      membershipList: [], // 멤버십 리스트
      showPolicyModal: false, // 환불 정책 모달 보이기 여부
    };
  },

  computed: {
    ...mapState(useUserStore, ['user']),
    ...mapState(useUserStore, { token: 'accessToken' }), // 토큰 저장
  },

  mounted() {
    // 멤버십 리스트 가져오기
    authInstance.get(`${SERVER_BASE_URL}/api/membershiptypes`).then((response) => {
      this.membershipList = response.data.data;
    });
  },

  methods: {
    async paymentRequest(membershipId) {
      try {
        // 결제 요청
        const response = await authInstance.post(`/api/payment/prepare`, { membershipId });
        console.log(response);
        const { price, type, merchantUid, paymentCompany } = response.data.data;

        console.log(response.data.data);

        window.IMP.request_pay(
          {
            pg: 'html5_inicis',
            pay_method: 'card',
            merchant_uid: merchantUid, // 주문 고유 번호
            name: type, // 결제할 멤버십 이름
            amount: price, // 가격

            // 회사 정보
            buyer_email: paymentCompany.companyEmail,
            buyer_name: paymentCompany.companyOwner,
            buyer_tel: paymentCompany.phoneNumber,
            buyer_addr: paymentCompany.companyAddr,
            buyer_postcode: paymentCompany.postcode,
          },

          async (response) => {
            const complete = await authInstance.post(`${SERVER_BASE_URL}/api/memberships`, {
              impUid: response.imp_uid,
              merchantUid: response.merchant_uid,
              success: response.success,
              paidAmount: response.paid_amount,
            });

            if (response.success) {
              alert('결제를 성공하셨습니다.');
              this.$router.push('/mypage/company');
            }

            console.log(complete.data.data);
          }
        );
      } catch (error) {
        console.log('결제 오류:', error);
      }
    },

    // 환불 요청
    async refundRequest() {
      try {
        const result = await authInstance.post(`${SERVER_BASE_URL}/api/membership`, {
          id: this.id,
        });
        console.log(result.data);
      } catch (error) {
        console.log('환불 오류:', error);
      }
    },

    // 환불 정책 모달 열기
    showRefundPolicy() {
      this.showPolicyModal = true;
    },

    // 환불 정책 모달 닫기
    closeRefundPolicy() {
      this.showPolicyModal = false;
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
