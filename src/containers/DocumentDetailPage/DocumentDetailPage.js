import { 
    getDocumentDetail, 
    getStrand, 
    getStandard, 
    updateFile,
    getWebThumbnail,
    getOtherThumbnail
} from "../../actions/pageActions";
import DocumentDetailPage from "../../components/DocumentDetailPage";

import { connect } from "react-redux";

function mapStateToProps(state) {
  return {
    cordata: state.cordata,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getDocumentDetail: (document_id) => dispatch( getDocumentDetail(document_id) ),
    getStrand: (selected_subject_triggerword, selected_grade_triggerword) => 
        dispatch( getStrand(selected_subject_triggerword, selected_grade_triggerword) ),
    getStandard: (selected_subject_triggerword, selected_grade_triggerword, selected_strand) => 
        dispatch( getStandard(selected_subject_triggerword, selected_grade_triggerword, selected_strand) ),
    updateFile: upload_file_info => dispatch( updateFile(upload_file_info) ),
    getWebThumbnail: (url) => dispatch( getWebThumbnail(url) ),
    getOtherThumbnail: (url, r_num) => dispatch( getOtherThumbnail(url, r_num) ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentDetailPage);