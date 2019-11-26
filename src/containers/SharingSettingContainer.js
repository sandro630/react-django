import { connect } from "react-redux";

import SharingSetting from "../components/SharingSetting";

const mapStateToProps = state => ({
    cordata: state.cordata,
});

export default connect(mapStateToProps)(SharingSetting);
