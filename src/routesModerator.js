/*!

=========================================================
* Now UI Dashboard PRO React - v1.5.0
=========================================================

* Product Page: https://www.creative-tim.com/product/now-ui-dashboard-pro-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================


* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/



import DashboardModScreen from "ViewsModerator/DashboardModScreen/DashboardModScreen";
import ListJobPostsScreen from "ViewsModerator/ManageJobPosts/ListJobPostsScreen";
import ListAccountsScreen from "ViewsModerator/ManageAccounts/ListAccountsScreen";
import TopUpScreen from "ViewsModerator/ManageAccounts/TopUpScreen";
import ListReportsScreen from "ViewsModerator/ManageReports/ListReportsScreen";
//=======================


let routesModerator = [
  {
    path: "/bang-dieu-khien-moderator",
    name: "Bảng điều khiển",
    icon: "fa fa-home text-green",
    component: DashboardModScreen,
    layout: "/moderator",
  },
  {
    path: "/quan-ly-bai-dang",
    name: "Quản lý bài đăng",
    icon: "fa fa-users text-green",
    component: ListJobPostsScreen,
    layout: "/moderator",
  },
  {
    path: "/quan-ly-tai-khoan",
    name: "Quản lý tài khoản",
    icon: "fa fa-map text-green",
    component: ListAccountsScreen,
    layout: "/moderator",
  },
  {
    path: "/nap-tien",
    name: "Nạp tiền vào tài khoản",
    icon: "fa fa-cog text-green",
    component: TopUpScreen,
    layout: "/moderator",
  },
  {
    path: "/quan-ly-bao-cao",
    name: "Quản lý báo cáo",
    icon: "fa fa-tree text-green",
    component: ListReportsScreen,
    layout: "/moderator",
  },
];

export default routesModerator;
