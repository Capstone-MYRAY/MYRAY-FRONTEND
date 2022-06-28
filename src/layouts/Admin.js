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

import routes from "routes.js";
import { useRecoilState } from "recoil";
import { listAreaState } from "state/areaState";
import { listTreeTypesState } from "state/treeTypeState";
import { listPostTypesState } from "state/postTypeState";
import areaApi from "api/areaApi";
import treeTypeApi from "api/treeTypeApi";
import postTypeApi from "api/postTypeApi";


var ps;

function Admin(props) {

const conditionDefault = {page:1, 'page-size': 20};

//Area state
const [listArea, setListArea] = useRecoilState(listAreaState);
//-----------------------------Call API to get list area, then set to area state
useEffect(() => {
  const fetchListArea = async () => {
   
    try {
       //Area
       const response = await areaApi.getAll(conditionDefault);
 
       setListArea(response.data.list_object);
       console.log("Success to fetch list area. ", response.data.list_object);

      //  const responseGetProvince = await areaApi.getProvince();

       console.log("Success to fetch list responseGetProvince. ", response.data);

    } catch (err) {
      console.log("Failed to fetch list responseGetProvince. ", err);
    }
  }
  
  fetchListArea();
},[]);

//Tree type state
const [listTreeTypes, setListTreeTypes] = useRecoilState(listTreeTypesState);
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
const [listPostTypes, setListPostTypes] = useRecoilState(listPostTypesState);
//-----------------------------Call API to get list Post Types, then set to Post Types state
useEffect(() => {
  const fetchListPostTypes = async () => {
   
    try {
       //ALUMNI
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
