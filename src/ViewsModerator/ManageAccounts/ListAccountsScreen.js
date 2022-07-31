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
import Swal from 'sweetalert2';
import PanelHeader from "components/PanelHeader/PanelHeader.js";
import { useRecoilState } from "recoil";
// import ImageUpload from "components/CustomUpload/ImageUpload";
import { moderatorState } from "state/moderatorState";
import accountApi from "api/accountApi";
import moderatorApi from "api/moderatorApi";
import { JobPostStatusVN, jobType, gender, roleId } from "variables/general";
import Datetime from 'react-datetime';
import SwitchSelector from "react-switch-selector";
import { accountState } from "state/accountState";


function ListAccountsScreen() {
  const [listAccounts, setListAccounts] = useRecoilState(accountState);
  const [isOpenDetail, setIsOpentDetail] = useState(false);
  const [isOpenEdit, setIsOpentEdit] = useState(false);
  const [isOpenTopUp, setIsOpentTopUp] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState({});
  const [filtersParams, setFiltersParams] = useState({
    page: 1,
    "page-size": 20,
    roleId: roleId.landowner,
  });
  const [toggleSelected, setToggleSelected] = useState('Landowner');


  //-----------------------------Call API to get list all moderators, then set to moderators state
  useEffect(() => {
    const fetchListAccounts = async () => {
      try {
        // let roleId = roleId.landowner;
        let role_Id = 3;
        //Accounts
        if (toggleSelected) {
          switch(toggleSelected) {
          case "Landowner":
            // roleId = roleId.landowner;
            role_Id = 3;
            console.log("roleIdroleIdroleIdroleIdroleId ", role_Id);
            filtersParams= {...filtersParams, roleId: roleId};
            break;
          case "Farmer":
            // roleId = roleId.farmer;
            role_Id = 4;
            filtersParams= {...filtersParams, roleId: role_Id};
            break;
          default:
            break;
        }
      } 
        const response = await accountApi.getAll(filtersParams);
        setListAccounts(response.data.list_object);
        console.log(
          "Success to fetch list accounts. ",
          response.data.list_object
        );
        
      } catch (err) {
        console.log("Failed to fetch list accounts. ", err);
      }
    };

    fetchListAccounts();
  }, []);

  const fetchListAccount = async (filtersParams) => {
    try {
      const response = await accountApi.getAll(filtersParams);
      setListAccounts(response.data.list_object);
      console.log(
        "Success to fetch list accounts. ",
        response.data.list_object
      );
    } catch (err) {
      console.log("Failed to fetch list accounts. ", err);
    }
  };

  const options = [
    {
        label: <span>Chủ đất</span>,
        value: {
             landowner: true
        },
        selectedBackgroundColor: "#4F9E1D",
        selectedFontColor: "#fff",
    },
    {
        label: "Nông dân",
        value: "Farmer",
        selectedBackgroundColor: "#4F9E1D",
        selectedFontColor: "#fff",
    }
 ];
 
 const onChange = async (newValue) => {
     console.log(newValue);
     setToggleSelected(newValue);
    //  switch(newValue) {
    //   case "Landowner":
    //     roleId = roleId.landowner;
    //     console.log("roleIdroleIdroleIdroleIdroleId ", roleId);
    //     filtersParams= {...filtersParams, roleId: roleId};
    //     break;
    //   case "Farmer":
    //     roleId = roleId.farmer;
    //     filtersParams= {...filtersParams, roleId: roleId};
    //     break;
    //   default:
    //     break;
    // }
    try {
      let roleId = roleId.landowner;
      //Accounts
      switch(toggleSelected) {
        case "Landowner":
          roleId = roleId.landowner;
          console.log("roleIdroleIdroleIdroleIdroleId ", roleId);
          filtersParams= {...filtersParams, roleId: roleId};
          break;
        case "Farmer":
          roleId = roleId.farmer;
          filtersParams= {...filtersParams, roleId: roleId};
          break;
        default:
          break;
      }

      const response = await accountApi.getAll(filtersParams);
      setListAccounts(response.data.list_object);
      console.log(
        "Success to fetch list accounts. ",
        response.data.list_object
      );
      
    } catch (err) {
      console.log("Failed to fetch list accounts. ", err);
    }
 };
 
 const initialSelectedIndex = options.findIndex(({value}) => value === "Landowner");

  const createDate = () => {
    const d = new Date();
    return d;
  }

  const [dobDateSelected, setDOBSelected] = React.useState(createDate());

  
  const handleChangeDOB = (e) => {
    setDOBSelected(e.format("DD-MM-YYYY"));
  }

  const openEditModal = () => {};

  const closeModal = () => {
    setIsOpentDetail(false);
  };

  const closeEditModal = () => {
    setIsOpentEdit(false);
  };

  const closeTopUpModal = () => {
    setIsOpentTopUp(false);
  }

  //Handle edit button
  const openDetailScreen = async (account) => {
    setSelectedAccount(account);
    console.log("EDDDDDDDIIIIIIIT acc:", account);
    setIsOpentDetail(true);
  };

  const closeDetailScreen = () => {
    setIsOpentDetail(false);
  };

  const handleUpdateButtonClick = async (e) => {
    setIsOpentEdit(true);
    console.log("EDDDDDDDIIIIIIIT account:", selectedAccount);
  };

  const handleTopUpButtonClick = async (e) => {
    setIsOpentTopUp(true);
    console.log("TOPUPPPPPPP account:", selectedAccount);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const updateAccount = {
      id:selectedAccount.id,
  role_id: selectedAccount.role_id,
  fullname: e.target.fullname.value,
  date_of_birth: momentjs(Date(dobDateSelected)).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
  phone_number: e.target.phone_number.value,
  
    }

    console.log("update account:" + updateAccount.address);

    try {
      const response = await accountApi.put(updateAccount);
      console.log("🚀 ~ file: account.js ~ line 197 ~ handleSubmit ~ response", response)

      try {
        const response = await accountApi.getAll(filtersParams);
        setListAccounts(response.data.list_object);
        console.log(
          "Success to fetch list account. ",
          response.data.list_object
        );
      } catch (err) {
        console.log("Failed to fetch list account. ", err);
      }

      Swal.fire({  
        icon: 'success',
        title: 'Thành công',  
        text: 'Cập nhật thành công!',  
      });

    } catch (err) {
      console.log(`Failed to update account ${err}`);
      Swal.fire({  
        icon: 'error',
        title: 'Lỗi',  
        text: 'Cập nhật không thành công!',  
      });

    }

    setIsOpentEdit(false);
    setIsOpentDetail(false);
  };

  const deleteModerator = async (account) => {
    setSelectedAccount(account);
    try {
      const response = await moderatorApi.delete(selectedAccount.id);
      console.log("🚀 ~ file: ListNewsPage.js ~ line 141 ~ deleteNews ~ response", response)

      try {
        const response = await moderatorApi.getAll(filtersParams);
        setListAccounts(response.data.list_object);
        console.log(
          "Success to fetch list account. ",
          response.data.list_object
        );
      } catch (err) {
        console.log("Failed to fetch list moderator. ", err);
      }

      Swal.fire({  
        icon: 'success',
        title: 'Thành công',  
        text: 'Xóa thành công!',  
      });
    } catch (err) {
      console.log(`Failed to delete moderator ${err}`);
      Swal.fire({  
        icon: 'error',
        title: 'Lỗi',  
        text: 'Xoá không thành công!',  
      });

    }
  };

  const handleChange = async (event) => {
    // console.log(event.target.value);
    // event.target.value = event.target.value.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})
  };

  const handleTopUpSubmit = async (e) => {
    e.preventDefault();

    const account = {
      accountId: selectedAccount.id,
      topUp: e.target.topUp.value,
    }
    console.log("🚀 ~ file: account.js ~ line 197 ~ handleSubmit ~ response", account.topUp, "    " , account.accountId)

    try {
      const response = await accountApi.topUp(account);
      console.log("🚀 ~ file: account.js ~ line 197 ~ handleSubmit ~ response", response)

      try {
        const response = await accountApi.getAll(filtersParams);
        setListAccounts(response.data.list_object);
        console.log(
          "Success to fetch list account. ",
          response.data.list_object
        );
      } catch (err) {
        console.log("Failed to fetch list account. ", err);
      }

      Swal.fire({  
        icon: 'success',
        title: 'Thành công',  
        text: 'Nạp tiền thành công!',  
      });

    } catch (err) {
      console.log(`Failed to update account ${err}`);
      Swal.fire({  
        icon: 'error',
        title: 'Lỗi',  
        text: 'Nạp tiền không thành công!',  
      });

    }

    setIsOpentTopUp(false);
    setIsOpentDetail(false);
  }



  const dataState = listAccounts.map((prop, key) => {
    key = prop.id;
    return {
      id: key,
      fullname: prop.fullname,
      phone_number: prop.phone_number,
      address: prop.address,
      balance: prop.balance.toLocaleString('it-IT', {style : 'currency', currency : 'VND'}),
      point: prop.point,
      actions: (
        // we've added some custom button actions
        <div className="actions-right">
          {/* use this button to add a edit kind of action */}
          <Button
            onClick={openDetailScreen.bind(this, prop)}
            className="btn-round"
            color="primary"
            size="sm"
          >
          Chi tiết
          </Button>{" "}
          {/* use this button to remove the data row */}
          <Button
              onClick={deleteModerator.bind(this, prop)}
            className="btn-round"
            color="danger"
            size="sm"
          >
          Khóa
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
                      <CardTitle tag="h4">Quản lý tài khoản</CardTitle>
                    </Col>
                    
                  </Row>

                  <Row>
                    <Col xs={3} md={2}>
                    <div className="your-required-wrapper" style={{width: 300, height: 40, color: "#fff !important"}}>
        <SwitchSelector
            onChange={onChange}
            options={options}
            initialSelectedIndex={initialSelectedIndex}
            backgroundColor={"#353b48"}
            fontColor={"#fff !important"}
            selectedFontColor={"#fff !important"}
        />
    </div>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <ReactTable
                    data={dataState}
                    columns={[
                      {
                        Header: "Họ và tên",
                        accessor: "fullname",
                      },
                      {
                        Header: "Số điện thoại",
                        accessor: "phone_number",
                      },
                      {
                        Header: "Số dư",
                        accessor: "balance",
                      },
                      {
                        Header: "Điểm",
                        accessor: "point",
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
          <div
            className="content mt-1"
            style={{ maxWidth: "1700px", width: "100%" }}
          >
            <Row>
              <Col md="12">
                <Card>
                  <CardHeader>
                    <h5 className="title">Tài khoản</h5>
                  </CardHeader>
                  <CardBody>
                    <Row className="d-flex justify-content-center">
                      <Form>
                        <Row>
                          <Col md="6">
                            <Table responsive>
                              <tr>
                                <th md="1">Họ và tên:</th>
                                <td md="7">{selectedAccount.fullname}</td>
                              </tr>

                              
                              <tr>
                                <th md="1">Số điện thoại:</th>
                                <td md="7">{selectedAccount.phone_number}</td>
                              </tr>

                              <tr>
                                <th md="1">Ngày sinh:</th>
                                <td md="7">
                                  <Moment format="DD/MM/YYYY">
                                    {selectedAccount.date_of_birth}
                                  </Moment>
                                </td>
                              </tr>

                              <tr>
                                <th md="1">Giới tính:</th>
                                <td md="7">
                                  {gender[selectedAccount.gender]}
                                </td>
                              </tr>
                            </Table>
                          </Col>

                          <Col md="6">
                            <Table responsive>
                            <tr>
                                <th md="1">Số dư tài khoản:</th>
                                <td md="7">{selectedAccount.balance.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</td>
                              </tr>

                              <tr>
                                <th md="1">Điểm:</th>
                                <td md="7">{selectedAccount.point}</td>
                              </tr>
                              
                            </Table>
                          </Col>
                        </Row>

                        <div className="d-flex justify-content-center">
                        <Button
                            className="mr-2"
                            color="warning"
                            onClick={handleTopUpButtonClick}
                          >
                            Nạp tiền
                          </Button>

                          <Button
                            className="ml-2 mr-2"
                            color="primary"
                            onClick={handleUpdateButtonClick}
                          >
                            Cập nhật
                          </Button>

                          <Button
                            className="ml-2"
                            color="danger"
                            onClick={closeDetailScreen}
                          >
                            Đóng
                          </Button>
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
            <ModalHeader>Cập nhật thông tin</ModalHeader>
            <ModalBody>
              <Row>
                <Col xs={12} md={12}>
                  <div className="content mt-1">
                    <Row>
                      <Col md="12">
                        <Form
                            onSubmit={handleUpdateSubmit}
                          className="form-horizontal"
                          method="get"
                        >
                          <Row>
                            <Label sm="2">Họ và tên:</Label>
                            <Col sm="7" md="7">
                              <FormGroup className="">
                                <Input
                                    defaultValue={selectedAccount.fullname}
                                  placeholder="fullname"
                                  type="text"
                                  name={"fullname"}
                                />
                              </FormGroup>
                            </Col>
                          </Row>

                          <Row>
                            <Label sm="2">Ngày sinh:</Label>
                            <Col sm="7" md="7">
                              <FormGroup className="">
                              <Datetime
                                          timeFormat={false}
                                          utc={true}
                                          dateFormat="DD/MM/YYYY"
                                          inputProps={{ placeholder: "Datetime Picker" }}
                                          name="date_of_birth"
                                          onChange={handleChangeDOB}
                                          value={dobDateSelected}
                                        />
                              </FormGroup>
                            </Col>
                          </Row>   


                          <Row>
                            <Label sm="2">Số điện thoại:</Label>
                            <Col sm="7" md="7">
                              <FormGroup className="">
                                <Input
                                    defaultValue={selectedAccount.phone_number}
                                  placeholder="phonenumber"
                                  type="text"
                                  name={"phone_number"}
                                />
                              </FormGroup>
                            </Col>
                          </Row>

                          <Row>
                            <Col sm="12">
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


          <Modal
            isOpen={isOpenTopUp}
            size="lg"
            style={{ maxWidth: "800px", width: "100%" }}
          >
            <ModalHeader>Nạp tiền vào tài khoản:</ModalHeader>
            <ModalBody>
              <Row>
                <Col xs={12} md={12}>
                  <div className="content mt-1">
                    <Row>
                      <Col md="12">
                        <Form
                            onSubmit={handleTopUpSubmit}
                          className="form-horizontal"
                          method="get"
                        >
                          <Row>
                            <Label sm="2">Số tiền:</Label>
                            <Col sm="7" md="7">
                              <FormGroup className="">
                                <Input
                                  placeholder="Số tiền cần nạp"
                                  type="text"
                                  name={"topUp"}
                                  onChange={handleChange}
                                />
                              </FormGroup>
                            </Col>
                          </Row>

                          <Row>
                            <Col sm="12">
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
                                  onClick={closeTopUpModal}
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

export default ListAccountsScreen;
