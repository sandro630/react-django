import { connect } from "react-redux";

import AddEmail from "../components/AddEmail";

const mapStateToProps = state => ({
    cordata: state.cordata,
});

export default connect(mapStateToProps)(AddEmail);
