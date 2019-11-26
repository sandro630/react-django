import { connect } from "react-redux";


import { getMyData, removeDocOnFind } from "../../actions/pageActions";
import ConfirmationPage from "../../components/ConfirmationPage";


function mapStateToProps(state) {
  return {
    searchdata: state.searchdata
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getMyData: () => dispatch( getMyData() ),
    removeDocOnFind: (doc_id) => dispatch( removeDocOnFind(doc_id) )
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmationPage);