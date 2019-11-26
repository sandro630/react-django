import React from "react";
import { withRouter } from "react-router-dom";
import Spinner from 'react-spinner-material';
import  CheckBox  from '../CustomComponents/CheckBox';

import "../../css/find.css";
import "../../css/navigation.css";


class SharingSettingPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            communities: []
        }
    }

    componentDidMount() {
        this.props.getCommunity();
    }

    componentWillReceiveProps(nextProps) {
        let coms = [];
        if (nextProps.cordata.communityData !== undefined) {
            nextProps.cordata.communityData.map( (item, i) => {
                coms.push({ id:item.id, value: item.value, isChecked: item.isChecked});
            });
        }
        
        this.setState({communities: coms});
    }

    handleAllChecked = (event) => {
        console.log(event.target.checked);
        let communities = this.state.communities
        communities.forEach(community => community.isChecked = event.target.checked) 
        this.setState({communities: communities})
    }
    
    handleCheckChieldElement = (event) => {
        let communities = this.state.communities
        communities.forEach(community => {
           if (community.value === event.target.value)
              community.isChecked =  event.target.checked
        })
        this.setState({communities: communities})
    }

    saveSharingSetting = () => {
        this.props.saveSharingSetting(this.state.communities);
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
                let initStatus = this.props.cordata.communityData.length > 0 ? false : true;
                return (
                    <div className="container-fluid">
                        <div className="row mt-4">
                            <div className="col-md-8">
                                <p className="lg-p">Sharing Settings</p>
                                <p className="md-p">Decide who has access to your resources</p>
                                <div className="input-group row">
                                    <div className="mt-4 grey-board">
                                        <p>Allow</p>
                                        {!initStatus && <label className="checkbox-container">All of Coteacher
                                            <input type="checkbox" onClick={this.handleAllChecked}  value="checkedall"/>
                                            <span className="checkmark"></span>
                                        </label>}
                                        {initStatus && <label className="checkbox-container">All of Coteacher
                                            <input type="checkbox" onClick={this.handleAllChecked}  value="checkedall" checked disabled/>
                                            <span className="checkmark"></span>
                                        </label>}
                                        {
                                        this.state.communities.map((community, i) => {
                                            checkbox.push(
                                                <label key={i} className="checkbox-container">{community.value}
                                                    <CheckBox handleCheckChieldElement={this.handleCheckChieldElement}  {...community} />
                                                    <span className="checkmark"></span>
                                                </label>
                                            )
                                        })
                                        }
                                        {checkbox}
                                    </div>
                                </div>
                                <div className="input-group row">
                                    <div className="mt-4 s-grey-board">
                                        <button className="btn float-right" onClick={this.saveSharingSetting} >Save</button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <p className="md-p">Do you want create a <br />Private Sharing Community?</p>  
                                <p className="md-p">Contact <span className="theme-color"> Support@coteacher.com</span></p>  
                            </div>
                        </div>
                        
                        
                    </div>
                );
            }
        }
    }
}

export default withRouter(SharingSettingPage);
