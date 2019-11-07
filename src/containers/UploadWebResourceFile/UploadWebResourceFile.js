import { getCorData, registerFile, getStrand, getStandard, getWebThumbnail, getOtherThumbnail } from "../../actions/pageActions";
import UploadWebResourceFile from "../../components/UploadWebResourceFile";

import { connect } from "react-redux";

function mapStateToProps(state) {
  return {
    cordata: state.cordata
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getCorData: () => dispatch( getCorData() ),
    registerFile: upload_file_info => dispatch( registerFile(upload_file_info) ),
    getStrand: (selected_subject_triggerword, selected_grade_triggerword) => 
        dispatch( getStrand(selected_subject_triggerword, selected_grade_triggerword) ),
    getStandard: (selected_subject_triggerword, selected_grade_triggerword, selected_strand) => 
        dispatch( getStandard(selected_subject_triggerword, selected_grade_triggerword, selected_strand) ),
    getWebThumbnail: (url) => dispatch( getWebThumbnail(url) ),
    getOtherThumbnail: (url, r_num) => dispatch( getOtherThumbnail(url, r_num) ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadWebResourceFile);