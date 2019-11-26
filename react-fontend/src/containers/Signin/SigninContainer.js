import { connect } from "react-redux";

import Signin from "../../components/Signin/Signin";

const mapStateToProps = state => ({
  goog_auth: state.goog_auth,
  github_auth: state.github_auth
});

export default connect(mapStateToProps)(Signin);
