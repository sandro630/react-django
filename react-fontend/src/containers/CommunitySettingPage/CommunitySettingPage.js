import { getUsersPerCommunity, getCommunities, saveCommunitySetting } from "../../actions/pageActions";
import CommunitySettingPage from "../../components/CommunitySettingPage";

import { connect } from "react-redux";

function mapStateToProps(state) {
  return {
    cordata: state.cordata
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getUsersPerCommunity: (communityID) => dispatch( getUsersPerCommunity(communityID) ),
    getCommunities: () => dispatch( getCommunities() ),
    saveCommunitySetting: (users, communityID) => dispatch( saveCommunitySetting(users, communityID) ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CommunitySettingPage);