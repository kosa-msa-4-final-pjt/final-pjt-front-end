<template>
  <div class="w-full mx-auto px-6 py-8">
    <p class="text-2xl font-semibold text-center pb-6">시공 사례 작성</p>

    <form
      @submit.prevent="insertPortfolio"
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
        작성하기
      </button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import { useUserStore } from '@/stores/userStore';
import QuillEditor from '@/components/common/QuillEditor.vue';

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
      selectedTypes: [],
      buildingTypes: [],
      selectedBuildingType: '',
      today: '',
    };
  },
  mounted() {
    const today = new Date().toISOString().split('T')[0];
    this.today = today;

    this.getConstructionType();
    this.getBuildingType();
  },
  methods: {
    searchAddress() {
      this.openDaumPostcode();
    },

    async afterUploadImages(portfolioId, afterUpdateContent, resolve, reject) {
      console.log('이미지 삽입 후 내용');
      console.log(afterUpdateContent);

      const userStore = useUserStore();
      const token = userStore.accessToken;

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
        const response = await axios.patch(`/api/portfolio/${portfolioId}`, portfolioRequest, {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        });

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
        const response = await axios.get('/api/buildingType');
        this.buildingTypes = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    async getConstructionType() {
      try {
        const response = await axios.get('/api/constructionType');
        this.constructionTypes = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    async insertPortfolio() {
      const userStore = useUserStore();
      const token = userStore.accessToken;

      const portfolioRequest = {
        title: this.title,
        content: '대체 예정',
        startDate: this.startDate,
        endDate: this.endDate,
        projectLocation: this.projectLocation,
        floor: this.floor,
        projectBudget: this.projectBudget,
        constructionService: this.selectedTypes,
        buildingTypeId: this.selectedBuildingType,
      };

      try {
        const response = await axios.post('/api/portfolio/create', portfolioRequest, {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        });
        alert('시공 사례가 작성되었습니다.');
        const portfolioId = response.data.id;
        console.log('이미지 저장 호출');
        await this.$refs.quillEditor.uploadImages(portfolioId);

        this.$router.push(`/portfolio/${portfolioId}`);
      } catch (error) {
        console.error(error);
        alert('시공 사례 작성에 실패하였습니다.');
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
