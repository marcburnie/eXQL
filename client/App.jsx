import React, { Component } from 'react';
import SummaryTable from "./components/SummaryTable.jsx";
import TableContextMenu from "./components/ContextMenu.jsx";
import ReactDataGrid from 'react-data-grid';
import { Menu } from "react-data-grid-addons";
const { ContextMenu, MenuItem, SubMenu, ContextMenuTrigger } = Menu;
// import 'react-data-grid/dist/react-data-grid.css';
// import * as React from 'react';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: [],
            columns: [],
            rows: [],
            name: "",
            primary_key: ""
        }
        this.loadTable = this.loadTable.bind(this);
        this.onGridRowsUpdated = this.onGridRowsUpdated.bind(this);
        this.deleteRow = this.deleteRow.bind(this);
    }

    componentDidMount() {
        //fetch database on load
        const url = "/table";
        fetch(url)
            .then((response) => response.json())
            .then((data) => this.setState({ ...this.state, tableData: data }))
            .catch((error) => console.log("Error:", error));
    }

    loadTable(tablename, primary_key) {
        //load selected table 
        const url = `/table/${tablename}?primary_key=${primary_key}`;
        fetch(url).then((response) => response.json())
            .then((data) => this.setState({ ...this.state, ...data }))
            .catch((error) => console.log("Error:", error));
    }

    onGridRowsUpdated({ fromRow, toRow, updated }) {
        //update state when cell values change
        this.setState(state => {
            const rows = state.rows.slice();
            for (let i = fromRow; i <= toRow; i++) {
                rows[i] = { ...rows[i], ...updated };
            }
            return { rows };
        });
        //update database when cell values change
        const url = `/table/${this.state.name}?primary_key=${this.state.primary_key}`;
        //attempt to write last row if it has been modified
        if (toRow === this.state.rows.length - 1) {
            fetch(url, {
                credentials: 'same-origin',
                method: 'POST',
                body: JSON.stringify({ ...this.state.rows[this.state.rows.length - 1], ...updated }),
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
            }).then((response) => response.json())
                .then((addedRow) => {
                    if (addedRow === true) {
                        this.loadTable(this.state.name, this.state.primary_key)
                    }
                })
                .catch((error) => console.log("Error:", error));
        }
        //check if the last row was updated - will send a seperate fetch request
        if (fromRow < this.state.rows.length - 1) {
            const from = this.state.rows[fromRow][this.state.primary_key];
            const to = this.state.rows[toRow][this.state.primary_key];

            fetch(url, {
                credentials: 'same-origin',
                method: 'PUT',
                body: JSON.stringify({ from, to, updated }),
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
            }).catch((error) => console.log("Error:", error));
        }
    };
    //delete row logic
    deleteRow(rowIdx) {
        const url = `/table/${this.state.name}?primary_key=${this.state.primary_key}`;
        const id = this.state.rows[rowIdx][this.state.primary_key]

        fetch(url, {
            credentials: 'same-origin',
            method: 'DELETE',
            body: JSON.stringify({ id }),
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
        }).then(() =>         //update state with removed row
            this.loadTable(this.state.name, this.state.primary_key))
            .catch((error) => console.log("Error:", error));

    };

    render() {
        const tables = [];
        //build list of tables - does not include current selected table
        this.state.tableData.forEach((t, i) => {
            if (t.table_name !== this.state.name) {
                tables.push(
                    <SummaryTable
                        id={t.table_name}
                        key={`table${i}`}
                        primary_key={t.primary_key}
                        columns={t.columns}
                        loadTable={this.loadTable}

                    />
                )
            }
        })
        //for ReactDataGrid
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
                        contextMenu={
                            <TableContextMenu
                                onRowDelete={(e, { rowIdx }) => this.deleteRow(rowIdx)}
                            />
                        }
                        RowsContainer={ContextMenuTrigger}

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