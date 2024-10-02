<template>
  <!-- 시공할 주소 입력 -->
  <h2 class="text-lg font-semibold my-10">시공할 주소를 선택해주세요.</h2>
  <div class="space-y-3 mb-10">
    <input
      type="text"
      placeholder="주소를 검색해주세요."
      class="w-full p-2 border rounded-md mb-3"
      v-model="address"
      readonly
    />

    <!-- Daum 우편번호 서비스 Wrap -->
    <div
      id="wrap"
      ref="wrap"
      class="border border-gray-300 h-72 overflow-hidden relative mx-auto"
      style="display: none"
    >
      <img
        src="//t1.daumcdn.net/postcode/resource/images/close.png"
        class="absolute right-0 top-0 z-10 cursor-pointer"
        @click="foldDaumPostcode"
        alt="접기 버튼"
      />
    </div>

    <input
      type="text"
      placeholder="(선택) 지역과 상세주소를 입력해주세요."
      class="w-full p-2 border rounded-md"
      v-model="detailedAddress"
      ref="detailedAddress"
    />
    <button @click="searchAddress" class="p-2 bg-gray-600 text-white rounded-lg">주소 검색</button>
  </div>

  <!-- 실측 가능일 선택 -->
  <h2 class="text-lg font-semibold mt-6 mb-5">실측 가능일을 선택해주세요. (선택사항)</h2>
  <input type="date" class="w-full p-2 border rounded-md mb-5" v-model="measureDate" :min="minDate" />

  <!-- 버튼 영역 -->
  <div class="mt-6 flex justify-between">
    <button @click="prevStep" class="w-24 py-2 bg-primary rounded-lg text-white" :disabled="step === 1">이전</button>

    <button
      @click="finish"
      :disabled="!address"
      class="w-24 py-2 rounded-lg text-white"
      :class="{
        'bg-gray-400 cursor-not-allowed': !address,
        'bg-primary hover:bg-primary-dark cursor-pointer': address,
      }"
    >
      완료
    </button>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/userStore';
import { mapState } from 'pinia';
import { authInstance } from '@/utils/axiosUtils';

export default {
  props: ['step', 'formData'],

  data() {
    return {
      address: this.formData.address || '', // 주소
      detailedAddress: this.formData.detailedAddress || '', // 상세 주소
      extraAddress: '', // 참고항목
      measureDate: this.formData.measureDate || '', // 실측 가능일
      minDate: '', // 현재 날짜
    };
  },

  computed: {
    ...mapState(useUserStore, ['user']),
    ...mapState(useUserStore, {
      token: 'accessToken',
    }),
  },

  methods: {
    // 주소 검색 버튼 클릭 시 실행되는 메서드
    searchAddress() {
      this.openDaumPostcode();
    },

    // Daum 우편번호 서비스 열기
    openDaumPostcode() {
      const currentScroll = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
      new window.daum.Postcode({
        oncomplete: (data) => {
          let addr = '';
          let extraAddr = '';

          // 사용자가 도로명 주소를 선택한 경우
          if (data.userSelectedType === 'R') {
            addr = data.roadAddress;
          } else {
            // 사용자가 지번 주소를 선택한 경우
            addr = data.jibunAddress;
          }

          // 도로명 주소 선택 시 참고항목 추가
          if (data.userSelectedType === 'R') {
            if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
              extraAddr += data.bname;
            }
            if (data.buildingName !== '' && data.apartment === 'Y') {
              extraAddr += extraAddr !== '' ? ', ' + data.buildingName : data.buildingName;
            }
            if (extraAddr !== '') {
              extraAddr = ' (' + extraAddr + ')';
            }
          }

          // 선택한 주소를 주소 필드에 입력
          this.address = addr + extraAddr;

          // 상세 주소 입력 필드에 포커스 이동
          this.$nextTick(() => {
            this.$refs.detailedAddress.focus();
          });

          // 우편번호 검색 창 닫기
          this.$refs.wrap.style.display = 'none';
          document.body.scrollTop = currentScroll;
        },
        // 창의 크기가 변경될 때 처리
        onresize: (size) => {
          this.$refs.wrap.style.height = size.height + 'px';
        },
        width: '100%',
        height: '100%',
      }).embed(this.$refs.wrap);

      // 우편번호 검색 창 표시
      this.$refs.wrap.style.display = 'block';
    },

    // 우편번호 검색 창 접기
    foldDaumPostcode() {
      this.$refs.wrap.style.display = 'none';
    },

    // 완료 버튼 클릭 시 실행되는 메서드
    finish() {
      this.$emit('updateFormData', {
        address: this.address,
        detailedAddress: this.detailedAddress,
        measureDate: this.measureDate,
      });

      this.$nextTick(() => {
        if (!this.formData.address) {
          alert('주소를 입력해주세요.');
          return;
        }

        // 서버로 폼 데이터를 전송
        authInstance
          .post('/api/estimaterequests', this.formData)
          .then((response) => {
            alert('견적 요청이 완료되었습니다.');

            // 견적 요청이 완료된 후, 부모 컴포넌트에 데이터 전달
            this.$emit('sendDataToParent', {
              city: response.data.city,
              district: response.data.district,
              constructionTypeIds: response.data.constructionTypeIds,
            });

            this.$router.push('/requestEstimate/stepSix');
            console.log(response);
          })
          .catch((error) => {
            console.error('폼 제출 중 오류 발생:', error);
            alert('견적 요청에 실패했습니다.');
          });
      });
    },

    // 이전 단계로 이동
    prevStep() {
      this.$emit('prevStep');
      this.$router.push('/requestEstimate/stepFour');
    },
  },

  mounted() {
    // 오늘 날짜를 minDate로 설정 (실측 가능일 선택 시 과거 날짜 선택 방지)
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    this.minDate = `${yyyy}-${mm}-${dd}`;
  },
};
</script>

<style scoped>
.bg-primary {
  background-color: #0a3a5e;
}
div > div {
  transition: width 1s ease;
}
</style>
