<template>
  <div class="w-72 mr-auto">
    <Listbox v-model="selectedDistrict">
      <div class="relative mt-1">
        <!-- Listbox Button -->
        <ListboxButton
          class="relative w-full cursor-pointer rounded-lg bg-white px-4 py-3 text-left shadow-sm focus:outline-none sm:text-sm"
        >
          <span class="block truncate font-medium">
            {{ selectedDistrict ? `${selectedDistrict.city} ${selectedDistrict.district || ''}` : '지역을 선택하세요' }}
          </span>
          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <font-awesome-icon :icon="['fas', 'chevron-down']" class="h-3 w-3 text-gray-400 mr-2" aria-hidden="true" />
          </span>
        </ListboxButton>

        <!-- Listbox Options with Disclosure Panel Inside -->
        <transition
          class="z-10"
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ListboxOptions
            class="absolute mt-1 max-h-[500px] w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg focus:outline-none sm:text-sm"
          >
            <Disclosure v-for="(region, index) in regions" :key="index" v-slot="{ open }">
              <!-- City selection -->
              <DisclosureButton
                @click="selectCity(Object.keys(region)[0])"
                class="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-3 text-left text-sm font-medium hover:text-midGreen focus:outline-none"
              >
                <span>{{ Object.keys(region)[0] }}</span>
                <font-awesome-icon
                  :icon="['fas', 'chevron-up']"
                  :class="open ? 'rotate-180 transform' : ''"
                  class="h-3 w-3"
                />
              </DisclosureButton>
              <DisclosurePanel class="px-4 pb-2 pt-1 text-sm text-gray-500">
                <ul>
                  <li v-for="(district, i) in Object.values(region)[0]" :key="i" class="py-3 pl-2 hover:text-midGreen">
                    <button @click="selectDistrict(Object.keys(region)[0], district)" class="text-left w-full">
                      {{ district }}
                    </button>
                  </li>
                </ul>
              </DisclosurePanel>
            </Disclosure>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { Listbox, ListboxButton, ListboxOptions, Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
import axios from 'axios';

export default {
  components: {
    Listbox,
    ListboxButton,
    ListboxOptions,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
  },
  setup(_, { emit }) {
    const regions = ref([]); // 지역 데이터를 저장할 변수
    const selectedDistrict = ref(null); // 선택된 시/군/구 저장 (city와 district를 함께 저장)

    // JSON 파일에서 지역 데이터를 가져오기
    const fetchRegions = async () => {
      try {
        const response = await axios.get('/regions.json');
        regions.value = response.data;
      } catch (error) {
        console.error('Error fetching regions:', error);
      }
    };

    // City만 선택하는 함수
    const selectCity = (city) => {
      selectedDistrict.value = { city, district: '' }; // district는 빈 값으로 설정
      emit('region-selected', selectedDistrict.value); // 부모 컴포넌트로 선택된 지역을 전달
    };

    // 선택된 시와 구/군을 설정하는 함수
    const selectDistrict = (city, district) => {
      selectedDistrict.value = { city, district };
      emit('region-selected', selectedDistrict.value); // 부모 컴포넌트로 선택된 지역을 전달
    };

    // 선택된 지역을 초기화하는 함수 (null 값 전달)
    const resetSelection = () => {
      selectedDistrict.value = null;
      emit('region-selected', null); // null을 전달하여 전체 업체 목록을 보여줌
    };

    // 컴포넌트가 마운트되면 JSON 데이터를 가져옴
    onMounted(() => {
      fetchRegions();
    });

    return {
      regions,
      selectedDistrict,
      selectCity,
      selectDistrict,
      resetSelection,
    };
  },
};
</script>

<style scoped></style>
