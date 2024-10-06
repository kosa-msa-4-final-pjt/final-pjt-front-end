<template>
  <div class="w-90 mx-auto">
    <div>
      <p class="text-2xl font-semibold text-center pb-4">업체 등록</p>

      <form
        @submit.prevent="validateForm"
        class="w-[500px] mb-2 overflow-x-hidden overflow-y-scroll px-10 pt-2 pb-4 pb-20 mx-auto"
      >
        <div class="mb-[22px]">
          <label class="text-[14px] font-medium">업체 로고</label>
          <div class="mt-2 flex items-center space-x-4">
            <!-- 미리보기 이미지 -->
            <div v-if="previewImage" class="mt-2">
              <img :src="previewImage" alt="로고 미리보기" class="w-[150px] h-[150px] object-cover rounded-lg border" />
              <span v-if="selectedFileName" class="pl-2 mt-2 text-gray-600 text-[14px]">{{ selectedFileName }}</span>
            </div>
          </div>
          <div class="mt-4">
            <label for="fileInput" class="cursor-pointer text-[14px] bg-midGreen text-white px-4 py-3 rounded-md">
              파일 선택
            </label>
            <input id="fileInput" type="file" accept="image/*" @change="onFileChange" class="hidden" />
          </div>
        </div>

        <div class="mb-[12px]">
          <label for="companyName" class="text-[14px] font-medium mb-4">업체 이름</label>
          <div class="mt-2 flex justify-between items-center">
            <input
              v-model="companyName"
              @blur="validateCompanyName"
              class="flex-grow h-[52px] text-[14px] font-normal p-4 rounded-[4px] border-solid border-[1px] border-[#ddd] box-border focus:outline-none focus:ring-1 focus:ring-midGreen focus:border-midGreen"
              type="text"
              placeholder="인테리어 업체 이름을 입력해 주세요."
              required
            />
          </div>
          <p v-if="errors.companyName" class="text-red text-[12px] mt-2">{{ errors.companyName }}</p>
        </div>

        <div class="mb-[12px]">
          <label for="owner" class="text-[14px] font-medium mb-4"
            >대표자명
            <span class="text-[10px] text-[#bbb] leading-[14px]">(2자 이상)</span>
          </label>
          <div class="mt-2 flex justify-between items-center">
            <input
              v-model="owner"
              @blur="validateOwner"
              class="flex-grow h-[52px] text-[14px] font-normal p-4 rounded-[4px] border-solid border-[1px] border-[#ddd] box-border focus:outline-none focus:ring-1 focus:ring-midGreen focus:border-midGreen"
              type="text"
              placeholder="대표자명을 입력해 주세요."
              required
            />
          </div>
          <p v-if="errors.owner" class="text-red text-[12px] mt-2">{{ errors.owner }}</p>
        </div>

        <div class="mb-[12px]">
          <label for="publishDate" class="text-[14px] font-medium mb-4">개업일자</label>
          <div class="mt-2 flex justify-between items-center">
            <input
              v-model="publishDate"
              @blur="validatePublishDate"
              class="flex-grow h-[52px] text-[14px] font-normal p-4 rounded-[4px] border-solid border-[1px] border-[#ddd] box-border focus:outline-none focus:ring-1 focus:ring-midGreen focus:border-midGreen"
              type="date"
              :max="today"
              required
            />
          </div>
        </div>

        <div class="mb-[12px]">
          <label for="companyNumber" class="text-[14px] font-medium mb-4">사업자번호</label>
          <span class="text-[10px] text-[#bbb] leading-[14px]"> (숫자만 작성) </span>

          <div class="mt-2 flex justify-between items-center">
            <input
              v-model="companyNumber"
              @blur="validateCompanyNumber"
              class="flex-grow h-[52px] text-[14px] font-normal p-4 rounded-[4px] border-solid border-[1px] border-[#ddd] box-border focus:outline-none focus:ring-1 focus:ring-midGreen focus:border-midGreen"
              type="text"
              placeholder="사업자 번호를 입력해 주세요."
              required
            />
            <button
              @click.prevent="verifyCompanyNumber"
              class="bg-midGreen text-white text-[14px] h-[52px] rounded-[4px] w-[90px] ml-2"
            >
              확인
            </button>
          </div>
          <p v-if="errors.companyNumber" class="text-red text-[12px] mt-2">{{ errors.companyNumber }}</p>
          <p v-if="companyNumberVerified" class="text-confirm text-[12px] mt-2">사업자 번호가 확인되었습니다.</p>
        </div>

        <div class="mb-[12px]">
          <label for="email" class="text-[14px] font-medium mb-4">이메일</label>
          <div class="mt-2 flex justify-between items-center">
            <input
              v-model="email"
              @blur="validateEmail"
              class="flex-grow h-[52px] text-[14px] font-normal p-4 rounded-[4px] border-solid border-[1px] border-[#ddd] box-border focus:outline-none focus:ring-1 focus:ring-midGreen focus:border-midGreen"
              type="email"
              placeholder="이메일을 입력해 주세요."
              required
            />
            <button
              @click.prevent="verifyEmail"
              class="bg-midGreen text-white text-[14px] h-[52px] rounded-[4px] w-[90px] ml-2"
            >
              중복확인
            </button>
          </div>
          <p v-if="errors.email" class="text-red text-[12px] mt-2">{{ errors.email }}</p>
          <p v-if="emailVerified" class="text-confirm text-[12px] mt-2">사용 가능한 이메일입니다.</p>
        </div>

        <div class="mb-[12px]">
          <label for="password" class="text-[14px] font-medium mb-4"
            >비밀번호
            <span class="text-[10px] text-[#bbb] leading-[14px]">(10~16자, 영문/숫자/특수문자 조합)</span></label
          >
          <div class="mt-2 flex justify-between items-center">
            <input
              v-model="password"
              @blur="validatePassword"
              class="flex-grow h-[52px] text-[14px] font-normal p-4 rounded-[4px] border-solid border-[1px] border-[#ddd] box-border focus:outline-none focus:ring-1 focus:ring-midGreen focus:border-midGreen"
              type="password"
              placeholder="비밀번호를 입력해 주세요."
              required
            />
          </div>
          <p v-if="errors.password" class="text-red text-[12px] mt-2">{{ errors.password }}</p>
        </div>

        <div class="mb-[12px]">
          <label for="confirmPassword" class="text-[14px] font-medium mb-4">비밀번호 확인</label>
          <div class="mt-2 flex justify-between items-center">
            <input
              v-model="confirmPassword"
              @blur="validateConfirmPassword"
              class="flex-grow h-[52px] text-[14px] font-normal p-4 rounded-[4px] border-solid border-[1px] border-[#ddd] box-border focus:outline-none focus:ring-1 focus:ring-midGreen focus:border-midGreen"
              type="password"
              placeholder="비밀번호를 한 번 더 입력해 주세요."
              required
            />
          </div>
          <p v-if="errors.confirmPassword" class="text-red text-[12px] mt-2">{{ errors.confirmPassword }}</p>
          <p v-if="passwordsMatch && !errors.confirmPassword" class="text-confirm text-[12px] mt-2">
            비밀번호가 일치합니다.
          </p>
        </div>

        <div class="mb-[12px]">
          <label for="phone" class="text-[14px] font-medium mb-4">휴대폰번호 </label>
          <span class="text-[10px] text-[#bbb] leading-[14px]">(숫자만 입력)</span>
          <div class="mt-2 flex justify-between items-center">
            <input
              v-model="phoneNumber"
              @blur="validatePhone"
              class="flex-grow h-[52px] text-[14px] font-normal p-4 rounded-[4px] border-solid border-[1px] border-[#ddd] box-border focus:outline-none focus:ring-1 focus:ring-midGreen focus:border-midGreen"
              type="text"
              placeholder="휴대폰번호를 입력해 주세요."
              required
            />
          </div>
          <p v-if="errors.phoneNumber" class="text-red text-[12px] mt-2">{{ errors.phoneNumber }}</p>
        </div>

        <div class="mb-[12px]">
          <label for="address" class="text-[14px] font-medium mb-4">업체 주소 </label>
          <span class="text-[10px] text-[#bbb] leading-[14px]">(상세 주소까지 작성)</span>
          <div class="mt-2 flex justify-between items-center">
            <input
              placeholder="업체 주소를 입력해주세요."
              v-model="address"
              @blur="validateAddress"
              class="flex-grow h-[52px] text-[14px] font-normal p-4 rounded-[4px] border-solid border-[1px] border-[#ddd] box-border focus:outline-none focus:ring-1 focus:ring-midGreen focus:border-midGreen"
              type="text"
              readonly
              required
            />
          </div>
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
            class="flex-grow w-full h-[52px] text-[14px] font-normal mt-2 p-4 rounded-[4px] border-solid border-[1px] border-[#ddd] box-border focus:outline-none focus:ring-1 focus:ring-midGreen focus:border-midGreen"
            v-model="detailedAddress"
            ref="detailedAddress"
          />
          <p v-if="errors.address" class="text-red text-[12px] mt-2">{{ errors.address }}</p>

          <div class="pb-2">
            <button
              type="button"
              @click="searchAddress"
              class="w-full mt-2 py-3 bg-midGreen text-white rounded-md text-[14px]"
            >
              주소 검색
            </button>
          </div>
        </div>

        <div class="mb-[12px]">
          <label for="companyDesc" class="text-[14px] font-medium mb-4">업체 소개 </label>
          <div class="mt-2 flex justify-between items-center">
            <textarea
              v-model="companyDesc"
              class="flex-grow h-[82px] text-[14px] font-normal px-4 py-2 rounded-[4px] border-solid border-[1px] border-[#ddd] box-border focus:outline-none focus:ring-1 focus:ring-midGreen focus:border-midGreen"
              type="text"
              required
            ></textarea>
          </div>
        </div>

        <div class="mb-[12px]">
          <label for="constructionTypes" class="text-[14px] font-medium mb-4">시공 종류</label>

          <!-- 전체 선택 체크박스 -->
          <div class="mt-2 mb-3 flex items-center">
            <input
              type="checkbox"
              @change="toggleAllConstructionTypes"
              :checked="isAllSelected"
              class="mr-2 accent-midGreen"
            />
            <span>전체 선택</span>
          </div>

          <!-- 개별 시공 종류 체크박스 -->
          <div class="mt-2 flex flex-wrap gap-2">
            <div v-for="type in constructionTypes" :key="type.id" class="flex items-center">
              <input type="checkbox" :value="type.id" v-model="selectedTypes" class="mr-2 accent-midGreen" />
              <span>{{ type.name }}</span>
            </div>
          </div>

          <p v-if="selectedTypes.length === 0" class="text-red text-[12px] mt-2">
            최소 한 개의 시공 종류를 선택해야 합니다.
          </p>
        </div>

        <button
          @click="insertCompany"
          type="submit"
          class="bg-midGreen text-white w-full h-[52px] rounded-[4px] text-[16px] mt-[24px]"
        >
          등록하기
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { instance } from '@/utils/axiosUtils';
import axios from 'axios';

export default {
  data() {
    return {
      companyName: '',
      companyNumber: '',
      email: '',
      password: '',
      confirmPassword: '',
      owner: '',
      phoneNumber: '',
      publishDate: '',
      companyDesc: '',
      address: '',
      detailedAddress: '',
      constructionTypes: [], // 시공 종류 데이터 배열
      selectedTypes: [], // 선택된 시공 종류 배열
      today: '',

      errors: {},
      emailVerified: false,
      companyNumberVerified: false,
      passwordsMatch: false,
      selectedFileName: '',
      logoFile: null, // 로고 이미지 파일
      previewImage: null, // 로고 이미지 미리보기 URL

      serviceKey: '',
    };
  },
  computed: {
    // 전체 입력과 인증 완료됐을 때 true
    isFormValid() {
      return (
        Object.keys(this.errors).length === 0 &&
        this.emailVerified &&
        this.companyNumberVerified &&
        this.passwordsMatch &&
        this.selectedTypes.length > 0
      );
    },

    // 전체 선택 여부 계산
    isAllSelected() {
      return this.selectedTypes.length === this.constructionTypes.length;
    },
  },
  mounted() {
    // 현재 날짜를 저장하여 개업날짜는 오늘 또는 미래의 날짜만 선택 가능하도록 설정
    const today = new Date().toISOString().split('T')[0];
    this.today = today;
    this.getConstructionType();
    this.serviceKey = process.env.VUE_APP_SERVICE_KEY;
  },
  methods: {
    // 파일 변경 시 로고 이미지 미리보기 설정
    onFileChange(event) {
      const file = event.target.files[0];
      if (file && file.type.startsWith('image/')) {
        this.logoFile = file;
        this.previewImage = URL.createObjectURL(file);
        this.selectedFileName = file.name; // 선택한 파일 이름 저장
      } else {
        this.logoFile = null;
        this.previewImage = null;
        this.selectedFileName = ''; // 파일이 없으면 이름 초기화
        this.$swal.fire({
          text: '이미지 파일을 선택해주세요.',
          icon: 'warning',
          confirmButtonText: '확인',
          confirmButtonColor: '#f39c12',
        });
      }
    },

    // 주소 검색
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

          // 주소가 선택되었으므로 에러 메시지 제거
          delete this.errors.address;

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

    // 이메일 중복 확인
    async verifyEmail() {
      this.validateEmail(); // 먼저 이메일 형식 유효성 검사

      // 이메일 형식이 유효하지 않으면 중복 확인 요청을 보내지 않음
      if (this.errors.email) {
        return;
      }

      try {
        const response = await instance.get(`/api/company/check-email`, {
          params: { email: this.email },
        });

        if (response.data) {
          this.errors.email = '이미 사용 중인 이메일입니다.';
        } else {
          delete this.errors.email;
          this.emailVerified = true;
        }
      } catch (error) {
        console.error(error);
        this.errors.email = '이메일 중복 확인에 실패했습니다.';
      }
    },
    async verifyCompanyNumber() {
      // 유효성 검사 수행
      this.validateCompanyNumber();
      this.validateOwner();

      // 필요한 값이 모두 입력되지 않으면 메시지를 표시
      if (!this.companyNumber) {
        this.errors.companyNumber = '사업자 번호를 입력해 주세요.';
      }
      if (!this.owner) {
        this.errors.companyNumber = '대표자명을 입력해 주세요.';
      }
      if (!this.publishDate) {
        this.errors.companyNumber = '개업일자를 입력해 주세요.';
      }

      // 유효성 검사를 통과하지 못한 경우 메시지를 표시하지 않음
      if (this.errors.companyNumber || this.errors.owner || this.errors.publishDate) {
        return;
      }

      const formattedDate = this.publishDate.replace(/-/g, ''); // YYYY-MM-DD를 YYYYMMDD로 변환

      const data = {
        businesses: [
          {
            b_no: this.companyNumber,
            start_dt: formattedDate,
            p_nm: this.owner,
            p_nm2: '',
            b_nm: '',
            corp_no: '',
            b_sector: '',
            b_type: '',
          },
        ],
      };

      // 사업자번호 확인 로직
      try {
        const response = await axios.post(
          `https://api.odcloud.kr/api/nts-businessman/v1/validate?serviceKey=${this.serviceKey}`,
          data
        );
        const status = response.data.data[0].valid_msg;

        if (status === '확인할 수 없습니다.') {
          this.errors.companyNumber = '입력하신 사업자번호를 확인할 수 없습니다.';
        } else {
          this.companyNumberVerified = true;
          delete this.errors.companyNumber;
        }
      } catch (error) {
        console.error(error);
        this.errors.companyNumber = '사업자 번호 확인에 실패했습니다.';
      }
    },

    validateEmail() {
      this.emailVerified = false; // 이메일이 변경되면 중복 확인 상태를 초기화
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.email) {
        this.errors.email = '이메일을 입력해 주세요.';
      } else if (!emailPattern.test(this.email)) {
        this.errors.email = '유효한 이메일 주소를 입력해 주세요.';
      } else {
        delete this.errors.email;
      }
    },
    validateCompanyNumber() {
      this.companyNumberVerified = false; // 사업자번호가 변경되면 확인 상태 초기화
      const companyNumberPattern = /^\d{10}$/; // 숫자만 10자리 정규식
      if (!this.companyNumber) {
        this.errors.companyNumber = '사업자 번호를 입력해 주세요.';
      } else if (!companyNumberPattern.test(this.companyNumber)) {
        this.errors.companyNumber = '사업자 번호는 숫자 10자리로 입력해 주세요.';
      } else {
        delete this.errors.companyNumber;
      }
    },

    validatePassword() {
      if (!this.password) {
        this.errors.password = '비밀번호를 입력해 주세요.';
      } else if (this.password.length < 10 || this.password.length > 16) {
        this.errors.password = '비밀번호는 10~16자로 입력해 주세요.';
      } else {
        delete this.errors.password;
      }
      this.checkPasswordsMatch(); // 중복 호출 방지
    },
    validateConfirmPassword() {
      this.checkPasswordsMatch(); // 중복 호출 방지
    },
    checkPasswordsMatch() {
      if (this.password && this.confirmPassword) {
        // 공백이 아닐 때만 검사
        if (this.confirmPassword === this.password) {
          this.passwordsMatch = true;
          delete this.errors.confirmPassword;
        } else {
          this.passwordsMatch = false;
          this.errors.confirmPassword = '비밀번호가 일치하지 않습니다.';
        }
      } else {
        this.passwordsMatch = false; // 공백일 때는 일치하지 않음
      }
    },
    validateCompanyName() {
      if (!this.companyName) {
        this.errors.companyName = '인테리어 업체명을 입력해 주세요.';
      } else {
        delete this.errors.companyName;
      }
    },
    validateOwner() {
      if (!this.owner) {
        this.errors.owner = '대표자명을 입력해 주세요.';
      } else if (this.owner.length < 2) {
        this.errors.owner = '대표자명은 2자 이상 입력해 주세요.';
      } else {
        delete this.errors.owner;
      }
    },
    validatePhoneNum() {
      const phonePattern = /^[0-9]{2,3}[0-9]{3,4}[0-9]{4}/;
      if (!this.phoneNumber) {
        this.errors.phoneNumber = '휴대폰번호를 입력해 주세요.';
      } else if (!phonePattern.test(this.phoneNumber)) {
        this.errors.phoneNumberv = '유효한 휴대폰번호를 입력해 주세요.';
      } else {
        delete this.errors.phoneNumber;
      }
    },
    validateAddress() {
      if (!this.address) {
        this.errors.address = '업체 주소를 입력해주세요.';
      } else {
        delete this.errors.address;
      }
    },

    // 시공 종류 조회
    async getConstructionType() {
      try {
        const response = await instance.get(`/api/constructionType`);
        this.constructionTypes = response.data; // 시공 종류 데이터 저장
      } catch (error) {
        console.error(error);
      }
    },

    // 전체 선택/해제
    toggleAllConstructionTypes() {
      if (this.isAllSelected) {
        this.selectedTypes = [];
      } else {
        this.selectedTypes = this.constructionTypes.map((type) => type.id);
      }
    },

    // 업체 등록 요청
    async insertCompany() {
      // 유효성 검사
      this.validateForm();

      // 에러가 없는 경우에만 서버로 요청 전송
      if (Object.keys(this.errors).length === 0) {
        const formData = new FormData();

        // 폼 데이터 추가
        formData.append('email', this.email);
        formData.append('companyName', this.companyName);
        formData.append('password', this.password);
        formData.append('phoneNumber', this.phoneNumber);
        formData.append('owner', this.owner);
        formData.append('companyNumber', this.companyNumber);
        formData.append('publishDate', this.publishDate);
        formData.append('address', this.address);
        formData.append('companyDesc', this.companyDesc);
        formData.append('constructionService', this.selectedTypes);

        if (this.logoFile) {
          formData.append('logoFile', this.logoFile);
        }

        // 서버로 POST 요청
        try {
          await instance.post('/api/company', formData);
          this.$swal.fire({
            text: '입력하신 이메일로 인증 메일이 전송되었습니다. 메일 인증 후 로그인이 가능합니다.',
            icon: 'info',
            confirmButtonText: '확인',
            confirmButtonColor: '#f39c12',
          });
          this.$router.push('/');
        } catch (error) {
          console.error(error);
          this.$swal.fire({
            text: '업체 등록에 실패했습니다.',
            icon: 'error',
            confirmButtonText: '확인',
            confirmButtonColor: '#f39c12',
          });
        }
      } else {
        this.$swal.fire({
          text: '입력한 정보를 확인해 주세요.',
          icon: 'warning',
          confirmButtonText: '확인',
          confirmButtonColor: '#f39c12',
        });
      }
    },

    validateForm() {
      this.validateCompanyName();
      this.validateCompanyNumber();
      this.validateEmail();
      this.validatePassword();
      this.validateConfirmPassword();
      this.validateOwner();
      this.validatePhoneNum();
      this.validateAddress();
    },
  },
};
</script>
