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
import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

// core components
import AuthNavbar from "components/Navbars/AuthNavbar.js";
import Footer from "components/Footer/Footer.js";
import LoginPage from "views/Pages/LoginPage.js";

// import routes from "routes.js";

function Auth(props) {
  let routes = [{
    path: "/login-page",
    name: "Login Page",
    short: "Login",
    mini: "LP",
    component: LoginPage,
    layout: "/auth",
  },];

  const [filterColor, setFilterColor] = React.useState("yellow");
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return getRoutes(prop.views);
      }
      if (prop.layout === "/auth") {
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
  const handleColorClick = (color) => {
    setFilterColor(color);
  };
  return (
    <>
      <div className="wrapper wrapper-full-page">
        <div className="full-page section-image" filter-color={filterColor}>
          <Switch>
            {getRoutes(routes)}
            <Redirect from="/auth" to="/auth/login-page" />
          </Switch>
          <Footer fluid />
        </div>
      </div>
      
    </>
  );
}

export default Auth;
