import { getSearchData, registerFile, getStrand } from "../../actions/pageActions";
import CommunityPage from "../../components/CommunityPage";

import { connect } from "react-redux";

function mapStateToProps(state) {
  return {
    searchdata: state.searchdata
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getSearchData: (keyword, option, community_id) => dispatch( getSearchData(keyword, option, community_id) ),
    registerFile: upload_file_info => dispatch( registerFile(upload_file_info) ),
    getStrand: (selected_subject_triggerword, selected_grade_triggerword) => 
        dispatch( getStrand(selected_subject_triggerword, selected_grade_triggerword) ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CommunityPage);