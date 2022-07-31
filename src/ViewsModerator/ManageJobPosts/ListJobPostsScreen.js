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
import Swal from 'sweetalert2';
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
        console.log(
          "Success to fetch list JobPost. ",
          jobPost.data.list_object
        );
      } catch (err) {
        console.log("Failed to fetch list JobPost. ", err);
      }
    };
    fetchListJobPost();
  }, []);

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
    setstatusFilterSelected(status);
    console.log(
      "🚀 ~ file: List JobPost.js ~ line 153 ~ filters ~ value",
      status
    );
    try {
      let jobPost = [];
      if (status.value !== -1) {
        const filters = { status: status.value, ...filtersParams };

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

  const verifyJobPost = async () => {
    try {
      const response = await jobPostApi.patchApproveJob(selectedJobPost.id);
      console.log(
        "🚀 ~ file: selectedJobPost.js ~ line 165 ~ handleSubmit ~ response",
        response
      );

      try {
        const jobPost = await jobPostApi.getAll(filtersParams);
        setListJobPosts(jobPost.data.list_object);
      } catch (err) {
        console.log("Failed to fetch list jobPost. ", err);
      }

      Swal.fire({  
        icon: 'success',
        title: 'Thành công',  
        text: 'Bài đăng đã được duyệt!',  
      });

    } catch (err) {
      Swal.fire({  
        icon: 'error',
        title: 'Lỗi',  
        text: 'Bài đăng chưa được duyệt!',  
      });

    }

    closeDetailScreen();
  };

  const rejectJobPost = async () => {
    try {
      const response = await jobPostApi.patchRejectJob(selectedJobPost.id);
      console.log(
        "🚀 ~ file: selectedJobPost.js ~ line 165 ~ handleSubmit ~ response",
        response
      );

      try {
        const jobPost = await jobPostApi.getAll(filtersParams);
        setListJobPosts(jobPost.data.list_object);
      } catch (err) {
        console.log("Failed to fetch list jobPost. ", err);
      }

      Swal.fire({  
        icon: 'success',
        title: 'Thành công',  
        text: 'Bài đăng đã bị từ chối!',  
      });
    } catch (err) {
      Swal.fire({  
        icon: 'error',
        title: 'Lỗi',  
        text: 'Bài đăng chưa được duyệt!',  
      });
    }
    closeDetailScreen();
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
            //   onClick={deleteNews.bind(this, prop)}
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
                  <ReactTable
                    data={dataState}
                    columns={[
                      {
                        Header: "Người đăng",
                        accessor: "publisher",
                      },
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
                  <CardBody className="d-flex justify-content-center">
                    <Row>
                      <Form style={{ maxWidth: "1000px", width: "100%" }}>
                        <Row>
                          {selectedJobPost.type == "PayPerHourJob" &&
                          selectedJobPost.pay_per_hour_job ? (
                            // "PayPerHourJob"
                            <div>
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

                                    <tr>
                                      <th md="1">Mô tả công việc:</th>
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
                                              selectedJobPost.tree_jobs.length -
                                                1
                                            ].type
                                          : ""}
                                      </td>
                                    </tr>

                                    <tr>
                                      <th md="1">Loại hình công việc:</th>
                                      <td md="10">{jobType.PayPerHourJob}</td>
                                    </tr>

                                    <tr>
                                      <th md="1">Giá công:</th>
                                      <td md="7">
                                        {selectedJobPost.pay_per_hour_job.salary
                                          ? selectedJobPost.pay_per_hour_job
                                              .salary
                                          : 0}{" "}
                                        VND
                                      </td>
                                    </tr>

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
                                      <th md="1">Giờ làm việc:</th>
                                      <td md="7">
                                        {selectedJobPost.pay_per_hour_job
                                          .start_time
                                          ? selectedJobPost.pay_per_hour_job
                                              .start_time
                                          : ""}
                                      </td>
                                    </tr>

                                    <tr>
                                      <th md="1">Ngày kết thúc công việc:</th>
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

                                    <tr>
                                      <th md="1">Mô tả công việc:</th>
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
                                              selectedJobPost.tree_jobs.length -
                                                1
                                            ].type
                                          : ""}
                                      </td>
                                    </tr>

                                    <tr>
                                      <th md="1">Loại hình công việc:</th>
                                      <td md="7">{jobType.PayPerTaskJob}</td>
                                    </tr>

                                    <tr>
                                      <th md="1">Giá:</th>
                                      <td md="7">
                                        {selectedJobPost.pay_per_task_job.salary
                                          ? selectedJobPost.pay_per_task_job
                                              .salary
                                          : 0}{" "}
                                        VND
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
                                          {selectedJobPost.pay_per_task_job
                                            .finish_time
                                            ? selectedJobPost.pay_per_task_job
                                                .finish_time
                                            : ""}
                                        </Moment>
                                      </td>
                                    </tr>

                                    <tr>
                                      <th md="1">Ngày kết thúc công việc:</th>
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
                        </Row>

                        <Row className="pl-3">
                          <Col className="pl-3" md="12">
                            <FormGroup>
                              <Col className="" md="12">
                                <FormGroup>
                                  <Row className="">
                                    <Input
                                      cols="80"
                                      placeholder="Mô tả"
                                      rows="20"
                                      type="textarea"
                                      defaultValue={selectedJobPost.description}
                                      name={"description"}
                                    />
                                  </Row>
                                </FormGroup>
                              </Col>
                            </FormGroup>
                          </Col>
                        </Row>
                        <div className="d-flex justify-content-center">
                          {selectedJobPost.status == JobPostStatus.pending ? (
                            <div>
                              <Button
                                className="mr-2"
                                color="primary"
                                onClick={verifyJobPost}
                              >
                                Duyệt
                              </Button>
                              <Button
                                className="mr-2"
                                color="danger"
                                onClick={rejectJobPost}
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
