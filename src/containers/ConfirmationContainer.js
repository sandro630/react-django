import { connect } from "react-redux";

import Confirmation from "../components/Confirmation";

const mapStateToProps = state => ({
  goog_auth: state.goog_auth,
  github_auth: state.github_auth
});

export default connect(mapStateToProps)(Confirmation);
