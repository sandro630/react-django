import React from "react";
import { withRouter } from "react-router-dom";
import GoogleLogoutButton from "../containers/GoogleAuth/GoogleLogoutButtonContainer.js";


import "../css/main.css";
import "../css/navigation.css";

class Topbar extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.isAdmin();
    }

    render() {
        return (
            <nav className="navbar navbar-expand-md navbar-light">
              <a className="navbar-brand" href="/home">
                <img className="co-teach__logo" src="/static/images/CoTeacherLogo.png" alt="logo" />
              </a>
              <button className="navbar-toggler co-teach__btn" type="button" data-toggle="collapse" data-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse text-right" id="navbarNav">
                <ul className="navbar-nav ml-auto">
                  <li className="nav-item mx-3">
                    <a className={this.props.match.path === '/home' ? "nav-link smooth-hover nav-active" : "nav-link smooth-hover"} href="/home">Contribute</a>
                  </li>
                  <li className="nav-item mx-3">
                    <a className={this.props.match.path === '/collection' ? "nav-link smooth-hover nav-active" : "nav-link smooth-hover"} href="/collection">Collections</a>
                  </li>
                  <li className="nav-item mx-3">
                    <a className={this.props.match.path === '/community' ? "nav-link smooth-hover nav-active" : "nav-link smooth-hover"} href="/community">Communities</a>
                  </li>
        
                  <li className="nav-item mx-3">
                    <a className={this.props.match.path === '/find' ? "nav-link smooth-hover nav-active" : "nav-link smooth-hover"} href="/find">Find</a>
                  </li>
                  <li className="nav-item mx-3 dropdown">
                    <a className="nav-link dropbtn" href="#" onClick={this.showAccount}>
                        <img src={localStorage.getItem("goog_avatar_url")} width="24px" height="auto" style={{borderRadius: "50%"}} />
                    </a>
                    <div className="pf-dropdown dropdown-content text-left">
                        <ul>
                            <li>
                                <a href="/edit-profile">Edit&nbsp;Profile</a>
                            </li>
                            {this.props.cordata.isAdmin && 
                            <li>
                                <a href="/community-setting">Community&nbsp;Settings</a>
                            </li>
                            }
                            <li>
                                <a href="/sharing-setting">Sharing&nbsp;Settings</a>
                            </li>
                            <li>
                                <GoogleLogoutButton history={this.props.history} />
                            </li>
                        </ul>
                    </div>
                  </li>
                </ul>
              </div>
            </nav>
          );
    }
  
}

export default withRouter(Topbar);
