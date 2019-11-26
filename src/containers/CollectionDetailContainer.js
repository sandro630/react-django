import { connect } from "react-redux";

import CollectionDetail from "../components/CollectionDetail";

const mapStateToProps = (state, ownProps) => {
return {
  goog_auth: state.goog_auth,
  github_auth: state.github_auth,
  collection_id: ownProps.match.params.collection_id
}};

export default connect(mapStateToProps)(CollectionDetail);
