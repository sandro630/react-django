import "../../css/card.css";
import "../../css/navigation.css";
import "../../css/collections.css";

import React from "react";
class NewColCard extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            showInput: false,
            col_title: ""
        }
        this.handleClick = this.handleClick.bind(this);
    }
    
    handleClick() {
        this.props.HandleClick(this.props.CollectionID)
    }

    changeInput = () => {
        this.setState({"showInput": true});

    }

    changePlainText = () => {
        this.setState({"showInput": false});
    }
    
    changeColTitle = (e) => {
        this.setState({"col_title": e.target.value});
        this.props.changeColTitle(e.target.value);
    }

    render(){
        let {CollectionID, SelectedCol, Title} = this.props
        return (
            <div className="card-st"
            onClick = {this.handleClick}>
                <div>
                    <img src="/static/images/newcollection.png" width="250px" height="160px" 
                        className={CollectionID == SelectedCol ? "card-border" : ""} />
                    {/* <img src="/static/images/.png" width="250px" height="160px" 
                        className={CollectionID == SelectedCol ? "card-border" : ""}/> */}
                </div>
                <div onClick={this.changeInput}>
                    {this.state.showInput && 
                        <input type='text' value={this.state.col_title} placeholder="Type Collection Name" autoFocus 
                            onChange={this.changeColTitle} style={{fontSize: "16px"}} onBlur={this.changePlainText}></input>
                    }
                    {!this.state.showInput && this.state.col_title === "" &&
                        <div className="">
                            <p className="text-center">{Title}</p>
                        </div>
                    }
                    {!this.state.showInput && this.state.col_title !== "" &&
                        <div className="">
                            <p className="text-center">{this.state.col_title}</p>
                        </div>
                    }
                </div>
            </div>
        );
    }
};



export default NewColCard;