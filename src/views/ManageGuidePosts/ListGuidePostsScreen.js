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
} from "reactstrap";
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
    } catch (err) {
      console.log("Failed to fetch list guidepost. ", err);
    }
  };

  //Press "Them moi loai tin button"
  const clearFormForCreate = (e) => {
    setSelectedGuidepost(null);
    setIsCreate(true);
    setGuidepostContent("");
  };

  //Handle edit button
  const editPostType = (guidePost) => {
    setGuidepostContent(guidePost.content);
    setSelectedGuidepost(guidePost);
    setIsCreate(false);
    console.log(
      "🚀 ~ file: List guidePost.js ~ guidePost",
      selectedGuidePost
    );
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

      alert(`Delete successfully!`);
    } catch (err) {
      alert(`Failed to delete guidepost ${err}`);
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
    
          alert(`Create successfully!`);
       
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
        alert(`Update successfully!`);
      }

      try {
        fetchListGuidepost(filtersParams);
        clearFormForCreate(e);
      } catch (err) {
        console.log("Failed to fetch list guidepost. ", err);
      }
    } catch (err) {
      if (isCreate) {
        alert(`Failed to create guidepost ${err}`);
      } else {
        alert(`Failed to update guidepost ${err}`);
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

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    const createGuidepost = {
      title: e.target.title.value,
      content: guidepostContent,
    };

    console.log("🚀 ~ file: createGuidepost", createGuidepost);

    try {
      const response = await guidePostApi.post(createGuidepost);
      console.log(
        "🚀 ~ file: ListReportsScreen ~ handleSubmit ~ response",
        response
      );

      try {
        const response = await guidePostApi.getAll(filtersParams);
        setListGuidePosts(response.data.list_object);
        console.log(
          "Success to fetch list guidePost. ",
          response.data.list_object
        );
      } catch (err) {
        console.log("Failed to fetch list guidePost. ", err);
      }

      alert(`Create successfully!`);
    } catch (err) {
      alert(`Failed to update guidePost ${err}`);
    }
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
            onClick={deleteguidepost.bind(this, prop)}
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
                        <Col xs={6} md={6}>
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
                                  <Col md="12">
                                    <FormGroup>
                                    <Row>
                                      <Label className="font-weight-bold">
                                        Tiêu đề
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
                                        Nội dung
                                      </Label>
                                    </Row>
                                    <Row className="content mt-1">
                                        <CKEditor
                                          editor={ClassicEditor}
                                          /* config={editorConfiguration} */
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
                            <div className="d-flex justify-content-center">
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

export default ListGuidePostsScreen;
