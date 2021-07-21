import React, { Component } from 'react';
import ReactDataGrid from 'react-data-grid';
import { Menu } from 'react-data-grid-addons';
import SummaryTable from './components/SummaryTable';
import TableContextMenu from './components/ContextMenu';

const {
  ContextMenu, MenuItem, SubMenu, ContextMenuTrigger,
} = Menu;
// import 'react-data-grid/dist/react-data-grid.css';
// import * as React from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
      columns: [],
      rows: [],
      name: '',
      primary_key: '',
    };
    this.loadTable = this.loadTable.bind(this);
    this.onGridRowsUpdated = this.onGridRowsUpdated.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
  }

  componentDidMount() {
    // fetch database on load
    const url = '/table';
    fetch(url)
      .then((response) => response.json())
      .then((data) => this.setState((state) => {
        const newState = { ...state, tableData: data };
        return newState;
      }))
      .catch((error) => console.log('Error:', error));
  }

  onGridRowsUpdated({ fromRow, toRow, updated }) {
    // update state when cell values change
    this.setState((state) => {
      const rows = state.rows.slice();
      for (let i = fromRow; i <= toRow; i += 1) {
        rows[i] = { ...rows[i], ...updated };
      }
      return { rows };
    });

    //destructure state variables
    const {name, primary_key, rows} = this.state;

    // update database when cell values change
    const url = `/table/${name}?primary_key=${primary_key}`;
    // attempt to write last row if it has been modified
    if (toRow === rows.length - 1) {
      fetch(url, {
        credentials: 'same-origin',
        method: 'POST',
        body: JSON.stringify({ ...rows[rows.length - 1], ...updated }),
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      }).then((response) => response.json())
        .then((addedRow) => {
          if (addedRow === true) {
            this.loadTable(name, primary_key);
          }
        })
        .catch((error) => console.log('Error:', error));
    }
    // check if the last row was updated - will send a seperate fetch request
    if (fromRow < rows.length - 1) {
      const from = rows[fromRow][primary_key];
      const to = rows[toRow][primary_key];

      fetch(url, {
        credentials: 'same-origin',
        method: 'PUT',
        body: JSON.stringify({ from, to, updated }),
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      }).catch((error) => console.log('Error:', error));
    }
  }

  loadTable(tablename, primary_key) {
    // load selected table
    const url = `/table/${tablename}?primary_key=${primary_key}`;
    fetch(url).then((response) => response.json())
      .then((data) => this.setState((state) => {
        const newState = { ...state, ...data };
        return newState;
      }))
      .catch((error) => console.log('Error:', error));
  }

  // delete row logic
  deleteRow(rowIdx) {
    // destructure state variables
    const { name, primary_key, rows } = this.state;

    const url = `/table/${name}?primary_key=${primary_key}`;
    const id = rows[rowIdx][primary_key];

    fetch(url, {
      credentials: 'same-origin',
      method: 'DELETE',
      body: JSON.stringify({ id }),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then(() => // update state with removed row
      this.loadTable(name, primary_key))
      .catch((error) => console.log('Error:', error));
  }

  render() {
    // destructure table data
    const { name, tableData, rows, columns } = this.state;
    const tables = [];
    // build list of tables - does not include current selected table
    tableData.forEach((t, i) => {
      if (t.table_name !== name) {
        tables.push(
          <SummaryTable
            id={t.table_name}
            key={`table${i}`}
            primary_key={t.primary_key}
            columns={t.columns}
            loadTable={this.loadTable}

          />,
        );
      }
    });
    // for ReactDataGrid
    const rowGetter = (rowNumber) => rows[rowNumber];

    return (
      <div className="app">
        <div className={`fullTable ${columns.length === 0 && 'hidden'}`}>
          <ReactDataGrid
            columns={columns}
            rowGetter={rowGetter}
            rowsCount={rows.length}
            minHeight={500}
            onGridRowsUpdated={this.onGridRowsUpdated}
            enableCellSelect
            contextMenu={(
              <TableContextMenu
                onRowDelete={(e, { rowIdx }) => this.deleteRow(rowIdx)}
              />
            )}
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
