import { getProfileData, updateProfile, getSchoolSuggestions } from "../../actions/pageActions";
import EditProfilePage from "../../components/EditProfilePage";

import { connect } from "react-redux";

function mapStateToProps(state) {
  return {
    basedata: state.basedata
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getProfileData: () => dispatch(getProfileData()),
    updateProfile: (register_info) => dispatch(updateProfile(register_info)),
    getSchoolSuggestions: (inputLength, inputValue) => dispatch( getSchoolSuggestions(inputLength, inputValue) ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProfilePage);
