import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
// reactstrap components
import {
  Badge,
  Button,
  Card,
  CardTitle,
  CardHeader,
  CardBody,
  FormGroup,
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
import Select from "react-select";
import { Line, Bar } from "react-chartjs-2";
import PanelHeader from "components/PanelHeader/PanelHeader.js";
import statisticApi from "api/statisticApi";
import { statisticState, chartDataState } from "state/statisticState";

function DashboardScreen() {
  const dashboardPanelChart = {
    data: (canvas) => {
      const ctx = canvas.getContext("2d");
      var chartColor = "#4F9E1D";
      var gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
      gradientStroke.addColorStop(0, "#80b6f4");
      gradientStroke.addColorStop(1, chartColor);
      var gradientFill = ctx.createLinearGradient(0, 200, 0, 50);
      gradientFill.addColorStop(0, hexToRGB("#4F9E1D", 0.6));
      gradientFill.addColorStop(1, "rgba(255, 255, 255, 0.14)");
  
      return {
        labels: [
          "Tháng 1",
            "Tháng 2",
            "Tháng 3",
            "Tháng 4",
            "Tháng 5",
            "Tháng 6",
            "Tháng 7",
            "Tháng 8",
            "Tháng 9",
            "Tháng 10",
            "Tháng 11",
            "Tháng 12",
        ],
        datasets: [
          {
            label: "Data",
            borderColor: chartColor,
            pointBorderColor: chartColor,
            pointBackgroundColor: "#4F9E1D",
            pointHoverBackgroundColor: "#4F9E1D",
            pointHoverBorderColor: chartColor,
            pointBorderWidth: 1,
            pointHoverRadius: 7,
            pointHoverBorderWidth: 2,
            pointRadius: 5,
            fill: true,
            backgroundColor: gradientFill,
            borderWidth: 2,
            tension: 0.4,
            data: [
              chartData["1"] ? chartData["1"] : 0,
            chartData["2"] ? chartData["2"] : 0,
            chartData["3"] ? chartData["3"] : 0,
            chartData["4"] ? chartData["4"] : 0,
            chartData["5"] ? chartData["5"] : 0,
            chartData["6"] ? chartData["6"] : 0,
            chartData["7"] ? chartData["7"] : 0,
            chartData["8"] ? chartData["8"] : 0,
            chartData["9"] ? chartData["9"] : 0,
            chartData["10"] ? chartData["10"] : 0,
            chartData["11"] ? chartData["11"] : 0,
            chartData["12"] ? chartData["12"] : 0,],
          },
        ],
      };
    },
    options: {
      layout: {
        padding: {
          left: 20,
          right: 20,
          top: 0,
          bottom: 0,
        },
      },
      maintainAspectRatio: false,
      plugins: {
        tooltips: {
          backgroundColor: "#fff",
          titleFontColor: "#333",
          bodyFontColor: "#666",
          bodySpacing: 4,
          xPadding: 12,
          mode: "nearest",
          intersect: 0,
          position: "nearest",
        },
        legend: {
          position: "bottom",
          fillStyle: "#FFF",
          display: false,
        },
      },
      scales: {
        y: {
          ticks: {
            fontColor: "rgba(255,255,255,0.4)",
            fontStyle: "bold",
            beginAtZero: true,
            maxTicksLimit: 5,
            padding: 10,
          },
          grid: {
            drawTicks: true,
            drawBorder: false,
            display: true,
            color: "rgba(0,0,0,0.1)",
            zeroLineColor: "transparent",
          },
        },
        x: {
          grid: {
            display: false,
            color: "rgba(255,255,255,0.1)",
          },
          ticks: {
            padding: 10,
            fontColor: "rgba(255,255,255,0.4)",
            fontStyle: "bold",
          },
        },
      },
    },
  };



  const [statisticResult, setStatisticResult] = useRecoilState(statisticState);
  const [chartData, setChartData] = useRecoilState(chartDataState);
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
    };

    function hexToRGB(hex, alpha) {
      var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);
    
      if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
      } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
      }
    };

    const chartsBar1 = {
      data: (canvas) => {
        var ctx = canvas.getContext("2d");
        var gradientFill = ctx.createLinearGradient(0, 170, 0, 50);
    gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
    gradientFill.addColorStop(1, hexToRGB("#2CA8FF", 0.6));
        return {
          labels: [
            "Tháng 1",
            "Tháng 2",
            "Tháng 3",
            "Tháng 4",
            "Tháng 5",
            "Tháng 6",
            "Tháng 7",
            "Tháng 8",
            "Tháng 9",
            "Tháng 10",
            "Tháng 11",
            "Tháng 12",
          ],
          datasets: [
            {
              label: "Tổng tiền",
              backgroundColor: gradientFill,
              borderColor: "#2CA8FF",
              pointBorderColor: "#FFF",
              pointBackgroundColor: "#2CA8FF",
              pointBorderWidth: 2,
              pointHoverRadius: 4,
              pointHoverBorderWidth: 1,
              pointRadius: 4,
              fill: true,
              borderWidth: 1,
              data: [
                chartData["1"] ? chartData["1"] : 0,
                chartData["2"] ? chartData["2"] : 0,
                chartData["3"] ? chartData["3"] : 0,
                chartData["4"] ? chartData["4"] : 0,
                chartData["5"] ? chartData["5"] : 0,
                chartData["6"] ? chartData["6"] : 0,
                chartData["7"] ? chartData["7"] : 0,
                chartData["8"] ? chartData["8"] : 0,
                chartData["9"] ? chartData["9"] : 0,
                chartData["10"] ? chartData["10"] : 0,
                chartData["11"] ? chartData["11"] : 0,
                chartData["12"] ? chartData["12"] : 0,

              ],
            },
          ],
        };
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltips: {
            bodySpacing: 4,
            mode: "nearest",
            intersect: 0,
            position: "nearest",
            xPadding: 10,
            yPadding: 10,
            caretPadding: 10,
          },
        },
        responsive: 1,
        scales: {
          y: {
            grid: {
              zeroLineColor: "transparent",
              drawBorder: false,
            },
            ticks: {
              maxTicksLimit: 7,
            },
          },
          x: {
            display: 0,
            ticks: {
              display: false,
            },
            grid: {
              zeroLineColor: "transparent",
              drawTicks: false,
              display: false,
              drawBorder: false,
            },
          },
        },
        layout: {
          padding: { left: 0, right: 0, top: 15, bottom: 15 },
        },
      },
    };
    

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
                      <h6 className="stats-title">Tiền thu được</h6>
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
                  Cập nhật
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
                  Cập nhật
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
                  Cập nhật
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
                  Cập nhật
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <Row className="justify-content-center">

        <Col xs={9} md={9}>
            <Card className="card-chart">
              
              <CardHeader>
                {/* <h5 className="card-category">Simple With Grids And Numbers</h5> */}
                <Row>
                <Col xs={8} md={8}>
                <CardTitle tag="h4">BIỂU ĐỒ TỔNG SỐ TIỀN THU ĐƯỢC</CardTitle>
                </Col>
                <Col xs={4} md={4}>
                
                      <FormGroup>
                        <label className="font-weight-bold ml-2">Năm:</label>
                        <Select
                          className="react-select primary"
                          classNamePrefix="react-select"
                          placeholder="Chọn năm"
                          name="status"
                          value={
                            {value: -1,
                            label: "2022",}
                          }
                          // onChange={filtersStatus}
                          options={
                            {value: -1,
                            label: "2022",}
                          }
                        />
                      </FormGroup>
                  
                  </Col>
                  </Row>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  {/* <Bar data={chartsBar1.data} options={chartsBar1.options} /> */}
                  <Line
            data={dashboardPanelChart.data}
            options={dashboardPanelChart.options}
          />
                </div>
              </CardBody>
              <CardFooter>
                <div className="stats">
                 
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
