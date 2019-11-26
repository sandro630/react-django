import { connect } from "react-redux";

import CollectionDetailFromLink from "../components/CollectionDetailFromLink";

const mapStateToProps = (state, ownProps) => {
return {
    goog_auth: state.goog_auth,
  collection_id: ownProps.match.params.collection_id
}};

export default connect(mapStateToProps)(CollectionDetailFromLink);
