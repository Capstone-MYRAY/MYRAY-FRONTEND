import React, { useEffect, useState } from "react";
// reactstrap components

// core components
import { useRecoilState } from "recoil";
import { authState } from "state/authState";
import jwt_decode from "jwt-decode";

import authApi from "api/authApi";

// reactstrap components
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Form,
  Container,
  Col,
  Row,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Button,
} from "reactstrap";

import bgImage from "assets/img/bg99.jpg";
import nowLogo from "myrayLogo.png";

function LoginPage() {
  const [phoneNumberFocus, setPhoneNumberFocus] = React.useState(false);
  const [passwordFocus, setPasswordFocus] = React.useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [authUser, setAuthUser] = useRecoilState(authState);

  React.useEffect(() => {
    document.body.classList.add("login-page");
    return function cleanup() {
      document.body.classList.remove("login-page");
    };
  }, []);

  const headerstyle = { color: "white", margin: "auto", width: "300px" };

  const setActive = (e) => {
    e.preventDefault();
    setIsResetPassword(true);
  };

  const setDeactive = (e) => {
    e.preventDefault();
    setIsResetPassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isResetPassword) {
      // alert(e.target.phone_number.value + `         AAAAAAA        ` + e.target.password.value);
      try {
        const loginInput = {
          phone_number: e.target.phone_number.value,
          password: e.target.password.value,
        };
        const response = await authApi.authen(loginInput);
        // alert(response);
        console.log("Login success: ", response);
        // const backendToken = jwt_decode(response.data.token);

        if (response.status === 200) {
          setAuthUser(response.data);

          const backendToken = jwt_decode(response.data.token);
          console.log("Login success backendToken: ", backendToken);

          // setAuthUser(backendToken.role);
          localStorage.setItem("user", JSON.stringify(response.data));
          localStorage.setItem("account", JSON.stringify(backendToken));

          if (backendToken.role === "Admin") {
            window.location.assign("/admin");
          } else if (backendToken.role === "Moderator") {
            window.location.assign("/moderator");
          } else {
            window.location.assign("/");
          }
        } else {
          window.location.assign("/");
        }
      } catch (error) {
        console.log("Failed to login: ", error);
      }
    } else {
      try {
        const phoneNumber =  e.target.phone_number.value;
        const response = await authApi.resetpassword(phoneNumber);
        console.log("RESET PASS:" ,response);
        setIsResetPassword(false);
      } catch (error) {
        console.log("Failed to reset: ", error);
      }
    }
  };
  return (
    <>
      <div className="content">
        <div className="login-page">
          <Container>
            <Col xs={12} md={8} lg={4} className="ml-auto mr-auto">
              <Form onSubmit={handleSubmit} method="post">
                <Card className="card-login card-plain">
                  <CardHeader>
                    <div className="logo-container">
                      <img src={nowLogo} alt="now-logo" />

                      {!isResetPassword ? (
                        <h2
                          className="ml-5 font-weight-bold"
                          style={headerstyle}
                        >
                          ĐĂNG NHẬP
                        </h2>
                      ) : (
                        <h3
                          className="ml-4 font-weight-bold"
                          style={headerstyle}
                        >
                          QUÊN MẬT KHẨU
                        </h3>
                      )}
                    </div>
                  </CardHeader>
                  {!isResetPassword ? (
                    <div>
                      <CardBody>
                        <InputGroup
                          className={
                            "no-border form-control-lg " +
                            (phoneNumberFocus ? "input-group-focus" : "")
                          }
                        >
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="now-ui-icons users_circle-08" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            name="phone_number"
                            type="text"
                            placeholder="Số điện thoại..."
                            onFocus={(e) => setPhoneNumberFocus(true)}
                            onBlur={(e) => setPhoneNumberFocus(false)}
                          />
                        </InputGroup>
                        <InputGroup
                          className={
                            "no-border form-control-lg " +
                            (passwordFocus ? "input-group-focus" : "")
                          }
                        >
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="now-ui-icons text_caps-small" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            name="password"
                            type="password"
                            placeholder="Mật khẩu..."
                            onFocus={(e) => setPasswordFocus(true)}
                            onBlur={(e) => setPasswordFocus(false)}
                          />
                        </InputGroup>
                      </CardBody>
                      <CardFooter>
                        <Button
                          block
                          color="primary"
                          size="lg"
                          type="submit"
                          className="mb-3 btn-round"
                        >
                          Đăng nhập
                        </Button>

                        <div className="pull-right">
                          <h6>
                            <div
                              onClick={setActive}
                              className="link footer-link"
                            >
                              Quên mật khẩu
                            </div>
                          </h6>
                        </div>
                      </CardFooter>
                    </div>
                  ) : (
                    <div>
                      <CardBody>
                        <InputGroup
                          className={
                            "no-border form-control-lg " +
                            (phoneNumberFocus ? "input-group-focus" : "")
                          }
                        >
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="now-ui-icons users_circle-08" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            name="phone_number"
                            type="text"
                            placeholder="Số điện thoại..."
                            onFocus={(e) => setPhoneNumberFocus(true)}
                            onBlur={(e) => setPhoneNumberFocus(false)}
                          />
                        </InputGroup>
                      </CardBody>
                      <CardFooter>
                        <Button
                          block
                          color="primary"
                          size="lg"
                          type="submit"
                          className="mb-3 btn-round"
                        >
                          Lấy mật khẩu mới
                        </Button>

                        <div className="pull-right">
                          <h6>
                            <div
                              onClick={setDeactive}
                              className="link footer-link"
                            >
                              Đăng nhập
                            </div>
                          </h6>
                        </div>
                      </CardFooter>
                    </div>
                  )}
                </Card>
              </Form>
            </Col>
          </Container>
        </div>
      </div>
      <div
        className="full-page-background"
        style={{ backgroundImage: "url(" + bgImage + ")" }}
      />
    </>
  );
}

export default LoginPage;
