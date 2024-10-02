<template>
  <div class="w-full mx-auto px-6 py-8">
    <p class="text-2xl font-semibold text-center pb-6">시공 사례 수정</p>

    <form
      @submit.prevent="updatePortfolio"
      class="max-w-[720px] mx-auto bg-white p-6 border-[1px] border-gray-300 rounded-lg"
    >
      <div class="mb-6">
        <label for="title" class="block text-sm font-medium mb-2">제목</label>
        <input
          v-model="title"
          class="w-full h-[44px] text-sm p-3 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-midGreen"
          type="text"
          placeholder="제목을 입력해주세요."
          required
        />
      </div>

      <div class="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label for="startDate" class="block text-sm font-medium mb-2">시작날짜</label>
          <input
            v-model="startDate"
            class="w-full h-[44px] text-sm p-3 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-midGreen"
            type="date"
            :max="today"
            required
          />
        </div>
        <div>
          <label for="endDate" class="block text-sm font-medium mb-2">종료날짜</label>
          <input
            v-model="endDate"
            class="w-full h-[44px] text-sm p-3 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-midGreen"
            type="date"
            :min="startDate"
            :max="today"
            required
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label for="floor" class="block text-sm font-medium mb-2">면적 (평수)</label>
          <input
            v-model="floor"
            class="w-full h-[44px] text-sm p-3 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-midGreen"
            type="text"
            placeholder="시공 면적을 입력해주세요."
            required
          />
        </div>
        <div>
          <label for="projectBudget" class="block text-sm font-medium mb-2">예산 (만원)</label>
          <input
            v-model="projectBudget"
            class="w-full h-[44px] text-sm p-3 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-midGreen"
            type="text"
            placeholder="예산을 입력해주세요."
            required
          />
        </div>
      </div>

      <div class="mb-6">
        <label for="projectLocation" class="block text-sm font-medium mb-2">시공 지역</label>
        <div class="flex space-x-2">
          <input
            v-model="projectLocation"
            class="w-full h-[44px] text-sm p-3 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-midGreen"
            type="text"
            placeholder="시공 지역을 입력해주세요."
            readonly
            required
          />
          <button
            type="button"
            @click="searchAddress"
            class="bg-midGreen text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap"
          >
            주소 검색
          </button>
        </div>
        <div
          id="wrap"
          ref="wrap"
          class="border border-gray-300 h-72 overflow-hidden relative mt-2 mx-auto"
          style="display: none"
        >
          <img
            src="//t1.daumcdn.net/postcode/resource/images/close.png"
            class="absolute right-0 top-0 z-10 cursor-pointer"
            @click="foldDaumPostcode"
            alt="접기 버튼"
          />
        </div>
      </div>

      <div class="mb-6">
        <label for="buildingTypes" class="block text-sm font-medium mb-2">건물 종류</label>
        <div class="flex flex-wrap gap-2">
          <div v-for="type in buildingTypes" :key="type.id" class="flex items-center">
            <input type="radio" :value="type.id" v-model="selectedBuildingType" class="mr-2 accent-midGreen" />
            <span class="text-sm">{{ type.name }}</span>
          </div>
        </div>
      </div>

      <div class="mb-6">
        <label for="constructionTypes" class="block text-sm font-medium mb-2">시공 종류</label>
        <div class="flex flex-wrap gap-2">
          <div v-for="type in constructionTypes" :key="type.id" class="flex items-center">
            <input type="checkbox" :value="type.id" v-model="selectedTypes" class="mr-2 accent-midGreen" />
            <span class="text-sm">{{ type.name }}</span>
          </div>
        </div>
      </div>

      <div class="mb-6">
        <label for="content" class="block text-sm font-medium mb-2">내용</label>
        <QuillEditor ref="quillEditor" @insert-images="afterUploadImages" v-model:modelValue="content" required />
      </div>

      <button class="bg-midGreen text-white w-full h-[44px] rounded text-[16px] font-medium mt-6" type="submit">
        수정하기
      </button>
    </form>
  </div>
</template>

<script>
// import { useUserStore } from '@/stores/userStore';
import QuillEditor from '@/components/common/QuillEditor.vue';
import { instance, authInstance } from '@/utils/axiosUtils';

export default {
  components: { QuillEditor },
  data() {
    return {
      title: '',
      content: '',
      startDate: '',
      endDate: '',
      floor: '',
      projectLocation: '',
      projectBudget: '',
      constructionTypes: [],
      selectedTypes: [], // Checked construction types
      buildingTypes: '',
      selectedBuildingType: '',
      today: '',
      portfolioId: '', // 수정할 포트폴리오 ID 저장
    };
  },
  async mounted() {
    const today = new Date().toISOString().split('T')[0];
    this.today = today;

    // 페이지 진입 시 기존 데이터를 불러옴
    const portfolioId = this.$route.params.id; // URL에서 포트폴리오 ID를 가져옴
    this.portfolioId = portfolioId;

    await this.getConstructionType(); // 시공 종류 가져오기
    await this.fetchPortfolioData(portfolioId); // 포트폴리오 데이터 가져오기
    await this.getBuildingType(); // 건물 종류 가져오기
  },
  methods: {
    async fetchPortfolioData(portfolioId) {
      try {
        const response = await instance.get(`/api/portfolio/${portfolioId}`);
        const data = response.data;
        console.log(data);

        // 불러온 데이터를 폼에 초기값으로 설정
        this.title = data.title;
        this.content = data.content;
        this.startDate = data.startDate;
        this.endDate = data.endDate;
        this.projectLocation = data.projectLocation;
        this.floor = data.floor;
        this.projectBudget = data.projectBudget;

        // 기존 건물 타입을 비교하여 라디오 버튼 설정
        this.selectedBuildingType = this.buildingTypes.filter((type) => data.buildingType.includes(type.name));

        // 기존 시공 서비스를 비교하여 체크박스 설정
        const serviceNames = data.services; // 포트폴리오의 시공 서비스 (string 리스트)

        // 시공 타입과 비교해서 체크박스 활성화
        this.selectedTypes = this.constructionTypes
          .filter((type) => serviceNames.includes(type.name)) // 시공 서비스가 일치하는 타입만 선택
          .map((type) => type.id); // 해당하는 ID만 저장
      } catch (error) {
        console.error('포트폴리오 데이터를 불러오는데 실패했습니다.', error);
      }
    },

    async afterUploadImages(portfolioId, afterUpdateContent, resolve, reject) {
      // const userStore = useUserStore();
      // const token = userStore.accessToken;

      const portfolioRequest = {
        title: this.title,
        content: afterUpdateContent,
        startDate: this.startDate,
        endDate: this.endDate,
        projectLocation: this.projectLocation,
        floor: this.floor,
        projectBudget: this.projectBudget,
        constructionService: this.selectedTypes,
        buildingTypeId: this.selectedBuildingType,
      };

      try {
        const response = await authInstance.patch(`/api/portfolio/${portfolioId}`, portfolioRequest);

        return resolve(response);
      } catch (error) {
        reject(error);
      }
    },

    openDaumPostcode() {
      const currentScroll = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
      new window.daum.Postcode({
        oncomplete: (data) => {
          let addr = '';
          let extraAddr = '';

          if (data.userSelectedType === 'R') {
            addr = data.roadAddress;
          } else {
            addr = data.jibunAddress;
          }

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

          this.projectLocation = addr + extraAddr;

          this.$refs.wrap.style.display = 'none';
          document.body.scrollTop = currentScroll;
        },
        onresize: (size) => {
          this.$refs.wrap.style.height = size.height + 'px';
        },
        width: '100%',
        height: '100%',
      }).embed(this.$refs.wrap);

      this.$refs.wrap.style.display = 'block';
    },

    foldDaumPostcode() {
      this.$refs.wrap.style.display = 'none';
    },

    async getBuildingType() {
      try {
        const response = await instance.get('/api/buildingType');
        this.buildingTypes = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    async getConstructionType() {
      try {
        const response = await instance.get('/api/constructionType');
        this.constructionTypes = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    async updatePortfolio() {
      // const userStore = useUserStore();
      // const token = userStore.accessToken;

      const portfolioRequest = {
        title: this.title,
        content: this.content,
        startDate: this.startDate,
        endDate: this.endDate,
        projectLocation: this.projectLocation,
        floor: this.floor,
        projectBudget: this.projectBudget,
        constructionService: this.selectedTypes,
        buildingTypeId: this.selectedBuildingType,
      };

      try {
        const response = await authInstance.patch(`/api/portfolio/${this.portfolioId}`, portfolioRequest);
        console.log(response.data);

        // 이미지 업로드도 진행
        await this.$refs.quillEditor.uploadImages(this.portfolioId);

        this.$router.push(`/portfolio/${this.portfolioId}`);
      } catch (error) {
        console.error('시공 사례 수정에 실패하였습니다.', error);
        alert('시공 사례 수정에 실패하였습니다.');
      }
    },
  },
};
</script>

<style>
.custom-quill-editor {
  height: 200px;
}

.ql-container {
  height: 100%;
}

.ql-editor {
  min-height: 150px;
  max-height: 400px;
  overflow-y: auto;
}
</style>
