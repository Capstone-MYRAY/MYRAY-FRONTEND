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
  Container,
} from "reactstrap";
import Select from "react-select";
import Swal from 'sweetalert2';
import { useRecoilState } from "recoil";
import { listPostTypesState } from "state/postTypeState";
import postTypeApi from "api/postTypeApi";

function ListPostTypesScreen() {
  const [postTypeList, setListPostTypes] = useRecoilState(listPostTypesState);
  const [selectedPostType, setSelectedPostType] = useState({});
  const [isCreate, setIsCreate] = useState(true);
  const [postTypeInput, setPostTypeInput] = useState("");
  const [priceInput, setPriceInput] = useState("");
  const [backgroundInput, setBackgroundInput] = useState("");
  const [fontColorInput, setFontColorInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");

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
        //Pagination
      let total_page = response.data.paging_metadata.total_pages;
      setPageOptions([...Array(total_page).keys()]);
      setCanNextPage(response.data.paging_metadata.has_next_page);
      setCanPreviousPage(response.data.paging_metadata.has_previous_page);
      setPageIndex(response.data.paging_metadata.page_index);
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
      //Pagination
      let total_page = response.data.paging_metadata.total_pages;
      setPageOptions([...Array(total_page).keys()]);
      setCanNextPage(response.data.paging_metadata.has_next_page);
      setCanPreviousPage(response.data.paging_metadata.has_previous_page);
      setPageIndex(response.data.paging_metadata.page_index);
    } catch (err) {
      console.log("Failed to fetch list postType. ", err);
    }
  };

  //Press "Them moi loai tin button"
  const clearFormForCreate = () => {
    setSelectedPostType(null);
    setIsCreate(true);
    setPostTypeInput("");
    setPriceInput("");
    setBackgroundInput("");
    setFontColorInput("");
    setDescriptionInput("");
  }

  //Handle edit button
  const editPostType = (postType) => {
    setSelectedPostType(postType);
    setPostTypeInput(postType.name);
    setPriceInput(postType.price);
    setBackgroundInput(postType.background);
    setFontColorInput(postType.color);
    setDescriptionInput(postType.description);
    setIsCreate(false);
    console.log(
      "🚀 ~ file: List PostType.js ~ selectedPostType",
      selectedPostType
    );
  };

  const handleDeleteButton = async (postType) => {
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
        deletePostType(postType);
      }
    })
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
        name: e.target.typeName.value,
        description: e.target.description.value,
        price: e.target.price.value,
        background: e.target.background.value,
        color: e.target.color.value,
      };

      e.target.typeName.value = "";
      e.target.description.value = "";
      e.target.price.value = "";
      e.target.background.value = "";
      e.target.color.value = "";
      
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
        name: e.target.typeName.value,
        description: e.target.description.value,
        price: e.target.price.value,
        background: e.target.background.value,
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
      setIsCreate(true);
      
    }

      try {
        fetchListPostType(filtersParams);
        clearFormForCreate();
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
            className="btn-icon btn-round"
            color="primary"
            size="sm"
          >
            <i className="fa fa-edit" />
          </Button>{" "}
          {/* use this button to remove the data row */}
          <Button
            onClick={handleDeleteButton.bind(this, prop)}
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

  const btnStyle = { width: 'max-content'};

  
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
    fetchListPostType(filtersParams);
  };

  const nextPage = async () => {
    let page = pageIndex + 1;
    filtersParams.page = page;
    fetchListPostType(filtersParams);
  };

  const previousPage = async () => {
    let page = pageIndex - 1;
    filtersParams.page = page;
    fetchListPostType(filtersParams);
  };

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
                        <Col xs={12} md={12}>
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
                                  <Label className="font-weight-bold">Loại tin <code>*</code>:</Label>
                                      <Input
                                        defaultValue={postTypeInput}
                                        placeholder="Nhập tên loại tin"
                                        type="text"
                                        name={"typeName"}
                                      />
                                    </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                <Col md="12">
                                <FormGroup className="">
                                  <Label className="font-weight-bold">Giá cả <code>*</code>:</Label>
                                      <Input
                                        defaultValue={priceInput}
                                        placeholder="Nhập giá"
                                        type="text"
                                        name={"price"}
                                      />
                                    </FormGroup>
                                    </Col>
                                </Row>

                                <Row>
                                <Col md="12">
                                <FormGroup className="">
                                  <Label className="font-weight-bold">Màu nền (hex) <code>*</code>:</Label>
                                      <Input
                                        defaultValue={backgroundInput}
                                        placeholder="Nhập màu sắc hiển thị"
                                        type="text"
                                        name={"background"}
                                      />
                                    </FormGroup>
                                    </Col>
                                </Row>

                                <Row>
                                <Col md="12">
                                <FormGroup className="">
                                  <Label className="font-weight-bold">Màu chữ (hex) <code>*</code>:</Label>
                                      <Input
                                        defaultValue={fontColorInput}
                                        placeholder="Nhập màu sắc hiển thị"
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
                                        placeholder="Nhập mô tả loại tin"
                                        rows="4"
                                        type="textarea"
                                        defaultValue={descriptionInput}
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
