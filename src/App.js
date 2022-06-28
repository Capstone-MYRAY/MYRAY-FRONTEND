import 'bootstrap/dist/css/bootstrap.css';
import 'assets/scss/now-ui-dashboard.scss?v=1.5.0';
import 'assets/css/demo.css';

import PrivateRoute from 'components/PrivateRoute';
import AdminLayout from 'layouts/Admin.js';
import ModeratorLayout from 'layouts/Moderator.js';
import AuthLayout from 'layouts/Auth.js';
import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
        <Switch>
          <PrivateRoute
            path='/admin'
            // requiredRoles=["Admin"]
            component={(props) => {
              return <AdminLayout {...props} />;
            }}
          />
          <PrivateRoute
            path='/moderator'
            // requiredRoles=["Moderator"]
            component={(props) => {
              return <ModeratorLayout {...props} />;
            }}
          />
          <Route
            path='/auth'
            component={(props) => {
              return <AuthLayout {...props} />;
            }}
          />
          <Redirect to="/auth" />
        </Switch>
    </BrowserRouter>

  );
}

export default App;
