// core components
import PanelHeader from "components/PanelHeader/PanelHeader.js";
import "moment-timezone";
import React, { useEffect, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
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
import { guidepostContentState, listGuidePostState } from "state/guidePostState";
import { useRecoilState } from "recoil";
import guidePostApi from "api/guidePostApi";

function ListGuidePostsScreen() {
  const [guidepostContent, setGuidepostContent] = useRecoilState(
    guidepostContentState
  );
  const [listGuidePosts, setListGuidePosts] = useRecoilState(
    listGuidePostState
  );
  const [filtersParams, setFiltersParams] = useState({
    page: 1,
    "page-size": 20,
  });

  const clearForm = (e) => {
    e.target.title.value = "";
    setGuidepostContent("<p>Nhập nội dung ở đây!</p>");
  }

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    const createGuidepost = {
        title: e.target.title.value,
        content: guidepostContent,
    }

    console.log("🚀 ~ file: createGuidepost", createGuidepost);

    try {
        const response = await guidePostApi.post(createGuidepost);
        console.log("🚀 ~ file: ListReportsScreen ~ handleSubmit ~ response", response);
  
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

  return (
    <>
      <PanelHeader size="sm" />
      {/* <TinyMceEditor/> */}
      <div className="App">
        {/* <h2>Using CKEditor 5 build in React</h2> */}

        <Form
          onSubmit={handleCreateSubmit}
          className="form-horizontal"
          method="get"
        >
          <Row>
            <Label sm="2">Tiêu đề:</Label>
            <Col sm="7" md="7">
              <FormGroup className="">
                <Input placeholder="title" type="text" name={"title"} />
              </FormGroup>
            </Col>
          </Row>

          <FormGroup className="content">
            <CKEditor
              editor={ClassicEditor}
              /* config={editorConfiguration} */
              data={guidepostContent}
              onInit={(editor) => {
                // You can store the "editor" and use when it is needed.
                console.log("Editor is ready to use!", editor);
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                console.log({ event, editor, data });
                setGuidepostContent(data);
              }}
              onBlur={(event, editor) => {
                console.log("Blur.", editor);
              }}
              onFocus={(event, editor) => {
                console.log("Focus.", editor);
              }}
            />
          </FormGroup>
          <Button type="submit" className="mr-2" color="primary">
            Tạo
          </Button>
        </Form>
      </div>
    </>
  );
}

export default ListGuidePostsScreen;
