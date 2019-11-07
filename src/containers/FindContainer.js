import { connect } from "react-redux";

import Find from "../components/Find";

const mapStateToProps = state => ({
  goog_auth: state.goog_auth,
  github_auth: state.github_auth
});

export default connect(mapStateToProps)(Find);
