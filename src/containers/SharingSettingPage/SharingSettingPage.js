import { getCommunity, saveSharingSetting } from "../../actions/pageActions";
import SharingSettingPage from "../../components/SharingSettingPage";

import { connect } from "react-redux";

function mapStateToProps(state) {
  return {
    cordata: state.cordata
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getCommunity: () => dispatch( getCommunity() ),
    saveSharingSetting: (communities) => dispatch( saveSharingSetting(communities) ),
    
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SharingSettingPage);