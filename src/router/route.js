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
import UserReviewList from '@/components/mypage/user/review/UserReviewList.vue';
import EstimateList from '@/components/estimate/EstimateList.vue';
import VerifyCompo from '@/components/login/VerifyCompo.vue';
import StepSix from '@/components/estimate/StepSix.vue';
import ReviewDetail from '@/components/review/ReviewDetail.vue';
import ReviewList from '@/components/review/ReviewList.vue';
import CreateReview from '@/components/review/CreateReview.vue';
import PortfolioDetail from '@/components/portfolio/PortfolioDetail.vue';
import PortfolioList from '@/components/portfolio/PortfolioList.vue';
import CompanyPageCompo from '@/components/mypage/company/CompanyPageCompo.vue';
import CompanyBaseInfo from '@/components/mypage/company/CompanyBaseInfo.vue';
import CompanyPortfolioList from '@/components/mypage/company/portfolio/CompanyPortfolioList.vue';

import AdminPageCompo from '@/components/admin/AdminPageCompo.vue';
import AdminCompanyMembershipList from '@/components/admin/company/AdminCompanyMembershipList.vue';
import AdminCompanyMembershipDetail from '@/components/admin/company/AdminCompanyMembershipDetail.vue';
import AdminCompanyPortfolioList from '@/components/admin/company/AdminCompanyPortfolioList.vue';
import AdminCompanyPortfolioDetail from '@/components/admin/company/AdminCompanyPortfolioDetail.vue';
import AdminMemberReviewList from '@/components/admin/member/AdminMemberReviewList.vue';
import AdminMemberReviewDetail from '@/components/admin/member/AdminMemberReviewDetail.vue';
import PlateformEventList from '@/components/admin/plateform/PlateformEventList.vue';
import PlateformEventDetail from '@/components/admin/plateform/PlateformEventDetail.vue';
import PlateformFAQList from '@/components/admin/plateform/PlateformFAQList.vue';
import PlateformFAQDetail from '@/components/admin/plateform/PlateformFAQDetail.vue';
import PlateformAskList from '@/components/admin/plateform/PlateformAskList.vue';
import PlateformAskDetail from '@/components/admin/plateform/PlateformAskDetail.vue';

import CompanySentRequests from '@/components/mypage/company/CompanySentRequests.vue';
import CompanyReceivedRequests from '@/components/mypage/company/CompanyReceivedRequests.vue';
import UserSaveRequests from '@/components/mypage/user/UserSaveRequests.vue';

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
      { path: 'stepSix', component: StepSix },
    ],
  },
  { path: '/payment', component: PaymentCompo },
  { path: '/company/:id', component: CompanyDetail },
  { path: '/portfolio/create', component: CreatePortfolio },
  { path: '/portfolio', component: PortfolioList },
  { path: '/portfolio/:id', component: PortfolioDetail },

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
        path: 'usersaverequest',
        component: UserSaveRequests,
      },
      {
        path: 'reviewlist',
        component: UserReviewList,
      },
    ],
  },
  {
    path: '/mypage/company',
    component: CompanyPageCompo,
    redirect: '/mypage/company/info',
    children: [
      {
        path: 'info',
        component: CompanyBaseInfo,
      },
      {
        path: 'sentrequest',
        component: CompanySentRequests,
      },
      {
        path: 'receivedrequest',
        component: CompanyReceivedRequests,
      },
      {
        path: 'portfoliolist',
        component: CompanyPortfolioList,
      },
    ],
  },
  { path: '/reviews/:id', component: ReviewDetail },
  { path: '/reviews', component: ReviewList },
  { path: '/reviews/create', component: CreateReview },
  {
    path: '/mypage/admin',
    component: AdminPageCompo,
    redirect: '/mypage/admin/adminCompanyMembershipList',
    children: [
      {
        path: 'adminCompanyMembershipList',
        component: AdminCompanyMembershipList,
      },
      {
        path: 'adminCompanyMembershipDetail',
        component: AdminCompanyMembershipDetail,
      },
      {
        path: 'adminCompanyPortfolioList',
        component: AdminCompanyPortfolioList,
      },
      {
        path: 'adminCompanyPortfolioDetail',
        component: AdminCompanyPortfolioDetail,
      },
      {
        path: 'adminMemberReviewList',
        component: AdminMemberReviewList,
      },
      {
        path: 'adminMemberReviewDetail',
        component: AdminMemberReviewDetail,
      },
      {
        path: 'plateformEventList',
        component: PlateformEventList,
      },
      {
        path: 'plateformEventDetail',
        component: PlateformEventDetail,
      },
      {
        path: 'plateformFAQList',
        component: PlateformFAQList,
      },
      {
        path: 'plateformFAQDetail',
        component: PlateformFAQDetail,
      },
      {
        path: 'plateformAskList',
        component: PlateformAskList,
      },
      {
        path: 'plateformAskDetail',
        component: PlateformAskDetail,
      },
    ],
  },
];
