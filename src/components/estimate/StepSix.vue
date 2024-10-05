<!-- CompanyList.vue -->
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
            <div class="text-right mb-2"></div>
          </div>
          <!-- 다른 등급의 업체가 없을 때 -->
          <div v-else class="mb-5 text-center text-gray-500">근처에 다른 업체가 없습니다.</div>
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
  <div class="text-right mb-2">
    <button
      v-if="sortedCompanies.PREMIUM.length > 0 || sortedCompanies.OTHER.length > 0"
      class="text-white rounded-xl py-2 px-4 transition-colors duration-300 bg-midGreen"
      @click="goToUserSaveRequests"
    >
      요청 확인
    </button>
  </div>
</template>

<script>
import { ref, reactive, watch, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router'; // useRouter 임포트
import { instance, authInstance } from '@/utils/axiosUtils';

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
    const router = useRouter(); // 라우터 초기화

    const companies = reactive({
      PREMIUM: [],
      BASIC: [],
      // NO: [], // 'NO' grade removed
    });
    const sortedCompanies = reactive({
      PREMIUM: [],
      OTHER: [],
    });
    const loading = ref(true);
    const error = ref(null);
    const requestedCompanies = ref([]);

    const showOtherCompanies = ref(false);

    const hasOtherCompanies = computed(() => {
      return sortedCompanies.OTHER.length > 0;
    });

    const grades = ['PREMIUM', 'BASIC']; // Removed 'NO'

    const fetchCompanies = async () => {
      loading.value = true;
      error.value = null;
      try {
        const requests = grades.map((grade) => {
          let url = `/api/company/categorylist?page=0&size=5&name=${grade}`;
          const params = [];

          if (props.city && props.district) {
            params.push(`city=${props.city}&district=${props.district}`);
          } else if (props.city) {
            params.push(`city=${props.city}`);
          }

          if (props.constructionTypeIds.length > 0) {
            params.push(`services=${props.constructionTypeIds.join(',')}`);
          }

          if (params.length > 0) {
            url += `&${params.join('&')}`;
          }
          return instance.get(url);
        });

        const responses = await Promise.all(requests);
        responses.forEach((response, index) => {
          const grade = grades[index];
          companies[grade] = response.data.list;
        });

        sortCompanies();
      } catch (err) {
        console.error('업체를 불러오는 중 오류가 발생했습니다:', err);
        error.value = '업체 목록을 불러오는 데 실패했습니다';
      } finally {
        loading.value = false;
      }
    };

    const sortCompanies = () => {
      sortedCompanies.PREMIUM = companies.PREMIUM || [];
      sortedCompanies.OTHER = [...(companies.BASIC || [])]; // Only BASIC is included in OTHER
    };

    const showOtherCompaniesMethod = () => {
      showOtherCompanies.value = true;
    };

    const isRequested = (companyId) => {
      return requestedCompanies.value.includes(companyId);
    };

    const sendEstimateRequest = async (companyId) => {
      const isConfirm = confirm('요청을 보내시겠습니까?');
      if (!isConfirm) return;

      try {
        const estimateResponse = await authInstance.get('/api/estimates/request/latest');
        const estimateRequestId = estimateResponse.data.data;

        const requestPayload = {
          companyId: companyId,
          estimateRequestId: estimateRequestId,
        };

        await authInstance.post('/api/estimates/send', requestPayload);

        requestedCompanies.value.push(companyId);

        alert('견적 요청이 완료되었습니다.');
      } catch (err) {
        console.error('견적 요청을 보내는 중 오류가 발생했습니다:', err);
        alert('견적 요청을 보내는 데 실패했습니다.');
      }
    };

    // UserSaveRequests로 이동하는 메서드
    const goToUserSaveRequests = () => {
      const isConfirm = confirm('요청한 견적을 보러 가시겠습니까?');
      if (!isConfirm) {
        return;
      }
      router.push('/mypage/user/usersaverequest');
    };

    watch(
      () => [props.city, props.district, props.constructionTypeIds],
      () => {
        fetchCompanies();
      }
    );

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
      hasOtherCompanies,
      goToUserSaveRequests, // 네비게이션 메서드 반환
    };
  },
};
</script>

<style scoped>
.company-card img {
  object-fit: cover;
}
</style>
