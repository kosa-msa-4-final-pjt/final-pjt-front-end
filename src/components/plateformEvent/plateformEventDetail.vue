<template>
  <div class="container w-[850px] mx-auto p-8">
    <!-- 이미지 -->
    <div class="my-carousel mb-8">
      <img
        class="w-[850px] h-[400px] rounded-lg object-cover"
        :src="require('@/assets/logo.png')"
        alt="plateformEvent Image"
      />
    </div>

    <!-- 공지사항 제목 -->
    <div class="bg-white p-6 mb-8 border-b-[1px] border-gray-200">
      <h2 class="text-3xl font-bold text-gray-900 mb-4">{{ plateformEventDetail.title }}</h2>
      <div class="flex justify-between items-center text-gray-600">
        <div>
          <p class="text-md text-gray-600 mb-1 font-semibold">{{ plateformEventDetail.adminName }} 관리자</p>
          <p class="text-sm text-gray-400 font-medium">{{ plateformEventDetail.regDate }}</p>
        </div>
      </div>
    </div>

    <!-- 공지사항 내용 섹션 -->
    <div class="bg-white p-6 pb-20 rounded-lg border-b-[1px] border-gray-200">
      <div class="text-gray-700 leading-relaxed">{{ plateformEventDetail.content }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      plateformEventDetail: {
        title: '새로운 정책으로 여러분을 만납니다!',
        content:
          '항상 저희 플랫폼을 사랑해주시는 고객 여러분께 진심으로 감사드립니다. 여러분께 더 나은 서비스와 편리한 이용 환경을 제공하기 위해 체인집업 플랫폼이 새로운 정책을 도입하게 되어 이를 안내드리고자 합니다. 1. 개선된 사용자 경험 더욱 간편한 회원가입 절차: 기존보다 빠르고 쉬운 절차로 신규 회원 가입이 가능합니다. 개인화된 맞춤 서비스: 이용자 개개인의 선호도에 맞춘 맞춤형 추천 기능이 강화됩니다. 2. 안전한 거래 환경 보안 강화: 사용자 정보 보호를 위해 최신 보안 시스템을 도입하여 거래 과정의 안전성을 한층 더 강화했습니다. 리뷰 및 평가 시스템 개선: 신뢰할 수 있는 리뷰 기반의 평가 시스템을 통해 고객 여러분의 만족도를 높이겠습니다. 3. 더 다양한 혜택 포인트 적립제도 신설: 거래 시 적립된 포인트를 통해 다양한 혜택을 누리실 수 있습니다. 회원 등급제 도입: 이용 실적에 따라 차별화된 혜택을 받을 수 있는 등급제를 도입하였습니다. 저희 체인집업 플랫폼은 항상 여러분의 소중한 의견을 경청하고, 더 나은 서비스로 보답할 수 있도록 노력하겠습니다. 앞으로도 많은 관심과 성원부탁드립니다. 새로운 변화와 함께 더 나은 서비스로 찾아뵙겠습니다! 감사합니다. 체인집업 드림',
        adminName: '체인집업',
        regDate: '24.10.07',
      },
    };
  },
};
</script>

<style scoped>
.container {
  max-width: 850px;
  margin: 0 auto;
}
</style>
