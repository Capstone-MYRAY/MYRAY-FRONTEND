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
    icon: "fa fa-book text-green",
    component: ListJobPostsScreen,
    layout: "/moderator",
  },
  {
    path: "/quan-ly-tai-khoan",
    name: "Quản lý tài khoản",
    icon: "fa fa-users text-green",
    component: ListAccountsScreen,
    layout: "/moderator",
  },
  // {
  //   path: "/nap-tien",
  //   name: "Nạp tiền vào tài khoản",
  //   icon: "fa fa-cog text-green",
  //   component: TopUpScreen,
  //   layout: "/moderator",
  // },
  {
    path: "/quan-ly-bao-cao",
    name: "Quản lý báo cáo",
    icon: "fa fa-bell text-green",
    component: ListReportsScreen,
    layout: "/moderator",
  },
];

export default routesModerator;
