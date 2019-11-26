import { connect } from "react-redux";

import NewCollection from "../components/NewCollection";

const mapStateToProps = (state) => {
return {
  goog_auth: state.goog_auth,
  github_auth: state.github_auth,
}};

export default connect(mapStateToProps)(NewCollection);
