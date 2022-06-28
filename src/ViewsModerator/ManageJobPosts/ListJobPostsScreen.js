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
import { jobPostState } from "state/jobPostState";
import jobPostApi from "api/jobPostApi";
import {JobPostStatusVN, jobType} from "variables/general";

function ListJobPostsScreen() {
  const [listJobPost, setListJobPosts] = useRecoilState(jobPostState);
  useEffect(() => {
    const fetchListJobPost = async () => {
      try {
        const jobPost = await jobPostApi.getAll(filtersParams);
        setListJobPosts(jobPost.data.list_object);
        console.log("Success to fetch list JobPost. ", jobPost.data.list_object);
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

  const openEditModal = () => {};

  const closeModal = () => {
    setIsOpentDetail(false);
  };

  const closeEditModal = () => {
    setIsOpentEdit(false);
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
            console.log("🚀 ~ file: selectedJobPost.js ~ line 165 ~ handleSubmit ~ response", response)
      
            try {
                const jobPost = await jobPostApi.getAll(filtersParams);
                setListJobPosts(jobPost.data.list_object);
            } catch (err) {
              console.log("Failed to fetch list jobPost. ", err);
            }
      
            alert(`Verified Job Post successfully!`);
          } catch (err) {
            alert(`Failed to verify Job Post ${err}`);
          }

          closeDetailScreen();
      };

      const rejectJobPost = async () => {
        try {
            const response = await jobPostApi.patchRejectJob(selectedJobPost.id);
            console.log("🚀 ~ file: selectedJobPost.js ~ line 165 ~ handleSubmit ~ response", response)
      
            try {
                const jobPost = await jobPostApi.getAll(filtersParams);
                setListJobPosts(jobPost.data.list_object);
            } catch (err) {
              console.log("Failed to fetch list jobPost. ", err);
            }
      
            alert(`Verified Job Post successfully!`);
          } catch (err) {
            alert(`Failed to verify Job Post ${err}`);
          }
          closeDetailScreen();
    };

  const dataState = listJobPost.map((prop, key) => {
    key = prop.id;
    return {
      id: key,
      title: prop.title,
      type: prop.type === 'PayPerTaskJob' ? jobType.PayPerTaskJob : jobType.PayPerHourJob,
      created_date: momentjs(prop.created_date).format("DD-MM-YYYY HH:mm A"),
      status: JobPostStatusVN[parseInt(prop.status)],
      // category_name: prop.category ? prop.category.category_name : 'Category',
      // group_name: prop.group ? prop.group.group_name : 'Group',

      actions: (
        // we've added some custom button actions
        <div className="actions-right">
          {/* use this button to add a edit kind of action */}
          <Button
              onClick={openDetailScreen.bind(this, prop)}
            className="btn-icon btn-round"
            color="success"
            size="sm"
          >
            <i className="fa fa-edit" />
          </Button>{" "}
          {/* use this button to remove the data row */}
          <Button
            //   onClick={deleteNews.bind(this, prop)}
            className="btn-icon btn-round"
            color="danger"
            size="sm"
          >
            <i className="fa fa-times" />
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
                        //   value={universityFilterSelected}
                        //   onChange={filtersUni}
                        //   options={universityFilterSelectData.map((prop) => {
                        //     return {
                        //       value: prop.value,
                        //       label: prop.label,
                        //     };
                        //   })}
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
                        Header: "Actions",
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
          <div className="content mt-1"  style={{maxWidth: "1500px", width: "100%" }}>
            <Row>
              <Col md="12">
                <Card>
                  <CardHeader>
                    <h5 className="title">Bài đăng</h5>
                  </CardHeader>
                  <CardBody>
                    <Row 
                    className="d-flex justify-content-center"
                    >
                      <Form>
                        <Row>
                          <Col md="6">
                            <Table responsive>
                              <tr>
                                <th md="1">Tiêu đề:</th>
                                <td md="7">{selectedJobPost.title}</td>
                              </tr>

                              <tr>
                                <th md="1">Ngày tạo:</th>
                                <td md="7">
                                  <Moment format="HH:mm A  DD-MM-YYYY">{selectedJobPost.created_date}</Moment>
                                </td>
                              </tr>

                              <tr>
                                <th md="1">Chủ đất:</th>
                                <td md="7">{selectedJobPost.published_name}</td>
                              </tr>

                              <tr>
                                <th md="1">Vườn:</th>
                                <td md="7">{selectedJobPost.garden_name}</td>
                              </tr>

                              <tr>
                                <th md="1">Loại cây:</th>
                                <td md="7">Chờ BE</td>
                              </tr>

                              <tr>
                                <th md="1">Loại hình công việc:</th>
                                <td md="7">{selectedJobPost.type === 'PayPerTaskJob' ? jobType.PayPerTaskJob : jobType.PayPerHourJob}</td>
                              </tr>
            
                              <tr>
                                <th md="1">Mô tả công việc:</th>
                                
                              </tr>
                            </Table>
                          </Col>

                          <Col md="6">
                            <Table responsive>
                            {selectedJobPost.pay_per_hour_job? 
                            <tr>
                                <th md="1">Số người ước lượng:</th>
                                <td md="7">{selectedJobPost.pay_per_hour_job.min_farmer} - {selectedJobPost.pay_per_hour_job.max_farmer} người</td>
                              </tr> 
                              : <div></div>}
                              

                              <tr>
                                <th md="1">Ngày bắt đầu công việc:</th>
                                <td md="7">
                                  <Moment format="HH:mm A  DD-MM-YYYY">{selectedJobPost.start_job_date}</Moment>
                                </td>
                              </tr>

                              

                              {selectedJobPost.pay_per_hour_job? 
                            <tr>
                            <th md="1">Giờ làm việc:</th>
                            <td md="7">{selectedJobPost.pay_per_hour_job.start_time}</td>
                          </tr>
                              : <tr>
                              <th md="1">Ngày kết thúc khoán:</th>
                              <td md="7">{selectedJobPost.pay_per_task_job.finish_time}</td>
                            </tr>}

                              <tr>
                                <th md="1">Ngày kết thúc công việc:</th>
                                <td md="7">
                                <Moment format="DD-MM-YYYY">{selectedJobPost.end_job_date}</Moment>
                                </td>
                              </tr>

                              {selectedJobPost.pay_per_hour_job? 
                            <tr>
                            <th md="1">Giá công:</th>
                            <td md="7">{selectedJobPost.pay_per_hour_job.salary} VND</td>
                          </tr>
                              : <tr>
                              <th md="1">Giá:</th>
                              <td md="7">{selectedJobPost.pay_per_task_job.salary} VND</td>
                            </tr>}
                              

                            </Table>
                          </Col>
                        </Row>

                        <Row className="pl-3">
                          <Col className="pl-3" md="12">
                            <FormGroup>
                              <Col className="" md="12">
                                <FormGroup>
                                  <Row className="">
                                    <Input
                                      cols="80"
                                      placeholder="Here can be your content"
                                      rows="20"
                                      type="textarea"
                                      // defaultValue={selectedNews.content}
                                      name={"event_content"}
                                    />
                                  </Row>
                                </FormGroup>
                              </Col>
                            </FormGroup>
                          </Col>
                        </Row>
                        <div className="d-flex justify-content-center">
                          {/* {selectedReferral.string_status === referralStatus.pending ? */}
                            
                              <div>
                                <Button className="mr-2" color="primary" onClick={verifyJobPost}>Verify</Button>
                                <Button className="mr-2" color="danger" onClick={rejectJobPost}>Reject</Button>
                              </div>
                            
                            {/* : selectedReferral.string_status === referralStatus.verified ? */}
                              
                              {/* : (<div></div>) */}
                          {/* } */}
                          <Button className="ml-2" color="warning" onClick={closeDetailScreen}>Cancel</Button>
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
            style={{ maxWidth: "800px", width: "100%" }}
          >
            <ModalHeader>News Information</ModalHeader>
            <ModalBody>
              <Row>
                <Col xs={12} md={12}>
                  <Card>
                    <CardBody>
                      <div className="content mt-1">
                        <Row>
                          <Col md="12">
                            <Card>
                              <CardHeader>
                                <h5 className="title">Edit News</h5>
                              </CardHeader>
                              <CardBody>
                                <Form
                                  //   onSubmit={handleSubmit}
                                  className="form-horizontal"
                                  method="get"
                                >
                                  <Row>
                                    <Label sm="2">Title</Label>
                                    <Col sm="7" md="7">
                                      <FormGroup className="">
                                        <Input
                                          //   defaultValue={selectedNews.title}
                                          placeholder="Title"
                                          type="text"
                                          name={"title"}
                                        />
                                      </FormGroup>
                                    </Col>
                                  </Row>
                                  <Row></Row>
                                  <Row>
                                    <Col sm="12">
                                      <Row>
                                        <Label sm="2">Group</Label>
                                        <Col md="4">
                                          <FormGroup>
                                            <Select
                                              className="react-select primary"
                                              classNamePrefix="react-select"
                                              placeholder="Choose Group"
                                              name="singleSelect"
                                              // value={groupSelect}
                                              // onChange={(value) => setGroupSelect(value)}
                                              // options={groupSelectData.map((prop) => {
                                              //   return {
                                              //     value: prop.value,
                                              //     label: prop.label,
                                              //   };
                                              // })}
                                            />
                                          </FormGroup>
                                        </Col>
                                      </Row>
                                      <Row>
                                        <Label sm="2">Category</Label>
                                        <Col md="4">
                                          <FormGroup>
                                            <Select
                                              className="react-select primary"
                                              classNamePrefix="react-select"
                                              placeholder="Choose Group"
                                              name="singleSelect"
                                              // value={categorySelect}
                                              // // options={selectOptions}
                                              // onChange={(value) => setCategorySelect(value)}
                                              // options={categorySelectData.map((prop) => {
                                              //   return {
                                              //     value: prop.value,
                                              //     label: prop.label,
                                              //   };
                                              // })}
                                            />
                                          </FormGroup>
                                        </Col>
                                      </Row>

                                      <Row>
                                        <Label sm="2">Pick banner</Label>
                                        <Col sm="4" md="4">
                                          {/* <ImageUpload /> */}
                                        </Col>
                                      </Row>

                                      <Row>
                                        <Label sm="2">Content: </Label>
                                        <Col sm="7" md="7">
                                          <FormGroup>
                                            <Row>
                                              <Input
                                                cols="80"
                                                placeholder="Here can be your content"
                                                rows="20"
                                                type="textarea"
                                                //   defaultValue={selectedNews.content}
                                                name={"content"}
                                              />
                                            </Row>
                                          </FormGroup>
                                        </Col>
                                      </Row>
                                      <div className="d-flex justify-content-center">
                                        <Button
                                          type="submit"
                                          className="mr-2"
                                          color="success"
                                        >
                                          Update
                                        </Button>
                                        <Button
                                          className="ml-2"
                                          onClick={closeEditModal}
                                          color="primary"
                                        >
                                          Cancel
                                        </Button>
                                      </div>
                                    </Col>
                                  </Row>
                                </Form>
                              </CardBody>
                            </Card>
                          </Col>
                        </Row>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </ModalBody>
          </Modal>
        </div>
      )}
    </>
  );
}

export default ListJobPostsScreen;
