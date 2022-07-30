// core components
import areaApi from "api/areaApi";
import PanelHeader from "components/PanelHeader/PanelHeader.js";
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
  Label,
  Form,
  FormGroup,
  Row,
} from "reactstrap";
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  listAreaState,
  provinceComboboxData,
  listDistrictState,
} from "state/areaState";
import {moderatorComboboxDataState} from "state/moderatorState";

function AddNewArea() {
  //Alumni state
  const [areaList, setlistArea] = useRecoilState(listAreaState);
  const provinceCombobox = useRecoilValue(provinceComboboxData);
  const [districtsData, setDistrictsData] = useRecoilState(listDistrictState);
  const [moderatorComboboxData, setModeratorComboboxData] = useRecoilState(moderatorComboboxDataState);

  const [filtersParams, setFiltersParams] = useState({
    page: 1,
    "page-size": 20,
  });

  const [provinceFilterSelected, setProvinceFilterSelected] = useState({
    value: -1,
    label: "Tỉnh thành",
  });

  const provinceFilterSelectData = [
    {
      value: -1,
      label: "Chọn tỉnh thành",
    },
    ...provinceCombobox,
  ];

  const [districtsFilterSelectData, setDistrictsFilterSelectData] = useState([{
    value: -1,
    label: "Chọn quận huyện",
  }]);

  const [districtFilterSelected, setDistrictFilterSelected] = useState({
    value: -1,
    label: "Quận huyện",
  });

  const [communeFilterSelectedData, setCommuneFilterSelectedData] = useState([{
    value: -1,
    label: 'Chọn xấ / thị trấn',
  }]);

  const [communeFilterSelected, setCommuneFilterSelected] = useState({
    value: -1,
    label: "Xã / Thị trấn",
  });

  const [moderatorFilterSelected, setModeratorFilterSelected] = useState({
    value: -1,
    label: "Người điều hành",
  });

  const moderatorFilterSelectData = [
    {
      value: -1,
      label: "Chọn người điều hành",
    },
    ...moderatorComboboxData,
  ];

  //filter province
  const filtersProvince = async (province) => {
    setProvinceFilterSelected(province);
    if (province.value > -1) {
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

      setDistrictFilterSelected({
        value: -1,
        label: "Quận huyện",
      });

      setCommuneFilterSelected({
        value: -1,
        label: "Xã / Thị trấn",
      });

      setModeratorFilterSelected({
        value: -1,
        label: "Người điều hành",
      });



      setDistrictsFilterSelectData([{
        value: -1,
        label: "Tất cả quận huyện",
      },
      ...districtInProvince,]);

      console.log("districtsFilterSelectData " + districtsFilterSelectData);


    } else {
      setDistrictsFilterSelectData([{
        value: -1,
        label: "Chọn quận huyện",
      }]);

      setCommuneFilterSelectedData(
        [{
          value: -1,
          label: 'Chọn xấ / thị trấn',
        }]
      );

      setDistrictFilterSelected({
        value: -1,
        label: "Quận huyện",
      });

      setCommuneFilterSelected({
        value: -1,
        label: "Xã / Thị trấn",
      });

      setModeratorFilterSelected({
        value: -1,
        label: "Người điều hành",
      });

    }
  };

  const filtersDistrict = async (district) => {
    setDistrictFilterSelected(district);
    console.log("districtsFilterSelectData " + districtsFilterSelectData);

    if (district.value > -1) {
      console.log("district: district.communes " + district.communes);


      let communeInDistrict = district.communes.map((commune) => {
        return {
          value: commune.id,
          label: `${commune.name}`,
        };
      });

      setCommuneFilterSelectedData([{
        value: -1,
        label: "Tất cả xã / thị trấn",
      },
      ...communeInDistrict,]);

      
    } else {
      setDistrictsFilterSelectData([{
        value: -1,
        label: "Chọn quận huyện",
      }]);

      setCommuneFilterSelectedData(
        [{
          value: -1,
          label: 'Chọn xấ / thị trấn',
        }]
      );
    }

  }

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
      console.log("Success to fetch list Area. ", response.data.list_object);
    } catch (err) {
      console.log("Failed to fetch list Area. ", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const areaCreated = {
      province: provinceFilterSelected.label,
      district: districtFilterSelected.label,
      commune: communeFilterSelected.label,
      moderator_id: moderatorFilterSelected.value
    };

    console.log(
          "🚀 ~ file: CREATE AREA",
          areaCreated
        );

    try {
      const response = await areaApi.put(areaCreated);
      console.log(
        "🚀 ~ file: List Area.js ~ line 197 ~ handleSubmit ~ response",
        response
      );

      try {
        const listAreaUpdate = await areaApi.getAll();
        setlistArea(listAreaUpdate.data);
      } catch (err) {
        console.log("Failed to fetch list Area. ", err);
      }

      alert(`Created successfully!`);
    } catch (err) {
      alert(`Failed to update Area ${err}`);
    }

  };

  return (
    <>
      <PanelHeader size="sm" />
     
        <div className="content mt-1">
          <Row>
            <Col xs={12} md={12}>
              <Card>
                
                <CardHeader>
              <Row>
                <Col xs={0.5} md={0.5}>
                  <Link to="/admin/khu-vuc">
                    <Button
                      className="btn-icon"
                      color="primary"
                      size="sm"
                    >
                      <i class="fas fa-angle-double-left"></i>
                    </Button>
                  </Link>
                </Col>
                <Col xs={11} md={11}>
                  <CardTitle tag="h4">Thêm mới khu vực</CardTitle>
                </Col>
              </Row>
            </CardHeader>
                <CardBody>
              
                      <div className="content mt-1">
                        <Row>
                          <Col md="12">
                            <Form className="form-horizontal" method="get" onSubmit={handleSubmit}>
                              <Col className="px-1" md="8">
                                <FormGroup>
                                  <Label className="font-weight-bold">Tỉnh thành:</Label>
                                  <Select
                                            className="react-select primary"
                                            classNamePrefix="react-select"
                                            placeholder="Tỉnh thành"
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
                              <Col className="px-1" md="8">
                                <FormGroup>
                                  <Label className="font-weight-bold">Quận huyện:</Label>
                                  <Select
                                            className="react-select primary"
                                            classNamePrefix="react-select"
                                            placeholder="Quận huyện"
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
                              <Col className="px-1" md="8">
                                <FormGroup>
                                  <Label className="font-weight-bold">Xã/Thị trấn:</Label>
                                  <Select
                                            className="react-select primary"
                                            classNamePrefix="react-select"
                                            placeholder="Tỉnh thành"
                                            name="commune"
                                            value={communeFilterSelected}
                                            onChange={(commune) => setCommuneFilterSelected(commune)}
                                            options={communeFilterSelectedData.map((prop) => {
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

                              <div className="d-flex justify-content-center">
                                <Button
                                  type="submit"
                                  className="mr-2"
                                  color="primary"
                                >
                                  Thêm mới
                                </Button>
                                
                              </div>
                            </Form>
                          </Col>
                        </Row>
                      </div>
                    
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
     
   
    </>
  );
}

export default AddNewArea;
