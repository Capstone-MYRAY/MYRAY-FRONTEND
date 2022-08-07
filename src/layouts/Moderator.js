import React, { useEffect } from "react";
import { Route, Switch, Redirect, useLocation } from "react-router-dom";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
// react plugin for creating notifications
import NotificationAlert from "react-notification-alert";

// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Footer from "components/Footer/Footer.js";
import SidebarModerator from "components/Sidebar/SidebarModerator";

import routesModerator from "routesModerator";
import { useRecoilState } from "recoil";
import { accountState } from "state/accountState";
import { reportState } from "state/reportState";
import { accountInfoState } from "state/authState";
// import { listAreaState } from "state/areaState";
// import { listTreeTypesState } from "state/treeTypeState";
import accountApi from "api/accountApi";
import reportApi from "api/reportApi";
// import treeTypeApi from "api/treeTypeApi";
// import postTypeApi from "api/postTypeApi";
import { roleId } from "variables/general";

var ps;

function Moderator(props) {

const conditionDefault = {page:1, 'page-size': 20};
const [listAccounts, setListAccounts] = useRecoilState(accountState);
const [listReports, setListReports] = useRecoilState(reportState);
const [userInfo, setUserInfo] = useRecoilState(accountInfoState);

  const location = useLocation();
  const [sidebarMini, setSidebarMini] = React.useState(true);
  const [backgroundColor, setBackgroundColor] = React.useState("orange");
  const notificationAlert = React.useRef();
  const mainPanel = React.useRef();
  const userAccountLocal = JSON.parse(localStorage.getItem('account'));

//-----------------------------Call API to get list all moderators, then set to moderators state
useEffect(() => {
  const fetchListAccounts = async () => {
   
    try {
       //Moderators 
       const response = await accountApi.getAll({...conditionDefault, roleId: roleId.landowner});
       setListAccounts(response.data.list_object);
       console.log("Success to fetch list account. ", response.data.list_object);

       const userAccount = await accountApi.get(userAccountLocal.id);
       console.log("Success to fetch user information. ", userAccount.data);
       setUserInfo(userAccount.data);
    } catch (err) {
      console.log("Failed to fetch list account. ", err);
    }
  }
  
  fetchListAccounts();
},[]);

//-----------------------------Call API to get list all report, then set to report state
useEffect(() => {
  const fetchListReports = async () => {
   
    try {
       //Moderators 
       const response = await reportApi.getAll(conditionDefault);
       setListReports(response.data.list_object);
       console.log("Success to fetch list Reports. ", response.data.list_object);

    } catch (err) {
      console.log("Failed to fetch list Reports. ", err);
    }
  }
  
  fetchListReports();
},[]);




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
      if (prop.layout === "/moderator") {
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
      <SidebarModerator
        {...props}
        routes={routesModerator}
        minimizeSidebar={minimizeSidebar}
        backgroundColor={backgroundColor}
      />
      <div className="main-panel" ref={mainPanel}>
        <AdminNavbar {...props} brandText={getActiveRoute(routesModerator)} />
        <Switch>
          {getRoutes(routesModerator)}
          <Redirect from="/moderator" to="/moderator/quan-ly-bai-dang" />
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

export default Moderator;
