<template>
  <div class="w-72 mr-auto">
    <Listbox v-model="selectedServices">
      <div class="relative mt-1">
        <!-- Listbox Button -->
        <ListboxButton
          class="relative w-full cursor-pointer rounded-lg bg-white px-4 py-3 text-left shadow-sm focus:outline-none sm:text-sm"
        >
          <span class="block truncate font-medium">
            {{ selectedServices.length ? selectedServiceNames.join(', ') : '시공 서비스를 선택하세요' }}
          </span>
          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <font-awesome-icon :icon="['fas', 'chevron-down']" class="h-3 w-3 text-gray-400 mr-2" aria-hidden="true" />
          </span>
        </ListboxButton>

        <!-- Listbox Options with Checkboxes -->
        <transition class="z-10">
          <ListboxOptions
            class="absolute mt-1 max-h-[300px] w-full overflow-auto rounded-md bg-white pl-2 py-1 shadow-lg sm:text-sm"
          >
            <!-- 전체 선택 체크박스 -->
            <label
              @click.prevent="toggleAllServices"
              class="flex items-center py-3 pl-3 pr-4 pb-3 border-b-[1px] border-gray-100 cursor-pointer"
            >
              <input
                type="checkbox"
                :checked="isAllSelected"
                class="mr-3 custom-checkbox"
                :class="{ 'checked-checkbox': isAllSelected }"
              />
              <span class="font-medium" :class="{ 'text-midGreen': isAllSelected }">전체 선택</span>
            </label>

            <!-- 개별 시공 서비스 체크박스 -->
            <label
              v-for="service in services"
              :key="service.id"
              class="flex items-center py-3 pl-3 pr-4 cursor-pointer hover:text-midGreen hover:color-midGreen"
              :class="{ 'text-midGreen': selectedServices.includes(service.id) }"
            >
              <input
                type="checkbox"
                :value="service.id"
                v-model="selectedServices"
                class="mr-3 custom-checkbox"
                :class="{ 'checked-checkbox': selectedServices.includes(service.id) }"
              />
              <span class="font-medium">{{ service.name }}</span>
            </label>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { Listbox, ListboxButton, ListboxOptions } from '@headlessui/vue';
import axios from 'axios';

export default {
  components: {
    Listbox,
    ListboxButton,
    ListboxOptions,
  },
  props: {
    selectedServicesProp: {
      type: Array,
      default: () => [], // 기본값으로 빈 배열을 설정
    },
  },
  setup(props, { emit }) {
    const services = ref([]);
    const selectedServices = ref([]);

    const resetSelection = () => {
      selectedServices.value = [];
      emit('services-selected', { services: [] }); // 초기화된 서비스를 부모로 전달
    };

    // 서비스 목록 가져오기
    const fetchServices = async () => {
      try {
        const response = await axios.get('/api/constructionType');
        services.value = response.data; // 서비스 데이터 설정
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    // 선택된 서비스 이름 계산
    const selectedServiceNames = computed(() => {
      return selectedServices.value.map((id) => {
        const service = services.value.find((s) => s.id === id);
        return service ? service.name : '';
      });
    });

    // 전체 선택 여부 확인
    const isAllSelected = computed(() => {
      return selectedServices.value.length === services.value.length && services.value.length > 0;
    });

    // 전체 선택/해제 기능
    const toggleAllServices = () => {
      if (isAllSelected.value) {
        selectedServices.value = []; // 선택 해제
      } else {
        selectedServices.value = services.value.map((service) => service.id); // 모든 서비스 선택
      }
    };

    // 서비스 선택이 변경될 때 부모 컴포넌트로 알림
    watch(selectedServices, (newVal) => {
      emit('services-selected', { services: newVal });
    });

    // 컴포넌트가 마운트될 때 서비스 목록 가져오기
    onMounted(() => {
      fetchServices();
      selectedServices.value = [...props.selectedServicesProp];
    });

    return {
      services,
      selectedServices,
      isAllSelected,
      toggleAllServices,
      selectedServiceNames,
      resetSelection,
    };
  },
};
</script>

<style scoped>
/* 체크박스 크기 조정 */
.custom-checkbox {
  transform: scale(1.4);
  accent-color: gray;
}

/* 체크된 체크박스 스타일 */
.checked-checkbox {
  accent-color: #388e3c;
}
</style>
