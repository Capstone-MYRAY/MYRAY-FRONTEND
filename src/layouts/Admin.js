import React, { useEffect } from "react";
import { Route, Switch, Redirect, useLocation } from "react-router-dom";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
// react plugin for creating notifications
import NotificationAlert from "react-notification-alert";

// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import { roleId } from "variables/general";

import routes from "routes.js";
import { useRecoilState } from "recoil";
import { listAreaState, listProvinceState, listDistrictState, listCommuneState } from "state/areaState";
import { listTreeTypesState } from "state/treeTypeState";
import { listPostTypesState } from "state/postTypeState";
import { moderatorState, moderatorsComboboxData } from "state/moderatorState";
import { listGuidePostState } from "state/guidePostState";
import { statisticState, chartDataState } from "state/statisticState";
import areaApi from "api/areaApi";
import treeTypeApi from "api/treeTypeApi";
import postTypeApi from "api/postTypeApi";
import moderatorApi from "api/moderatorApi";
import guidePostApi from "api/guidePostApi";
import statisticApi from "api/statisticApi";

var ps;

function Admin(props) {

const conditionDefault = {page:1, 'page-size': 20};

// fetch('https://api.myray.site/upload/tinhthanh.json')
//   .then(response => response.json())
//   .then(data => {
//     console.log("TINH NÈEEEEEEEEEEEEEEE:", data);
//   });

//State
const [listArea, setListArea] = useRecoilState(listAreaState);
const [listProvince, setListProvince] = useRecoilState(listProvinceState);
const [listDistrict, setListDistrict] = useRecoilState(listDistrictState);
const [listCommune, setListCommune] = useRecoilState(listCommuneState);
const [listModerators, setListModerators] = useRecoilState(moderatorState);
const [listModeratorsComboboxData, setListModeratorsComboboxData] = useRecoilState(moderatorsComboboxData);
const [listGuidePost, setListGuidePost] = useRecoilState(listGuidePostState);
const [listTreeTypes, setListTreeTypes] = useRecoilState(listTreeTypesState);
const [listPostTypes, setListPostTypes] = useRecoilState(listPostTypesState);
const [statisticResult, setStatisticResult] = useRecoilState(statisticState);
const [chartData, setChartData] = useRecoilState(chartDataState);

//-----------------------------Call API to get list area, then set to area state
useEffect(() => {
  const fetchListArea = async () => {
   
    try {
       //Area
       const response = await areaApi.getAll(conditionDefault);
 
       setListArea(response.data.list_object);
       console.log("Success to fetch list area. ", response.data.list_object);

       const responseGetProvince = await areaApi.getProvince();
       setListProvince(responseGetProvince);
       console.log("Success to fetch list responseGetProvince. ", responseGetProvince);

       const responseDistrict = await areaApi.getDistrict();
       setListDistrict(responseDistrict);
       console.log("Success to fetch list responseDistrict. ", responseDistrict);

       const responseGetCommune = await areaApi.getCommune();
       setListCommune(responseGetCommune);
       console.log("Success to fetch list responseGetCommune. ", responseGetCommune);

    } catch (err) {
      console.log("Failed to fetch list responseGetProvince. ", err);
    }
  }
  
  fetchListArea();
},[]);

//-----------------------------Call API to get StatisticResult, then set to StatisticResult state
useEffect(() => {
  const fetchStatisticResult = async () => {
   
    try {
       //StatisticResult
       const response = await statisticApi.getStatistic();
       setStatisticResult(response.data);
       console.log("Success to fetch StatisticResult. ", response.data);
    } catch (err) {
      console.log("Failed to fetch StatisticResult. ", err);
    }
  }
  
  fetchStatisticResult();
},[]);

useEffect(() => {
  const fetchStatisticResult = async () => {
   
    try {
       //StatisticResult
       const response = await statisticApi.getChartData(2022);
       setChartData(response.data);
       console.log("Success to fetch getChartData. ", response.data);
    } catch (err) {
      console.log("Failed to fetch getChartData. ", err);
    }
  }
  
  fetchStatisticResult();
},[]);

//-----------------------------Call API to get list moderators do not manage area, then set to moderators state
useEffect(() => {
  const fetchListModeratorsNoManage = async () => {
   
    try {
       //Moderators do not manage area
       const response = await moderatorApi.getModeratorNoManage(conditionDefault);
       setListModeratorsComboboxData(response.data);
       console.log("Success to fetch list moderator no manage. ", response.data);

    } catch (err) {
      console.log("Failed to fetch list moderator no manage. ", err);
    }
  }
  
  fetchListModeratorsNoManage();
},[]);

//-----------------------------Call API to get list all moderators, then set to moderators state
useEffect(() => {
  const fetchListModerators = async () => {
   
    try {
       //Moderators 
       const response = await moderatorApi.getAll(conditionDefault);
       setListModerators(response.data.list_object);
       console.log("Success to fetch list moderator. ", response.data.list_object);

    } catch (err) {
      console.log("Failed to fetch list moderator. ", err);
    }
  }
  
  fetchListModerators();
},[]);

//Guidepost state
//-----------------------------Call API to get list Guidepost, then set to Guidepost state
useEffect(() => {
  const fetchListPostTypes = async () => {
   
    try {
       const response = await guidePostApi.getAll(conditionDefault);
       setListGuidePost(response.data.list_object);
       console.log("Success to fetch list Guidepost. ", response.data.list_object);
    } catch (err) {
      console.log("Failed to fetch list Guidepost. ", err);
    }
  }
  
  fetchListPostTypes();
},[]);

//Tree type state
//-----------------------------Call API to get list Tree Types, then set to Tree Types state
useEffect(() => {
  const fetchListTreeTypes = async () => {
   
    try {
       //Tree Types
       const response = await treeTypeApi.getAll(conditionDefault);
       setListTreeTypes(response.data.list_object);
       console.log("Success to fetch list Tree Types. ", response.data.list_object);
    } catch (err) {
      console.log("Failed to fetch list Tree Types. ", err);
    }
  }
  
  fetchListTreeTypes();
},[]);

//Post type state
//-----------------------------Call API to get list Post Types, then set to Post Types state
useEffect(() => {
  const fetchListPostTypes = async () => {
   
    try {
       const response = await postTypeApi.getAll(conditionDefault);
       setListPostTypes(response.data.list_object);
       console.log("Success to fetch list Post Types. ", response.data.list_object);
    } catch (err) {
      console.log("Failed to fetch list Post Types. ", err);
    }
  }
  
  fetchListPostTypes();
},[]);

  const location = useLocation();
  const [sidebarMini, setSidebarMini] = React.useState(true);
  const [backgroundColor, setBackgroundColor] = React.useState("orange");
  const notificationAlert = React.useRef();
  const mainPanel = React.useRef();
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      document.documentElement.className += " perfect-scrollbar-on";
      document.documentElement.classList.remove("perfect-scrollbar-off");
      ps = new PerfectScrollbar(mainPanel.current);
    }
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
        document.documentElement.className += " perfect-scrollbar-off";
        document.documentElement.classList.remove("perfect-scrollbar-on");
      }
    };
  });
  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainPanel.current.scrollTop = 0;
  }, [location]);
  const minimizeSidebar = () => {
    var message = "Sidebar mini ";
    if (document.body.classList.contains("sidebar-mini")) {
      setSidebarMini(false);
      message += "deactivated...";
    } else {
      setSidebarMini(true);
      message += "activated...";
    }
    document.body.classList.toggle("sidebar-mini");
    var options = {};
    options = {
      place: "tr",
      message: message,
      type: "info",
      icon: "now-ui-icons ui-1_bell-53",
      autoDismiss: 7,
    };
    
  };
  const handleColorClick = (color) => {
    setBackgroundColor(color);
  };
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return getRoutes(prop.views);
      }
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  const getActiveRoute = (routes) => {
    let activeRoute = "Default Brand Text";
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveRoute = getActiveRoute(routes[i].views);
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute;
        }
      } else {
        if (
          window.location.pathname.indexOf(
            routes[i].layout + routes[i].path
          ) !== -1
        ) {
          return routes[i].name;
        }
      }
    }
    return activeRoute;
  };
  return (
    <div className="wrapper">
      <NotificationAlert ref={notificationAlert} />
      <Sidebar
        {...props}
        routes={routes}
        minimizeSidebar={minimizeSidebar}
        backgroundColor={backgroundColor}
      />
      <div className="main-panel" ref={mainPanel}>
        <AdminNavbar {...props} brandText={getActiveRoute(routes)} />
        <Switch>
          {getRoutes(routes)}
          <Redirect from="/admin" to="/admin/bang-dieu-khien" />
        </Switch>
        {
          // we don't want the Footer to be rendered on full screen maps page
          window.location.href.indexOf("full-screen-maps") !== -1 ? null : (
            <Footer fluid />
          )
        }
      </div>
      
    </div>
  );
}

export default Admin;
