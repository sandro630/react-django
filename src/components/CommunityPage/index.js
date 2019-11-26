import React from "react";
import { withRouter } from "react-router-dom";
import Spinner from 'react-spinner-material';

import "../../css/find.css";
import "../../css/navigation.css";

import "react-tabulator/lib/css/bootstrap/tabulator_bootstrap.min.css"; // use Theme(s)

// for React 16.4.x use: import { ReactTabulator }
import { ReactTabulator } from "react-tabulator"; // for React 15.x


class CommunityPage extends React.Component {
    constructor(props){
        super(props);
    }

    
    render() {
        return (
            <div className="container-fluid">
                <div className="row gn-mg">
                    <div className="col-md-6">
                        <p className="lg-p">Coteacher Communities</p>
                        <p className="md-p mt-3">
                            Help us build coteacher communities. <br />
                            We would like to hear your thoughts, <br />
                            Send an email to participate. 
                        </p>
                        <p className="md-p theme-color">feedback@coteacher.com</p>
                    </div>
                    <div className="col-md-6 mt-6">
                        <img src="/static/images/comunities-illustration.png" />
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(CommunityPage);
