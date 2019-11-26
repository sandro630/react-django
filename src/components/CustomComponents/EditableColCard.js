import "../../css/docCard.css";
import "../../css/navigation.css";
import "../../css/collections.css";

import React from "react";
class EditableColCard extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
            Hover: false,
        }
    }

    MouseHover = () => {
        this.setState({ Hover: true });
    }

    MouseOut = () => {
        this.setState({ Hover: false });    
    }

    editImage = () => {
        this.props.showEditImageModal()
    }
    render() {
        return (
            //  <div className={this.props.noHoverEffect === true ? "top-col-image-no-hover" : "top-col-image"} onMouseOver={this.MouseHover} onMouseOut={this.MouseOut}>
            <div className={this.props.noHoverEffect === true ? "top-col-image-no-hover" : "top-col-image-no-hover"} onMouseOver={this.MouseHover} onMouseOut={this.MouseOut}>
                <div className="img-panel">
                    { this.props.isEmpty && 
                        <img src="/static/images/add_collection_default_image.png" />}
                    { !this.props.isEmpty && !Array.isArray(this.props.thumbnail) &&
                        <img src={this.props.thumbnail} className="full-img" />}
                    { !this.props.isEmpty && Array.isArray(this.props.thumbnail) && this.props.thumbnail.length !== 0 &&
                        <div className="inner-editable-card">
                            <div className="f-row">
                                <img src={this.props.thumbnail[0]} style={{maxWidth: "100%"}} className="img1"/>
                                <img src={this.props.thumbnail[1]} style={{maxWidth: "100%"}} className="img2"/>
                            </div>
                            <div className="s-row">
                                <img src={this.props.thumbnail[2]} style={{maxWidth: "100%"}} className="edit_col-img3"/>
                                <img src={this.props.thumbnail[3]} style={{maxWidth: "100%"}} className="edit_col-img4"/>
                            </div>
                        </div>
                    }
                    { !this.props.isEmpty && Array.isArray(this.props.thumbnail) && this.props.thumbnail.length === 0 &&
                        <img src="/static/images/add_collection_default_image.png" />
                    }
                    {/* <button className={this.state.Hover && this.props.noHoverEffect === false ? "btn-edit-image btn" : ".btn-edit-image btn display-none"} onClick={this.editImage}>Edit Image</button> */}
                    <button className={this.state.Hover && this.props.noHoverEffect === false ? "btn-edit-image btn display-none" : "btn-edit-image btn display-none"} onClick={this.editImage}>Edit Image</button>
                </div>
            </div>
    )}
};

export default EditableColCard;