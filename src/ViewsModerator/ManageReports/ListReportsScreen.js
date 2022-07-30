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

import PanelHeader from "components/PanelHeader/PanelHeader.js";
import { useRecoilState } from "recoil";
// import ImageUpload from "components/CustomUpload/ImageUpload";
import { reportState } from "state/reportState";
import reportApi from "api/reportApi";
import accountApi from "api/accountApi";
import jobPostApi from "api/jobPostApi";
import { roleNameVN, gender, reportStatus } from "variables/general";
import Datetime from "react-datetime";
import {
  JobPostStatusVN,
  jobType,
  JobPostStatusVNCombobox,
  JobPostStatus,
} from "variables/general";

function ListReportsScreen() {
  const [listReports, setListReports] = useRecoilState(reportState);
  const [isOpenDetail, setIsOpentDetail] = useState(false);
  const [isOpenEdit, setIsOpentEdit] = useState(false);
  const [selectedReport, setSelectedReport] = useState({});
  const [selectedAccountCreateReport, setSelectedAccountCreateReport] =
    useState({});
  const [selectedAccountReported, setSelectedAccountReported] = useState({});
  const [selectedJobPostReported, setSelectedJobPostReported] = useState({});
  const [filtersParams, setFiltersParams] = useState({
    page: 1,
    "page-size": 20,
  });

  //-----------------------------Call API to get list all Reports, then set to Reports state
  useEffect(() => {
    const fetchListReports = async () => {
      try {
        //Moderators do not manage area
        const response = await reportApi.getAll(filtersParams);
        setListReports(response.data.list_object);
        console.log(
          "Success to fetch list Reports. ",
          response.data.list_object
        );
      } catch (err) {
        console.log("Failed to fetch list Reports. ", err);
      }
    };

    fetchListReports();
  }, []);

  const fetchListModerators = async (filtersParams) => {
    try {
      //Reports
      const response = await reportApi.getAll(filtersParams);
      setListReports(response.data.list_object);
      console.log("Success to fetch list report. ", response.data.list_object);
    } catch (err) {
      console.log("Failed to fetch list report. ", err);
    }
  };

  const createDate = () => {
    const d = new Date();
    return d;
  };

  const [dobDateSelected, setDOBSelected] = React.useState(createDate());

  const handleChangeDOB = (e) => {
    setDOBSelected(e.format("DD--MM-YYYY"));
  };

  const openEditModal = () => {};

  const closeModal = () => {
    setIsOpentDetail(false);
  };

  const closeEditModal = () => {
    setIsOpentEdit(false);
  };

  //Handle edit button
  const openDetailScreen = async (report) => {
    setSelectedReport(report);
    console.log("EDDDDDDDIIIIIIIT report:", report);

    const createdAccount = await accountApi.get(report.created_by);
    console.log(
      "🚀 ~ file: ListReportsScreen ~ created_by ~ response",
      createdAccount.data
    );

    const reportedAccount = await accountApi.get(report.reported_id);
    console.log(
      "🚀 ~ file: ListReportsScreen ~ reported_id ~ response",
      reportedAccount.data
    );

    const jobPost = await jobPostApi.get(report.job_post_id);
    console.log(
      "🚀 ~ file: ListReportsScreen ~ job_post_id ~ response",
      jobPost.data
    );

    setSelectedAccountCreateReport(createdAccount.data);
    setSelectedAccountReported(reportedAccount.data);
    setSelectedJobPostReported(jobPost.data);

    setIsOpentDetail(true);
  };

  const closeDetailScreen = () => {
    setIsOpentDetail(false);
  };

  const handleUpdateButtonClick = async (e) => {
    setIsOpentEdit(true);
    console.log("EDDDDDDDIIIIIIIT report:", selectedReport);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const resolveReport = {
      id: selectedReport.id,
      job_post_id: selectedReport.job_post_id,
      resolve_content: e.target.resolve_content.value,
      resolved_date: momentjs(createDate()).format(
        "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
      ),
    };

    console.log("resolveReport resolveReport:" + resolveReport.resolved_date);

    try {
      const response = await reportApi.resolve(resolveReport);
      console.log(
        "🚀 ~ file: ListReportsScreen ~ handleSubmit ~ response",
        response
      );

      try {
        const response = await reportApi.getAll(filtersParams);
        setListReports(response.data.list_object);
        console.log(
          "Success to fetch list Report. ",
          response.data.list_object
        );
      } catch (err) {
        console.log("Failed to fetch list Report. ", err);
      }

      alert(`Update successfully!`);
    } catch (err) {
      alert(`Failed to update Report ${err}`);
    }

    setIsOpentEdit(false);
  };

  // const deleteReport = async (report) => {
  //   setSelectedReport(report);
  //   try {
  //     const response = await reportApi.delete(parseInt(report.id));
  //     try {
  //       const response = await reportApi.getAll(filtersParams);
  //       setListReports(response.data.list_object);
  //       console.log(
  //         "Success to fetch list report. ",
  //         response.data.list_object
  //       );
  //     } catch (err) {
  //       console.log("Failed to fetch list report. ", err);
  //     }

  //     alert(`Delete successfully!`);
  //   } catch (err) {
  //     alert(`Failed to delete report ${err}`);
  //   }
  // }

  const dataState = listReports.map((prop, key) => {
    key = prop.id;
    return {
      id: key,
      created_by: prop.created_by,
      reported_id: prop.reported_id,
      created_date: momentjs(prop.created_date).format("HH:mm - DD/MM/YYYY"),
      created_name: prop.created_name,
      reported_name: prop.reported_name,
      role_id_created: prop.role_id_created,
      role_id_reported: prop.role_id_reported,
      status: reportStatus[prop.status],

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
            Giải quyết
          </Button>{" "}
          {/* use this button to remove the data row */}
          {/* <Button
              onClick={deleteReport.bind(this, prop)}
            className="btn-icon btn-round"
            color="danger"
            size="sm"
          >
            <i className="fa fa-times" />
          </Button> */}{" "}
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
                      <CardTitle tag="h4">Quản lý báo cáo</CardTitle>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <ReactTable
                    data={dataState}
                    columns={[
                      {
                        Header: "Người báo cáo",
                        accessor: "created_name",
                      },
                      {
                        Header: "Người bị báo cáo",
                        accessor: "reported_name",
                      },
                      {
                        Header: "Ngày báo cáo",
                        accessor: "created_date",
                      },
                      {
                        Header: "Trạng thái",
                        accessor: "status",
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
                    <h5 className="title">Chi tiết báo cáo:</h5>
                  </CardHeader>
                  <CardBody>
                    <Row className="d-flex justify-content-center">
                      <Form>
                        <Row>
                          <Col md="4">
                            <h6 style={{ color: "red" }}>Báo cáo:</h6>
                            <Table responsive>
                              
                              <tr>
                                <th md="1">Loại hình:</th>
                                <td md="7">
                                  {selectedJobPostReported.type ===
                                  "PayPerTaskJob"
                                    ? jobType.PayPerTaskJob
                                    : jobType.PayPerHourJob}
                                </td>
                              </tr>

                              <tr>
                                <th md="1">Trạng thái:</th>
                                <td md="7">
                                  {
                                    JobPostStatusVN[
                                      parseInt(selectedJobPostReported.status)
                                    ]
                                  }
                                </td>
                              </tr>

                              <tr>
                                <th md="1">Nội dung:</th>
                                <td md="7">
                                  {selectedReport.content
                                    ? selectedReport.content
                                    : ""}
                                </td>
                              </tr>
                              
                            </Table>
                          </Col>

                          <Col md="4">
                            <h6 style={{ color: "red" }}>Người bị báo cáo</h6>
                            <Table responsive>
                              <tr>
                                <th md="1">Họ và tên:</th>
                                <td md="7">
                                  {selectedAccountReported.fullname
                                    ? selectedAccountReported.fullname
                                    : ""}
                                </td>
                              </tr>

                              <tr>
                                <th md="1">Số điện thoại:</th>
                                <td md="7">
                                  {selectedAccountReported.phone_number
                                    ? selectedAccountReported.phone_number
                                    : ""}
                                </td>
                              </tr>

                              <tr>
                                <th md="1">Vai trò:</th>
                                <td md="7">
                                  {selectedAccountReported.role_id
                                    ? roleNameVN[
                                        selectedAccountReported.role_id
                                      ]
                                    : ""}
                                </td>
                              </tr>

                              <tr>
                                <th md="1">Điểm đánh giá:</th>
                                <td md="7">
                                  {selectedAccountReported.rating
                                    ? selectedAccountReported.rating + "/5"
                                    : "Chưa có đánh giá"}
                                </td>
                              </tr>
                            </Table>
                          </Col>

                          <Col md="4">
                            <h6 style={{ color: "#4F9E1D" }}>Người báo cáo</h6>
                            <Table responsive>
                              <tr>
                                <th md="1">Họ và tên:</th>
                                <td md="7">
                                  {selectedAccountCreateReport.fullname
                                    ? selectedAccountCreateReport.fullname
                                    : ""}
                                </td>
                              </tr>

                              <tr>
                                <th md="1">Số điện thoại:</th>
                                <td md="7">
                                  {selectedAccountCreateReport.phone_number
                                    ? selectedAccountCreateReport.phone_number
                                    : ""}
                                </td>
                              </tr>

                              <tr>
                                <th md="1">Vai trò:</th>
                                <td md="7">
                                  {selectedAccountCreateReport.role_id
                                    ? roleNameVN[
                                        selectedAccountCreateReport.role_id
                                      ]
                                    : ""}
                                </td>
                              </tr>

                              <tr>
                                <th md="1">Điểm đánh giá:</th>
                                <td md="7">
                                  {selectedAccountCreateReport.rating
                                    ? selectedAccountCreateReport.rating + "/5"
                                    : "Chưa có đánh giá"}
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
            style={{ maxWidth: "850px", width: "100%" }}
          >
            <ModalHeader>Giải quyết báo cáo</ModalHeader>
            <ModalBody>
              <Row>
                <Col xs={12} md={12}>
                  <div className="content mt-1">
                    <Row>
                      <Col md="12">
                        <Form
                          onSubmit={handleUpdateSubmit}
                          className="form-horizontal"
                          method="get"
                        >
                          <Row>
                            <Label sm="3">Cách giải quyết:</Label>
                            <Col sm="9" md="9">
                              <FormGroup>
                                <Row className="">
                                  <Input
                                    cols="80"
                                    placeholder="Cách giải quyết"
                                    rows="20"
                                    type="textarea"
                                    defaultValue={
                                      selectedReport.resolve_content
                                    }
                                    name={"resolve_content"}
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

export default ListReportsScreen;
