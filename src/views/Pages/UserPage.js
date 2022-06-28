import React from "react";
// reactstrap components
import {
  Card, CardBody, CardHeader, Col,
  Form, FormGroup, Input, Row
} from "reactstrap";



function User() {
  return (
    <>
      <div className="content">
        <Row>
          <Col md="9">
            <Card>
              <CardHeader>
                <h5 className="title">Edit Profile</h5>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row>
                  <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>Full Name</label>
                        <Input
                          defaultValue="NBT"
                          placeholder="Fullname"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col className="px-1" md="1">
                      <FormGroup>
                        <label>Class Of</label>
                        <Input
                          defaultValue="14"
                          placeholder="ClassOf"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-1" md="5">
                      <FormGroup>
                      <label>Major</label>
                        <Input placeholder="Major" type="text" />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                      <label htmlFor="exampleInputEmail1">
                          Email
                          </label>
                        <Input
                          defaultValue="Mike"
                          placeholder="Company"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-1" md="6">
                      <FormGroup>
                        <label>Day of Birth</label>
                        <Input
                          defaultValue="Date time picker"
                          placeholder="DOB"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Address</label>
                        <Input
                          defaultValue="Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09"
                          placeholder="Home Address"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>Job</label>
                        <Input
                          defaultValue="Dev"
                          placeholder="Job"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col className="px-1" md="6">
                      <FormGroup>
                        <label>Company</label>
                        <Input
                          defaultValue="Company Picker"
                          placeholder="Company"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>About Me</label>
                        <Input
                          cols="80"
                          defaultValue="Lamborghini Mercy, Your chick she so thirsty, I'm in
                            that two seat Lambo."
                          placeholder="Here can be your description"
                          rows="4"
                          type="textarea"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
          <Col md="3">
            <Card className="card-user">
              <CardBody>
                <div className="d-flex justify-content-center">
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    <img
                      alt="..."
                      className="avatar border-gray mt-5 "
                      src={require("assets/img/default-avatar.png").default}
                    />
                  </a>
                </div>
                <p className="description text-center mt-5">
                  {'"'}Software Engineering K5 {'"'}
                </p>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default User;
