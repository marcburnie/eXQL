import React, { Component } from 'react';

class SummaryTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: {}
        }
    }

    componentDidMount() {
        // const url = `http://localhost:3000/table/${this.props.id}`;
        // fetch(url)
        //     .then((response) => response.json())
        //     .then((data) => {
        //         console.log(data)
        //         this.setState({ tableData: data })
        //     })
        //     .catch((error) => console.log("Error:", error));
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