import React from "react";
import { withRouter } from "react-router-dom";
import GooglePicker from 'react-google-picker';
import Modal from "../CustomComponents/Modal";
import gapi from 'gapi-client';
import { ReactTabulator } from "react-tabulator";
import Spinner from 'react-spinner-material';


import "../../css/main.css";
import "../../css/navigation.css";

// const CLIENT_ID = "955570269964-oh0iqqd210p35g3ms21qni9pdocess6v.apps.googleusercontent.com";
// const DEVELOPER_KEY = "AIzaSyC8SoCeWcw7vGXrqHUqWODn0gYKxQsnPE0";
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const DEVELOPER_KEY = process.env.REACT_APP_DEVELOPER_KEY;
const SCOPE = ['https://www.googleapis.com/auth/drive'];

var printIcon = function(cell, formatterParams){ //plain text value
    return "<img src='"+ cell.getRow().getData().iconUrl +"' />";
};

var trashIcon = function(cell, formatterParams){ //plain text value
    return "<img src='/static/images/delete icon.svg' style='height: 100%; width: 100%' />";
};

var editIcon = function(cell, formatterParams){ //plain text value
    return "<img src='/static/images/edit_button.svg' style='height: 100%; width: 100%' />";
};
class MyDrive extends React.Component {

  
    constructor (props) {
        super(props);
        this.state = {
            show: false,
            picked_file: null,
            showRemoveConfirmModal: false,
            remove_doc_id: 0,
        };
        this.pickerCallback = this.pickerCallback.bind(this);
        this.selectAssessment = this.selectAssessment.bind(this);
        this.selectPlan = this.selectPlan.bind(this);
        this.selectResource = this.selectResource.bind(this);
    }

    componentDidMount() {
        this.props.getMyData();
        gapi.load('client:auth2', this.initClient);
    }

    hideRemoveConfirmModal = () => {
        this.setState({ showRemoveConfirmModal: false });
    }

    removeDoc = () => {
        this.props.removeDocOnHome(this.state.remove_doc_id);
    }

    rowClick(e, row){
        if ( row.getData().url.includes("http", 0) ) {
            window.open(row.getData().url, "_blank");
        } else {
            window.open("https://" + row.getData().url, "_blank");
        }
    }

    initClient() {
        gapi.client.init({
          discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
          clientId: CLIENT_ID,
          scope: 'https://www.googleapis.com/auth/drive'
        }).then(function () {
          // do stuff with loaded APIs
          console.log('it worked');
        });
    }
    selectAssessment(){
        localStorage.setItem("DocType", "Assessment");
        window.location = "/upload";
    }
    selectPlan(){
        localStorage.setItem("DocType", "Plan");
        window.location = "/upload";
    }
    selectResource(){
        localStorage.setItem("DocType", "Resource");
        window.location = "/upload";
    }
    pickerCallback(data) {
        if (data.action == "picked") {
            var file = data.docs[0];
            localStorage.setItem("file", JSON.stringify(file));
            console.log(file);
            console.log(localStorage);
            this.setState({ show: true });
            var accessToken = gapi.auth.getToken().access_token;
            this.props.getThumbnailLink(file.id, accessToken);
        }
    };
    
    hideModal = () => {
        this.setState({ show: false });
    };

    editDocOnHome = (doc_id) => {
        window.location = "/document/doc-" + doc_id + "+col-0"; 
    }

    showRemoveConfirmModal = (doc_id) => {
        this.setState({ showRemoveConfirmModal: true });
        this.setState({ remove_doc_id: doc_id });
    }
    
    render () {
        const columns = [
            { title: "", field: "thumbnail", align: "center", formatter:printIcon,  width: '5%', headerSort:false,},
            { title: "Resource Description", field: "name", width: '28%' },
            { title: "Document Type", field: "DocType", width: '12%' },
            { title: "Subject", field: "subject" , width: '12%' },
            { title: "Standards", field: "standard", width: '20%'  },
            { title: "Tags", field: "tags", width: '15%'  },
            { title: "", field: "edit", width: '3%', align: "center", formatter:editIcon, headerSort:false,
                cellClick: (e, cell) => {e.stopPropagation();this.editDocOnHome(cell.getRow().getData().id);}},
            { title: "", field: "remove", width: '3%', align: "center", formatter:trashIcon, headerSort:false,
                cellClick: (e, cell) => {e.stopPropagation();this.showRemoveConfirmModal(cell.getRow().getData().doc_id);}},
            { title: "", field: "iconUrl", visible: false  },
            { title: "", field: "url", visible: false  },
            { title: "", field: "doc_id", visible: false },
        ];
        // console.log(this.props.searchdata);
        if (this.props.searchdata.isFetching) {
            return (
                <div className="spinner-padding">
                    <Spinner size={50} spinnerColor={"#FF671D"} spinnerWidth={2} visible={true} />
                </div>
            )
        } else {
            if (this.props.searchdata.searchdata.length > 0) {
                const options = {
                    height: "500px",
                    movableRows: true
                };
                return (
                    <div className="container text-center" style={{ 'display': 'block'}}>
                        <p className="lg-p text-center">Shared with Coteacher</p>
                        <div className="mt-4">
                            <ReactTabulator
                                ref={ref => (this.ref = ref)}
                                columns={columns}
                                data={this.props.searchdata.searchdata}
                                rowClick={this.rowClick}
                                options={options}
                                data-custom-attr="test-custom-attribute"
                                className="custom-css-class"
                            />
                        </div>
                        <GooglePicker clientId={CLIENT_ID}
                            developerKey={DEVELOPER_KEY}
                            scope={SCOPE}
                            onChange={data => console.log('on change:', data)}
                            onAuthFailed={data => console.log('on auth failed:', data)}
                            multiselect={true}
                            navHidden={true}
                            authImmediate={false}
                            mimeTypes={['image/png', 'image/jpeg', 'image/jpg']}
                            viewId={'DOCS'}
                            createPicker={ (google, oauthToken) => {
                                const googleViewId = google.picker.ViewId.DOCS;
                                const docsView = new google.picker.DocsView(googleViewId)
                                    .setIncludeFolders(true)
                                    .setMimeTypes('application/vnd.google-apps.docs')
                                    .setSelectFolderEnabled(false);
        
                                const picker = new window.google.picker.PickerBuilder()
                                    .addView(new google.picker.DocsView().setIncludeFolders(true).setOwnedByMe(true))
                                    .setOAuthToken(oauthToken)
                                    .setDeveloperKey(DEVELOPER_KEY)
                                    .setCallback(this.pickerCallback);
        
                                picker.build().setVisible(true);
                                
                            }}
                        >
                            <button className="btn mt-4 float-left">Add more</button>
                            <div className="google"></div>
                        </GooglePicker>
                        <Modal show={this.state.show} handleClose={this.hideModal}>
                            <div className="mt-5"></div>
                            <h5 className="text-center">What is this document?</h5>
                            <div className="mt-4"></div>
                            <div className="text-center">
                                <button className="btn inline-btn" onClick={this.selectAssessment}> An Assessment</button>
                                <button className="btn inline-btn" onClick={this.selectPlan}>A Plan</button>
                                <button className="btn inline-btn" onClick={this.selectResource}>A Resource</button>
                            </div>
                            <div className="mt-5"></div>
                        </Modal>
                        <Modal show={this.state.showRemoveConfirmModal} handleClose={this.hideRemoveConfirmModal}>
                            <div className="text-center mt-6">
                                <div className="col">
                                    <div>
                                        <h5>Are you sure you want to remove this resource from coteacher ?</h5>
                                        <p>Your files will remain on your drive</p>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 text-right">
                                    <button className="btn-reversed mt-4" onClick={this.hideRemoveConfirmModal}>Cancel</button>
                                </div>
                                <div className="col-md-6">
                                    <button className="btn mt-4" onClick={this.removeDoc}>Delete</button>
                                </div>
                            </div>
                            <div className="row mt-4"></div>
                        </Modal>
                    </div>
                )
            } else {
                return (
                    <div className="row gn-mg">
                        <div className="col-md-6">
                            <p className="lg-p">Upload a file from your Google Drive&trade;</p>
                            <p className="md-p">Click on a file in your Drive, describe it a little,and share it with your fellow teachers!</p>
                            <GooglePicker clientId={CLIENT_ID}
                                developerKey={DEVELOPER_KEY}
                                scope={SCOPE}
                                onChange={data => console.log('on change:', data)}
                                onAuthenticate={token => console.log('oauth token:', token)}
                                onAuthFailed={data => console.log('on auth failed:', data)}
                                multiselect={true}
                                navHidden={true}
                                authImmediate={false}
                                mimeTypes={['image/png', 'image/jpeg', 'image/jpg']}
                                viewId={'DOCS'}
                                createPicker={ (google, oauthToken) => {
                                    const googleViewId = google.picker.ViewId.DOCS;
                                    const docsView = new google.picker.DocsView(googleViewId)
                                        .setIncludeFolders(true)
                                        .setMimeTypes('application/vnd.google-apps.docs')
                                        .setSelectFolderEnabled(false);
            
                                    const picker = new window.google.picker.PickerBuilder()
                                        .addView(new google.picker.DocsView().setIncludeFolders(true).setOwnedByMe(true))
                                        .setOAuthToken(oauthToken)
                                        .setDeveloperKey(DEVELOPER_KEY)
                                        .setCallback(this.pickerCallback);
            
                                    picker.build().setVisible(true);
                                    
                                }}
                            >
                                <button className="btn mt-4">Upload From<br/>Google Drive</button>
                                <div className="google"></div>
                            </GooglePicker>
                        </div>
                        <div className="col-md-6 mt-6">
                            <img src="/static/images/upload illustration.svg" />
                        </div>
                        <Modal show={this.state.show} handleClose={this.hideModal}>
                            <div className="mt-5"></div>
                            <h5 className="text-center">What is this document?</h5>
                            <div className="mt-4"></div>
                            <div className="text-center">
                                <button className="btn inline-btn" onClick={this.selectAssessment}> An Assessment</button>
                                <button className="btn inline-btn" onClick={this.selectPlan}>A Plan</button>
                                <button className="btn inline-btn" onClick={this.selectResource}>A Resource</button>
                            </div>
                            <div className="mt-5"></div>
                        </Modal>
                        
                    </div>
                );
            }
        }
        
    }
}

export default withRouter(MyDrive);
