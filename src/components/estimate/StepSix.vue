<template>
  <div class="company-list w-full p-6">
    <div class="header text-xl text-center mb-6">요청에 맞는 인테리어 업체들을 추천해드립니다!</div>

    <!-- 프리미엄 등급 업체 리스트 또는 메시지 -->
    <div class="border border-gray-300 rounded-lg p-4 pb-2 bg-white mb-4">
      <div class="text-lg font-bold mb-4">
        <span>프리미엄 업체 목록</span>
      </div>
      <div>
        <!-- 프리미엄 업체가 있을 때 -->
        <div v-if="sortedCompanies.PREMIUM.length > 0">
          <div
            v-for="company in sortedCompanies.PREMIUM"
            :key="company.id"
            class="company-card flex items-center justify-between bg-gray-100 rounded-lg p-4 mb-4"
          >
            <div class="company-logo">
              <img
                :src="company.companyLogoUrl ? company.companyLogoUrl : require('@/assets/logo.png')"
                alt="업체 로고"
                class="w-16 h-16"
              />
            </div>
            <div class="company-info flex-1 pl-4">
              <div class="company-header flex items-center">
                <span class="company-name text-lg font-bold">
                  {{ company.companyName || 'Unknown Company' }}
                </span>
              </div>
              <div class="flex justify-start">
                <p class="text-xs text-gray-500 mr-2">{{ company.rating }}건의 공사</p>
                <p class="text-xs text-midGreen flex items-center">
                  <font-awesome-icon icon="star" />
                  <span class="ml-1">{{ company.rating }}</span>
                </p>
              </div>
            </div>
            <div class="contact ml-4">
              <button
                :disabled="isRequested(company.id)"
                :class="[
                  'text-white rounded-xl py-2 px-4 transition-colors duration-300',
                  isRequested(company.id) ? 'bg-gray-400 cursor-not-allowed' : 'bg-midGreen hover:bg-green-600',
                ]"
                @click="sendEstimateRequest(company.id)"
              >
                {{ isRequested(company.id) ? '요청 완료' : '요청' }}
              </button>
            </div>
          </div>
          <div class="text-right mb-2">
            <button class="text-white rounded-xl py-2 px-4 transition-colors duration-300 bg-midGreen">
              요청 확인
            </button>
          </div>
        </div>
        <!-- 프리미엄 업체가 없을 때 -->
        <div v-else class="mb-5 text-center text-gray-500">근처에 프리미엄 업체가 없습니다.</div>
      </div>
    </div>

    <!-- 다른 업체를 보시겠습니까? 버튼 (다른 등급의 업체가 있을 때만 표시) -->
    <div class="text-center" v-if="hasOtherCompanies">
      <button
        v-if="!showOtherCompanies"
        class="text-white rounded-xl py-2 px-4 transition-colors duration-300 bg-midGreen hover:bg-green-600"
        @click="showOtherCompaniesMethod"
      >
        다른 업체를 보시겠습니까?
      </button>
    </div>

    <!-- 다른 등급의 등급 업체 리스트 또는 메시지 -->
    <div v-if="showOtherCompanies">
      <div class="border border-gray-300 rounded-lg p-4 pb-2 bg-white">
        <div class="text-lg font-bold mb-4">
          <span>다른 업체 목록</span>
        </div>
        <div>
          <!-- 다른 등급의 업체가 있을 때 -->
          <div v-if="sortedCompanies.OTHER.length > 0">
            <div
              v-for="company in sortedCompanies.OTHER"
              :key="company.id"
              class="company-card flex items-center justify-between bg-gray-100 rounded-lg p-4 mb-4"
            >
              <div class="company-logo">
                <img
                  :src="company.companyLogoUrl ? company.companyLogoUrl : require('@/assets/logo.png')"
                  alt="업체 로고"
                  class="w-16 h-16"
                />
              </div>
              <div class="company-info flex-1 pl-4">
                <div class="company-header flex items-center">
                  <span class="company-name text-lg font-bold">
                    {{ company.companyName || 'Unknown Company' }}
                  </span>
                </div>
                <div class="flex justify-start">
                  <p class="text-xs text-gray-500 mr-2">{{ company.rating }}건의 공사</p>
                  <p class="text-xs text-midGreen flex items-center">
                    <font-awesome-icon icon="star" />
                    <span class="ml-1">{{ company.rating }}</span>
                  </p>
                </div>
              </div>
              <div class="contact ml-4">
                <button
                  :disabled="isRequested(company.id)"
                  :class="[
                    'text-white rounded-xl py-2 px-4 transition-colors duration-300',
                    isRequested(company.id) ? 'bg-gray-400 cursor-not-allowed' : 'bg-midGreen hover:bg-green-600',
                  ]"
                  @click="sendEstimateRequest(company.id)"
                >
                  {{ isRequested(company.id) ? '요청 완료' : '요청' }}
                </button>
              </div>
            </div>
            <div class="text-right mb-2">
              <button class="text-white rounded-xl py-2 px-4 transition-colors duration-300 bg-midGreen">
                요청 확인
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 로딩 중이거나 에러 메시지 -->
    <div v-if="loading" class="text-center text-gray-500">로딩 중...</div>
    <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>
    <div v-else-if="!sortedCompanies.PREMIUM.length && !sortedCompanies.OTHER.length" class="text-center">
      <!-- 다른 등급의 업체가 없을 때 -->
      <button class="bg-gray-400 cursor-not-allowed text-white rounded-xl py-2 px-4 transition-colors duration-300">
        근처에 다른 업체가 없습니다.
      </button>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch, onMounted, computed } from 'vue';
import axios from 'axios';

export default {
  props: {
    city: {
      type: String,
      required: false,
    },
    district: {
      type: String,
      required: false,
    },
    constructionTypeIds: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  setup(props) {
    const companies = ref([]);
    const sortedCompanies = reactive({
      PREMIUM: [],
      OTHER: [],
    });
    const loading = ref(true);
    const error = ref(null);
    const requestedCompanies = ref([]);

    // 다른 등급의 업체 표시 여부를 관리하는 ref
    const showOtherCompanies = ref(false);

    // 다른 등급의 업체가 있는지 확인하는 computed
    const hasOtherCompanies = computed(() => {
      return sortedCompanies.OTHER.length > 0;
    });

    // 업체 리스트를 가져오는 메서드
    const fetchCompanies = async () => {
      loading.value = true;
      error.value = null;
      try {
        let url = '/api/company/list';
        const params = [];

        // 지역 선택이 된 경우
        if (props.city && props.district) {
          params.push(`city=${props.city}&district=${props.district}`);
        } else if (props.city) {
          params.push(`city=${props.city}`);
        }

        // 선택된 시공 서비스가 있을 경우 필터링 추가
        if (props.constructionTypeIds.length > 0) {
          params.push(`services=${props.constructionTypeIds.join(',')}`);
        }

        // URL에 파라미터 추가
        if (params.length > 0) {
          url += `?${params.join('&')}`;
        }

        console.log('요청 파라미터:', params);

        const response = await axios.get(url);
        companies.value = response.data;
        sortCompanies();
        console.log('응답 데이터:', response);
      } catch (err) {
        console.error('업체를 불러오는 중 오류가 발생했습니다:', err);
        error.value = '업체 목록을 불러오는 데 실패했습니다';
      } finally {
        loading.value = false;
      }
    };

    // 업체 데이터를 PREMIUM과 다른 등급의 업체로 나누는 메서드
    const sortCompanies = () => {
      sortedCompanies.PREMIUM = companies.value.PREMIUM || [];
      sortedCompanies.OTHER = [...(companies.value.BASIC || []), ...(companies.value.NO || [])];
    };

    // 다른 등급의 업체를 보시겠습니까? 버튼의 표시 메서드 (토글 없이 단순히 표시)
    const showOtherCompaniesMethod = () => {
      showOtherCompanies.value = true;
    };

    // 특정 업체가 요청 완료되었는지 확인하는 메서드
    const isRequested = (companyId) => {
      return requestedCompanies.value.includes(companyId);
    };

    // 견적 요청을 보내는 메서드
    const sendEstimateRequest = async (companyId) => {
      const isConfirm = confirm('요청을 보내시겠습니까?');
      if (!isConfirm) return;

      try {
        // 최신 견적 요청 ID 가져오기
        const estimateResponse = await axios.get('/api/estimates/request/latest');
        const estimateRequestId = estimateResponse.data.data;

        const requestPayload = {
          companyId: companyId,
          estimateRequestId: estimateRequestId,
        };

        // API로 견적 요청 전송
        const response = await axios.post('/api/estimates/send', requestPayload);
        console.log(response);

        // 요청 완료된 회사 ID 저장
        requestedCompanies.value.push(companyId);

        alert('견적 요청이 완료되었습니다.');
      } catch (err) {
        console.error('견적 요청을 보내는 중 오류가 발생했습니다:', err);
        alert('견적 요청을 보내는 데 실패했습니다.');
      }
    };

    // Props가 변경될 때마다 업체 리스트를 다시 가져옴
    watch(
      () => [props.city, props.district, props.constructionTypeIds],
      () => {
        fetchCompanies();
      }
    );

    // 컴포넌트가 마운트될 때 업체 리스트를 가져옴
    onMounted(() => {
      fetchCompanies();
    });

    return {
      companies,
      sortedCompanies,
      loading,
      error,
      requestedCompanies,
      showOtherCompanies,
      showOtherCompaniesMethod,
      isRequested,
      sendEstimateRequest,
      hasOtherCompanies, // computed 추가
    };
  },
};
</script>

<style scoped>
.company-card img {
  object-fit: cover;
}
</style>
