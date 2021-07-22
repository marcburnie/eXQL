import React from 'react';
import { string, arrayOf, shape, func, bool } from 'prop-types';

function SummaryTable({ columns, id, loadTable, primary_key }) {
  return (
    <div className="summaryTable">
      <button type="button" onClick={() => loadTable(id, primary_key)}>{`${id}`}</button>
      {columns.map((c) => <div className="column">{`${c.column_name}`}</div>)}
    </div>
  );
}

SummaryTable.propTypes = {
  id: string.isRequired,
  primary_key: string.isRequired,
  columns: arrayOf(shape({
    key: string,
    name: string,
    editable: bool,
    filterable: bool,
    sortable: bool,
  })).isRequired,
  loadTable: func.isRequired,
};

export default SummaryTable;
