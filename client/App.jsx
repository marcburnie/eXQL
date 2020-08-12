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
            columns: [],
            rows: [],
            name: ""
        }
        this.loadTable = this.loadTable.bind(this);
        this.onGridRowsUpdated = this.onGridRowsUpdated.bind(this);
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
            .then((data) => this.setState({ ...this.state, ...data }))
            .catch((error) => console.log("Error:", error));
    }

    onGridRowsUpdated({ fromRow, toRow, updated }) {
        console.log(fromRow, toRow, updated)

        const url = `http://localhost:3000/table/${this.state.name}`;
        fetch(url, {
            credentials: 'same-origin',
            method: 'PUT',
            body: JSON.stringify({ fromRow, toRow, updated }),
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
        })
            .then((response) => response.json())
            .then((data) => console.log("Successfully updated table"))
            .catch((error) => console.log("Error:", error));

        this.setState(state => {
            const rows = state.rows.slice();
            for (let i = fromRow; i <= toRow; i++) {
                rows[i] = { ...rows[i], ...updated };
            }
            return { rows };
        });
    };


    render() {
        console.log(this.state)
        const tables = [];

        this.state.tableData.forEach((t, i) => {
            if (t.table_name !== this.state.name) {
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

        const rowGetter = rowNumber => this.state.rows[rowNumber];

        return (
            <div className="app">
                <div className={`fullTable ${this.state.columns.length === 0 && 'hidden'}`}>
                    <ReactDataGrid
                        columns={this.state.columns}
                        rowGetter={rowGetter}
                        rowsCount={this.state.rows.length}
                        minHeight={500}
                        onGridRowsUpdated={this.onGridRowsUpdated}
                        enableCellSelect={true}

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