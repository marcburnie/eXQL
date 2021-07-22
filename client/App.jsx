import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes, { string, bool, func, arrayOf, shape } from 'prop-types';
import ReactDataGrid from 'react-data-grid';
import { Menu } from 'react-data-grid-addons';
import SummaryTable from './components/SummaryTable';
import TableContextMenu from './components/ContextMenu';
import * as actions from './actions/actions';

const {
  ContextMenu, MenuItem, SubMenu, ContextMenuTrigger,
} = Menu;
// import 'react-data-grid/dist/react-data-grid.css';
// import * as React from 'react';

const mapStateToProps = (state) => {
  return {
    tableData: state.tables.tableData,
    name: state.tables.name,
    columns: state.tables.columns,
    rows: state.tables.rows,
    primary_key: state.tables.primary_key,
  }
};

const mapDispatchToProps = (dispatch) => ({
  handleGetTables: (tableData) => dispatch(actions.getTables(tableData)),
  handleGetTable: (name, columns, rows, primary_key) => {
    dispatch(actions.getTable(name, columns, rows, primary_key));
  },
  handleUpdateTable: (fromRow, toRow, updated) => {
    dispatch(actions.updateTable(fromRow, toRow, updated));
  },
});

class App extends Component {
  constructor(props) {
    super(props);
    this.loadTable = this.loadTable.bind(this);
    this.onGridRowsUpdated = this.onGridRowsUpdated.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
  }

  componentDidMount() {
    const { handleGetTables } = this.props;
    // fetch database on load
    const url = '/table';
    fetch(url)
      .then((response) => response.json())
      .then((data) => handleGetTables(data))
      .catch((error) => console.log('Error:', error));
  }

  onGridRowsUpdated({ fromRow, toRow, updated }) {
    // destructure state variables
    const { handleUpdateTable, name, primary_key, rows } = this.props;

    handleUpdateTable(fromRow, toRow, updated);

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
    const { handleGetTable } = this.props;
    // load selected table
    const url = `/table/${tablename}?primary_key=${primary_key}`;
    fetch(url).then((response) => response.json())
      .then(({name, columns, rows, primary_key}) => handleGetTable(name, columns, rows, primary_key))
      .catch((error) => console.log('Error:', error));
  }

  // delete row logic
  deleteRow(rowIdx) {
    // destructure state variables
    const { name, primary_key, rows } = this.props;

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
    console.log(this.props)
    const {
      name,
      tableData,
      rows,
      columns,
    } = this.props;

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
          {tableData.map((t, i) => {
            return (t.table_name !== name) && <SummaryTable
              id={t.table_name}
              key={`table${i}`}
              primary_key={t.primary_key}
              columns={t.columns}
              loadTable={this.loadTable}
            />
          })}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  name: string.isRequired,
  primary_key: string.isRequired,
  tableData: arrayOf(shape({
    table_name: string,
    primary_key: string,
    columns: arrayOf(shape({
      column_name: string,
      is_nullable: string,
      data_type: string,
    })),
  })).isRequired,
  columns: arrayOf(shape({
    key: string,
    name: string,
    editable: bool,
    filterable: bool,
    sortable: bool,
  })).isRequired,
  rows: arrayOf(PropTypes.object).isRequired,
  handleGetTable: func.isRequired,
  handleGetTables: func.isRequired,
  handleUpdateTable: func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
