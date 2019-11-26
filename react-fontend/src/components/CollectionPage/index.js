import React from "react";
import { withRouter } from "react-router-dom";
import Spinner from 'react-spinner-material';
import ColCard from '../../components/CustomComponents/ColCard';
import Modal from "../CustomComponents/Modal";

import "../../css/navigation.css";
import "../../css/collections.css";


class CollectionPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            keyword: "",
            showRemoveConfirmModal: false,
            remove_col_id: 0,
            isShared: false
        }
        // this.removeCol = this.removeCol.bind(this);
    }

    componentDidMount() {
        this.props.getCollectionData();
    }

    removeCol = () => {
        if (this.state.isShared) {
            this.props.searchdata.shared_collections.map( (item, i) => {
                if (item.pk === this.state.remove_col_id) {
                    this.props.removeSharedCollection(this.state.remove_col_id);
                    return 1;
                } else {
                    return 0;
                }
            })
        } else {
            this.props.searchdata.my_collections.map( (item, i) => {
                if (item.pk === this.state.remove_col_id) {
                    this.props.removeCollection(this.state.remove_col_id);
                    return 1;
                } else {
                    return 0;
                }
            });
        }
    }

    changeKeyword = (evt) => {
        this.setState({"keyword": evt.target.value});
    }

    searchCollection = () => {
        this.props.searchCollection(this.state.keyword);
    }
    
    _handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            this.searchCollection();
        }
    }

    showRemoveConfirmModal = (col_id, isShared) => {
        this.setState({ showRemoveConfirmModal: true });
        this.setState({ remove_col_id: col_id });
        this.setState({ isShared: isShared }); // that collection is shared collection?
    }
    hideRemoveConfirmModal = () => {
        this.setState({ showRemoveConfirmModal: false });
    }
    render() {
        const my_cards = [];
        this.props.searchdata.my_collections.map( (my_collection, i) => {

            my_cards.push(
                <ColCard collectionId={my_collection.pk}
                    title={my_collection.title} 
                    thumbnail={my_collection.thumbnail}
                    isNew={false}
                    removeCol={this.showRemoveConfirmModal}
                    key={i}
                    isShared={false}
                />
            )
        })
        const shared_cards = [];
        this.props.searchdata.shared_collections.map( (shared_collection, i) => {
            shared_cards.push(
                <ColCard collectionId={shared_collection.pk}
                    title={shared_collection.title} 
                    thumbnail={shared_collection.thumbnail}
                    isNew={false}
                    removeCol={this.showRemoveConfirmModal}
                    key={i}
                    isShared={true}
                />
            )
        })

        if (this.props.searchdata.isFetching) {
            return (
                <div className="spinner-padding">
                    <Spinner size={50} spinnerColor={"#FF671D"} spinnerWidth={2} visible={true} />
                </div>
            )
        } else {
            return (
                <div className="container">
                    <div className="top-container">
                        <p className="lg-p text-center">Resource Collections</p>
                        <p className="md-p text-center">All of your resources at your fingertips</p>
                        <div className="row mt-4">
                            <div className="input-group w-80">
                                <input type="text" className="search-query form-control" placeholder="Search Collections" 
                                    value={this.state.keyword} onChange={this.changeKeyword} onKeyDown={this._handleKeyDown}/>
                                <button className="btn search-btn" onClick={this.searchCollection} >
                                    <span className="fa fa-search"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="middle=container">
                        <div className="row mt-3">
                            {/* <div className="col col-md-7 order-1">
                                
                            </div>
                            <div className="col col-md-5 order-2">
                                <span className="p-0-25-0-65">Sort:</span>
                                <button className="round-btn">Recent</button>
                                <button className="round-btn">Abc</button>
                                <button className="round-btn">Custom</button>
                            </div> */}
                        </div>
                    </div>
                    <div className="row ml-115">
                        <p className="text-collections">My Collections:</p>
                    </div>
                    <div className="row ml-90">
                        {my_cards}
                        <ColCard isNew={true}/>
                    </div>
                    <div className="row mt-3 ml-115">
                        <p className="text-collections">Collections Shared with me:</p>
                    </div>
                    <div className="row ml-90">
                        {shared_cards}
                    </div>
                    <Modal show={this.state.showRemoveConfirmModal} handleClose={this.hideRemoveConfirmModal}>
                        <div className="text-center mt-6">
                            <div className="col">
                                <div>
                                    <p className="m-p1">Are you sure you want to delete this document and its content permanently?</p>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 text-right">
                                <button className="btn-reversed mt-4" onClick={this.hideRemoveConfirmModal}>Cancel</button>
                            </div>
                            <div className="col-md-6">
                                <button className="btn mt-4" onClick={this.removeCol}>Delete</button>
                            </div>
                        </div>
                        <div className="row mt-4"></div>
                    </Modal>
                </div>
            );
        }
    }  
}

export default withRouter(CollectionPage);
