import "../../css/card.css";
import "../../css/navigation.css";
import "../../css/collections.css";

import React from "react";
class SelColCard extends React.Component {
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        this.props.HandleClick(this.props.CollectionID)
    }
    render(){
        let {CollectionID, SelectedCol, Title, thumbnail} = this.props
        return (
            <div className="card-st"
            onClick = {this.handleClick}>
                { !Array.isArray(thumbnail) && 
                    <div className={CollectionID == SelectedCol ? 'inner-card card-border' : 'inner-card'}>
                        <img src={thumbnail} className="full-img"></img>
                    </div>
                }
                { Array.isArray(thumbnail) && thumbnail.length !== 0 &&
                    <div className={CollectionID == SelectedCol ? 'inner-card card-border' : 'inner-card'}>
                        <div className="f-row">
                            <img src={thumbnail[0]} style={{maxWidth: "100%"}} className="img1"/>
                            <img src={thumbnail[1]} style={{maxWidth: "100%"}} className="img2"/>
                        </div>
                        <div className="s-row">
                            <img src={thumbnail[2]} style={{maxWidth: "100%"}} className="img3"/>
                            <img src={thumbnail[3]} style={{maxWidth: "100%"}} className="img4"/>
                        </div>
                    </div>
                }
                { Array.isArray(thumbnail) && thumbnail.length === 0 &&
                    <div className={CollectionID == SelectedCol ? 'inner-card card-border' : 'inner-card'}>
                        <img src="/static/images/add_collection_default_image.png" className="full-img"></img>
                    </div>
                }
                <div>
                    <div className="">
                        <p className="text-center">{Title}</p>
                    </div>
                </div>
            </div>
        );
    }
};



export default SelColCard;