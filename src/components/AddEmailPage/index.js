import React from "react";
import { withRouter } from "react-router-dom";
import { FilePicker } from 'react-file-picker'
import Modal from "../CustomComponents/Modal";


import "../../css/find.css";
import "../../css/navigation.css";


class AddEmailPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            email: "",
            show: false
        }
    }

    componentDidMount() {
        const query = new URLSearchParams(this.props.location.search);
        var communityID = query.get("com");
        this.props.getCommunityName(communityID);
    }

    hideModal = () => {
        this.setState({ show: false });
    }

    addEmail = () => {
        if (this.state.email !== "") {
            const query = new URLSearchParams(this.props.location.search);
            var communityID = query.get("com");
            this.props.addEmailToCommunity(this.state.email, communityID);
        }
    }

    getEmail = (evt) => {
        this.setState({email: evt.target.value});
    }

    uploadFile = (fileObject) => {
        const query = new URLSearchParams(this.props.location.search);
        var communityID = query.get("com");
        this.props.uploadCSVFile(fileObject, communityID);
        this.setState({show: true});
    }

    downloadFile = () => {
        const query = new URLSearchParams(this.props.location.search);
        var communityID = query.get("com");
        this.props.downloadFile(communityID);
    }

    render() {
        console.log(this.props.cordata);
        return (
            <div className="container-fluid">
                <div className="input-group row">
                    <div className="mt-4 cent-panel">
                        <p className="fw-thicker fs-24">Add new members</p>
                        <p className="fs-20">Use emails to invite new members to <span className="fw-600">{this.props.cordata.communityName}</span></p>
                        <div className="row mt-6">
                            <div className="col-md-1"></div>
                            <div className="col-md-7">
                                <input type="email" placeholder="Type an email address" value={this.state.email} onChange={this.getEmail} className="search-query w-10"/>
                            </div>
                            <div className="col-md-3">
                                <button className="btn" onClick={this.addEmail}>
                                    Add
                                </button>
                            </div>
                        </div>
                        <div className="mt-4"></div>
                        <p className="fw-thicker fs-24">Bulk Upload ?</p>
                        <span className="fw-thicker fs-20">Step 1: </span>
                        <span className="fs-20">Download our standard csv template <a href="#" className="theme-color" onClick={this.downloadFile}>here</a></span>
                        <br />
                        <div className="mt-3"></div>
                        <span className="fw-thicker fs-20">Step 2: </span>
                        <span className="fs-20 file-picker">Upload your csv file here&nbsp;
                            <FilePicker
                                extensions={['csv']}
                                onChange={FileObject => (this.uploadFile(FileObject))}
                                onError={errMsg => (alert(errMsg))}
                            >
                                <a href="#" className="theme-color">here</a>
                            </FilePicker>
                        </span>
                        <input type="file" className="display-none" value={this.state.fileName} ></input>
                        <p className="ovl-5">NOTE: Our systems only accept .csv files.</p>
                        { this.props.cordata.uploadFileName !== "" && 
                        <div className="text-center">
                            <img src="/static/images/Text-csv-text.svg" className="csv-img"></img>
                            <p>{this.props.cordata.uploadFileName}</p>
                        </div>
                        }
                    </div>
                </div>
                <Modal show={this.state.show} closeDisplay="none">
                    <div className="mt-5"></div>
                    <h5 className="text-center">Your upload was successfully completed!</h5>
                    <div className="mt-4"></div>
                    <div className="text-center">
                        <button className="btn inline-btn" onClick={this.hideModal}> Done</button>
                    </div>
                    <div className="mt-3"></div>
                </Modal>
            </div>
        );
    }
}

export default withRouter(AddEmailPage);
