import React from "react";
import { withRouter } from "react-router-dom";
import Spinner from 'react-spinner-material';

import "../../css/find.css";
import "../../css/navigation.css";

import "react-tabulator/lib/css/bootstrap/tabulator_bootstrap.min.css"; // use Theme(s)

// for React 16.4.x use: import { ReactTabulator }
import { ReactTabulator } from "react-tabulator"; // for React 15.x

var printIcon = function(cell, formatterParams){ //plain text value
    // console.log();
    return "<img src='"+ cell.getRow().getData().iconUrl +"' />";
};

class FindFile extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            keyword: ""
        }
        this.rowClick = this.rowClick.bind(this);
        this.clickSearch = this.clickSearch.bind(this);
    }

    componentDidMount() {
        this.props.getSearchData("", "", "");
    }

    rowClick(e, row){
        if ( row.getData().url.includes("http", 0) ) {
            window.open(row.getData().url, "_blank");
        } else {
            window.open("https://" + row.getData().url, "_blank");
        }
    }

    clickSearch(){
        this.props.getSearchData(this.state.keyword, "", "");
    }

    _handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            this.props.getSearchData(this.state.keyword, "", "");
        }
    }

    handleChange(value){
        this.setState({
             keyword: value
        });
    }
    render() {
        const columns = [
            { title: "", field: "thumbnail", align: "center", formatter:printIcon,  width: '5%', headerSort:false,},
            { title: "Documents matching your search:", field: "name", width: '28%' },
            { title: "Contributor", field: "owner", width: '15%' },
            { title: "Type", field: "DocType" , width: '15%' },
            { title: "Standards", field: "standard", width: '20%'  },
            { title: "Tags", field: "tags", width: '15%'  },
            // { title: "", field: "remove", width: '3%', align: "center", formatter: "buttonCross", 
            //     cellClick: (e, cell) => {e.stopPropagation();this.props.removeDocOnFind(cell.getRow().getData().doc_id);}},
            { title: "", field: "iconUrl", visible: false  },
            { title: "", field: "url", visible: false  },
            { title: "", field: "doc_id", visible: false },
        ];
        if (this.props.searchdata.isFetching) {
            return (
                <div className="spinner-padding">
                    <Spinner size={50} spinnerColor={"#FF671D"} spinnerWidth={2} visible={true} />
                </div>
            )
        } else {
            const options = {
                height: "500px",
                movableRows: true
              };
            return (
                <div className="container text-center" style={{ 'display': 'block'}}>
                    <p className="lg-p text-center">Find Resources</p>
                    <p className="md-p text-center">Search for content relevant to you and your students</p>
                
                    <div className="input-group w-80">
                        <input type="text" className="search-query form-control" placeholder="Search for resources" value={this.state.keyword} 
                            onChange={e => this.handleChange(e.target.value)} onKeyDown={this._handleKeyDown} />
                        <button className="btn search-btn" type="button" onClick={this.clickSearch}>
                            <span className="fa fa-search"></span>
                        </button>
                    </div>
                    <div className="row mt-5">
                        <ReactTabulator
                            ref={ref => (this.ref = ref)}
                            columns={columns}
                            data={this.props.searchdata.searchdata}
                            rowClick={this.rowClick}
                            options={options}
                            data-custom-attr="test-custom-attribute"
                            className="custom-css-class"
                        />
                    </div>
                    
                </div>
            );
        }
    }  
}

export default withRouter(FindFile);
