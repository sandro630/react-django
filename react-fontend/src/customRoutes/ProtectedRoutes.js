import { Route, Redirect } from "react-router-dom";
import React from "react";

const checkAuth = () => {
//   const goog_token = localStorage.getItem("goog_access_token_conv");
//   const github_token = localStorage.getItem("github_access_token_conv");
//   if (!goog_token && !github_token) {
//     return false;
//   }
//   return true;
    const GmailID = localStorage.getItem("GmailID");
    const isRegistered = localStorage.getItem("isRegistered");
    if (GmailID && ( isRegistered === "true")) {
        return true;
    } else  {
        return false;
    }
};
// const checkAuth = () => {
//     const goog_token = localStorage.getItem("goog_access_token_conv");
//     const github_token = localStorage.getItem("github_access_token_conv");
//     if (!goog_token && !github_token) {
//       return false;
//     }
//     return true;
// };
//If there is a google/github token in localStorage let them access /secret
const PrivateRoute = ({ component: Component, community, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
        // console.log(localStorage.getItem("GmailID"));
        // console.log(localStorage.getItem("isRegistered"));
        // switch( checkAuth() ) {
        //     case "/": return (<Redirect to={{ pathname: "/" }} />);
        //     // case "/more_info": return (<Redirect to={{ pathname: "/more_info" }} />);
        //     default: return (<Component {...props} />);
        // }
          return checkAuth() ? (
            <Component {...props} />
          ) : (
            <Redirect to={{ pathname: "/" }} />
          );
    }}
        
  />
);

export { PrivateRoute };
