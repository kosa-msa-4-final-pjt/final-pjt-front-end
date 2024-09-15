import CompanyDetail from '@/components/company/CompanyDetail.vue';
import HomeCompo from '@/components/HomeCompo.vue';
import CompanySignup from '@/components/login/CompanySignup.vue';
import LoginCompo from '@/components/login/LoginCompo.vue';
import MemberSignup from '@/components/login/MemberSignup.vue';
import RedirectCompo from '@/components/login/RedirectCompo.vue';
import CreatePortfolio from '@/components/portfolio/CreatePortfolio.vue';
import RequestEstimateCompo from '@/components/estimate/RequestEstimateCompo';
import StepOne from '@/components/estimate/StepOne.vue';
import StepTwo from '@/components/estimate/StepTwo.vue';
import StepThree from '@/components/estimate/StepThree.vue';
import StepFour from '@/components/estimate/StepFour.vue';
import StepFive from '@/components/estimate/StepFive.vue';
import PaymentCompo from '@/components/payment/PaymentCompo.vue';
import UserBaseInfo from '@/components/mypage/user/UserBaseInfo.vue';
import UserPageCompo from '@/components/mypage/user/UserPageCompo.vue';
import UserRequestListCompo from '@/components/mypage/user/UserRequestListCompo.vue';
import UserBookMark from '@/components/mypage/user/UserBookMark.vue';
import UserReviewList from '@/components/mypage/user/review/UserReviewList.vue';
import EstimateList from '@/components/estimate/EstimateList.vue';
import VerifyCompo from '@/components/login/VerifyCompo.vue';
import AdminPage from '@/components/mypage/admin/AdminPage.vue';
import AdminAccountManagement from '@/components/mypage/admin/AdminAccountManagement.vue';
import AdminMembershipsManagement from '@/components/mypage/admin/AdminMembershipsManagement.vue';

export default [
  { path: '/', component: HomeCompo },
  { path: '/login', component: LoginCompo },
  { path: '/memberSignup', component: MemberSignup },
  { path: '/companySignup', component: CompanySignup },
  { path: '/oauth/redirect', component: RedirectCompo },
  {
    path: '/requestEstimate',
    component: RequestEstimateCompo,
    children: [
      { path: '', redirect: '/requestEstimate/stepOne' }, // 기본적으로 stepOne으로 리다이렉트
      { path: 'stepOne', component: StepOne },
      { path: 'stepTwo', component: StepTwo },
      { path: 'stepThree', component: StepThree },
      { path: 'stepFour', component: StepFour },
      { path: 'stepFive', component: StepFive },
    ],
  },
  {
    path: '/admin',
    component: AdminPage,
    children: [
      { path: '/admin/accounts', component: AdminAccountManagement },
      { path: '/admin/memberships', component: AdminMembershipsManagement },
    ],
  },
  { path: '/payment', component: PaymentCompo },
  { path: '/company/:id', component: CompanyDetail },
  { path: '/portfolio/create', component: CreatePortfolio },
  { path: '/estimate/list', component: EstimateList },
  { path: '/verify-email', component: VerifyCompo },
  {
    path: '/mypage/user',
    component: UserPageCompo,
    redirect: '/mypage/user/info',
    children: [
      {
        path: 'info',
        component: UserBaseInfo,
      },

      {
        path: 'requestlist',
        component: UserRequestListCompo,
      },

      {
        path: 'reviewlist',
        component: UserReviewList,
      },

      {
        path: 'bookmark',
        component: UserBookMark,
      },
    ],
  },
];
