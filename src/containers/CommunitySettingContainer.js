import { connect } from "react-redux";

import CommunitySetting from "../components/CommunitySetting";

const mapStateToProps = state => ({
    cordata: state.cordata,
});

export default connect(mapStateToProps)(CommunitySetting);
