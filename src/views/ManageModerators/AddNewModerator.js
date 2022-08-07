// core components
import areaApi from "api/areaApi";
import moderatorApi from "api/moderatorApi";
import PanelHeader from "components/PanelHeader/PanelHeader.js";
import "moment-timezone";
import React, { useEffect, useState } from "react";
import Select from "react-select";
// reactstrap components
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Table,
} from "reactstrap";
import Swal from 'sweetalert2';
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  listAreaState,
  provinceComboboxData,
  listDistrictState,
} from "state/areaState";
import { moderatorComboboxDataState } from "state/moderatorState";
import { moderatorState } from "state/moderatorState";
import Datetime from "react-datetime";
import momentjs from "moment";
import { roleId } from "variables/general";

function AddNewModerator() {
  const [listModerators, setListModerators] = useRecoilState(moderatorState);
  const [areaList, setlistArea] = useRecoilState(listAreaState);
  const provinceCombobox = useRecoilValue(provinceComboboxData);
  const [districtsData, setDistrictsData] = useRecoilState(listDistrictState);
  const [moderatorComboboxData, setModeratorComboboxData] = useRecoilState(
    moderatorComboboxDataState
  );

  const [filtersParams, setFiltersParams] = useState({
    page: 1,
    "page-size": 20,
  });

  const createDate = () => {
    const d = new Date();
    return d;
  };

  const [dobDateSelected, setDOBSelected] = React.useState(createDate());

  const handleChangeDOB = (e) => {
    setDOBSelected(e.format("DD/MM/YYYY"));
  };

  const [provinceFilterSelected, setProvinceFilterSelected] = useState({
    value: -1,
    label: "Tỉnh thành",
  });

  const provinceFilterSelectData = [
    {
      value: -1,
      label: "Chọn tỉnh thành",
    },
    ...provinceCombobox,
  ];

  const [districtsFilterSelectData, setDistrictsFilterSelectData] = useState([
    {
      value: -1,
      label: "Chọn quận huyện",
    },
  ]);

  const [districtFilterSelected, setDistrictFilterSelected] = useState({
    value: -1,
    label: "Quận huyện",
  });

  const [communeFilterSelected, setCommuneFilterSelected] = useState({
    value: -1,
    label: "Xã / Thị trấn",
  });

  const [moderatorFilterSelected, setModeratorFilterSelected] = useState({
    value: -1,
    label: "Người điều hành",
  });

  const fetchListArea = async (filters) => {
    try {
      //Area
      const response = await areaApi.getAll(filters);
      response.data ? setlistArea(response.data.list_object) : setlistArea([]);
      console.log("Success to fetch list Area. ", response.data.list_object);
    } catch (err) {
      console.log("Failed to fetch list Area. ", err);
    }
  };

  const fetchListModerators = async (filtersParams) => {
    try {
      const response = await moderatorApi.getAll(filtersParams);
      setListModerators(response.data.list_object);
      console.log(
        "Success to fetch list moderator. ",
        response.data.list_object
      );
    } catch (err) {
      console.log("Failed to fetch list moderator. ", err);
    }
  };

  const clearFormForCreate = (e) => {
    e.target.fullname.value = "";
    // e.target.exampleRadios.value = 0;
    e.target.address.value = "";
    e.target.phone_number.value = "";
    e.target.email.value = "";
    e.target.about_me.value = "";
  };

  const handleCreateSubmit = async (e) => {
    const moderatorCreated = {
      role_id: roleId.moderator,
      fullname: e.target.fullname.value,
      date_of_birth: momentjs(Date(dobDateSelected)).format(
        "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
      ),
      gender: e.target.exampleRadios.value,
      address: e.target.address.value,
      phone_number: e.target.phone_number.value,
      password: "123456",
      email: e.target.email.value,
      about_me: e.target.about_me.value,
    };

    console.log("🚀 ~ file: CREATE MODERATOR", moderatorCreated);

    try {
      const response = await moderatorApi.post(moderatorCreated);
      console.log(
        "🚀 ~ file: moderatorCreated~ handleSubmit ~ response",
        response
      );

      Swal.fire({  
        icon: 'success',
        title: 'Thành công',  
        text: 'Tạo mới thành công!',  
      });

      clearFormForCreate(e);
      
    } catch (err) {
      console.log(`Failed to update moderator ${err}`);
      Swal.fire({  
        icon: 'error',
        title: 'Lỗi',  
        text: 'Tạo mới không thành công!',  
      });
    }
  };

  return (
    <>
      <PanelHeader size="sm" />

      <div className="content mt-1">
        <Row>
          <Col xs={12} md={12}>
            <Card>
              <CardHeader>
                <Row>
                  <Col xs={0.5} md={0.5}>
                    <Link to="/admin/nguoi-dieu-hanh">
                      <Button className="btn-icon" color="primary" size="sm">
                        <i class="fas fa-angle-double-left"></i>
                      </Button>
                    </Link>
                  </Col>
                  <Col xs={11} md={11}>
                    <CardTitle tag="h4">Thêm mới người điều hành</CardTitle>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <div className="content mt-1">
                  <Row>
                    <Col xs={12} md={12}>
                      <div className="content mt-1 d-flex justify-content-center">
                        <Row>
                          <Col md="12">
                            <Form
                              onSubmit={handleCreateSubmit}
                              className="form-horizontal"
                              method="get"
                            >
                              <Row>
                                <Label className="font-weight-bold" sm="3">Họ và tên:</Label>
                                <Col sm="9" md="9">
                                  <FormGroup className="">
                                    <Input
                                      placeholder="Nhập họ và tên..."
                                      type="text"
                                      name={"fullname"}
                                    />
                                  </FormGroup>
                                </Col>
                              </Row>

                              <Row>
                                <Label className="font-weight-bold" sm="3">Ngày sinh:</Label>
                                <Col sm="9" md="9">
                                  <FormGroup className="">
                                    <Datetime
                                      timeFormat={false}
                                      utc={true}
                                      dateFormat="DD/MM/YYYY"
                                      inputProps={{
                                        placeholder: "Datetime Picker",
                                      }}
                                      name="date_of_birth"
                                      onChange={handleChangeDOB}
                                      value={dobDateSelected}
                                    />
                                  </FormGroup>
                                </Col>
                              </Row>

                              <Row>
                            <Label className="font-weight-bold" sm="3">Giới tính:</Label>
                            <FormGroup check className="form-check-radio">
                              <Label check>
                                  <Input
                                    defaultChecked
                                    defaultValue="0"
                                    id="exampleRadios1"
                                    name="exampleRadios"
                                    type="radio"
                                  />
                                <span className="form-check-sign" />
                                Nam
                              </Label>
                            </FormGroup>
                            <FormGroup check className="form-check-radio">
                              <Label check>
                                  <Input
                                    defaultValue="1"
                                    id="exampleRadios2"
                                    name="exampleRadios"
                                    type="radio"
                                  />
                                <span className="form-check-sign" />
                                Nữ
                              </Label>
                            </FormGroup>
                            <FormGroup check className="form-check-radio">
                              <Label check>
                                  <Input
                                    defaultValue="2"
                                    id="exampleRadios2"
                                    name="exampleRadios"
                                    type="radio"
                                  />
                                <span className="form-check-sign" />
                                Khác
                              </Label>
                            </FormGroup>
                          </Row>

                              <Row>
                                <Label className="font-weight-bold" sm="3">Email:</Label>
                                <Col sm="9" md="9">
                                  <FormGroup className="">
                                    <Input
                                      placeholder="Nhập email... "
                                      type="text"
                                      name={"email"}
                                    />
                                  </FormGroup>
                                </Col>
                              </Row>

                              <Row>
                                <Label className="font-weight-bold" sm="3">Số điện thoại:</Label>
                                <Col sm="9" md="9">
                                  <FormGroup className="">
                                    <Input
                                      placeholder="Nhập số điện thoại..."
                                      type="text"
                                      name={"phone_number"}
                                    />
                                  </FormGroup>
                                </Col>
                              </Row>

                              <Row>
                                <Label className="font-weight-bold" sm="3">Địa chỉ:</Label>
                                <Col sm="9" md="9">
                                  <FormGroup className="">
                                    <Input
                                      placeholder="Nhập địa chỉ..."
                                      type="text"
                                      name={"address"}
                                    />
                                  </FormGroup>
                                </Col>
                              </Row>

                              <Row>
                                <Label className="font-weight-bold" sm="3">Mô tả:</Label>
                                <Col sm="9" md="9">
                                  <FormGroup>
                                    <Row className="">
                                      <Input
                                        cols="80"
                                        placeholder="Nhập mô tả..."
                                        rows="20"
                                        type="textarea"
                                        name={"about_me"}
                                      />
                                    </Row>
                                  </FormGroup>
                                </Col>
                              </Row>

                              <Row>
                                <Col sm="12">
                                  <div className="d-flex justify-content-center">
                                    <Button
                                      type="submit"
                                      className="mr-2"
                                      color="primary"
                                    >
                                      Tạo mới
                                    </Button>
                                  </div>
                                </Col>
                              </Row>
                            </Form>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default AddNewModerator;
