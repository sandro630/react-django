import React, { Component } from "react";
import { GoogleLogout } from "react-google-login";

import gapi from "gapi-client";

// const CLIENT_ID = "955570269964-oh0iqqd210p35g3ms21qni9pdocess6v.apps.googleusercontent.com";
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

class GoogleLogoutButton extends Component {
  componentWillMount() {
    gapi.load("auth2", () => {
      this.auth2 = gapi.auth2.init({
        client_id: CLIENT_ID
      });
    });
  }

  render() {
    const signOut = dispatch => {
      var auth2 = gapi.auth2.getAuthInstance();
      auth2
        .signOut()
        .then(() => {
          console.log("User signed out.");
          localStorage.removeItem("goog_avatar_url");
          localStorage.removeItem("goog_name");
          localStorage.removeItem("goog_email");
          localStorage.removeItem("GmailID");
          localStorage.removeItem("isRegistered");
          localStorage.removeItem("access_token");
        })
        .then(() => this.props.googleLogoutAction())
        .then(() => this.props.history.push("/"));
    };
    return (
      <GoogleLogout
        buttonText="Log Out"
        onLogoutSuccess={signOut}
        className="btn-logout"
      />
    );
  }
}

export default GoogleLogoutButton;
