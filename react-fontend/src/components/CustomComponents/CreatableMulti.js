import React, { Component } from 'react';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';
import CreatableSelect from 'react-select/lib/Creatable';

export default class CreatableMulti extends Component {
    constructor(props) {
        super(props);
        this.options = props.options;
    }
    handleChange = (newValue, actionMeta) => {
        this.props.parentMethod(newValue, actionMeta);
    };
    render() {
        return (
        <CreatableSelect options={ this.options }
            isMulti
            onChange={this.handleChange}
        />
        );
    }
}