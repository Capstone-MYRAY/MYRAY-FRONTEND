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



import DashboardScreen from "views/DashboardScreen/DashboardScreen";
import ListModeratorsScreen from "views/ManageModerators/ListModeratorsScreen";
import ListAreasScreen from "views/ManageAreas/ListAreasScreen";
import ListTreeTypesScreen from "views/ManageTreeType/ListTreeTypesScreen";
import ListPostTypesScreen from "views/ManagePostTypes/ListPostTypesScreen";
import ListGuidePostsScreen from "views/ManageGuidePosts/ListGuidePostsScreen";
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
    path: "/nguoi-dieu-hanh",
    name: "Người điều hành",
    icon: "fa fa-users text-green",
    component: ListModeratorsScreen,
    layout: "/admin",
  },
  {
    path: "/khu-vuc",
    name: "Khu vưc",
    icon: "fa fa-map text-green",
    component: ListAreasScreen,
    layout: "/admin",
  },
  {
    path: "/ky-thuat-lam-nong",
    name: "Kỹ thuật làm nông",
    icon: "fa fa-cog text-green",
    component: ListGuidePostsScreen,
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
