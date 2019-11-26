import { 
    getCollectionDetail, 
    shareCollection, 
    getCollectionDetailFromUUID, 
    changeColTitle, 
    getThumbnailLink,
    removeDoc 
} from "../../actions/pageActions";
import CollectionDetailFromLinkPage from "../../components/CollectionDetailFromLinkPage";

import { connect } from "react-redux";

function mapStateToProps(state) {
  return {
    goog_auth: state.goog_auth,
    searchdata: state.searchdata,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getCollectionDetail: (collection_id) => dispatch( getCollectionDetail(collection_id) ),
    shareCollection: (email, collection_id) => dispatch( shareCollection(email, collection_id) ),
    getCollectionDetailFromUUID: (uuid) => 
        dispatch( getCollectionDetailFromUUID(uuid) ),
    changeColTitle: (col_title, col_description, col_id) => dispatch( changeColTitle(col_title, col_description, col_id) ),
    getThumbnailLink: (fileId, accessToken) => 
        dispatch( getThumbnailLink(fileId, accessToken) ),
    removeDoc: (docID, col_id) => 
        dispatch( removeDoc(docID, col_id) ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionDetailFromLinkPage);