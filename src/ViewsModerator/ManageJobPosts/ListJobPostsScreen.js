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
import {
  useTable,
  useFilters,
  useAsyncDebounce,
  useSortBy,
  usePagination,
} from "react-table";
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
import { jobPostState } from "state/jobPostState";
import jobPostApi from "api/jobPostApi";
import {
  JobPostStatusVN,
  jobType,
  JobPostStatusVNCombobox,
  JobPostStatus,
} from "variables/general";

function ListJobPostsScreen() {
  const [listJobPost, setListJobPosts] = useRecoilState(jobPostState);

  useEffect(() => {
    const fetchListJobPost = async () => {
      try {
        const jobPost = await jobPostApi.getAll(filtersParams);
        setListJobPosts(jobPost.data.list_object);

        //Pagination
        let total_page = jobPost.data.paging_metadata.total_pages;
        setPageOptions([...Array(total_page).keys()]);
        setCanNextPage(jobPost.data.paging_metadata.has_next_page);
        setCanPreviousPage(jobPost.data.paging_metadata.has_previous_page);
        setPageIndex(jobPost.data.paging_metadata.page_index);

        console.log("Success to fetch list JobPost. ", jobPost.data);
      } catch (err) {
        console.log("Failed to fetch list JobPost. ", err);
      }
    };
    fetchListJobPost();
  }, []);

  const fetchListJobPost = async (filters) => {
    try {
      const jobPost = await jobPostApi.getAll(filters);
      setListJobPosts(jobPost.data.list_object);

      //Pagination
      let total_page = jobPost.data.paging_metadata.total_pages;
      setPageOptions([...Array(total_page).keys()]);
      setCanNextPage(jobPost.data.paging_metadata.has_next_page);
      setCanPreviousPage(jobPost.data.paging_metadata.has_previous_page);
      setPageIndex(jobPost.data.paging_metadata.page_index);

      console.log("Success to fetch list JobPost. ", jobPost.data.list_object);
    } catch (err) {
      console.log("Failed to fetch list JobPost. ", err);
    }
  };

  const [isOpenDetail, setIsOpentDetail] = useState(false);
  const [isOpenEdit, setIsOpentEdit] = useState(false);
  const [selectedJobPost, setSelectedJobPost] = useState({});
  const [filtersParams, setFiltersParams] = useState({
    page: 1,
    "page-size": 20,
  });

  const [statusFilterSelected, setstatusFilterSelected] = useState({
    value: -1,
    label: "Trạng thái",
  });

  const openEditModal = () => {};

  const closeModal = () => {
    setIsOpentDetail(false);
  };

  const closeEditModal = () => {
    setIsOpentEdit(false);
  };

  const filtersStatus = async (status) => {
    handlePageSelect({
      value: 0,
      label: "Trang 1",
    });

    setstatusFilterSelected({
      value: status.value,
      label: status.label,
    });
    console.log(
      "🚀 ~ file: List JobPost.js ~ line 153 ~ filters ~ value= ",
      status.value
    );
    try {
      let jobPost = [];
      if (status.value !== -1) {
        const filters = { ...filtersParams, status: status.value };
        console.log(
          "🚀 ~ file: List JobPost filtersfiltersfiltersfiltersfilters",
          filters
        );
        jobPost = await jobPostApi.getAll(filters);

        setFiltersParams(filters);
      } else {
        setFiltersParams({
          page: 1,
          "page-size": 20,
        });
        jobPost = await jobPostApi.getAll(filtersParams);
      }

      console.log(
        "🚀 ~ file: List JobPost.js jobPost",
        jobPost.data.list_object
      );

      jobPost.data.list_object
        ? setListJobPosts(jobPost.data.list_object)
        : setListJobPosts([]);
    } catch (err) {
      console.log("Failed to fetch list jobpost. ", err);
    }
  };

  //Handle edit button
  const openDetailScreen = async (jobpost) => {
    try {
      const jobPost = await jobPostApi.get(jobpost.id);
      // setListJobPosts(jobPost.data);
      console.log("Success to fetch JobPost by id. ", jobPost);
    } catch (err) {
      console.log("Failed to fetch list JobPost. ", err);
    }
    setSelectedJobPost(jobpost);
    console.log("EDDDDDDDIIIIIIIT jobpost:", jobpost);
    setIsOpentDetail(true);
  };

  const closeDetailScreen = () => {
    setIsOpentDetail(false);
  };

  const handleVerifyButton = async () => {
    Swal.fire({
      title: "Bạn có muốn duyệt bài đăng này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#4F9E1D",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        verifyJobPost();
      }
    });
  };

  const verifyJobPost = async () => {
    try {
      const response = await jobPostApi.patchApproveJob(selectedJobPost.id);
      console.log(
        "🚀 ~ file: selectedJobPost.js ~ line 165 ~ handleSubmit ~ response",
        response
      );

      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Bài đăng đã được duyệt!",
      });

      try {
        const jobPost = await jobPostApi.getAll(filtersParams);
        setListJobPosts(jobPost.data.list_object);
      } catch (err) {
        console.log("Failed to fetch list jobPost. ", err);
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Bài đăng chưa được duyệt!",
      });
    }

    closeDetailScreen();
  };

  const rejectJobPost = async (reasonReject) => {
    try {
      const response = await jobPostApi.patchRejectJob({
        id: selectedJobPost.id,
        reason_reject: reasonReject,
      });
      console.log(
        "🚀 ~ file: selectedJobPost.js ~ line 165 ~ handleSubmit ~ response",
        response
      );
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Bài đăng đã bị từ chối!",
      });

      try {
        const jobPost = await jobPostApi.getAll(filtersParams);
        setListJobPosts(jobPost.data.list_object);
      } catch (err) {
        console.log("Failed to fetch list jobPost. ", err);
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Bài đăng chưa được duyệt!",
      });
    }
    closeDetailScreen();
  };

  const handleDeleteButton = async (jobpost) => {
    Swal.fire({
      title: "Bạn có muốn ẩn thông tin này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#4F9E1D",
      confirmButtonText: "Ẩn",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteJobpost(jobpost);
      }
    });
  };

  const handleRejectButton = async () => {
    const value = await Swal.fire({
      input: "textarea",
      inputLabel: "Lý do từ chối",
      inputPlaceholder: "Nhập lý do từ chối...",
      inputAttributes: {
        "aria-label": "Nhập lý do từ chối",
      },
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#4F9E1D",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("resultresultresultresultresultresult: ", result);
        rejectJobPost(result.value);
      }
    });
  };

  const deleteJobpost = async () => {
    try {
      // const response = await jobPostApi.patchRejectJob({id: selectedJobPost.id, reason_reject: "Bài đăng không hợp lệ"});
      // console.log(
      //   "🚀 ~ file: selectedJobPost.js ~ line 165 ~ handleSubmit ~ response",
      //   response
      // );
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Bài đăng đã bị ẩn!",
      });

      // try {
      //   const jobPost = await jobPostApi.getAll(filtersParams);
      //   setListJobPosts(jobPost.data.list_object);
      // } catch (err) {
      //   console.log("Failed to fetch list jobPost. ", err);
      // }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Bài đăng chưa được duyệt!",
      });
    }
  };

  const dataState = listJobPost.map((prop, key) => {
    key = prop.id;
    return {
      id: key,
      title: prop.title,
      type:
        prop.type === "PayPerTaskJob"
          ? jobType.PayPerTaskJob
          : jobType.PayPerHourJob,
      created_date: momentjs(prop.created_date).format("HH:mm - DD/MM/YYYY"),
      status: JobPostStatusVN[parseInt(prop.status)],
      publisher: prop.published_name,
      // category_name: prop.category ? prop.category.category_name : 'Category',
      // group_name: prop.group ? prop.group.group_name : 'Group',

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
            onClick={handleDeleteButton.bind(this, prop)}
            className="btn-round"
            color="danger"
            size="sm"
          >
            Ẩn
          </Button>{" "}
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
    fetchListJobPost(filtersParams);
  };

  const nextPage = async () => {
    let page = pageIndex + 1;
    filtersParams.page = page;
    fetchListJobPost(filtersParams);
  };

  const previousPage = async () => {
    let page = pageIndex - 1;
    filtersParams.page = page;
    fetchListJobPost(filtersParams);
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
                      <CardTitle tag="h4">Quản lý bài đăng</CardTitle>
                    </Col>
                    {/* <Col xs={2} md={2}>
                      <Link to="/admin/list-categories-page">
                        <Button color="primary">Duyệt bài đăng</Button>
                      </Link>
                    </Col> */}
                  </Row>
                  <Row>
                    <Col xs={3} md={2}>
                      <FormGroup>
                        <label>Trạng thái:</label>
                        <Select
                          className="react-select primary"
                          classNamePrefix="react-select"
                          placeholder="Chọn trạng thái"
                          name="status"
                          value={statusFilterSelected}
                          onChange={filtersStatus}
                          options={JobPostStatusVNCombobox.map((prop) => {
                            return {
                              value: prop.value,
                              label: prop.label,
                            };
                          })}
                        />
                      </FormGroup>
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
                        Header: "Tiêu đề",
                        accessor: "title",
                      },
                      {
                        Header: "Loại hình công việc",
                        accessor: "type",
                      },
                      {
                        Header: "Ngày tạo",
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
                    <h5 className="title">Bài đăng</h5>
                  </CardHeader>
                  <CardBody>
                    <Row
                      style={{ width: "100%" }}
                      className="d-flex justify-content-center"
                    >
                      <Form style={{ width: "100%", padding: "0 10%" }}>
                        {/* <Row
                          className="d-flex justify-content-center"
                          style={{ width: "100%" }}
                        > */}
                        {selectedJobPost.type == "PayPerHourJob" &&
                        selectedJobPost.pay_per_hour_job ? (
                          // "PayPerHourJob"
                          <div style={{ width: "100%", padding: "0 8%" }}>
                            <Row>
                              <Col md="4">
                                <Table responsive>
                                  <tr>
                                    <th md="1">Tiêu đề:</th>
                                    <td md="10">
                                      {selectedJobPost.title
                                        ? selectedJobPost.title
                                        : ""}
                                    </td>
                                  </tr>

                                  <tr>
                                    <th md="1">Ngày tạo:</th>
                                    <td md="10">
                                      <Moment format="DD/MM/YYYY">
                                        {selectedJobPost.created_date
                                          ? selectedJobPost.created_date
                                          : ""}
                                      </Moment>
                                    </td>
                                  </tr>

                                  <tr>
                                    <th md="1">Chủ đất:</th>
                                    <td md="10">
                                      {selectedJobPost.published_name
                                        ? selectedJobPost.published_name
                                        : ""}
                                    </td>
                                  </tr>

                                  <tr>
                                    <th md="1">Vườn:</th>
                                    <td md="10">
                                      {selectedJobPost.garden_name
                                        ? selectedJobPost.garden_name
                                        : ""}
                                    </td>
                                  </tr>
                                </Table>
                              </Col>

                              <Col md="4">
                                <Table responsive>
                                  <tr>
                                    <th md="1">Loại cây:</th>
                                    <td md="10">
                                      {selectedJobPost.tree_jobs.length > 0
                                        ? selectedJobPost.tree_jobs[
                                            selectedJobPost.tree_jobs.length - 1
                                          ].type
                                        : ""}
                                    </td>
                                  </tr>

                                  <tr>
                                    <th md="1">Loại công việc:</th>
                                    <td md="10">{jobType.PayPerHourJob}</td>
                                  </tr>

                                  <tr>
                                    <th md="1">Giá công:</th>
                                    <td md="7">
                                      {selectedJobPost.pay_per_hour_job.salary
                                        ? selectedJobPost.pay_per_hour_job.salary.toLocaleString(
                                            "it-IT",
                                            {
                                              style: "currency",
                                              currency: "VND",
                                            }
                                          )
                                        : 0}{" "}
                                    </td>
                                  </tr>
                                </Table>
                              </Col>

                              <Col md="4">
                                <Table responsive>
                                  <tr>
                                    <th md="1">Số người ước lượng:</th>
                                    <td md="7">
                                      {selectedJobPost.pay_per_hour_job
                                        .min_farmer
                                        ? selectedJobPost.pay_per_hour_job
                                            .min_farmer
                                        : 0}{" "}
                                      -{" "}
                                      {selectedJobPost.pay_per_hour_job
                                        .max_farmer
                                        ? selectedJobPost.pay_per_hour_job
                                            .max_farmer
                                        : 0}{" "}
                                      người
                                    </td>
                                  </tr>

                                  <tr>
                                    <th md="1">Ngày bắt đầu công việc:</th>
                                    <td md="7">
                                      <Moment format="DD/MM/YYYY">
                                        {selectedJobPost.start_job_date
                                          ? selectedJobPost.start_job_date
                                          : ""}
                                      </Moment>
                                    </td>
                                  </tr>

                                  <tr>
                                    <th md="1">Giờ làm việc:</th>
                                    <td md="7">
                                      {selectedJobPost.pay_per_hour_job
                                        .start_time
                                        ? selectedJobPost.pay_per_hour_job
                                            .start_time
                                        : ""}
                                    </td>
                                  </tr>
                                </Table>
                              </Col>
                            </Row>
                          </div>
                        ) : selectedJobPost.type == "PayPerTaskJob" &&
                          selectedJobPost.pay_per_task_job ? (
                          // "PayPerTaskJob"
                          <div>
                            <Row>
                              <Col md="4">
                                <Table responsive>
                                  <tr>
                                    <th md="1">Tiêu đề:</th>
                                    <td md="7">
                                      {selectedJobPost.title
                                        ? selectedJobPost.title
                                        : ""}
                                    </td>
                                  </tr>

                                  <tr>
                                    <th md="1">Ngày tạo:</th>
                                    <td md="7">
                                      <Moment format="DD/MM/YYYY">
                                        {selectedJobPost.created_date
                                          ? selectedJobPost.created_date
                                          : ""}
                                      </Moment>
                                    </td>
                                  </tr>

                                  <tr>
                                    <th md="1">Chủ đất:</th>
                                    <td md="7">
                                      {selectedJobPost.published_name
                                        ? selectedJobPost.published_name
                                        : ""}
                                    </td>
                                  </tr>

                                  <tr>
                                    <th md="1">Vườn:</th>
                                    <td md="7">
                                      {selectedJobPost.garden_name
                                        ? selectedJobPost.garden_name
                                        : ""}
                                    </td>
                                  </tr>
                                </Table>
                              </Col>

                              <Col md="4">
                                <Table responsive>
                                  <tr>
                                    <th md="1">Loại cây:</th>
                                    <td md="7">
                                      {selectedJobPost.tree_jobs.length > 0
                                        ? selectedJobPost.tree_jobs[
                                            selectedJobPost.tree_jobs.length - 1
                                          ].type
                                        : ""}
                                    </td>
                                  </tr>

                                  <tr>
                                    <th md="1">Loại công việc:</th>
                                    <td md="7">{jobType.PayPerTaskJob}</td>
                                  </tr>

                                  <tr>
                                    <th md="1">Giá:</th>
                                    <td md="7">
                                      {selectedJobPost.pay_per_task_job.salary
                                        ? selectedJobPost.pay_per_task_job.salary.toLocaleString(
                                            "it-IT",
                                            {
                                              style: "currency",
                                              currency: "VND",
                                            }
                                          )
                                        : 0}{" "}
                                    </td>
                                  </tr>
                                </Table>
                              </Col>

                              <Col md="4">
                                <Table responsive>
                                  <tr>
                                    <th md="1">Ngày bắt đầu công việc:</th>
                                    <td md="7">
                                      <Moment format="DD/MM/YYYY">
                                        {selectedJobPost.start_job_date
                                          ? selectedJobPost.start_job_date
                                          : ""}
                                      </Moment>
                                    </td>
                                  </tr>

                                  <tr>
                                    <th md="1">Ngày kết thúc khoán:</th>
                                    <td md="7">
                                      <Moment format="DD/MM/YYYY">
                                        {selectedJobPost.end_job_date
                                          ? selectedJobPost.end_job_date
                                          : ""}
                                      </Moment>
                                    </td>
                                  </tr>

                                  <tr>
                                    <th md="2">Ngày kết thúc công việc:</th>
                                    <td md="7">
                                      <Moment format="DD/MM/YYYY">
                                        {selectedJobPost.end_job_date
                                          ? selectedJobPost.end_job_date
                                          : ""}
                                      </Moment>
                                    </td>
                                  </tr>
                                </Table>
                              </Col>
                            </Row>
                          </div>
                        ) : (
                          <div></div>
                        )}

                        <Row
                          className="d-flex justify-content-center"
                          // style={{ width: "100%" }}
                        >
                          <Col md="8">
                            <Table responsive>
                              <tr>
                                <th md="2">Mô tả công việc:</th>
                                <td md="5">
                                  <Col className="" md="12">
                                    <FormGroup>
                                      <Row className="">
                                        <Input
                                          cols="80"
                                          placeholder="Mô tả"
                                          rows="20"
                                          type="textarea"
                                          defaultValue={
                                            selectedJobPost.description
                                          }
                                          name={"description"}
                                          style={{ fontSize: "14px" }}
                                        />
                                      </Row>
                                    </FormGroup>
                                  </Col>
                                </td>
                              </tr>
                            </Table>
                          </Col>
                        </Row>
                        {/* </Row> */}

                        <div className="d-flex justify-content-center">
                          {selectedJobPost.status == JobPostStatus.pending ? (
                            <div>
                              <Button
                                className="mr-2"
                                color="primary"
                                onClick={handleVerifyButton}
                              >
                                Duyệt
                              </Button>
                              <Button
                                className="mr-2"
                                color="danger"
                                onClick={handleRejectButton}
                              >
                                Từ chối
                              </Button>
                            </div>
                          ) : selectedJobPost.status == JobPostStatus.posted ? (
                            <div></div>
                          ) : (
                            <div></div>
                          )}
                          <Button
                            className="ml-2"
                            color="warning"
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
        </div>
      )}
    </>
  );
}

export default ListJobPostsScreen;
