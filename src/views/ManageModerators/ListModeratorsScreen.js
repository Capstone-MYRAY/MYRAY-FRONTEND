import ReactTable from "components/ReactTable/ReactTable.js";
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
import Moment from "react-moment";
import { Link } from "react-router-dom";
import Select from "react-select";
import React, { useEffect, useState } from "react";
import momentjs from "moment";
import "moment-timezone";
import Swal from "sweetalert2";
import PanelHeader from "components/PanelHeader/PanelHeader.js";
import { useRecoilState } from "recoil";
// import ImageUpload from "components/CustomUpload/ImageUpload";
import { moderatorState } from "state/moderatorState";
import moderatorApi from "api/moderatorApi";
import { JobPostStatusVN, jobType, gender } from "variables/general";
import Datetime from "react-datetime";

function ListModeratorsScreen() {
  const [listModerators, setListModerators] = useRecoilState(moderatorState);
  const [isOpenDetail, setIsOpentDetail] = useState(false);
  const [isOpenEdit, setIsOpentEdit] = useState(false);
  const [selectedModerator, setSelectedModerator] = useState({});
  const [filtersParams, setFiltersParams] = useState({
    page: 1,
    "page-size": 20,
  });

  //Call API to get list all moderators, then set to moderators state
  useEffect(() => {
    const fetchListModerators = async () => {
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

    fetchListModerators();
  }, []);

  const fetchListModerators = async (filtersParams) => {
    try {
      //Moderators do not manage area
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

  const createDate = () => {
    const d = new Date();
    return d;
  };

  const [dobDateSelected, setDOBSelected] = React.useState(createDate());

  const handleChangeDOB = (e) => {
    console.log("EDDDDDDDIIIIIIIT TIMEEEEEEEEEEEEE:", e.format("DD/MM/YYYY"));
    setDOBSelected(e.format("DD/MM/YYYY"));
  };

  const openEditModal = () => {};

  const closeModal = () => {
    setIsOpentDetail(false);
  };

  const closeEditModal = () => {
    setIsOpentEdit(false);
  };

  //Handle edit button
  const openDetailScreen = async (moderator) => {
    setSelectedModerator(moderator);
    console.log("EDDDDDDDIIIIIIIT moderator:", moderator);
    setIsOpentDetail(true);
    setDOBSelected(momentjs(moderator.date_of_birth).format("DD/MM/YYYY"));
  };

  const closeDetailScreen = () => {
    setIsOpentDetail(false);
  };

  const handleUpdateButtonClick = async (e) => {
    setIsOpentEdit(true);
    console.log("EDDDDDDDIIIIIIIT moderator:", selectedModerator);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const updateModerator = {
      id: selectedModerator.id,
      role_id: selectedModerator.role_id,
      fullname: e.target.fullname.value,
      date_of_birth: momentjs(Date(dobDateSelected)).format(
        "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
      ),
      gender: e.target.exampleRadios.value,
      address: e.target.address.value,
      phone_number: e.target.phone_number.value,
      email: e.target.email.value,
      about_me: e.target.about_me.value,
      // area_id: 0
    };

    console.log("updateModerator moderator:" + updateModerator.date_of_birth);

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

      setIsOpentDetail(false);
    } catch (err) {
      console.log(`Failed to update moderator ${err}`);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Cập nhật không thành công!",
      });
    }

    setIsOpentEdit(false);
  };

  const deleteModerator = async (moderator) => {
    setSelectedModerator(moderator);
    console.log(
      "🚀 ~ file: ListNewsPage.js ~ line 141 ~ delete moderator ~ response",
      moderator.id
    );
    try {
      const response = await moderatorApi.delete(parseInt(moderator.id));
      console.log(
        "🚀 ~ file: ListNewsPage.js ~ line 141 ~ delete response ~ response",
        response
      );

      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Xóa thành công!",
      });

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
    } catch (err) {
      console.log(`Failed to delete moderator ${err}`);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Xóa không thành công!",
      });
    }
  };

  const dataState = listModerators.map((prop, key) => {
    key = prop.id;
    return {
      id: key,
      fullname: prop.fullname,
      area:
        prop.area_accounts.length > 0
          ? prop.area_accounts[prop.area_accounts.length - 1].address
          : "Không quản lý khu vực nào",
      phone_number: prop.phone_number,
      email: prop.email,
      address: prop.address,

      actions: (
        // we've added some custom button actions
        <div className="actions-right">
          {/* use this button to add a edit kind of action */}
          <Button
            onClick={openDetailScreen.bind(this, prop)}
            className="btn-round"
            color="primary"
            size="sm"
          >
            Chi tiết
          </Button>{" "}
          {/* use this button to remove the data row */}
          <Button
            onClick={deleteModerator.bind(this, prop)}
            className="btn-round"
            color="danger"
            size="sm"
          >
            Xóa
          </Button>{" "}
        </div>
      ),
    };
  });
  return (
    <>
      <PanelHeader size="sm" />
      {!isOpenDetail ? (
        <div className="content mt-1">
          <Row>
            <Col xs={12} md={12}>
              <Card>
                <CardHeader>
                  <Row>
                    <Col xs={10} md={10}>
                      <CardTitle tag="h4">Quản lý người điều hành</CardTitle>
                    </Col>
                    <Col xs={2} md={2}>
                      <Link to="/admin/them-moi-nguoi-dieu-hanh">
                        <Button color="primary">Thêm mới</Button>
                      </Link>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <ReactTable
                    data={dataState}
                    columns={[
                      {
                        Header: "Họ và tên",
                        accessor: "fullname",
                      },
                      {
                        Header: "Khu vực quản lý",
                        accessor: "area",
                      },
                      {
                        Header: "Số điện thoại",
                        accessor: "phone_number",
                      },
                      {
                        Header: "Email",
                        accessor: "email",
                      },
                      {
                        Header: "Địa chỉ",
                        accessor: "address",
                      },
                      {
                        Header: "",
                        accessor: "actions",
                        sortable: false,
                        filterable: false,
                      },
                    ]}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      ) : (
        //DETAILS
        <div>
          <div
            className="content mt-1"
            style={{ maxWidth: "1700px", width: "100%" }}
          >
            <Row>
              <Col md="12">
                <Card>
                  <CardHeader>
                    <h5 className="title">Hồ sơ của người điều hành</h5>
                  </CardHeader>
                  <CardBody>
                    <Row className="d-flex justify-content-center">
                      <Form style={{ width: "100%" }}>
                        <Row style={{ width: "100%", padding: "0 10%"}}>
                          <Col md="6">
                            <Table responsive>
                              <tr>
                                <th md="1">Họ và tên:</th>
                                <td md="7">{selectedModerator.fullname}</td>
                              </tr>

                              <tr>
                                <th md="1">Quản lý khu vực:</th>
                                <td md="7">
                                  {selectedModerator.area_accounts.length > 0
                                    ? selectedModerator.area_accounts[
                                        selectedModerator.area_accounts.length -
                                          1
                                      ].address
                                    : "Không"}
                                </td>
                              </tr>

                              <tr>
                                <th md="1">Địa chỉ:</th>
                                <td md="7">{selectedModerator.address}</td>
                              </tr>

                              <tr>
                                <th md="1">Email:</th>
                                <td md="7">{selectedModerator.email}</td>
                              </tr>

                              <tr>
                                <th md="1">Số điện thoại:</th>
                                <td md="7">{selectedModerator.phone_number}</td>
                              </tr>
                            </Table>
                          </Col>

                          <Col md="6">
                            <Table responsive>
                              <tr>
                                <th md="1">Ngày sinh:</th>
                                <td md="7">
                                  <Moment format="DD/MM/YYYY">
                                    {dobDateSelected}
                                  </Moment>
                                </td>
                              </tr>

                              <tr>
                                <th md="1">Giới tính:</th>
                                <td md="7">
                                  {gender[selectedModerator.gender]}
                                </td>
                              </tr>

                              <tr>
                                <th md="1">Mô tả:</th>
                                <td md="7">
                                  <Col className="" md="12">
                                    <FormGroup>
                                      <Row className="">
                                        <Input
                                          cols="80"
                                          placeholder="Giới thiệu"
                                          rows="20"
                                          type="textarea"
                                          defaultValue={
                                            selectedModerator.about_me
                                          }
                                          name={"about_me"}
                                        />
                                      </Row>
                                    </FormGroup>
                                  </Col>
                                </td>
                              </tr>
                            </Table>
                          </Col>
                        </Row>

                        <div className="d-flex justify-content-center">
                          <Button
                            className="mr-2"
                            color="primary"
                            onClick={handleUpdateButtonClick}
                          >
                            Cập nhật
                          </Button>

                          <Button
                            className="ml-2"
                            color="danger"
                            onClick={closeDetailScreen}
                          >
                            Đóng
                          </Button>
                        </div>
                      </Form>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>

          <Modal
            isOpen={isOpenEdit}
            size="lg"
            style={{ maxWidth: "700px", width: "100%" }}
          >
            <ModalHeader>Cập nhật thông tin</ModalHeader>
            <ModalBody>
              <Row>
                <Col xs={12} md={12}>
                  <div className="content mt-1 d-flex justify-content-center">
                    <Row>
                      <Col md="12">
                        <Form
                          onSubmit={handleUpdateSubmit}
                          className="form-horizontal"
                          method="get"
                        >
                          <Row>
                            <Label className="font-weight-bold" sm="3">Họ và tên:</Label>
                            <Col sm="9" md="9">
                              <FormGroup className="">
                                <Input
                                  defaultValue={selectedModerator.fullname}
                                  placeholder="fullname"
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
                                {selectedModerator.gender == 0 ? (
                                  <Input
                                    defaultChecked
                                    defaultValue="0"
                                    id="exampleRadios1"
                                    name="exampleRadios"
                                    type="radio"
                                  />
                                ) : (
                                  <Input
                                    defaultValue="0"
                                    id="exampleRadios1"
                                    name="exampleRadios"
                                    type="radio"
                                  />
                                )}
                                <span className="form-check-sign" />
                                Nam
                              </Label>
                            </FormGroup>
                            <FormGroup check className="form-check-radio">
                              <Label check>
                                {selectedModerator.gender == 1 ? (
                                  <Input
                                    defaultChecked
                                    defaultValue="1"
                                    id="exampleRadios2"
                                    name="exampleRadios"
                                    type="radio"
                                  />
                                ) : (
                                  <Input
                                    defaultValue="1"
                                    id="exampleRadios2"
                                    name="exampleRadios"
                                    type="radio"
                                  />
                                )}
                                <span className="form-check-sign" />
                                Nữ
                              </Label>
                            </FormGroup>
                            <FormGroup check className="form-check-radio">
                              <Label check>
                                {selectedModerator.gender == 2 ? (
                                  <Input
                                    defaultChecked
                                    defaultValue="2"
                                    id="exampleRadios2"
                                    name="exampleRadios"
                                    type="radio"
                                  />
                                ) : (
                                  <Input
                                    defaultValue="2"
                                    id="exampleRadios2"
                                    name="exampleRadios"
                                    type="radio"
                                  />
                                )}
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
                                  defaultValue={selectedModerator.email}
                                  placeholder="email"
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
                                  defaultValue={selectedModerator.phone_number}
                                  placeholder="phonenumber"
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
                                  defaultValue={selectedModerator.address}
                                  placeholder="address"
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
                                    placeholder="Giới thiệu"
                                    rows="20"
                                    type="textarea"
                                    defaultValue={selectedModerator.about_me}
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
                                  Cập nhật
                                </Button>
                                <Button
                                  className="ml-2"
                                  onClick={closeEditModal}
                                  color="danger"
                                >
                                  Đóng
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
            </ModalBody>
          </Modal>
        </div>
      )}
    </>
  );
}

export default ListModeratorsScreen;
