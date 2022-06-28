// core components
import areaApi from "api/areaApi";
import treeTypeApi from "api/treeTypeApi";
import PanelHeader from "components/PanelHeader/PanelHeader.js";
import ReactTable from "components/ReactTable/ReactTable.js";
import momentjs from "moment";
import "moment-timezone";
import React, { useEffect, useState } from "react";
import Datetime from "react-datetime";
import Moment from "react-moment";
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
  Table,
  Label,
} from "reactstrap";
import { useRecoilState, useRecoilValue } from "recoil";
import { listTreeTypesState } from "state/treeTypeState";

function ListTreeTypesScreen() {
  //TreeType state
  const [treeTypeList, setlistTreeTypes] = useRecoilState(listTreeTypesState);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedTreeType, setSelectedTreeType] = useState({});
  const [isOpenDetail, setIsOpentDetail] = useState(false);
  const [isOpenEdit, setIsOpentEdit] = useState(false);
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
        setlistTreeTypes(response.data.list_object);
      } catch (err) {
        console.log("Failed to fetch list TreeTypes. ", err);
      }
    };
    fetchListTreeTypes();
  }, []);

  const fetchListTreeType = async (filters) => {
    try {
      //ALUMNI
      const response = await treeTypeApi.getAll(filters);
      response.data ? setlistTreeTypes(response.data) : setlistTreeTypes([]);
    } catch (err) {
      console.log("Failed to fetch list TreeType. ", err);
    }
  };

  const closeModal = () => {
    setIsOpentDetail(false);
  };

  const closeEditModal = () => {
    setIsOpentEdit(false);
  };

  //open Edit Modal
  const openEditTreeTypeModal = () => {
    setIsOpentDetail(true);
    setIsOpentEdit(true);
  };

  //Handle edit button
  const editTreeType = (treeType) => {
    setSelectedTreeType(treeType);
    setIsOpentDetail(true);
    setOpenEditModal(true);
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

      try {
        const response = await treeTypeApi.getAll(filtersParams);
        setlistTreeTypes(response.data);
      } catch (err) {
        console.log("Failed to fetch list treeType. ", err);
      }

      alert(`Delete successfully!`);
    } catch (err) {
      alert(`Failed to delete treeType ${err}`);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const updateTreeType = {
      id: selectedTreeType.id,
      type: e.target.type.value,
      description: e.target.description.value,
    };

    try {
      const response = await treeTypeApi.put(updateTreeType);
      console.log(
        "🚀 ~ file: List treeType.js ~ line 197 ~ handleSubmit ~ response",
        response
      );

      try {
        const listTreeTypeUpdate = await treeTypeApi.getAll(filtersParams);
        setlistTreeTypes(listTreeTypeUpdate.data);
      } catch (err) {
        console.log("Failed to fetch list TreeType. ", err);
      }

      alert(`Update successfully!`);
    } catch (err) {
      alert(`Failed to update TreeType ${err}`);
    }

    setOpenEditModal(false);
    setIsOpentDetail(false);
  };

  const dataState = treeTypeList.map((prop, key) => {
    key = prop.id;
    console.log("PROPS ", prop);
    return {
      id: key,
      type: prop.type,
      status: prop.status,
      actions: (
        // we've added some custom button actions
        <div className="actions-right">
          {/* use this button to add a edit kind of action */}
          <Button
            onClick={editTreeType.bind(this, prop)}
            className="btn-icon btn-round"
            color="success"
            size="sm"
          >
            <i className="fa fa-edit" />
          </Button>{" "}
          {/* use this button to remove the data row */}
          <Button
            onClick={deleteTreeType.bind(this, prop)}
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

      <div className="content mt-1">
        <Row>
          <Col xs={7} md={7}>
            <Card>
              <CardHeader>
                <Row>
                  <Col xs={10} md={10}>
                    <CardTitle tag="h4">Quản lý loại cây</CardTitle>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <ReactTable
                  models="alumni"
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

          <Col xs={5} md={5}>
            {/* DETAILS */}

            <div>
              <Row>
                <Col md="12">
                  <Card>
                    <CardHeader>
                      <Row>
                        <Col xs={6} md={6}>
                          <h5 className="card-title">Thêm mới loại cây</h5>
                        </Col>
                      </Row>
                    </CardHeader>

                    <CardBody>
                      <Row>
                        <Col md="12">
                          <Form>
                            <Row className="d-flex justify-content-center">
                              <Col md="7">
                                <Row>
                                <Col md="12">
                                <FormGroup className="">
                                  <Label className="font-weight-bold">Loại cây</Label>
                                      <Input
                                        defaultValue=""
                                        placeholder="Hãy nhập tên loại cây"
                                        type="text"
                                        name={"type"}
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
                                        defaultValue={selectedTreeType.description}
                                        name={"description"}
                                      />
                                    </FormGroup>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>

                            <div className="d-flex justify-content-center">
                              <Button
                                className="mr-2"
                                onClick={openEditTreeTypeModal}
                                color="success"
                              >
                                Update
                              </Button>
                              <Button
                                className="ml-2"
                                onClick={closeModal}
                                color="danger"
                              >
                                Cancel
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
          </Col>
        </Row>
      </div>

      <div>
        <Modal
          isOpen={isOpenEdit}
          size="lg"
          style={{ maxWidth: "1000px", width: "100%" }}
        >
          <ModalHeader>Thông tin loại cây</ModalHeader>
            <ModalBody>
              <Row>
                <Col xs={12} md={12}>
                  <Card>
                    <CardBody>
                      <div className="content mt-1">
                        <Row>
                          <Col md="12">
                            
                                <Form onSubmit={handleSubmit}>
                                  
                                 

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
    </>
  );
}

export default ListTreeTypesScreen;
