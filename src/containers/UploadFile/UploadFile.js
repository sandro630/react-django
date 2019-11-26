import { getCorData, registerFile, getStrand, getStandard } from "../../actions/pageActions";
import UploadFile from "../../components/UploadFile";

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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadFile);