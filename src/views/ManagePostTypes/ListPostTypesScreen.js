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
import { listPostTypesState } from "state/postTypeState";
import postTypeApi from "api/postTypeApi";

function ListPostTypesScreen() {
  //TreeType state
  const [postTypeList, setListPostTypes] = useRecoilState(listPostTypesState);
  const [selectedPostType, setSelectedPostType] = useState({});
  const [isCreate, setIsCreate] = useState(true);

  const [filtersParams, setFiltersParams] = useState({
    page: 1,
    "page-size": 20,
  });

  //PostType state
  //-----------------------------Call API to get list PostType, then set to PostType state
  useEffect(() => {
    const fetchListPostTypes = async () => {
      try {
        //TreeTypes
        const response = await postTypeApi.getAll(filtersParams);
        setListPostTypes(response.data.list_object);
      } catch (err) {
        console.log("Failed to fetch list postType. ", err);
      }
    };
    fetchListPostTypes();
  }, []);

  const fetchListPostType = async (filters) => {
    try {
      //Post Type
      const response = await postTypeApi.getAll(filters);
      response.data ? setListPostTypes(response.data.list_object) : setListPostTypes([]);
    } catch (err) {
      console.log("Failed to fetch list postType. ", err);
    }
  };

  //Press "Them moi loai tin button"
  const clearFormForCreate = (e) => {
    setSelectedPostType(null);
    setIsCreate(true);
      e.target.name.value = "";
      e.target.description.value = "";
      e.target.price.value = "";
      e.target.color.value = "";
  }

  //Handle edit button
  const editPostType = (postType) => {
    setSelectedPostType(postType);
    setIsCreate(false);
    console.log(
      "🚀 ~ file: List PostType.js ~ selectedPostType",
      selectedPostType
    );
  };

  //Handle delete button
  const deletePostType = async (postType) => {
    setSelectedPostType(postType);
    try {
      const response = await postTypeApi.delete(postType.id);
      console.log(
        "🚀 ~ file: List PostType.js ~ line 197 ~ handleSubmit ~ response",
        response
      );

      try {
        fetchListPostType(filtersParams);
      } catch (err) {
        console.log("Failed to fetch list postType. ", err);
      }

      Swal.fire({  
        icon: 'success',
        title: 'Thành công',  
        text: 'Xóa thành công!',  
      });
    } catch (err) {
      console.log(`Failed to delete postType ${err}`);
      Swal.fire({  
        icon: 'error',
        title: 'Lỗi',  
        text: 'Xóa không thành công!',  
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  try {
    let postTypeObj = {};
    if (isCreate) {
      postTypeObj = {
        name: e.target.name.value,
        description: e.target.description.value,
        price: e.target.price.value,
        color: e.target.color.value,
      };

      const responseCreate = await postTypeApi.post(postTypeObj);
      console.log(
        "🚀 ~ file: List postType.js ~ line 197 ~ handleSubmit ~ responseCreate",
        responseCreate
      );
      Swal.fire({  
        icon: 'success',
        title: 'Thành công',  
        text: 'Tạo mới thành công!',  
      });

    } else {
      postTypeObj = {
        id: selectedPostType ? selectedPostType.id : null,
        name: e.target.name.value,
        description: e.target.description.value,
        price: e.target.price.value,
        color: e.target.color.value,
      };

      const responseUpdate = await postTypeApi.put(postTypeObj);
      console.log(
        "🚀 ~ file: List postType.js ~ line 197 ~ handleSubmit ~ responseUpdate",
        responseUpdate
      );
      Swal.fire({  
        icon: 'success',
        title: 'Thành công',  
        text: 'Cập nhật thành công!',  
      });
    }

      try {
        fetchListPostType(filtersParams);
        clearFormForCreate(e);
      } catch (err) {
        console.log("Failed to fetch list postType. ", err);
      }
      
    } catch (err) {
      if (isCreate) {
        console.log(`Failed to create postType ${err}`);
        Swal.fire({  
          icon: 'error',
          title: 'Lỗi',  
          text: 'Tạo mới không thành công!',  
        });
      } else {
        console.log(`Failed to update postType ${err}`);
        Swal.fire({  
          icon: 'error',
          title: 'Lỗi',  
          text: 'Cập nhật không thành công!',  
        });
      }
    }
  };

  const dataState = postTypeList.map((prop, key) => {
    key = prop.id;
    return {
      id: key,
      name: prop.name,
      description: prop.description,
      price: prop.price,
      color: prop.color,
      background: prop.background,
      actions: (
        // we've added some custom button actions
        <div className="actions-right">
          {/* use this button to add a edit kind of action */}
          <Button
            onClick={editPostType.bind(this, prop)}
            className="btn-round"
            color="primary"
            size="sm"
          >
            Chi tiết
          </Button>{" "}
          {/* use this button to remove the data row */}
          <Button
            onClick={deletePostType.bind(this, prop)}
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

  const btnStyle = { width: 'max-content'};

  return (
    <>
      <PanelHeader size="sm" />

      <div className="content mt-1">
        <Row>
          <Col xs={8} md={8}>
            <Card>
              <CardHeader>

                <Row>
                    <Col xs={9} md={9}>
                    <CardTitle tag="h4">Quản lý loại tin</CardTitle>
                  </Col>
                  {!isCreate ? (
                    <div>
                    <Col xs={4} md={4}>
                        <Button 
                        color="primary" 
                        style={btnStyle}
                        onClick={clearFormForCreate}>
                          Thêm mới
                          </Button>
                    </Col>
                    </div> )
                    : <div></div>
                    }
                  </Row>


              </CardHeader>
              <CardBody>
                <ReactTable
                  models="treetype"
                  data={dataState}
                  columns={[
                    {
                      Header: "Loại tin",
                      accessor: "name",
                    },
                    {
                      Header: "Giá tiền",
                      accessor: "price",
                    },
                    {
                      Header: "Màu nền",
                      accessor: "background",
                    },
                    {
                      Header: "Màu chữ",
                      accessor: "color",
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

          <Col xs={4} md={4}>
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
                          ? "Thêm mới loại tin" 
                          : "Chỉnh sửa loại tin"}
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
                                  <Label className="font-weight-bold">Loại tin</Label>
                                      <Input
                                        defaultValue={selectedPostType? selectedPostType.name : ""}
                                        placeholder="Hãy nhập tên loại tin"
                                        type="text"
                                        name={"name"}
                                      />
                                    </FormGroup>
                                    </Col>
                                </Row>

                                <Row>
                                <Col md="12">
                                <FormGroup className="">
                                  <Label className="font-weight-bold">Giá cả</Label>
                                      <Input
                                        defaultValue={selectedPostType? selectedPostType.price : ""}
                                        placeholder="Hãy nhập giá"
                                        type="text"
                                        name={"price"}
                                      />
                                    </FormGroup>
                                    </Col>
                                </Row>

                                <Row>
                                <Col md="12">
                                <FormGroup className="">
                                  <Label className="font-weight-bold">Màu nền</Label>
                                      <Input
                                        defaultValue={selectedPostType ? (selectedPostType.background ?  '#' + selectedPostType.background : "") : ""}
                                        placeholder="Hãy nhập màu sắc hiển thị"
                                        type="text"
                                        name={"background"}
                                      />
                                    </FormGroup>
                                    </Col>
                                </Row>

                                <Row>
                                <Col md="12">
                                <FormGroup className="">
                                  <Label className="font-weight-bold">Màu chữ</Label>
                                      <Input
                                        defaultValue={selectedPostType ? (selectedPostType.color ?  '#' + selectedPostType.color : "") : ""}
                                        placeholder="Hãy nhập màu sắc hiển thị"
                                        type="text"
                                        name={"color"}
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
                                        placeholder="Hãy nhập mô tả loại tin"
                                        rows="4"
                                        type="textarea"
                                        defaultValue={selectedPostType ? selectedPostType.description : ""}
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

export default ListPostTypesScreen;
