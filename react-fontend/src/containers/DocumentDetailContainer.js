import { connect } from "react-redux";

import DocumentDetail from "../components/DocumentDetail";

const mapStateToProps = (state, ownProps) => {
return {
  goog_auth: state.goog_auth,
  document_id: ownProps.match.params.document_id
}};

export default connect(mapStateToProps)(DocumentDetail);    
