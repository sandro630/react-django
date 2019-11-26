import { getCommunityName, addEmailToCommunity, uploadCSVFile, downloadFile } from "../../actions/pageActions";
import AddEmailPage from "../../components/AddEmailPage";

import { connect } from "react-redux";

function mapStateToProps(state) {
  return {
    cordata: state.cordata
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getCommunityName: (communityID) => dispatch( getCommunityName(communityID) ),
    addEmailToCommunity: (email, communityID) => dispatch( addEmailToCommunity(email, communityID) ),
    uploadCSVFile: (fileObject, communityID) => dispatch( uploadCSVFile(fileObject, communityID) ),
    downloadFile: (communityID) => dispatch( downloadFile(communityID) ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddEmailPage);