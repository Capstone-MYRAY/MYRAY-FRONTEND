// core components
import areaApi from "api/areaApi";
import PanelHeader from "components/PanelHeader/PanelHeader.js";
import ReactTable from "components/ReactTable/ReactTable.js";
import "moment-timezone";
import React, { useEffect, useState } from "react";
import Select from "react-select";
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
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Label,
  Table,
  Container,
} from "reactstrap";
import Swal from 'sweetalert2';
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  listAreaState,
  provinceComboboxData,
  listDistrictState,
} from "state/areaState";
import {moderatorComboboxDataState} from "state/moderatorState";
import { typeVNStatus } from "variables/general";

function ListAreasScreen() {
  //Alumni state
  const [areaList, setlistArea] = useRecoilState(listAreaState);
  const provinceCombobox = useRecoilValue(provinceComboboxData);
  const [districtsData, setDistrictsData] = useRecoilState(listDistrictState);
  const [moderatorComboboxData, setModeratorComboboxData] = useRecoilState(moderatorComboboxDataState);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedArea, setSelectedArea] = useState({});
  const [isOpenDetail, setIsOpentDetail] = useState(false);
  const [isOpenEdit, setIsOpentEdit] = useState(false);
  const [filtersParams, setFiltersParams] = useState({
    page: 1,
    "page-size": 20,
  });

  const [provinceFilterSelected, setProvinceFilterSelected] = useState({
    value: -1,
    label: "Tất cả tỉnh thành",
  });

  const provinceFilterSelectData = [
    {
      value: -1,
      label: "Tỉnh thành",
    },
    ...provinceCombobox,
  ];

  const [districtsFilterSelectData, setDistrictsFilterSelectData] = useState([{
    value: -1,
    label: "Chọn quận huyện",
  }]);

  const [districtFilterSelected, setDistrictFilterSelected] = useState({
    value: -1,
    label: "Tất cả quận huyện",
  });

  const [communeDetailsSelected, setCommuneDetailsSelect] = useState({
    value: -1,
    label: 'Chọn xấ / thị trấn',
  });

  const [moderatorFilterSelected, setModeratorFilterSelected] = useState({
    value: -1,
    label: "Người điều hành",
  });

  const moderatorFilterSelectData = [
    {
      value: -1,
      label: "Không có người điều hành",
    },
    ...moderatorComboboxData,
  ];

  //filter province
  const filtersProvince = async (province) => {
    setProvinceFilterSelected(province);
    let filters = {};
    if (province.value > -1) {
      filters = { ...filtersParams, province: province.label };
      console.log("province: province.label " + province.label);

      //fetch districts of province
      let districtInProvince = districtsData.filter(
        (district) => district.parent_id == province.value
      );

      districtInProvince = districtInProvince.map((district) => {
        return {
          value: district.id,
          label: `${district.name}`,
          communes: district.phuong_xa,
        };
      });

      setDistrictsFilterSelectData([{
        value: -1,
        label: "Tất cả quận huyện",
      },
      ...districtInProvince,]);

      console.log("districtsFilterSelectData " + districtsFilterSelectData);


    } else {
      filters = {
        page: 1,
        "page-size": 20,
      };

      setDistrictsFilterSelectData([{
        value: -1,
        label: "Chọn quận huyện",
      }])
    }

    setFiltersParams(filters);
    fetchListArea(filters);
  };

  const filtersDistrict = async (district) => {
    setDistrictFilterSelected(district);
    console.log("districtsFilterSelectData " + districtsFilterSelectData);

    let filters = {};
    if (district.value > -1) {
      filters = { ...filtersParams, district: district.label };
      console.log("district: district.label " + district.label);

    } else {
      console.log("provinceFilterSelected " + provinceFilterSelected);
      filters = {
        page: 1,
        "page-size": 20,
        province: provinceFilterSelected.label,
      };

      setDistrictsFilterSelectData([{
        value: -1,
        label: "Chọn quận huyện",
      }])
    }

    setFiltersParams(filters);
    fetchListArea(filters);
  }

  //Area state
  //-----------------------------Call API to get list Area, then set to Area state
  useEffect(() => {
    const fetchListArea = async () => {
      try {
        //Area
        fetchListArea(filtersParams);
      } catch (err) {
        console.log("Failed to fetch list Area. ", err);
      }
    };
    fetchListArea();
  }, [filtersParams, districtsFilterSelectData]);

  const fetchListArea = async (filters) => {
    try {
      //Area
      const response = await areaApi.getAll(filters);
      response.data ? setlistArea(response.data.list_object) : setlistArea([]);
      //Pagination
      let total_page = response.data.paging_metadata.total_pages;
      setPageOptions([...Array(total_page).keys()]);
      setCanNextPage(response.data.paging_metadata.has_next_page);
      setCanPreviousPage(response.data.paging_metadata.has_previous_page);
      setPageIndex(response.data.paging_metadata.page_index);
      console.log("Success to fetch list Area. ", response.data.list_object);
    } catch (err) {
      console.log("Failed to fetch list Area. ", err);
    }
  };

  const closeModal = () => {
    setIsOpentDetail(false);
  };

  const closeEditModal = () => {
    setIsOpentEdit(false);
  };

  //open Edit Modal
  const openEditAreaModal = () => {
    setIsOpentDetail(true);
    setIsOpentEdit(true);
  };

  //Handle edit button
  const editArea = (area) => {
    
    setProvinceFilterSelected({
      value: 0,
      label: area.province,
    });

    setDistrictFilterSelected({
      value: 0,
      label: area.district,
    })

    setCommuneDetailsSelect({
      value: 0,
      label: area.commune,
    })


    setSelectedArea(area);
    setIsOpentDetail(true);
  };

  const handleDeleteButton = async (area) => {
    Swal.fire({
      title: 'Bạn có muốn ẩn thông tin này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#4F9E1D',
      confirmButtonText: 'Ẩn',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteArea(area);
      }
    })
  };



  //Handle delete button
  const deleteArea = async (area) => {
    setSelectedArea(area);
    try {
      const response = await areaApi.delete(area.id);
      console.log(
        "🚀 ~ file: List Area.js ~ line 197 ~ handleSubmit ~ response",
        response
      );

      fetchListArea(filtersParams);

      Swal.fire({  
        icon: 'success',
        title: 'Thành công',  
        text: 'Xóa thành công!',  
      });
    } catch (err) {
      console.log(`Failed to delete area ${err}`);
      Swal.fire({  
        icon: 'error',
        title: 'Lỗi',  
        text: 'Xóa không thành công!',  
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let updateArea = {
      id: selectedArea.id,
      province: provinceFilterSelected.label,
      district: districtFilterSelected.label,
      commune: communeDetailsSelected.label,
      address: e.target.address.value,
    }

    if (moderatorFilterSelected.value > -1) {
      updateArea = {...updateArea, moderator_id: moderatorFilterSelected.value};
    }

    console.log(
          "🚀 ~ file: List Area.js ~ line 197 ~ handleSubmit ~ updateArea",
          updateArea
        );
        Swal.fire({  
          icon: 'success',
          title: 'Thành công',  
          text: 'Cập nhật thành công!',  
        });

    try {
      const response = await areaApi.put(updateArea);
      console.log(
        "🚀 ~ file: List Area.js ~ line 197 ~ handleSubmit ~ response",
        response
      );

      fetchListArea(filtersParams);
      
    } catch (err) {
      console.log(`Failed to update Area ${err}`);
    Swal.fire({  
      icon: 'error',
      title: 'Lỗi',  
      text: 'Cập nhật không thành công!',  
    });
    }

    setOpenEditModal(false);
    setIsOpentDetail(false);
  };

  const dataState = areaList.map((prop, key) => {
    key = prop.id;
    return {
      id: key,
      province: prop.province,
      commune: prop.commune,
      district: prop.district,
      address: prop.address,
      status: typeVNStatus[prop.status],
      moderator:
        prop.manager_of.length > 0
          ? prop.manager_of[0].fullname
          : "Chưa có người điều hành",
      actions: (
        // we've added some custom button actions
        <div className="actions-right">
          {/* use this button to add a edit kind of action */}
          <Button
            onClick={editArea.bind(this, prop)}
            className="btn-round"
            color="primary"
            size="sm"
          >
            Chi tiết
          </Button>
          {/* use this button to remove the data row */}
          <Button
            onClick={handleDeleteButton.bind(this, prop)}
            className="btn-round"
            color="danger"
            size="sm"
          >
            Ẩn
          </Button>
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
    fetchListArea(filtersParams);
  };

  const nextPage = async () => {
    let page = pageIndex + 1;
    filtersParams.page = page;
    fetchListArea(filtersParams);
  };

  const previousPage = async () => {
    let page = pageIndex - 1;
    filtersParams.page = page;
    fetchListArea(filtersParams);
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
                      <CardTitle tag="h4">Quản lý khu vực</CardTitle>
                    </Col>
                    <Col xs={2} md={2}>
                      <Link to="/admin/them-moi-khu-vuc">
                        <Button color="primary">Thêm mới</Button>
                      </Link>
                    </Col>
                  </Row>

                  {/* Filter */}
                  <Row>
                    <Col xs={3} md={2}>
                      <FormGroup>
                        <label>Tỉnh thành:</label>
                        <Select
                          className="react-select primary"
                          classNamePrefix="react-select"
                          placeholder="Chọn tỉnh thành"
                          name="province"
                          value={provinceFilterSelected}
                          onChange={filtersProvince}
                          options={provinceFilterSelectData.map((prop) => {
                            return {
                              value: prop.value,
                              label: prop.label,
                            };
                          })}
                        />
                      </FormGroup>
                    </Col>

                    <Col xs={3} md={2}>
                      <FormGroup>
                        <label>Quận huyện:</label>
                        <Select
                          className="react-select primary"
                          classNamePrefix="react-select"
                          placeholder="Chọn quận huyện"
                          name="district"
                            value={districtFilterSelected}
                            onChange={filtersDistrict}
                            options={districtsFilterSelectData.map((prop) => {
                              return {
                                value: prop.value,
                                label: prop.label,
                                communes: prop.communes,
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
                    models="alumni"
                    data={dataState}
                    columns={[
                      {
                        Header: "Tỉnh thành",
                        accessor: "province",
                      },
                      {
                        Header: "Quận huyện",
                        accessor: "district",
                      },
                      {
                        Header: "Xã/Thị trấn",
                        accessor: "commune",
                      },
                      {
                        Header: "Địa chỉ",
                        accessor: "address",
                      },
                      {
                        Header: "Người điều hành",
                        accessor: "moderator",
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
          <div className="content mt-1">
            <Row>
              <Col md="12">
                <Card>
                  <CardHeader>
                    <Row>
                      <Col xs={6} md={6}>
                        <h5 className="title">Chi tiết khu vực</h5>
                      </Col>
                    </Row>
                  </CardHeader>

                  <CardBody>
                    <Row>
                      <Col md="12">
                        <Form>
                          <Row className="d-flex justify-content-center">
                            <Col md="7">
                              <Table responsive>
                                <tr>
                                  <th md="1">Tỉnh thành:</th>
                                  <td md="7">{selectedArea.province}</td>
                                </tr>

                                <tr>
                                  <th md="1">Quận huyện:</th>
                                  <td md="7">{selectedArea.district}</td>
                                </tr>

                                <tr>
                                  <th md="1">Xã/Thị trấn:</th>
                                  <td md="7">{selectedArea.commune}</td>
                                </tr>

                                <tr>
                                  <th md="1">Địa chỉ:</th>
                                  <td md="7">{selectedArea.address}</td>
                                </tr>

                                <tr>
                                  <th md="1">Trạng thái:</th>
                                  <td md="7">{typeVNStatus[selectedArea.status]}</td>
                                </tr>

                                <tr>
                                  <th md="1">Người điều hành:</th>
                                  <td md="7">{selectedArea.commune}</td>
                                </tr>
                              </Table>
                            </Col>
                          </Row>

                          <div className="d-flex justify-content-center">
                            <Button
                              className="mr-2"
                              onClick={openEditAreaModal}
                              color="primary"
                            >
                              Cập nhật
                            </Button>
                            <Button
                              className="ml-2"
                              onClick={closeModal}
                              color="danger"
                            >
                              Đóng
                            </Button>
                          </div>
                        </Form>
                      </Col>
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
            className="mt-5"
          >
            <ModalHeader>Thông tin khu vực</ModalHeader>
            <ModalBody>
              <Row>
                <Col xs={12} md={12}>
                  
                   
                      <div className="content mt-1">
                        <Row>
                          <Col md="12">
                            <Form onSubmit={handleSubmit}>
                            <Row className="d-flex justify-content-center">
                              <Col className="px-1" md="8">
                                <FormGroup>
                                  <Label className="font-weight-bold">Tỉnh thành</Label>
                                  <Select
                                            isDisabled={true}
                                            className="react-select primary"
                                            classNamePrefix="react-select"
                                            placeholder="Tỉnh thành"
                                            name="province"
                                            value={provinceFilterSelected}
                                            onChange={(value) => setProvinceFilterSelected(value)}
                                            options={provinceFilterSelectData.map((prop) => {
                                              return {
                                                value: prop.value,
                                                label: prop.label,
                                              };
                                            })}
                                          />
                                </FormGroup>
                              </Col>
                              <Col className="px-1" md="8">
                                <FormGroup>
                                  <Label className="font-weight-bold">Quận huyện</Label>
                                  <Select
                                            isDisabled={true}
                                            className="react-select primary"
                                            classNamePrefix="react-select"
                                            placeholder="Quận huyện"
                                            name="district"
                                            value={districtFilterSelected}
                                            onChange={(value) => setDistrictFilterSelected(value)}
                                            options={districtsFilterSelectData.map((prop) => {
                                              return {
                                                value: prop.value,
                                                label: prop.label,
                                                communes: prop.communes,
                                              };
                                            })}
                                          />
                                </FormGroup>
                              </Col>
                              <Col className="px-1" md="8">
                                <FormGroup>
                                  <Label className="font-weight-bold">Xã/Thị trấnn</Label>
                                  <Select
                                            isDisabled={true}
                                            className="react-select primary"
                                            classNamePrefix="react-select"
                                            placeholder="Tỉnh thành"
                                            name="commune"
                                            value={communeDetailsSelected}
                                            onChange={(value) => setCommuneDetailsSelect(value)}
                                            options={provinceFilterSelectData.map((prop) => {
                                              return {
                                                value: prop.value,
                                                label: prop.label,
                                              };
                                            })}
                                          />
                                </FormGroup>
                              </Col>
                              <Col className="px-1" md="8">
                                <FormGroup>
                                  <Label className="font-weight-bold">Địa chỉ</Label>
                                  <Input
                                      placeholder="Nhập địa chỉ..."
                                      defaultValue={selectedArea.address}
                                      type="text"
                                      name={"address"}
                                    />
                                </FormGroup>
                              </Col>
                              <Col className="px-1" md="8">
                                <FormGroup>
                                  <Label className="font-weight-bold">Người điều hành</Label>
                                  <Select
                                            className="react-select primary"
                                            classNamePrefix="react-select"
                                            placeholder="Người điều hành"
                                            name="moderator"
                                            value={moderatorFilterSelected}
                                            onChange={(value) => setModeratorFilterSelected(value)}
                                            options={moderatorFilterSelectData.map((prop) => {
                                              return {
                                                value: prop.value,
                                                label: prop.label,
                                              };
                                            })}
                                          />
                                </FormGroup>
                              </Col>
                              <Col className="px-1" md="8">
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

export default ListAreasScreen;
