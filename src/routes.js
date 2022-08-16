import DashboardScreen from "views/DashboardScreen/DashboardScreen";
import ListModeratorsScreen from "views/ManageModerators/ListModeratorsScreen";
import ListAreasScreen from "views/ManageAreas/ListAreasScreen";
import ListTreeTypesScreen from "views/ManageTreeType/ListTreeTypesScreen";
import ListPostTypesScreen from "views/ManagePostTypes/ListPostTypesScreen";
import ListGuidePostsScreen from "views/ManageGuidePosts/ListGuidePostsScreen";
import AddNewArea from "views/ManageAreas/AddNewArea";
import AddGuidePost from "views/ManageGuidePosts/AddGuidePost";
import AddNewModerator from "views/ManageModerators/AddNewModerator";
import UserPage from "views/Pages/UserPage"; 
import ListWorkTypesScreen from "views/ManageWorkTypes/ListWorkTypesScreen";
//=======================

let routes = [
  {
    path: "/bang-dieu-khien",
    name: "Bảng điều khiển",
    icon: "fa fa-home text-green",
    component: DashboardScreen,
    layout: "/admin",
  },
  {
    collapse: true,
    path: "/nguoi-dieu-hanh",
    name: "Người điều hành",
    state: "openModerator",
    icon: "fa fa-users text-green",
    component: ListModeratorsScreen,
    layout: "/admin",
    views: [
      {
        path: "/nguoi-dieu-hanh",
        name: "Người điều hành",
        mini: "LN",
        component: ListModeratorsScreen,
        layout: "/admin",
      },
      {
        path: "/them-moi-nguoi-dieu-hanh",
        name: "Thêm mới người điều hành",
        mini: "LN",
        component: AddNewModerator,
        layout: "/admin",
      },
      {
        path: "/ho-so",
        name: "Hồ sơ",
        mini: "HS",
        component: UserPage,
        layout: "/admin",
      },
    ],
  },
  {
    collapse: true,
    path: "/khu-vuc",
    name: "Khu vực",
    state: "openAreas",
    icon: "fa fa-map text-green",
    component: ListAreasScreen,
    layout: "/admin",
    views: [
      {
        path: "/khu-vuc",
        name: "Khu vực",
        mini: "LN",
        component: ListAreasScreen,
        layout: "/admin",
      },
      {
        path: "/them-moi-khu-vuc",
        name: "Thêm mới khu vực",
        mini: "LN",
        component: AddNewArea,
        layout: "/admin",
      },
    ],
  },
  {
    collapse: true,
    path: "/ky-thuat-lam-nong",
    name: "Kỹ thuật làm nông",
    state: "openGuideposts",
    icon: "fa fa-cog text-green",
    component: ListGuidePostsScreen,
    layout: "/admin",
    views: [
      {
        path: "/ky-thuat-lam-nong",
        name: "Kỹ thuật làm nông",
        mini: "LN",
        component: ListGuidePostsScreen,
        layout: "/admin",
      },
      {
        path: "/them-moi-ky-thuat-lam-nong",
        name: "Thêm mới kỹ thuật làm nông",
        mini: "LN",
        component: AddGuidePost,
        layout: "/admin",
      },
    ],
  },
  {
    path: "/loai-cong-viec",
    name: "Loại công việc",
    icon: "fa fa-cog text-green",
    component: ListWorkTypesScreen,
    layout: "/admin",
  },
  {
    path: "/loai-cay",
    name: "Loại cây",
    icon: "fa fa-tree text-green",
    component: ListTreeTypesScreen,
    layout: "/admin",
  },
  {
    path: "/loai-tin",
    name: "Loại tin",
    icon: "fa fa-newspaper text-green",
    component: ListPostTypesScreen,
    layout: "/admin",
  },
];

export default routes;
