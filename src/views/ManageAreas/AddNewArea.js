// core components
import PanelHeader from "components/PanelHeader/PanelHeader.js";
import React from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
// reactstrap components
import {
    Button,
    Card, CardBody, CardHeader, CardTitle, Col, Form, FormGroup, Input, Label, Row
} from "reactstrap";
import { useRecoilState, useRecoilValue } from "recoil";

function AddNewArea() {
    React.useEffect(() => {
        document.body.classList.add("lock-page");
        return function cleanup() {
            document.body.classList.remove("lock-page");
        };
    }, []);



    // const clearForm = (e) => {
    //     e.target.discount_value.value = "";
    //     e.target.relationship_name.value = "";
    //     setMajorSelected({
    //         value: 0,
    //         label: 'Major',
    //     });
    // }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // if (maxState === 'has-danger') {
        //     alert(`Invalid discount value!`);
        // } else {
        //     const newVoucher = {
        //         discount_value: e.target.discount_value.value,
        //         major_id: majorSelected.value,
        //         relationship_name: e.target.relationship_name.value,
        //     }
        //     try {
        //         const response = await voucherApi.post(newVoucher);
        //         console.log("🚀 ~ file: AddNewCLassPage.js ~ line 68 ~ handleSubmit ~ response", response)

        //         try {
        //             const vouchers = await voucherApi.getAll({ status: 'Active' });
        //             setListVouchers(vouchers.data);
        //         } catch (err) {
        //             console.log("Failed to fetch list vouchers: ", err);
        //         }

        //         alert(`Update successfully!`);
        //     } catch (err) {
        //         alert(`Failed to ADD voucher: ${err}`);
        //     }

        //     clearForm(e);
        // }

    };

    return (
        <>
            <PanelHeader size="sm" />
            <div className="content mt-1">
                <Col md="12">
                    <Card>
                        <CardHeader>
                            <Row>
                                <Col xs={0.5} md={0.5}>
                                    <Link to="/admin/list-voucherss-page">
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
                                    <CardTitle tag="h4">Add New Voucher</CardTitle>
                                </Col>
                            </Row>
                        </CardHeader>
                        <CardBody>
                            <Form onSubmit={handleSubmit} className="form-horizontal" method="get">
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
                                <Button
                                  type="submit"
                                  className="mr-2"
                                  color="primary"
                                >
                                  Update
                                </Button>
                                <Button
                                  className="ml-2"
                                //   onClick={closeEditModal}
                                  color="danger"
                                >
                                  Cancel
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
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </div>
        </>
    );
}

export default AddNewArea;
