import React from "react";
import Topbar from "../containers/TopbarContainer";
import MyDrive from "../containers/MyDrive/MyDrive";

const Home = ({ github_auth, goog_auth }) => {

    return (<div className="container-fluid">
                <Topbar />
                <MyDrive />
            </div>);
};

export default Home;
