import { connect } from "react-redux";
import { getThumbnailLink, getMyData, removeDocOnHome } from "../../actions/pageActions";
import MyDrive from "../../components/MyDrive";

const mapStateToProps = state => ({
    searchdata: state.searchdata
});

function mapDispatchToProps(dispatch) {
    return {
        getThumbnailLink: (fileId, accessToken) => 
            dispatch( getThumbnailLink(fileId, accessToken) ),
        getMyData: () => dispatch( getMyData() ),
        removeDocOnHome: (doc_id) => dispatch( removeDocOnHome(doc_id) )
    };
  }

export default connect(mapStateToProps, mapDispatchToProps)(MyDrive);
