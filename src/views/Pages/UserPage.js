import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
// reactstrap components
import {
  Card, CardBody, CardHeader, Col, Button,
  Form, FormGroup, Input, Row
} from "reactstrap";
import PanelHeader from "components/PanelHeader/PanelHeader.js";
import { accountInfoState } from "state/authState";
import accountApi from "api/accountApi";
import Moment from "react-moment";
import Datetime from "react-datetime";
import momentjs from "moment";
import "moment-timezone";
import Swal from "sweetalert2";
import moderatorApi from "api/moderatorApi";

function User() {
  const [userInfo, setUserInfo] = useRecoilState(accountInfoState);

  useEffect(() => {
    const fetchListAccounts = async () => {
     
      try {
         //Moderators 
         
        //  const userAccount = await accountApi.get(userInfo.id);
         console.log("Success to fetch user information. ", userInfo);
        //  setUserInfo(userAccount);
      } catch (err) {
        console.log("Failed to fetch list account. ", err);
      }
    }
    
    fetchListAccounts();
  },[]);

  const createDate = () => {
    const d = momentjs(userInfo.date_of_birth).format("DD-MM-YYYY");
    return d;
  };

  const [dobDateSelected, setDOBSelected] = React.useState(momentjs(userInfo.date_of_birth).format("DD/MM/YYYY"));

  const handleChangeDOB = (e) => {
    console.log("EDDDDDDDIIIIIIIT TIMEEEEEEEEEEEEE:", e.format("DD/MM/YYYY")
    );
    setDOBSelected(e.format("DD/MM/YYYY"));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const updateModerator = {
      id: userInfo.id,
      role_id: userInfo.role_id,
      fullname: e.target.fullname.value,
      date_of_birth: momentjs(Date(dobDateSelected)).format(
        "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
      ),
      address: e.target.address.value,
      phone_number: e.target.phone_number.value,
      email: e.target.email.value,
      about_me: e.target.about_me.value,
      // area_id: 0
    };
    console.log(
      "🚀 ~ file: moderatorApi.js ~ line 197 ~ handleSubmit ~ response",
      updateModerator
    );

    try {
      const response = await moderatorApi.put(updateModerator);
      console.log(
        "🚀 ~ file: moderatorApi.js ~ line 197 ~ handleSubmit ~ response",
        response
      );

      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Cập nhật thành công!",
      });

    } catch (err) {
      console.log(`Failed to update moderator ${err}`);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Cập nhật không thành công!",
      });
    }

  };

  return (
    <>
    <PanelHeader size="sm" />
      <div className="content">
        <Row>
          <Col md="9">
            <Card>
              <CardHeader>
                <h5 className="title">Chỉnh sửa hồ sơ</h5>
              </CardHeader>
              <CardBody>
                <Form  onSubmit={handleUpdateSubmit} method="get"> 
                  <Row>
                  <Col className="pr-1" md="6">
                      <FormGroup>
                        <label className="font-weight-bold">Họ và tên</label>
                        <Input
                          defaultValue={userInfo.fullname}
                          placeholder="Họ và tên"
                          type="text"
                          name="fullname"
                        />
                      </FormGroup>
                    </Col>
                    
                    <Col className="pl-1" md="6">
                    <FormGroup>
                        <label className="font-weight-bold">Ngày sinh</label>
                        <Datetime
                                  timeFormat={false}
                                  utc={true}
                                  dateFormat="DD/MM/YYYY"
                                  inputProps={{
                                    placeholder: "Chọn ngày sinh",
                                  }}
                                  name="date_of_birth"
                                  onChange={handleChangeDOB}
                                  value={dobDateSelected}
                                  // defaultValue={userInfo.date_of_birth}
                                />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                    <FormGroup>
                        <label className="font-weight-bold">Số điện thoại</label>
                        <Input
                          defaultValue={userInfo.phone_number}
                          placeholder="Số điện thoại"
                          type="text"
                          name={"phone_number"}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-1" md="6">
                    <FormGroup>
                      <label className="font-weight-bold" htmlFor="exampleInputEmail1">
                          Email
                          </label>
                        <Input
                          defaultValue={userInfo.email}
                          placeholder="Email"
                          type="text"
                          name={"email"}
                        />
                      </FormGroup>
                      
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label className="font-weight-bold">Địa chỉ</label>
                        <Input
                          defaultValue={userInfo.address}
                          placeholder="Địa chỉ"
                          type="text"
                          name={"address"}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label className="font-weight-bold">Giới thiệu:</label>
                        <Input
                          cols="80"
                          defaultValue={userInfo.about_me}
                          placeholder="Giới thiệu"
                          rows="4"
                          type="textarea"
                          name={"about_me"}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <div className="d-flex justify-content-center">
                          <Button
                            color="primary"
                            type="submit"
                          >
                            Cập nhật
                          </Button>

                        </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
          <Col md="3">
            <Card className="card-user">
              <CardBody>
                <div className="d-flex justify-content-center">
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    <img
                      alt="..."
                      className="avatar border-gray mt-5"
                      src={userInfo.image_url ? userInfo.image_url : require("assets/img/default-avatar.png").default}
                    />
                  </a>
                  
                </div>
                <FormGroup className="form-file-upload form-file-simple">
                      <Input
                        type="text"
                        className="inputFileVisible"
                        placeholder="Đổi ảnh đại diện"
                        // onClick={(e) => handleSingleFileInput(e)}
                        // defaultValue={singleFileName}
                      />
                      <input
                        type="file"
                        className="inputFileHidden"
                        // style={{ zIndex: -1 }}
                        // ref={singleFileRef}
                        // onChange={(e) => addSingleFile(e)}
                      />
                    </FormGroup>

                    
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default User;
