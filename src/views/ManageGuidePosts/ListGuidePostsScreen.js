// core components
import PanelHeader from "components/PanelHeader/PanelHeader.js";
import ReactTable from "components/ReactTable/ReactTable.js";
import "moment-timezone";
import momentjs from "moment";
import React, { useEffect, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
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
import {
  guidepostContentState,
  listGuidePostState,
} from "state/guidePostState";
import guidePostApi from "api/guidePostApi";

function ListGuidePostsScreen() {
  //TreeType state
  const [guidepostList, setListGuidepost] = useRecoilState(listGuidePostState);
  const [selectedGuidePost, setSelectedGuidepost] = useState({});
  const [isCreate, setIsCreate] = useState(true);
  const [titleInput, setTitleInput] = useState("");

  const [filtersParams, setFiltersParams] = useState({
    page: 1,
    "page-size": 20,
  });

  //Guidepost state
  //-----------------------------Call API to get list Guidepost, then set to Guidepost state
  useEffect(() => {
    const fetchListGuidepost = async () => {
      try {
        //Guidepost
        const response = await guidePostApi.getAll(filtersParams);
        setListGuidepost(response.data.list_object);
        //Pagination
      let total_page = response.data.paging_metadata.total_pages;
      setPageOptions([...Array(total_page).keys()]);
      setCanNextPage(response.data.paging_metadata.has_next_page);
      setCanPreviousPage(response.data.paging_metadata.has_previous_page);
      setPageIndex(response.data.paging_metadata.page_index);
      } catch (err) {
        console.log("Failed to fetch list Guidepost. ", err);
      }
    };
    fetchListGuidepost();
  }, []);

  const fetchListGuidepost = async (filters) => {
    try {
      //Post Type
      const response = await guidePostApi.getAll(filters);
      response.data
        ? setListGuidepost(response.data.list_object)
        : setListGuidepost([]);
        //Pagination
      let total_page = response.data.paging_metadata.total_pages;
      setPageOptions([...Array(total_page).keys()]);
      setCanNextPage(response.data.paging_metadata.has_next_page);
      setCanPreviousPage(response.data.paging_metadata.has_previous_page);
      setPageIndex(response.data.paging_metadata.page_index);
    } catch (err) {
      console.log("Failed to fetch list guidepost. ", err);
    }
  };

  //Press "Them moi loai tin button"
  const clearFormForCreate = (e) => {
    setSelectedGuidepost(null);
    setIsCreate(true);
    setGuidepostContent("");
    setTitleInput("");
  };

  //Handle edit button
  const editPostType = (guidePost) => {
    setGuidepostContent(guidePost.content);
    setSelectedGuidepost(guidePost);
    setTitleInput(guidePost.title);
    setIsCreate(false);
    console.log(
      "🚀 ~ file: List guidePost.js ~ guidePost",
      selectedGuidePost
    );
  };

  const handleDeleteButton = async (guidepost) => {
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
        deleteguidepost(guidepost);
      }
    })
  };



  //Handle delete button
  const deleteguidepost = async (guidepost) => {
    setSelectedGuidepost(guidepost);
    try {
      const response = await guidePostApi.delete(guidepost.id);
      console.log(
        "🚀 ~ file: List guidepost.js ~ line 197 ~ handleSubmit ~ response",
        response
      );

      try {
        fetchListGuidepost(filtersParams);
      } catch (err) {
        console.log("Failed to fetch list guidepost. ", err);
      }

      Swal.fire({  
        icon: 'success',
        title: 'Thành công',  
        text: 'Xóa thành công!',  
      });
    } catch (err) {
      console.log(`Failed to delete guidepost ${err}`);
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
          title: e.target.title.value,
          content: guidepostContent,
        };
    
        console.log("🚀 ~ file: createGuidepost", postTypeObj);
    
      
          const response = await guidePostApi.post(postTypeObj);
          console.log(
            "🚀 ~ file: ListReportsScreen ~ handleSubmit ~ response",
            response
          );
    
          Swal.fire({  
            icon: 'success',
            title: 'Thành công',  
            text: 'Tạo mới thành công!',  
          });
            
      } else {
        postTypeObj = {
          id: selectedGuidePost ? selectedGuidePost.id : null,
          title: e.target.title.value,
          content: guidepostContent,
        };

        const responseUpdate = await guidePostApi.put(postTypeObj);
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
        fetchListGuidepost(filtersParams);
        clearFormForCreate(e);
      } catch (err) {
        console.log("Failed to fetch list guidepost. ", err);
      }
    } catch (err) {
      if (isCreate) {
        Swal.fire({  
          icon: 'error',
          title: 'Lỗi',  
          text: 'Tạo mới không thành công!',  
        });
      } else {
        Swal.fire({  
          icon: 'error',
          title: 'Lỗi',  
          text: 'Cập nhật không thành công!',  
        });
      }
    }
  };

  const [guidepostContent, setGuidepostContent] = useRecoilState(
    guidepostContentState
  );
  const [listGuidePosts, setListGuidePosts] =
    useRecoilState(listGuidePostState);

  const clearForm = (e) => {
    e.target.title.value = "";
    setGuidepostContent("<p>Nhập nội dung ở đây!</p>");
  };

  const dataState = guidepostList.map((prop, key) => {
    key = prop.id;
    return {
      id: key,
      title: prop.title,
      content: prop.content,
      create_by: prop.create_by,
      create_date: momentjs(prop.created_date).format("HH:mm - DD/MM/YYYY"),
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
            onClick={handleDeleteButton.bind(this, prop)}
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

  const btnStyle = { width: "max-content" };

  const ckStyle = { width: "100%", };

  const editorConfiguration = {
    toolbar: {
      items: [
        'heading',
        '|',
        'fontSize',
        'fontFamily',
        '|',
        'bold',
        'italic',
        '|',
        'alignment',
        '|',
        'numberedList',
        'bulletedList',
        '|',
        'link',
        'blockQuote',
        'insertTable',
        'mediaEmbed',
        '|',
        'placeholder',
      ],
    },
    image: {
      toolbar: ['imageTextAlternative', 'imageStyle:full', 'imageStyle:side'],
    },
    table: {
      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
    },
    placeholderConfig: {
      types: ['Name', 'DOB'],
    },
  };

  
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
    fetchListGuidepost(filtersParams);
  };

  const nextPage = async () => {
    let page = pageIndex + 1;
    filtersParams.page = page;
    fetchListGuidepost(filtersParams);
  };

  const previousPage = async () => {
    let page = pageIndex - 1;
    filtersParams.page = page;
    fetchListGuidepost(filtersParams);
  };

  return (
    <>
      <PanelHeader size="sm" />

      <div className="content mt-1">
        <Row>
          <Col xs={6} md={6}>
            <Card>
              <CardHeader>
                <Row>
                  <Col xs={9} md={9}>
                    <CardTitle tag="h4">Quản lý bài hướng dẫn</CardTitle>
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
                  models="treetype"
                  data={dataState}
                  columns={[
                    {
                      Header: "Tiêu đề",
                      accessor: "title",
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

          <Col xs={6} md={6}>
            {/* DETAILS */}
            <div>
              <Row>
                <Col md="12">
                  <Card>
                    <CardHeader>
                      <Row>
                        <Col>
                          <h5 className="card-title">
                            {isCreate
                              ? "Thêm mới bài hướng dẫn"
                              : "Chỉnh sửa bài hướng dẫn"}
                          </h5>
                        </Col>
                      </Row>
                    </CardHeader>

                    <CardBody>
                      <Row>
                        <Col md="12">
                          <Form onSubmit={handleSubmit}>
                            <Row className="d-flex justify-content-center">
                              <Col md="10">
                                <Row>
                                  <Col lg="12" md={12}>
                                    <FormGroup>
                                    <Row>
                                      <Label className="font-weight-bold">
                                        Tiêu đề <code>*</code>:
                                      </Label>
                                      </Row>
                                      <Input
                                        defaultValue={
                                          selectedGuidePost
                                            ? selectedGuidePost.title
                                            : ""
                                        }
                                        className="ml-3"
                                        placeholder="Hãy nhập tiêu đề"
                                        type="text"
                                        name={"title"}
                                      />
                                    </FormGroup>
                                  </Col>
                                </Row>

                                <Row>
                                  <Col md="12">
                                  <FormGroup >
                                    <Row>
                                      <Label className="font-weight-bold">
                                        Nội dung <code>*</code>:
                                      </Label>
                                    </Row>
                                    <Row className="content mt-1" style={ckStyle}>
                                        <CKEditor
                                          // style={ckStyle}
                                          editor={ClassicEditor}
                                          config={editorConfiguration} 
                                          data={guidepostContent}
                                          onInit={(editor) => {
                                            // You can store the "editor" and use when it is needed.
                                            console.log(
                                              "Editor is ready to use!",
                                              editor
                                            );
                                          }}
                                          onChange={(event, editor) => {
                                            const data = editor.getData();
                                            console.log({
                                              event,
                                              editor,
                                              data,
                                            });
                                            setGuidepostContent(data);
                                          }}
                                          onBlur={(event, editor) => {
                                            console.log("Blur.", editor);
                                          }}
                                          onFocus={(event, editor) => {
                                            console.log("Focus.", editor);
                                          }}
                                        />
                                    </Row>
                                    </FormGroup>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            {/* <div className="d-flex justify-content-center"> */}
                              <Row>
                                <Col md="12">
                                  <Button
                                    type="submit"
                                    color="primary"
                                  >
                                    {isCreate ? "Tạo" : "Cập nhật"}
                                  </Button>
                                </Col>
                              </Row>
                            {/* </div> */}
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

export default ListGuidePostsScreen;
