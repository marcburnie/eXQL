/** @format */

const fs = require("fs");
const path = require("path");
const db = require('../models/models');
const query = require("../utils/query");

const tableController = {};

tableController.getDatabase = (req, res, next) => {

    //requires sorted tables list
    db.query(query.getAllTablesAndHeaders())
        .then(data => {
            const tables = [];
            let tableName = ""
            let j = -1;
            for (let i = 0; i < data.rows.length; i++) {
                //check if table name is different
                if (tableName !== data.rows[i].table_name) {
                    tableName = data.rows[i].table_name;
                    j++;
                    //create new element in tables array
                    tables.push({
                        table_name: tableName,
                        columns: []
                    })
                }
                //add new column
                tables[j].columns.push({
                    column_name: data.rows[i].column_name,
                    is_nullable: data.rows[i].is_nullable,
                    data_type: data.rows[i].data_type
                })
            }
            res.locals.tables = tables
            return next();
        })
        .catch(err => next({
            log: `Something went wrong with tableController.getDatabase. Hint: ${err.hint}`,
            message: { err: 'Unable to retrieve data' }
        }))

}

tableController.getTable = (req, res, next) => {
    const { table } = req.params

    db.query(query.pullTable(table))
        .then(data => {

            const dataGrid = {};
            dataGrid.columns = [];
            dataGrid.rows = data.rows;
            dataGrid.name = table;
            //create additional row for editing
            dataGrid.rows.push({ ...data.rows[0] })

            for (let cName in dataGrid.rows[dataGrid.rows.length - 1]) {
                //create additional column
                dataGrid.columns.push({ key: cName, name: cName, editable: true, onBeforeEdit: (c) => console.log(c) })
                //clear entry
                dataGrid.rows[dataGrid.rows.length - 1][cName] = ""
            }


            res.locals.table = dataGrid
            return next();
        })
        .catch(err => next({
            log: `Something went wrong with tableController.getTable. Hint: ${err.hint}`,
            message: { err: 'Unable to retrieve table data' }
        }))
};

tableController.editRows = (req, res, next) => {
    const { table } = req.params
    const { from, to, updated } = req.body
    const column = Object.keys(updated)[0]
    const value = updated[column]

    db.query(query.editRow(table, from, to, column, value))
        .then(data => {
            return next();
        })
        .catch(err => next({
            log: `Something went wrong with tableController.editRows. Hint: ${err.hint}`,
            message: { err: 'Unable to edit table data' }
        }))
};

tableController.addRow = (req, res, next) => {
    const { table } = req.params;

    db.query(query.addRow(table, req.body))
        .then(data => {
            res.locals.addedRow = true;
            return next();
        })
        .catch(err => {
            res.locals.addedRow = false;
            next()
        })
    // const { table } = req.params
    // const { fromRow, toRow, updated } = req.body
    // const column = Object.keys(updated)[0]
    // const value = updated[column]

    // db.query(query.editRow(table, fromRow + 1, toRow + 1, column, value))
    //     .then(data => {
    //         return next();
    //     })
    //     .catch(err => next({
    //         log: `Something went wrong with tableController.getTable. Hint: ${err.hint}`,
    //         message: { err: 'Unable to retrieve table data' }
    //     }))
};

module.exports = tableController;
