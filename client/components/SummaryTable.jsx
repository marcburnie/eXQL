import React from 'react';
import PropTypes from 'prop-types';

function SummaryTable({ columns, id, loadTable, primary_key }) {
  return (
    <div className="summaryTable">
      <button type="button" onClick={() => loadTable(id, primary_key)}>{`${id}`}</button>
      {columns.map((c) => <div className="column">{`${c.column_name}`}</div>)}
    </div>
  );
}

export default SummaryTable;
