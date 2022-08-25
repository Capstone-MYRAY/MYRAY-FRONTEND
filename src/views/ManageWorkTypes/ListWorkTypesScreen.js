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
import { listWorkTypesState } from "state/workTypeState";
import workTypeApi from "api/workTypeApi";
import { typeVNStatus } from "variables/general";

function ListWorkTypesScreen() {
  const [workTypeList, setListWorkTypes] = useRecoilState(listWorkTypesState);
  const [selectedWorkType, setSelectedWorkType] = useState({});
  const [isCreate, setIsCreate] = useState(true);
  const [workTypeInput, setWorkTypeInput] = useState("");

  const [filtersParams, setFiltersParams] = useState({
    page: 1,
    "page-size": 20,
  });

  //WorkTypes state
  //-----------------------------Call API to get list WorkTypes, then set to WorkTypes state
  useEffect(() => {
    const fetchListWorkTypes = async () => {
      try {
        const response = await workTypeApi.getAll(filtersParams);
        setListWorkTypes(response.data.list_object);
         //Pagination
      let total_page = response.data.paging_metadata.total_pages;
      setPageOptions([...Array(total_page).keys()]);
      setCanNextPage(response.data.paging_metadata.has_next_page);
      setCanPreviousPage(response.data.paging_metadata.has_previous_page);
      setPageIndex(response.data.paging_metadata.page_index);
      } catch (err) {
        console.log("Failed to fetch list WorkTypes. ", err);
      }
    };
    fetchListWorkTypes();
  }, []);

  const fetchListWorkType = async (filters) => {
    try {
      const response = await workTypeApi.getAll(filters);
      response.data
        ? setListWorkTypes(response.data.list_object)
        : setListWorkTypes([]);
         //Pagination
      let total_page = response.data.paging_metadata.total_pages;
      setPageOptions([...Array(total_page).keys()]);
      setCanNextPage(response.data.paging_metadata.has_next_page);
      setCanPreviousPage(response.data.paging_metadata.has_previous_page);
      setPageIndex(response.data.paging_metadata.page_index);
    } catch (err) {
      console.log("Failed to fetch list WorkTypes. ", err);
    }
  };

  const clearFormForCreate = () => {
    setIsCreate(true);
    setWorkTypeInput("");
  };

  //Handle edit button
  const editWorkType = (workType) => {
    setSelectedWorkType(workType);
    setWorkTypeInput(workType.name);
    setIsCreate(false);
    console.log(
      "🚀 ~ file: List treeType.js ~ selectedTreeType",
      selectedWorkType
    );
  };

  const handleDeleteButton = async (workType) => {
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
        deleteWorkType(workType);
      }
    })
  };

  //Handle delete button
  const deleteWorkType = async (workType) => {
    setSelectedWorkType(workType);
    try {
      const response = await workTypeApi.delete(workType.id);
      console.log(
        "🚀 ~ file: List workType ~ response",
        response
      );
      Swal.fire({  
        icon: 'success',
        title: 'Thành công',  
        text: 'Xóa thành công!',  
      });
      try {
        fetchListWorkType(filtersParams);
      } catch (err) {
        console.log("Failed to fetch list workType. ", err);
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
    console.log(
            "🚀 ~workTypeInputworkTypeInputworkTypeInputworkTypeInput",
            workTypeInput
          );
    try {
      let workTypeObj = {
        // name: e.target.typeName.value,
        name: workTypeInput,
      };
      clearFormForCreate();

      if (isCreate) {
        const responseCreate = await workTypeApi.post(workTypeObj);
        console.log(
          "🚀 ~ file: List workType ~ handleSubmit ~ responseCreate",
          responseCreate
        );
        Swal.fire({  
          icon: 'success',
          title: 'Thành công',  
          text: 'Tạo mới thành công!',  
        });
      } else {
        workTypeObj = {
            ...workTypeObj,
          id: selectedWorkType ? selectedWorkType.id : null,
        };

        const responseUpdate = await workTypeApi.put(workTypeObj);
        console.log(
          "🚀 ~ file: List workType ~ handleSubmit ~ responseUpdate",
          responseUpdate
        );
        Swal.fire({  
          icon: 'success',
          title: 'Thành công',  
          text: 'Cập nhật thành công!',  
        });
      }

      try {
        fetchListWorkType(filtersParams);
      } catch (err) {
        console.log("Failed to fetch list workType. ", err);
      }
    } catch (err) {
      if (isCreate) {
        console.log(`Failed to create workType. ${err}`);
        Swal.fire({  
          icon: 'error',
          title: 'Lỗi',  
          text: 'Tạo mới không thành công!',  
        });
      } else {
        console.log(`Failed to update workType ${err}`);
        Swal.fire({  
          icon: 'error',
          title: 'Lỗi',  
          text: 'Cập nhật không thành công!',  
        });
      }
    }
  };

  const dataState = workTypeList.map((prop, key) => {
    key = prop.id;
    return {
      id: key,
      name: prop.name,
      status: typeVNStatus[prop.status],
      actions: (
        // we've added some custom button actions
        <div className="actions-right">
          {/* use this button to add a edit kind of action */}
          <Button
            onClick={editWorkType.bind(this, prop)}
            className="btn-icon btn-round"
            color="primary"
            size="sm"
          >
          <i className="fa fa-edit" />
          </Button>{" "}
          {/* use this button to remove the data row */}
          {prop.status == 1 ? (
          <Button
            onClick={handleDeleteButton.bind(this, prop)}
            className="btn-icon btn-round"
            color="danger"
            size="sm"
          >
          <i className="fa fa-times" />
          </Button>
         )
          : (<div></div>) }
          
        </div>
      ),
    };
  });

  const btnStyle = { width: "max-content" };

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
    fetchListWorkType(filtersParams);
  };

  const nextPage = async () => {
    let page = pageIndex + 1;
    filtersParams.page = page;
    fetchListWorkType(filtersParams);
  };

  const previousPage = async () => {
    let page = pageIndex - 1;
    filtersParams.page = page;
    fetchListWorkType(filtersParams);
  };

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
                    <CardTitle tag="h4">Quản lý loại công việc</CardTitle>
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
                  models="worktype"
                  data={dataState}
                  columns={[
                    {
                      Header: "Loại công việc",
                      accessor: "name",
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
                        <Col xs={8} md={8}>
                          <h5 className="card-title">
                            {isCreate
                              ? "Thêm mới loại công việc"
                              : "Chỉnh sửa loại công việc"}
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
                                        Loại công việc <code>*</code>:
                                      </Label>
                                      <Input
                                      onInput=
                                      {e => setWorkTypeInput(e.target.value)}

                                        defaultValue={workTypeInput}
                                        placeholder="Hãy nhập tên loại công việc"
                                        type="text"
                                        name={"typeName"}
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

export default ListWorkTypesScreen;
