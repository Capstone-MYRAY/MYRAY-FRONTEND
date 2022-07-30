import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
// reactstrap components
import {
  Badge,
  Button,
  Card,
  CardHeader,
  CardBody,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
  Form,
  Input,
  ListGroupItem,
  ListGroup,
  Media,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
  UncontrolledTooltip,
  CardFooter,
} from "reactstrap";

import PanelHeader from "components/PanelHeader/PanelHeader.js";
import statisticApi from "api/statisticApi";
import { statisticState } from "state/statisticState";

function DashboardScreen() {
  const [statisticResult, setStatisticResult] = useRecoilState(statisticState);
  //-----------------------------Call API to get StatisticResult, then set to StatisticResult state
  useEffect(() => {
    const fetchStatisticResult = async () => {
      try {
        //StatisticResult
        const response = await statisticApi.getStatistic();
        setStatisticResult(response.data);
        console.log("Success to fetch StatisticResult. ", response.data);
      } catch (err) {
        console.log("Failed to fetch StatisticResult. ", err);
      }
    };

    fetchStatisticResult();
  }, []);

  const fetchStatisticResult = async () => {
      try {
        //StatisticResult
        const response = await statisticApi.getStatistic();
        setStatisticResult(response.data);
        console.log("Success to fetch StatisticResult. ", response.data);
      } catch (err) {
        console.log("Failed to fetch StatisticResult. ", err);
      }
    }
  return (
    <>
      <PanelHeader size="sm" />
      <Container className="mt--6" fluid>
        <Row>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <CardBody>
                <div className="statistics statistics-horizontal">
                  <div className="info info-horizontal">
                    <Row>
                      <Col xs="5">
                        <div className="icon icon-primary icon-circle">
                          <i className="now-ui-icons business_money-coins" />
                        </div>
                      </Col>
                      <Col className="text-right" xs="7">
                      <h6 className="stats-title">Tổng tiền thu được</h6>
                        <h3 className="info-title">{new Intl.NumberFormat( 'en-US', { maximumFractionDigits: 1,notation: "compact" , compactDisplay: "short" }).format(statisticResult.total_money)} <span>VND</span></h3>
                      </Col>
                    </Row>
                  </div>
                </div>
              </CardBody>
              <hr />
              <CardFooter>
                <div className="stats" onClick={fetchStatisticResult}>
                  <i className="now-ui-icons arrows-1_refresh-69" />
                  Update now
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <CardBody>
                <div className="statistics statistics-horizontal">
                  <div className="info info-horizontal">
                    <Row>
                      <Col xs="5">
                        <div className="icon icon-warning icon-circle">
                          <i className="now-ui-icons files_paper" />
                        </div>
                      </Col>
                      <Col className="text-right" xs="7">
                      <h6 className="stats-title">Bài đăng</h6>
                        <h3 className="info-title">{new Intl.NumberFormat( 'en-US', { maximumFractionDigits: 1,notation: "compact" , compactDisplay: "short" }).format(statisticResult.total_job_post)}</h3>
                      </Col>
                    </Row>
                  </div>
                </div>
              </CardBody>
              <hr />
              <CardFooter>
              <div className="stats" onClick={fetchStatisticResult}>
                  <i className="now-ui-icons arrows-1_refresh-69" />
                  Update now
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <CardBody>
                <div className="statistics statistics-horizontal">
                  <div className="info info-horizontal">
                    <Row>
                      <Col xs="5">
                        <div className="icon icon-danger icon-circle">
                          <i className="now-ui-icons users_single-02" />
                        </div>
                      </Col>
                      <Col className="text-right" xs="7">
                      <h6 className="stats-title">Chủ đất</h6>
                        <h3 className="info-title">{new Intl.NumberFormat( 'en-US', { maximumFractionDigits: 1,notation: "compact" , compactDisplay: "short" }).format(statisticResult.total_landowner)}</h3>
                      </Col>
                    </Row>
                  </div>
                </div>
              </CardBody>
              <hr />
              <CardFooter>
              <div className="stats" onClick={fetchStatisticResult}>
                  <i className="now-ui-icons arrows-1_refresh-69" />
                  Update now
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <CardBody>
                <div className="statistics statistics-horizontal">
                  <div className="info info-horizontal">
                    <Row>
                      <Col xs="5">
                        <div className="icon icon-info icon-circle">
                          <i className="now-ui-icons users_single-02" />
                        </div>
                      </Col>
                      <Col className="text-right" xs="7">
                      <h6 className="stats-title">Nông dân</h6>
                        <h3 className="info-title">{new Intl.NumberFormat( 'en-US', { maximumFractionDigits: 1,notation: "compact" , compactDisplay: "short" }).format(statisticResult.total_farmer)}</h3>
                      </Col>
                    </Row>
                  </div>
                </div>
              </CardBody>
              <hr />
              <CardFooter>
              <div className="stats" onClick={fetchStatisticResult}>
                  <i className="now-ui-icons arrows-1_refresh-69" />
                  Update now
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default DashboardScreen;
