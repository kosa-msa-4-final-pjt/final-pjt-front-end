<template>
  <!-- 전체 공지사항 공간 -->
  <div class="flex border-b cursor-pointer px-3 py-6 transition duration-300" @click="goToDetailPage">
    <div class="flex-1 flex flex-col pr-6">
      <!-- 제목 -->
      <h2 class="text-xl font-bold text-gray-900 mb-4">{{ title }}</h2>

      <!-- 내용 미리보기 -->
      <div class="text-gray-700">
        <p v-html="truncatedContent"></p>
      </div>

      <!-- 별점 및 작성자 정보 -->
      <div class="flex items-center mt-3 text-sm text-gray-600 font-medium">
        <span class="mr-4">{{ adminName }} 관리자</span>
        <span class="font-normal text-gray-500">{{ regDate }}</span>
      </div>
    </div>

    <!-- 썸네일 이미지 -->
    <div class="w-32 h-32 flex-shrink-0">
      <img src="@/assets/logo.png" alt="공지사항 이미지" class="w-full h-full object-cover rounded-lg shadow-sm" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '새로운 정책으로 여러분을 만납니다!',
      content:
        '항상 저희 플랫폼을 사랑해주시는 고객 여러분께 진심으로 감사드립니다. 여러분께 더 나은 서비스와 편리한 이용 환경을 제공하기 위해 체인집업 플랫폼이 새로운 정책을 도입하게 되어 이를 안내드리고자 합니다. 1. 개선된 사용자 경험 더욱 간편한 회원가입 절차: 기존보다 빠르고 쉬운 절차로 신규 회원 가입이 가능합니다. 개인화된 맞춤 서비스: 이용자 개개인의 선호도에 맞춘 맞춤형 추천 기능이 강화됩니다. 2. 안전한 거래 환경 보안 강화: 사용자 정보 보호를 위해 최신 보안 시스템을 도입하여 거래 과정의 안전성을 한층 더 강화했습니다. 리뷰 및 평가 시스템 개선: 신뢰할 수 있는 리뷰 기반의 평가 시스템을 통해 고객 여러분의 만족도를 높이겠습니다. 3. 더 다양한 혜택 포인트 적립제도 신설: 거래 시 적립된 포인트를 통해 다양한 혜택을 누리실 수 있습니다. 회원 등급제 도입: 이용 실적에 따라 차별화된 혜택을 받을 수 있는 등급제를 도입하였습니다. 저희 체인집업 플랫폼은 항상 여러분의 소중한 의견을 경청하고, 더 나은 서비스로 보답할 수 있도록 노력하겠습니다. 앞으로도 많은 관심과 성원부탁드립니다. 새로운 변화와 함께 더 나은 서비스로 찾아뵙겠습니다! 감사합니다. 체인집업 드림',
      adminName: '체인집업',
      regDate: '24.10.07',
      id: '1',
    };
  },
  props: {
    plateformEvent: {
      type: Object,
      required: true,
    },
  },
  computed: {
    // plateformEvent content 글자수 정하기 및 img태그 숨김
    truncatedContent() {
      if (!this.content) {
        return '';
      }
      const cleanedContent = this.content.replace(/<img[^>]*>/g, ''); // content에 img태그 지우기
      return cleanedContent.length > 100 ? cleanedContent.substring(0, 100) + '...' : cleanedContent;
    },

    // 게시일에 불필요한 시간 자르기
    // formattedRegDate() {
    //   if (!this.plateformEvent || !this.plateformEvent.regDate) return '';

    //   const date = new Date(this.regDate);
    //   const year = date.getFullYear();
    //   const month = String(date.getMonth() + 1).padStart(2, '0');
    //   const day = String(date.getDate()).padStart(2, '0');

    //   return `${year}.${month}.${day}`;
    // },
  },

  methods: {
    goToDetailPage() {
      this.$router.push(`/plateformEvents/list/${this.id}`);
    },
  },
};
</script>

<style scoped></style>
