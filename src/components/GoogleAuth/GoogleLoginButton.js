import React from "react";
import { GoogleLogin } from "react-google-login";

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
// const CLIENT_ID = "955570269964-oh0iqqd210p35g3ms21qni9pdocess6v.apps.googleusercontent.com";

const GoogleLoginButton = props => {
  const responseGoogleSuccess = response => {
      console.log(response);
    if (response.profileObj) {
      localStorage.setItem("goog_avatar_url", response.profileObj.imageUrl);
      localStorage.setItem("goog_name", response.profileObj.name);
      localStorage.setItem("goog_email", response.profileObj.email);
      localStorage.setItem("access_token", response.Zi.access_token);
    }
    props.convertGoogleToken(response.profileObj.googleId, props.nextPage);
  };
  const responseGoogleFailure = response => {
    console.log(response);
  };

  return (
    <GoogleLogin
      clientId={CLIENT_ID}
      responseType="code"
      buttonText="Sign in with Google"
      scope='https://www.googleapis.com/auth/drive'
      onSuccess={responseGoogleSuccess}
      onFailure={responseGoogleFailure}
      className="loginBtn loginBtn--google"
      prompt="consent"
      redirectUri="http://localhost:3000/home/"
    //  redirectUri="http://coteacherv1.eastus.cloudapp.azure.com/home/"
    />
  );
};

export default GoogleLoginButton;
