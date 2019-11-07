import { createCollection, getThumbnailLink } from "../../actions/pageActions";
import NewCollectionPage from "../../components/NewCollectionPage";

import { connect } from "react-redux";

function mapStateToProps(state) {
  return {
    collectiondata: state.collectiondata,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createCollection: (col_title, col_description, col_uuid, gmail_id) => 
        dispatch( createCollection(col_title, col_description, col_uuid, gmail_id) ),
    getThumbnailLink: (fileId, accessToken) => 
        dispatch( getThumbnailLink(fileId, accessToken) ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewCollectionPage);