import { connect } from "react-redux";

import Upload from "../components/Upload";

const mapStateToProps = state => ({
  goog_auth: state.goog_auth,
  github_auth: state.github_auth
});

export default connect(mapStateToProps)(Upload);
