import React, { Component } from 'react';

class SummaryTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: {}
        }
    }

    render() {
        const columns = [];
        this.props.columns.forEach(c => {
            columns.push(
                <div className="column">{`${c.column_name}`}</div>
            )
        })
        return (
            <div className="summaryTable">
                <h3 onClick={() => this.props.loadTable(this.props.id, this.props.primary_key)}>{`${this.props.id}`}</h3>
                {columns}
            </div>
        );
    }
}

export default SummaryTable;