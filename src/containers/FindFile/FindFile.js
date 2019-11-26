import { getSearchData, removeDocOnFind } from "../../actions/pageActions";
import FindFile from "../../components/FindFile";

import { connect } from "react-redux";

function mapStateToProps(state) {
  return {
    searchdata: state.searchdata
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getSearchData: (keyword, option, community_id) => dispatch( getSearchData(keyword, option, community_id) ),
    removeDocOnFind: (doc_id) => dispatch( removeDocOnFind(doc_id) )
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FindFile);