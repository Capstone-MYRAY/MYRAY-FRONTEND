import DashboardModScreen from "ViewsModerator/DashboardModScreen/DashboardModScreen";
import ListJobPostsScreen from "ViewsModerator/ManageJobPosts/ListJobPostsScreen";
import ListAccountsScreen from "ViewsModerator/ManageAccounts/ListAccountsScreen";
import TopUpScreen from "ViewsModerator/ManageAccounts/TopUpScreen";
import ListReportsScreen from "ViewsModerator/ManageReports/ListReportsScreen";
import UserPage from "views/Pages/UserPage"; 
//=======================


let routesModerator = [
  // {
  //   path: "/bang-dieu-khien-moderator",
  //   name: "Bảng điều khiển",
  //   icon: "fa fa-home text-green",
  //   component: DashboardModScreen,
  //   layout: "/moderator",
  // },
  {
    path: "/quan-ly-bai-dang",
    name: "Quản lý bài đăng",
    icon: "fa fa-book text-green",
    component: ListJobPostsScreen,
    layout: "/moderator",
  },
  {
    collapse: true,
    path: "/quan-ly-tai-khoan",
    name: "Quản lý tài khoản",
    state: "openAccounts",
    icon: "fa fa-users text-green",
    component: ListAccountsScreen,
    layout: "/moderator",
    views: [
      {
        path: "/quan-ly-tai-khoan",
        name: "Quản lý tài khoản",
        mini: "TK",
        component: ListAccountsScreen,
        layout: "/moderator",
      },
      {
        path: "/ho-so",
        name: "Hồ sơ",
        mini: "HS",
        component: UserPage,
        layout: "/moderator",
      },
    ],
  },
  {
    path: "/quan-ly-bao-cao",
    name: "Quản lý báo cáo",
    icon: "fa fa-bell text-green",
    component: ListReportsScreen,
    layout: "/moderator",
  },
];

export default routesModerator;
