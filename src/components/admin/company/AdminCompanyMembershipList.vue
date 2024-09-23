<template>
  <div class="flex-col">
    <!-- header -->
    <div class="mb-10 p-5 bg-white rounded-lg">
      <h2 class="font-semibold text-xl mb-4">멤버십 관리</h2>
      <ul class="flex gap-4">
        <li>
          <label for="" class="font-medium">총 가입자수</label>
          <p class="text-red">3명</p>
        </li>
        <li>
          <label for="" class="font-medium">신규 가입자수</label>
          <p class="text-red">3명</p>
        </li>
        <li>
          <label for="" class="font-medium">총 가입비</label>
          <p class="text-red">350원</p>
        </li>
        <li>
          <label for="" class="font-medium">환불 처리수</label>
          <p class="text-red">1개</p>
        </li>
        <li>
          <label for="" class="font-medium">환불 처리금액</label>
          <p class="text-red">150원</p>
        </li>
      </ul>
    </div>
    <!-- center -->
    <div>
      <table class="table border-2 border-solid border-gray-300 border-collapse w-full">
        <thead>
          <tr>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">번호</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">업체명</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">멤버십 종류</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">멤버십 금액</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">멤버십 가입일</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">멤버십 만료일</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">상태</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">상태</th>
            <th class="bg-gray-200 text-center p-2 whitespace-nowrap">상세보기</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">1</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">부자업체</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">Basic</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">100원</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">24.9.20</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">24.10.20</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              <p class="border-2 border-solid border-secondary rounded-lg px-2 text-secondary whitespace-nowrap">
                유지
              </p>
            </td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              <button
                class="px-2 rounded-lg whitespace-nowrap bg-gray-200 cursor-pointer hover:bg-gray-300"
                @click="$router.push('adminCompanyMembershipDetail')"
              >
                상세보기
              </button>
            </td>
          </tr>
          <tr>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">2</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">프리미엄업체</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">Premium</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">150원</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">24.9.17</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">24.10.17</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              <p class="border-2 border-solid border-secondary rounded-lg px-2 text-secondary whitespace-nowrap">
                유지
              </p>
            </td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              <button
                class="px-2 rounded-lg whitespace-nowrap bg-gray-200 cursor-pointer hover:bg-gray-300"
                @click="$router.push('adminCompanyMembershipDetail')"
              >
                상세보기
              </button>
            </td>
          </tr>
          <tr>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">3</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">뚝딱뚝딱업체</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">Basic</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">100원</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">24.09.07</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">24.10.7</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              <p class="border-2 border-solid border-secondary rounded-lg px-2 text-secondary whitespace-nowrap">
                유지
              </p>
            </td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              <button
                class="px-2 rounded-lg whitespace-nowrap bg-gray-200 cursor-pointer hover:bg-gray-300"
                @click="$router.push('adminCompanyMembershipDetail')"
              >
                상세보기
              </button>
            </td>
          </tr>
          <tr>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">4</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">하우스업체</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">Premium</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">150원</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">24.08.23</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">24.9.23</td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              <p class="border-2 border-solid border-red rounded-lg px-2 px-2 px-2 text-red whitespace-nowrap">정지</p>
            </td>
            <td class="text-center p-2 border-t border-gray-300 bg-white whitespace-nowrap">
              <button
                class="px-2 rounded-lg whitespace-nowrap bg-gray-200 cursor-pointer hover:bg-gray-300"
                @click="$router.push('adminCompanyMembershipDetail')"
              >
                상세보기
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
th {
  border-bottom: 2px solid gray;
}
</style>
