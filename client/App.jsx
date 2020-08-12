import React, { Component } from 'react';
import SummaryTable from "./components/SummaryTable.jsx";
import ReactDataGrid from 'react-data-grid';
// import 'react-data-grid/dist/react-data-grid.css';
// import * as React from 'react';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: [],
            loadedTable: {
                columns: [],
                rows: [],
                name: ""
            }
        }
        this.loadTable = this.loadTable.bind(this);
    }

    componentDidMount() {
        const url = "http://localhost:3000/table";
        fetch(url)
            .then((response) => response.json())
            .then((data) => this.setState({ ...this.state, tableData: data }))
            .catch((error) => console.log("Error:", error));
    }

    loadTable(tablename) {
        console.log(tablename, " clicked")
        const url = `http://localhost:3000/table/${tablename}`;
        fetch(url)
            .then((response) => response.json())
            .then((data) => this.setState({ ...this.state, loadedTable: data }))
            .catch((error) => console.log("Error:", error));
    }


    render() {
        console.log(this.state)
        const tables = [];

        this.state.tableData.forEach((t, i) => {
            if (t.table_name !== this.state.loadedTable.name) {
                tables.push(
                    <SummaryTable
                        id={t.table_name}
                        key={`table${i}`}
                        columns={t.columns}
                        loadTable={this.loadTable}
                    />
                )
            }
        })

        const rowGetter = rowNumber => this.state.loadedTable.rows[rowNumber];

        return (
            <div className="app">
                <div className={`fullTable ${this.state.loadedTable.columns.length === 0 && 'hidden'}`}>
                    <ReactDataGrid
                        columns={this.state.loadedTable.columns}
                        rowGetter={rowGetter}
                        rowsCount={this.state.loadedTable.rows.length}
                        minHeight={500}
                    />
                </div>
                <div className="tableList">
                    {tables}
                </div>
            </div>
        );
    }
}

export default App;