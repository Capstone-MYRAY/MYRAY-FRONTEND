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
  Container,
} from "reactstrap";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import Select from "react-select";
import React, { useEffect, useState } from "react";
import momentjs from "moment";
import "moment-timezone";
import Swal from 'sweetalert2';
import PanelHeader from "components/PanelHeader/PanelHeader.js";
import { useRecoilState } from "recoil";
// import ImageUpload from "components/CustomUpload/ImageUpload";
import { reportState, accountReportedState } from "state/reportState";
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
  const [accReportedState, setAccountReportedState] = useRecoilState(accountReportedState);
  const [isOpenDetail, setIsOpentDetail] = useState(false);
  const [isOpenEdit, setIsOpentEdit] = useState(false);
  const [selectedReport, setSelectedReport] = useState({});
  const [selectedAccountCreateReport, setSelectedAccountCreateReport] =
    useState({});
  const [selectedAccountReported, setSelectedAccountReported] = useState({});
  const [selectedAccountReportedHistory, setSelectedAccountReportedHistory] = useState({});
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

        //Pagination
      let total_page = response.data.paging_metadata.total_pages;
      setPageOptions([...Array(total_page).keys()]);
      setCanNextPage(response.data.paging_metadata.has_next_page);
      setCanPreviousPage(response.data.paging_metadata.has_previous_page);
      setPageIndex(response.data.paging_metadata.page_index);
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

  const fetchListReports = async (filtersParams) => {
    try {
      //Reports
      const response = await reportApi.getAll(filtersParams);
      setListReports(response.data.list_object);

      //Pagination
      let total_page = response.data.paging_metadata.total_pages;
      setPageOptions([...Array(total_page).keys()]);
      setCanNextPage(response.data.paging_metadata.has_next_page);
      setCanPreviousPage(response.data.paging_metadata.has_previous_page);
      setPageIndex(response.data.paging_metadata.page_index);
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

    const reportedAccountHistory = await reportApi.getAll({...filtersParams, reportedId: report.reported_id});
    console.log(
      "🚀 ~ file: ListReportsScreen ~ reportedAccountHistory ~ response",
      reportedAccountHistory.data
    );

    const jobPost = await jobPostApi.get(report.job_post_id);
    console.log(
      "🚀 ~ file: ListReportsScreen ~ job_post_id ~ response",
      jobPost.data
    );

    setSelectedAccountCreateReport(createdAccount.data);
    setSelectedAccountReported(reportedAccount.data);
    setSelectedAccountReportedHistory(reportedAccountHistory.data);
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

      Swal.fire({  
        icon: 'success',
        title: 'Thành công',  
        text: 'Cập nhật thành công!',  
      });

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
    } catch (err) {
      console.log(`Failed to update Report ${err}`);
      Swal.fire({  
        icon: 'error',
        title: 'Lỗi',  
        text: 'Cập nhật không thành công!',  
      });
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

  
  const [numberOfRows, setNumberOfRows] = React.useState({
    value: 20,
    label: "20 kết quả",
  });
  const [pageSelect, handlePageSelect] = useState({
    value: 0,
    label: "Trang 1",
  });
  const [canPreviousPage, setCanPreviousPage] = useState(false);
  const [canNextPage, setCanNextPage] = useState(false);
  const [pageOptions, setPageOptions] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);

  let pageSelectData = Array.apply(null, Array(pageOptions.length)).map(
    function () {}
  );

  let numberOfRowsData = [10, 20, 50, 100];

  const gotoPage = async (value) => {
    let page = value + 1;
    filtersParams.page = page;
    fetchListReports(filtersParams);
  };

  const nextPage = async () => {
    let page = pageIndex + 1;
    filtersParams.page = page;
    fetchListReports(filtersParams);
  };

  const previousPage = async () => {
    let page = pageIndex - 1;
    filtersParams.page = page;
    fetchListReports(filtersParams);
  };

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

                <div className="ReactTable -striped -highlight primary-pagination">
                    <div className="pagination-top">
                      <div className="-pagination">
                        <div className="-previous">
                          <button
                            type="button"
                            onClick={() => previousPage()}
                            disabled={!canPreviousPage}
                            className="-btn"
                          >
                            Trước
                          </button>
                        </div>
                        <div className="-center">
                          <Container>
                            <Row className="justify-content-center">
                              <Col md="6" sm="6" xs="12">
                                <Select
                                  className="react-select primary"
                                  classNamePrefix="react-select"
                                  name="pageSelect"
                                  value={pageSelect}
                                  onChange={(value) => {
                                    gotoPage(value.value);
                                    handlePageSelect(value);
                                  }}
                                  options={pageSelectData.map((prop, key) => {
                                    return {
                                      value: key,
                                      label: "Trang " + (key + 1),
                                    };
                                  })}
                                  placeholder="Chọn trang"
                                />
                              </Col>
                              {/* <Col md="6" sm="6" xs="12">
                    <Select
                      className="react-select primary"
                      classNamePrefix="react-select"
                      name="numberOfRows"
                      value={numberOfRows}
                      onChange={(value) => {
                        // setPageSize(value.value);
                        setNumberOfRows(value);
                      }}
                      options={numberOfRowsData.map((prop) => {
                        return {
                          value: prop,
                          label: prop + " kết quả",
                        };
                      })}
                      placeholder="Chọn số dòng hiển thị"
                    />
                  </Col> */}
                            </Row>
                          </Container>
                        </div>
                        <div className="-next">
                          <button
                            type="button"
                            onClick={() => nextPage()}
                            disabled={!canNextPage}
                            className="-btn"
                          >
                            Tiếp
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

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
                      <Form style={{ width: "100%" }}>
                        <Row style={{ width: "100%" , padding: "0 8%" }}>
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
                                    reportStatus[
                                      parseInt(selectedReport.status)
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
{/* 
                                    <a href="/moderator/quan-ly-tai-khoan" onClick={() => setAccountReportedState(selectedAccountReported)}> 
                                    {selectedAccountReported.fullname
                                    ? selectedAccountReported.fullname
                                    : ""}
                                    </a> */}
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
                                    ? selectedAccountReported.rating.toFixed(2) + "/5"
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
                                    ? selectedAccountCreateReport.rating.toFixed(2) + "/5"
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
            className="modal-dialog modal-dialog-centered"
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
                            <Label className="font-weight-bold mt-2" sm="3">Cách giải quyết <code>*</code>:</Label>
                            <Col sm="9" md="9">
                              <FormGroup>
                                <Row className="">
                                  <Input
                                    cols="80"
                                    placeholder="Cách giải quyết"
                                    rows="20"
                                    type="textarea"
                                    defaultValue={
                                      selectedReport.resolve_content ? selectedReport.resolve_content : ""
                                    }
                                    name={"resolve_content"}
                                    style={{fontSize:"20px"}}
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
