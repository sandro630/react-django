import { connect } from "react-redux";

import EditProfile from "../components/EditProfile";

const mapStateToProps = state => ({
    cordata: state.cordata,
});

export default connect(mapStateToProps)(EditProfile);
