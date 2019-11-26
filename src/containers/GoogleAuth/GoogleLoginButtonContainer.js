import { convertGoogleToken } from "../../actions/googleAuthActions";
import GoogleLoginButton from "../../components/GoogleAuth/GoogleLoginButton";

import { connect } from "react-redux";

const mapDispatchToProps = dispatch => ({
  convertGoogleToken: (access_token, nextPage) => dispatch(convertGoogleToken(access_token, nextPage))
});

export default connect(null, mapDispatchToProps)(GoogleLoginButton);
