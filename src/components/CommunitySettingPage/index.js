import React from "react";
import { withRouter } from "react-router-dom";
import Spinner from 'react-spinner-material';
import  CheckBox  from '../CustomComponents/CheckBox';
import { Dropdown } from 'reactjs-dropdown-component';

import "../../css/find.css";
import "../../css/navigation.css";


class CommunitySettingPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            users: [],
            communities: [],
            selected_community: 0
        }
    }

    componentDidMount() {
        this.props.getCommunities();
    }

    componentWillReceiveProps(nextProps) {
        let coms = [];
        if (nextProps.cordata.communityData !== undefined) {
            nextProps.cordata.communityData.map( (item, i) => {
                coms.push({ id:item.id, title: item.value, selected: false, key: "selected_community"});
            });
        }
        this.setState({communities: coms});

        let users = [];
        if (nextProps.cordata.usersPerCommunity !== undefined) {
            nextProps.cordata.usersPerCommunity.map( (item, i) => {
                users.push({ id:item.id, value: item.value, isChecked: item.isChecked, email: item.email});
            });
        }
        this.setState({users});
    }

    handleAllChecked = (event) => {
        console.log(event.target.checked);
        let users = this.state.users;
        users.forEach(user => user.isChecked = event.target.checked) 
        this.setState({users: users})
    }
    
    handleCheckChieldElement = (event) => {
        let users = this.state.users
        users.forEach(user => {
           if (user.value === event.target.value){
                user.isChecked =  event.target.checked;
           }
        });
        this.setState({users: users});
    }

    saveCommunitySetting = () => {
        console.log(this.state.users);
        console.log(this.state.selected_community);
        this.props.saveCommunitySetting(this.state.users, this.state.selected_community);
    }

    resetThenSetCommunity = (id, key) => {
        this.setState({selected_community: id});
        this.props.getUsersPerCommunity(id);
    }

    render() {
        {
            if (this.props.cordata.isFetching) {
                return (
                    <div className="spinner-padding">
                        <Spinner size={50} spinnerColor={"#FF671D"} spinnerWidth={2} visible={true} />
                    </div>
                )
            } else {
                let checkbox = [];
                checkbox.push(
                    <label key={-1} className="checkbox-container">&nbsp;
                        <input type="checkbox" onClick={this.handleAllChecked}  value="checkedall" />
                        <span className="email-span"></span>
                        <span className="checkmark-user"></span>
                    </label>
                );
                return (
                    <div className="container-fluid">
                        <p className="lg-p">Community Settings</p>
                        <div className="row mt-4">
                            <div className="col-md-8">
                                <p className="md-p">Add or delete members from community.</p>    
                                <div className="col-md-12">
                                    <h5 className="fs-16_fw-600">Number of Communities you are an administrator of : <span className="c_fs-18">{this.props.cordata.communityData.length}</span></h5>
                                </div>
                                <div className="col-md-9 custom-dropdown">
                                    <span className="fs-16_fw-600">Select a Community</span>
                                    <Dropdown
                                        title="Select Community"
                                        list={this.props.cordata.communityData}
                                        resetThenSet={this.resetThenSetCommunity}
                                    /> 
                                </div>
                            </div>
                            <div className="col-md-4">
                                <p className="md-p">Do you want create a <br />Private Sharing Community?</p>  
                                <p className="md-p">Contact <span className="theme-color"> Support@coteacher.com</span></p>  
                            </div>
                        </div>
                        <div className="input-group row">
                            { this.props.cordata.usersPerCommunity.length > 0 && <div className="mt-4 grey-board-user">
                                <p><span>Member</span><span style={{marginLeft: "230px"}}>Email</span><span style={{marginLeft: "300px"}}>Select All</span></p>
                                {
                                this.state.users.map((user, i) => {
                                    checkbox.push(
                                        <label key={i} className="checkbox-container">{user.value}
                                            <CheckBox handleCheckChieldElement={this.handleCheckChieldElement}  {...user} />
                                            <span className="email-span">{user.email}</span>
                                            <span className="checkmark-user"></span>
                                        </label>
                                    )
                                })
                                }
                                {checkbox}
                            </div>
                            }
                        </div>
                        { this.props.cordata.usersPerCommunity.length > 0 && 
                        <div className="input-group row">
                            <div className="mt-4 s-grey-board-user">
                                <span className="fs-16_fw-600">Add more members <a href={"/add-email?com=" + this.state.selected_community} className="theme-color">here</a></span>
                                <button className="btn float-right" onClick={this.saveCommunitySetting}>Save</button>
                            </div>
                        </div>
                        }
                    </div>
                );
            }
        }
    }
}

export default withRouter(CommunitySettingPage);
