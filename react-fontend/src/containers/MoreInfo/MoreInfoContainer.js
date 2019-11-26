import { getBaseData, register, getSchoolSuggestions } from "../../actions/pageActions";
import MoreInfo from "../../components/MoreInfo";

import { connect } from "react-redux";

function mapStateToProps(state) {
  return {
    basedata: state.basedata
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getBaseData: () => dispatch(getBaseData()),
    register: (register_info, nextPage) => dispatch(register(register_info, nextPage)),
    getSchoolSuggestions: (inputLength, inputValue) => dispatch( getSchoolSuggestions(inputLength, inputValue) ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MoreInfo);
