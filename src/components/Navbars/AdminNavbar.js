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
import { useLocation } from "react-router-dom";
// used for making the prop types of this component
import PropTypes from "prop-types";

// reactstrap components
import {
  Navbar,
  NavbarBrand,
  Container,
  Button,
  Col,
} from "reactstrap";

function AdminNavbar(props) {
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);
  const [color, setColor] = React.useState("transparent");
  // const color = #4F9E1D;
  const sidebarToggle = React.useRef();
  
  const openSidebar = () => {
    document.documentElement.classList.toggle("nav-open");
    sidebarToggle.current.classList.toggle("toggled");
  };
  // function that adds color white/transparent to the navbar on resize (this is for the collapse)
  const updateColor = () => {
    if (window.innerWidth < 993 && isOpen) {
      setColor("white");
    } else {
      setColor("transparent");
    }
  };
  React.useEffect(() => {
    window.addEventListener("resize", updateColor);
    // eslint-disable-next-line
  }, []);
  React.useEffect(() => {
    if (
      window.innerWidth < 993 &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
      sidebarToggle.current.classList.toggle("toggled");
    }
  }, [location]);


  const logout = () => {
    localStorage.removeItem('user');
  }

  return (
    // add or remove classes depending if we are on full-screen-maps page or not
    <Navbar
      color={
        window.location.href.indexOf("full-screen-maps") !== -1
          ? "white"
          : color
      }
      expand="lg"
      className={
        window.location.href.indexOf("full-screen-maps") !== -1
          ? "navbar-absolute "
          : "navbar-absolute " +
            (color === "transparent" ? "navbar-transparent " : "")
      }
    >
      <Container fluid>
        <div className="navbar-wrapper">
          <Col md="10">
          <div className="navbar-toggle">
            <button
              type="button"
              ref={sidebarToggle}
              className="navbar-toggler"
              onClick={() => openSidebar()}
            >
              <span className="navbar-toggler-bar bar1" />
              <span className="navbar-toggler-bar bar2" />
              <span className="navbar-toggler-bar bar3" />
            </button>
          </div>
          <NavbarBrand>{props.brandText}</NavbarBrand>
          </Col>

        </div>
        <Col md="1">
          </Col>
      </Container>
    </Navbar>
  );
}

AdminNavbar.defaultProps = {
  brandText: "Default Brand Text",
};

AdminNavbar.propTypes = {
  // string for the page name
  brandText: PropTypes.string,
};

export default AdminNavbar;
