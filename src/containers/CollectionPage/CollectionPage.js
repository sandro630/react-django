import { getCollectionData, searchCollection, removeCollection, removeSharedCollection } from "../../actions/pageActions";
import CollectionPage from "../../components/CollectionPage";

import { connect } from "react-redux";

function mapStateToProps(state) {
  return {
    searchdata: state.searchdata
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getCollectionData: () => dispatch( getCollectionData() ),
    searchCollection: (keyword) => dispatch( searchCollection(keyword) ),
    removeCollection: (col_id) => dispatch( removeCollection(col_id) ),
    removeSharedCollection: (col_id) => dispatch( removeSharedCollection(col_id) ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionPage);