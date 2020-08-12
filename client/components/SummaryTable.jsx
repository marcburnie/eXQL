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
                <div>{`${c.column_name}`}</div>
            )
        })
        return (
            <div>
                <h3>{`${this.props.id}`}</h3>
                {columns}
            </div>
        );
    }
}

export default SummaryTable;