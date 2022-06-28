// core components
import areaApi from "api/areaApi";
import PanelHeader from "components/PanelHeader/PanelHeader.js";
import ReactTable from "components/ReactTable/ReactTable.js";
import momentjs from 'moment';
import 'moment-timezone';
import React, { useEffect, useState } from "react";
import Datetime from 'react-datetime';
import Moment from 'react-moment';
import Select from "react-select";
// reactstrap components
import {
  Button, Card, CardBody, CardHeader, CardTitle, Col, Form, FormGroup, Input, Modal, ModalBody, ModalHeader, Row, Table
} from "reactstrap";
import { useRecoilState, useRecoilValue } from "recoil";
import { listAreaState } from "state/alumniState";




function ListAreasScreen() {

  //Alumni state
  const [areaList, setlistArea] = useRecoilState(listAreaState);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedArea, setSelectedArea] = useState({});
  const [isOpenDetail, setIsOpentDetail] = useState(false);
  const [isOpenEdit, setIsOpentEdit] = useState(false);
  const [filtersParams, setFiltersParams] = useState({page:1, 'page-size': 20});

  //Area state
  //-----------------------------Call API to get list Area, then set to Area state
  useEffect(() => {
    const fetchListArea = async () => {
      try {
        //Area
        const response = await areaApi.getAll(filtersParams);
        setlistArea(response.data.list_object);
      } catch (err) {
        console.log("Failed to fetch list Area. ", err);
      }
    }
    fetchListArea();
  }, []);


  const fetchListArea = async (filters) => {
    try {
      //Area
      const response = await areaApi.getAll(filters);
      response.data ? setlistArea(response.data) : setlistArea([]);
    } catch (err) {
      console.log("Failed to fetch list Area. ", err);
    }
  }

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
  }

  //Handle edit button
  const editArea = area => {
    setSelectedArea(area);
    setIsOpentDetail(true);
    setOpenEditModal(true);
  };

  //Handle delete button
  const deleteArea = async (area) => {
    setSelectedArea(area);
    try {
      const response = await areaApi.delete(area.id);
      console.log("🚀 ~ file: List Area.js ~ line 197 ~ handleSubmit ~ response", response);

      try {
        const response = await areaApi.getAll(filtersParams);
        setlistArea(response.data);
      } catch (err) {
        console.log("Failed to fetch list area. ", err);
      }

      alert(`Delete successfully!`);
    } catch (err) {
      alert(`Failed to delete area ${err}`);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const updateArea = {
      id: selectedArea.id,
      province: e.target.province.value,
      district: e.target.district.value,
      commune: e.target.commune.value,
    }

    try {
      const response = await areaApi.put(updateArea);
      console.log("🚀 ~ file: List Area.js ~ line 197 ~ handleSubmit ~ response", response)

      try {
        const listAreaUpdate = await areaApi.getAll();
        setlistArea(listAreaUpdate.data);
      } catch (err) {
        console.log("Failed to fetch list Area. ", err);
      }

      alert(`Update successfully!`);
    } catch (err) {
      alert(`Failed to update Area ${err}`);
    }

    setOpenEditModal(false);
    setIsOpentDetail(false);
  };

  const dataState =
  areaList.map((prop, key) => {
      key = prop.id
      return {
        id: key,
        province: prop.province,
        commune: prop.commune,
        district: prop.district,
        actions: (
          // we've added some custom button actions
          <div className="actions-right">
            {/* use this button to add a edit kind of action */}
            <Button
              onClick={editArea.bind(this, prop)}
              className="btn-icon btn-round"
              color="success"
              size="sm"
            >
              <i className="fa fa-edit" />
            </Button>{" "}
            {/* use this button to remove the data row */}
            <Button
              onClick={deleteArea.bind(this, prop)}
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
                      <CardTitle tag="h4">Quản lý khu vực</CardTitle>
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
                        //   value={universityFilterSelected}
                        //   // options={selectOptions}
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

                    <Col xs={3} md={2}>
                      <FormGroup>
                        <label>Quận huyện:</label>
                        <Select
                          className="react-select primary"
                          classNamePrefix="react-select"
                          placeholder="Chọn quận huyện"
                          name="district"
                        //   value={companyFilterSelected}
                        //   onChange={filters}
                        //   options={companyFilterSelectData.map((prop) => {
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
                        Header: "Người điều hành",
                        accessor: "",
                      },
                      {
                        Header: "Quản lý",
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
                                  <th md="1">Người điều hành:</th>
                                  <td md="7">{selectedArea.commune}</td>
                                </tr>

                              </Table>
                            </Col>
                          </Row>

                          <div className="d-flex justify-content-center">
                            <Button className="mr-2" onClick={openEditAreaModal} color="success">Update</Button>
                            <Button className="ml-2" onClick={closeModal} color="danger">Cancel</Button>
                          </div>
                        </Form>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>

          <Modal isOpen={isOpenEdit} size="lg" style={{ maxWidth: '800px', width: '100%' }}>
            <ModalHeader>Thông tin khu vực</ModalHeader>
            <ModalBody>
              <Row>
                <Col xs={12} md={12}>
                  <Card>
                    <CardBody>
                      <div className="content mt-1">
                        <Row>
                          <Col md="12">
                            
                                <Form onSubmit={handleSubmit}>
                                  
                                    <Col className="px-1" md="8">
                                      <FormGroup>
                                        <label>Tỉnh thành</label>
                                        <Select
                                          className="react-select primary"
                                          classNamePrefix="react-select"
                                          placeholder="Chọn tỉnh thành"
                                          name="province"
                                        />
                                      </FormGroup>
                                    </Col>
                                    <Col className="px-1" md="8">
                                      <FormGroup>
                                        <label>Quận huyện</label>
                                        <Select
                                          className="react-select primary"
                                          classNamePrefix="react-select"
                                          placeholder="Chọn quận huyện"
                                          name="district"
                                        />
                                      </FormGroup>
                                    </Col>
                                    <Col className="px-1" md="8">
                                      <FormGroup>
                                        <label>Xã/Thị trấn</label>
                                        <Select
                                          className="react-select primary"
                                          classNamePrefix="react-select"
                                          placeholder="Chọn xã/thị trấn"
                                          name="commune"
                                        />
                                      </FormGroup>
                                    </Col>
                                    <Col className="px-1" md="8">
                                      <FormGroup>
                                        <label>Người điều hành</label>
                                        <Select
                                          className="react-select primary"
                                          classNamePrefix="react-select"
                                          placeholder="Chọn người điều hành"
                                          name="moderator"
                                        />
                                      </FormGroup>
                                    </Col>
                                 

                                  <div className="d-flex justify-content-center">
                                    <Button type="submit" className="mr-2" color="success">Update</Button>
                                    <Button className="ml-2" onClick={closeEditModal} color="danger">Cancel</Button>
                                  </div>
                                </Form>
                              
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

      )
      }
    </>
  );
}

export default ListAreasScreen;
