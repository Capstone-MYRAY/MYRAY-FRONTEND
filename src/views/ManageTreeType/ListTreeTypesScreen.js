// core components
import PanelHeader from "components/PanelHeader/PanelHeader.js";
import ReactTable from "components/ReactTable/ReactTable.js";
import "moment-timezone";
import React, { useEffect, useState } from "react";

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
  Row,
  Label,
} from "reactstrap";
import Swal from 'sweetalert2';
import { useRecoilState } from "recoil";
import { listTreeTypesState } from "state/treeTypeState";
import treeTypeApi from "api/treeTypeApi";
import { treeTypeVNStatus } from "variables/general";

function ListTreeTypesScreen() {
  //TreeType state
  const [treeTypeList, setListTreeTypes] = useRecoilState(listTreeTypesState);
  const [selectedTreeType, setSelectedTreeType] = useState({});
  const [isCreate, setIsCreate] = useState(true);

  const [filtersParams, setFiltersParams] = useState({
    page: 1,
    "page-size": 20,
  });

  //TreeTypes state
  //-----------------------------Call API to get list TreeTypes, then set to TreeTypes state
  useEffect(() => {
    const fetchListTreeTypes = async () => {
      try {
        //TreeTypes
        const response = await treeTypeApi.getAll(filtersParams);
        setListTreeTypes(response.data.list_object);
      } catch (err) {
        console.log("Failed to fetch list TreeTypes. ", err);
      }
    };
    fetchListTreeTypes();
  }, []);

  const fetchListTreeType = async (filters) => {
    try {
      //tree type
      const response = await treeTypeApi.getAll(filters);
      response.data
        ? setListTreeTypes(response.data.list_object)
        : setListTreeTypes([]);
    } catch (err) {
      console.log("Failed to fetch list TreeType. ", err);
    }
  };

  //Press "Them moi loai cay" button"
  const clearFormForCreate = (e) => {
    setIsCreate(true);
    e.target.typeName.value = "";
    e.target.description.value = "";
  };

  //Handle edit button
  const editTreeType = (treeType) => {
    setSelectedTreeType(treeType);
    setIsCreate(false);
    console.log(
      "🚀 ~ file: List treeType.js ~ selectedTreeType",
      selectedTreeType
    );
  };

  const handleDeleteButton = async (treeType) => {
    Swal.fire({
      title: 'Bạn có muốn xóa thông tin này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#4F9E1D',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTreeType(treeType);
      }
    })
  };

  //Handle delete button
  const deleteTreeType = async (treeType) => {
    setSelectedTreeType(treeType);
    try {
      const response = await treeTypeApi.delete(treeType.id);
      console.log(
        "🚀 ~ file: List treeType.js ~ line 197 ~ handleSubmit ~ response",
        response
      );
      Swal.fire({  
        icon: 'success',
        title: 'Thành công',  
        text: 'Xóa thành công!',  
      });
      try {
        fetchListTreeType(filtersParams);
      } catch (err) {
        console.log("Failed to fetch list treeType. ", err);
      }
    } catch (err) {
      Swal.fire({  
        icon: 'error',
        title: 'Lỗi',  
        text: 'Xoá không thành công!',  
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let treeTypeObj = {};
      if (isCreate) {
        treeTypeObj = {
          type: e.target.typeName.value,
          description: e.target.description.value,
        };

        const responseCreate = await treeTypeApi.post(treeTypeObj);
        console.log(
          "🚀 ~ file: List treeType.js ~ line 197 ~ handleSubmit ~ responseCreate",
          responseCreate
        );
        Swal.fire({  
          icon: 'success',
          title: 'Thành công',  
          text: 'Tạo mới thành công!',  
        });
      } else {
        treeTypeObj = {
          id: selectedTreeType ? selectedTreeType.id : null,
          type: e.target.typeName.value,
          description: e.target.description.value,
          status: selectedTreeType.status,
        };

        const responseUpdate = await treeTypeApi.put(treeTypeObj);
        console.log(
          "🚀 ~ file: List treeType.js ~ line 197 ~ handleSubmit ~ responseUpdate",
          responseUpdate
        );
        Swal.fire({  
          icon: 'success',
          title: 'Thành công',  
          text: 'Cập nhật thành công!',  
        });
      }

      try {
        fetchListTreeType(filtersParams);
        clearFormForCreate(e);
      } catch (err) {
        console.log("Failed to fetch list TreeType. ", err);
      }
    } catch (err) {
      if (isCreate) {
        console.log(`Failed to create TreeType. ${err}`);
        Swal.fire({  
          icon: 'error',
          title: 'Lỗi',  
          text: 'Tạo mới không thành công!',  
        });
      } else {
        console.log(`Failed to update TreeType ${err}`);
        Swal.fire({  
          icon: 'error',
          title: 'Lỗi',  
          text: 'Cập nhật không thành công!',  
        });
      }
    }
  };

  const dataState = treeTypeList.map((prop, key) => {
    key = prop.id;
    return {
      id: key,
      type: prop.type,
      status: treeTypeVNStatus[prop.status],
      actions: (
        // we've added some custom button actions
        <div className="actions-right">
          {/* use this button to add a edit kind of action */}
          <Button
            onClick={editTreeType.bind(this, prop)}
            className="btn-round"
            color="primary"
            size="sm"
          >
          Chi tiết
          </Button>{" "}
          {/* use this button to remove the data row */}
          {prop.status == 1 ? (
          <Button
            onClick={handleDeleteButton.bind(this, prop)}
            className="btn-round"
            color="danger"
            size="sm"
          >
          Xóa
          </Button>
         )
          : (<div></div>) }
          
        </div>
      ),
    };
  });

  const btnStyle = { width: "max-content" };

  return (
    <>
      <PanelHeader size="sm" />

      <div className="content mt-1">
        <Row>
          <Col xs={7} md={7}>
            <Card>
              <CardHeader>
                <Row>
                  <Col xs={9} md={9}>
                    <CardTitle tag="h4">Quản lý loại cây</CardTitle>
                  </Col>
                  {!isCreate ? (
                    <div>
                      <Col xs={4} md={4}>
                        <Button
                          color="primary"
                          style={btnStyle}
                          onClick={clearFormForCreate}
                        >
                          Thêm mới
                        </Button>
                      </Col>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </Row>
              </CardHeader>
              <CardBody>
                <ReactTable
                  models="treetype"
                  data={dataState}
                  columns={[
                    {
                      Header: "Loại cây",
                      accessor: "type",
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

          <Col xs={5} md={5}>
            {/* DETAILS */}

            <div>
              <Row>
                <Col md="12">
                  <Card>
                    <CardHeader>
                      <Row>
                        <Col xs={6} md={6}>
                          <h5 className="card-title">
                            {isCreate
                              ? "Thêm mới loại cây"
                              : "Chỉnh sửa loại cây"}
                          </h5>
                        </Col>
                      </Row>
                    </CardHeader>

                    <CardBody>
                      <Row>
                        <Col md="12">
                          <Form onSubmit={handleSubmit}>
                            <Row className="d-flex justify-content-center">
                              <Col md="7">
                                <Row>
                                  <Col md="12">
                                    <FormGroup className="">
                                      <Label className="font-weight-bold">
                                        Loại cây
                                      </Label>
                                      <Input
                                        defaultValue={
                                          selectedTreeType
                                            ? selectedTreeType.type
                                            : ""
                                        }
                                        placeholder="Hãy nhập tên loại cây"
                                        type="text"
                                        name={"typeName"}
                                      />
                                    </FormGroup>
                                  </Col>
                                </Row>

                                <Row>
                                  <Col md="12">
                                    <FormGroup>
                                      <Label className="font-weight-bold">
                                        Mô tả
                                      </Label>
                                      <Input
                                        cols="80"
                                        placeholder="Hãy nhập mô tả loại cây"
                                        rows="4"
                                        type="textarea"
                                        defaultValue={
                                          selectedTreeType
                                            ? selectedTreeType.description
                                            : ""
                                        }
                                        name={"description"}
                                      />
                                    </FormGroup>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>

                            <div className="d-flex justify-content-center">
                              <Row>
                                <Col md="12">
                                  <Button
                                    type="submit"
                                    className="mr-2"
                                    color="primary"
                                  >
                                    {isCreate ? "Tạo" : "Cập nhật"}
                                  </Button>
                                </Col>
                              </Row>
                            </div>
                          </Form>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default ListTreeTypesScreen;
