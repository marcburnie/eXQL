import React, { Component } from 'react';
import SummaryTable from "./components/SummaryTable.jsx";
// import * as React from 'react';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: []
        }
    }

    componentDidMount() {
        const url = "http://localhost:3000/table";
        fetch(url)
            .then((response) => response.json())
            .then((data) => this.setState({ tableData: data }))
            .catch((error) => console.log("Error:", error));
    }


    render() {
        console.log(this.state.tableData)
        const tables = [];

        this.state.tableData.forEach((t, i) => {
            tables.push(
                <SummaryTable
                    id={t.table_name}
                    key={`table${i}`}
                    columns={t.columns}
                />
            )
        })

        return (
            <div>
                <h1>Tables</h1>
                {tables}
            </div>
        );
    }
}

export default App;