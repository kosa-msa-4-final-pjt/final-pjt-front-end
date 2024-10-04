<!-- Footer.vue -->
<template>
  <footer class="bg-gray-800 text-white py-8">
    <div class="container max-w-[1100px] mx-auto px-4">
      <!-- 상단 섹션 -->
      <div class="flex flex-wrap justify-between items-start text-[14px]">
        <!-- 로고 및 회사 정보 -->
        <div class="w-full md:w-1/3 mb-6 md:mb-0">
          <img class="w-10 h-10" src="@/assets/logo.png" alt="로고" />
          <h2 class="mt-2 text-xl font-bold">체인집업</h2>
          <div class="flex items-center mt-2">
            <a href="https://github.com/orgs/kosa-msa-4-final-pjt/repositories">
              <font-awesome-icon class="text-white" :icon="['fab', 'github']" />
            </a>
            <p class="ml-1 text-gray-400 font-semibold">팀 체인저</p>
          </div>

          <p class="mt-1 text-gray-400">김동혁 이연수 이푸름 채형일</p>
        </div>

        <!-- 퀵 링크 -->
        <div class="w-full md:w-1/3 mb-6 md:mb-0">
          <h3 class="text-lg font-bold">퀵 링크</h3>
          <ul class="mt-2 space-y-2">
            <li><a href="/" class="hover:text-gray-300">홈</a></li>
            <li>
              <p @click="$router.push('/notice/list')" class="cursor-pointer hover:text-gray-300">공지사항</p>
            </li>
            <li><p @click="$router.push('/faq/list')" class="cursor-pointer hover:text-gray-300">FAQ</p></li>
          </ul>
        </div>
      </div>

      <!-- 하단 섹션 -->
      <div class="mt-8 text-[12px] text-center text-gray-400">
        <p>&copy; 2024 Changzipup. All Rights Reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {};
</script>

<style scoped></style>
