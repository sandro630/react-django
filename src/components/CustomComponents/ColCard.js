import React from "react";

import "../../css/card.css";
import "../../css/navigation.css";
import "../../css/collections.css";


class ColCard extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
            Hover: false
        }
    }

    removeCol = () => {
        // pass collection id and if that collection is shared collection?
        this.props.removeCol(this.props.collectionId, this.props.isShared);
    }

    editCol = () => {
        window.location = "/collection/" + this.props.collectionId + "/?isShared=" + this.props.isShared;
    }
    
    MouseHover = () => {
        this.setState({ Hover: true });
    }
    MouseOut = () => {
        this.setState({ Hover: false });
    }

    render () {
        const { isNew, collectionId, thumbnail, title, isShared } = this.props;
        if (isNew) {
            return (
                <div className="col-md-3 mb-40">
                    <div className="square-new">
                        <a href="/new-collection" className="new-a"><span className="fa fa-plus"></span></a>
                    </div>
                    <div>
                        <div className="new-collection">
                            <p className="text-center">Add New Collection</p>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="col-md-3 mb-40">
                    <div className="square" onMouseOver={this.MouseHover} onMouseOut={this.MouseOut}>
                        <span className={this.state.Hover == true ? "x-col-btn" : "x-col-btn display-none"} onClick={this.removeCol}>
                            <img src="/static/images/delete icon.svg" className="ic-w100"></img></span>
                        <button className={this.state.Hover == true ? "col-open-icon" : "display-none"} onClick={this.editCol}>
                            Open
                        </button>
                        { Array.isArray(thumbnail) && thumbnail.length !== 0 && 
                            <a href={"/collection/"+collectionId} >
                                <div className="f-row">
                                    <img src={thumbnail[0]} style={{maxWidth: "100%"}} className="img1"/>
                                    <img src={thumbnail[1]} style={{maxWidth: "100%"}} className="img2"/>
                                </div>
                                <div className="s-row">
                                    <img src={thumbnail[2]} style={{maxWidth: "100%"}} className="img3"/>
                                    <img src={thumbnail[3]} style={{maxWidth: "100%"}} className="img4"/>
                                </div>
                                {/* <img src={thumbnail} style={{maxWidth: "100%"}} width="50%" height="50%"/>
                                <img src={thumbnail} style={{maxWidth: "100%"}} width="50%" height="50%"/> */}
                            </a>
                        }
                        { Array.isArray(thumbnail) && thumbnail.length === 0 && 
                            <a href={"/collection/"+collectionId} >
                                <img src="/static/images/add_collection_default_image.png" style={{maxWidth: "100%"}} className="full-img" />
                            </a>
                        }
                        { !Array.isArray(thumbnail) && 
                            <a href={"/collection/"+collectionId} >
                                <img src={thumbnail} style={{maxWidth: "100%"}} className="full-img" />
                            </a>
                        }
                    </div>
                    <div>
                        <div className="new-collection">
                            <p className="text-center">{title}</p>
                        </div>
                    </div>
                </div>
            )
        }
    }
    
};

export default ColCard;