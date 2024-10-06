<template>
  <div class="w-90 mx-auto">
    <div>
      <p class="text-2xl font-semibold text-center pb-4">회원가입</p>
      <div class="w-100 text-center">
        <RouterLink to="companySignup" class="text-center text-[13px] text-gray-700"
          >업체 등록을 원하신다면? <span class="underline hover:text-midGreen">업체 등록하기</span></RouterLink
        >
      </div>

      <form @submit.prevent="validateForm" class="w-[500px] px-10 py-4 pb-20 mx-auto">
        <div class="mb-[12px]">
          <label for="email" class="text-[14px] font-normal mb-4">이메일</label>
          <div class="mt-2 flex justify-between items-center">
            <input
              v-model="email"
              @blur="validateEmail"
              class="flex-grow h-[52px] text-[14px] font-normal p-4 rounded-[4px] border-solid border-[1px] border-[#ddd] box-border focus:outline-none focus:border-midGreen focus:ring-1 focus:ring-midGreen"
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
          <label for="password" class="text-[14px] font-normal mb-4"
            >비밀번호
            <span class="text-[10px] text-[#bbb] leading-[14px]">(10~16자, 영문/숫자/특수문자 조합)</span></label
          >
          <div class="mt-2 flex justify-between items-center">
            <input
              v-model="password"
              @blur="validatePassword"
              class="flex-grow h-[52px] text-[14px] font-normal p-4 rounded-[4px] border-solid border-[1px] border-[#ddd] box-border focus:outline-none focus:border-midGreen focus:ring-1 focus:ring-midGreen"
              type="password"
              placeholder="비밀번호를 입력해 주세요."
              required
            />
          </div>
          <p v-if="errors.password" class="text-red text-[12px] mt-2">{{ errors.password }}</p>
        </div>

        <div class="mb-[12px]">
          <label for="confirmPassword" class="text-[14px] font-normal mb-4">비밀번호 확인</label>
          <div class="mt-2 flex justify-between items-center">
            <input
              v-model="confirmPassword"
              @blur="validateConfirmPassword"
              class="flex-grow h-[52px] text-[14px] font-normal p-4 rounded-[4px] border-solid border-[1px] border-[#ddd] box-border focus:outline-none focus:border-midGreen focus:ring-1 focus:ring-midGreen"
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
          <label for="name" class="text-[14px] font-normal mb-4"
            >이름
            <span class="text-[10px] text-[#bbb] leading-[14px]">(2자 이상)</span>
          </label>
          <div class="mt-2 flex justify-between items-center">
            <input
              v-model="name"
              @blur="validateName"
              class="flex-grow h-[52px] text-[14px] font-normal p-4 rounded-[4px] border-solid border-[1px] border-[#ddd] box-border focus:outline-none focus:border-midGreen focus:ring-1 focus:ring-midGreen"
              type="text"
              placeholder="이름을 입력해 주세요."
              required
            />
          </div>
          <p v-if="errors.name" class="text-red text-[12px] mt-2">{{ errors.name }}</p>
        </div>

        <div class="mb-[12px]">
          <label for="nickname" class="text-[14px] font-normal mb-4"
            >닉네임
            <span class="text-[10px] text-[#bbb] leading-[14px]">(2자 이상)</span>
          </label>
          <div class="mt-2 flex justify-between items-center">
            <input
              v-model="nickName"
              @blur="validateNickname"
              class="flex-grow h-[52px] text-[14px] font-normal p-4 rounded-[4px] border-solid border-[1px] border-[#ddd] box-border focus:outline-none focus:border-midGreen focus:ring-1 focus:ring-midGreen"
              type="text"
              placeholder="닉네임을 입력해 주세요."
              required
            />
          </div>
          <p v-if="errors.nickName" class="text-red text-[12px] mt-2">{{ errors.nickName }}</p>
        </div>

        <div class="mb-[12px]">
          <label for="phoneNumber" class="text-[14px] font-normal mb-4">휴대폰번호</label>
          <div class="mt-2 flex justify-between items-center">
            <input
              v-model="phoneNumber"
              @blur="validatePhone"
              class="flex-grow h-[52px] text-[14px] font-normal p-4 rounded-[4px] border-solid border-[1px] border-[#ddd] box-border focus:outline-none focus:border-midGreen focus:ring-1 focus:ring-midGreen"
              type="text"
              placeholder="휴대폰번호를 입력해 주세요."
              required
            />
          </div>
          <p v-if="errors.phoneNumber" class="text-red text-[12px] mt-2">{{ errors.phoneNumber }}</p>
        </div>

        <button
          @click="insertMember"
          type="submit"
          class="bg-midGreen text-white w-full h-[52px] rounded-[4px] text-[16px] mt-[24px]"
        >
          가입하기
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { instance } from '@/utils/axiosUtils';

export default {
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      nickName: '',
      phoneNumber: '',
      errors: {},
      emailVerified: false,
      passwordsMatch: false,

      serverUri: process.env.VUE_APP_SERVER_URI,
    };
  },
  methods: {
    // 이메일 중복 확인
    async verifyEmail() {
      this.validateEmail();

      if (this.errors.email) {
        return;
      }

      try {
        const response = await instance.get(`/api/member/check-email`, {
          params: { email: this.email },
        });
        if (response.data.duplicated) {
          // 객체로 전달되기 때문에
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
    validatePassword() {
      const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).{10,16}$/;
      if (!this.password) {
        this.errors.password = '비밀번호를 입력해 주세요.';
      } else if (this.password.length < 10 || this.password.length > 16) {
        this.errors.password = '비밀번호는 10~16자로 입력해 주세요.';
      } else if (!regex.test(this.password)) {
        this.errors.password = '비밀번호는 영문, 숫자. 특수문자를 포함해서 입력해주세요';
      } else {
        delete this.errors.password;
      }
      this.checkPasswordsMatch(); // 중복 호출 방지
    },
    validateConfirmPassword() {
      this.checkPasswordsMatch(); // 중복 호출 방지
    },
    checkPasswordsMatch() {
      if (!this.errors.password && this.confirmPassword === this.password) {
        if (!this.password) {
          this.passwordsMatch = false;
        } else {
          this.passwordsMatch = true;
        }
        delete this.errors.confirmPassword;
      } else if (this.confirmPassword !== this.password) {
        this.passwordsMatch = false;
        this.errors.confirmPassword = '비밀번호가 일치하지 않습니다.';
      } else {
        delete this.errors.confirmPassword;
      }
    },
    validateName() {
      if (!this.name) {
        this.errors.name = '이름을 입력해 주세요.';
      } else if (this.name.length < 2) {
        this.errors.name = '이름은 2자 이상 입력해 주세요.';
      } else {
        delete this.errors.name;
      }
    },
    validateNickname() {
      if (!this.nickName) {
        this.errors.nickName = '닉네임을 입력해 주세요.';
      } else if (this.nickName.length < 2) {
        this.errors.nickName = '닉네임은 2자 이상 입력해 주세요.';
      } else {
        delete this.errors.nickName;
      }
    },
    validatePhone() {
      const phonePattern = /^\d{10,11}$/;
      if (!this.phoneNumber) {
        this.errors.phoneNumber = '휴대폰번호를 입력해 주세요.';
      } else if (!phonePattern.test(this.phoneNumber)) {
        this.errors.phoneNumber = '유효한 휴대폰번호를 입력해 주세요.';
      } else {
        delete this.errors.phoneNumber;
      }
    },
    validateForm() {
      this.validateEmail();
      this.validatePassword();
      this.validateConfirmPassword();
      this.validateName();
      this.validateNickname();
      this.validatePhone();
    },
    async insertMember() {
      this.validateForm();

      if (Object.keys(this.errors).length === 0) {
        const memberData = {
          email: this.email,
          password: this.confirmPassword,
          name: this.name,
          nickName: this.nickName,
          phoneNumber: this.phoneNumber,
        };

        // 서버로 POST 요청
        try {
          await instance.post(`/api/member`, memberData);
          this.$swal.fire({
            text: '입력하신 이메일로 인증 메일이 전송되었습니다. 메일 인증 후 로그인이 가능합니다.',
            icon: 'info',
            confirmButtonText: '확인',
            confirmButtonColor: '#f39c12',
          });
          this.$router.push('/login');
        } catch (error) {
          console.error(error);
          this.$swal.fire({
            text: '회원 등록에 실패했습니다.',
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
  },
};
</script>

<style></style>
