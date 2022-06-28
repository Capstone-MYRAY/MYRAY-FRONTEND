import App from 'App';
import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/now-ui-dashboard.scss?v=1.5.0";
import "assets/css/demo.css";
import React from "react";
import ReactDOM from "react-dom";
import {
  RecoilRoot
} from 'recoil';

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
    <App />
    </RecoilRoot>
  </React.StrictMode>
  ,document.getElementById('root')
);
