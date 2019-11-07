import React from "react";
import { withRouter } from "react-router-dom";

import GoogleLoginButton from "../../containers/GoogleAuth/GoogleLoginButtonContainer.js";
import GoogleLogoutButton from "../../containers/GoogleAuth/GoogleLogoutButtonContainer.js";
import MoreInfo from "../../containers/MoreInfo/MoreInfoContainer";

import "../../css/login.css";

function Signin(props) {
  function userIsAuthenticatedGoogle() {
    if (props.goog_auth.isAuthenticated) {
      return [
        <li className="nav-item" key="goog-logout-btn">
          <GoogleLogoutButton history={props.history} />
        </li>
      ];
    }
  }
  function userIsNotAuthenticated() {
    if (!props.goog_auth.isAuthenticated) {
      return [
        <li className="nav-item" key="goog-login-btn">
          <GoogleLoginButton nextPage="/home" history={props.history} />
        </li>
      ];
    }
  }
  function userIsAuthenticated() {
    if ( (localStorage.getItem("GmailID") && localStorage.getItem("isRegistered") === "false") ) {
      return (
        <MoreInfo nextPage="/home" />
      );
    } else {
        return (
        <div className="container h-100 pt-9">
            <div className="login row w-32 mx-auto h-75">
                <div className="col-12 text-center px-0">
                    <div className="login-logo mb-3">
                    <img
                        className="login-logo__image"
                        src="/static/images/coteacher-logo.jpg"
                    />
                    </div>
                    <p className="login-info mx-auto mb-4">
                    Save time and enjoy teaching more by sharing lesson plans and
                    materials with amazing educators just like you.
                    </p>

                    <div className="login-profile mb-4">
                    <img className="login-profile__pic" src="/static/images/Profile icon.svg" />
                    </div>
                    <div className="buttons">
                        <ul className="navbar-nav ">
                            {userIsAuthenticatedGoogle()}
                            {/* {userIsAuthenticategGithub()} */}
                            {userIsNotAuthenticated()}
                            {/* {userIsAuthenticated()} */}
                        </ul>
                    </div>
                </div>
            </div>
        </div>);
    }
  }

//   function userIsAuthenticategGithub() {
//     if (props.github_auth.isAuthenticated) {
//       return [
//         <li className="nav-item mr-3" key="git-logout-btn">
//           <GithubLogoutButton history={props.history} />
//         </li>
//       ];
//     }
//   }

  return (
      <div>
          {userIsAuthenticated()}
      </div>
  );
}

export default withRouter(Signin);
