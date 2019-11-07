import { isAdmin } from "../actions/pageActions";
import { connect } from "react-redux";

import Topbar from "../components/Topbar";

const mapStateToProps = state => ({
  cordata: state.cordata
});

function mapDispatchToProps(dispatch) {
    return {
      isAdmin: () => dispatch( isAdmin() ),
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Topbar);
