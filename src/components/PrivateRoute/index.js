import { useRecoilState } from 'recoil';
import { authState } from 'state/authState';
import { Route } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import { Redirect } from 'react-router-dom';

const PrivateRoute = (props) => {
    const [authUser, setAuthUser] = useRecoilState(authState);
    console.log("🚀 ~ file: index.js ~ line 9 ~ PrivateRoute ~ authUser", authUser);
    if (localStorage.getItem('user')) {
        const custom_token = JSON.parse(localStorage.getItem('user'));
        console.log("🚀 ~ file: index.js ~ line 11 ~ PrivateRoute ~ token", custom_token)
        if (custom_token) {
            const backendToken = jwt_decode(custom_token.token);
            console.log("🚀 ~ file: index.js ~ line 13 ~ PrivateRoute ~ backendToken", backendToken)
            if (backendToken.role === "Admin") return <Route {...props} />
    
        }
    }
    
    return <Redirect to="/" />


}

export default PrivateRoute;