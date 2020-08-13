const query = require("../utils/query");
const jwt = require('jsonwebtoken');

const { Pool } = require('pg');

const clientCode = 'someSecretCode';

// let PG_URI = 'postgres://gvqpnhsz:1xQgVrDYi0X3DiC1qSzu571d5K0yc4FW@ruby.db.elephantsql.com:5432/gvqpnhsz';

const db = {
    createPool: (PG_URI) => this.pool = new Pool({ connectionString: PG_URI }),
    query: (text, params, callback) => {
        console.log('executed query', text);
        return this.pool.query(text, params, callback);
    }
}

const tableController = {};

//validates DB URI
tableController.verifyDatabase = (req, res, next) => {
    //initialize DB
    db.createPool(req.body.url)
    db.query(query.getAllTablesAndHeaders())
        .then(data => {
            return next();
        })
        .catch(err => res.redirect("/login"))
}

tableController.getDatabase = (req, res, next) => {
    //initialize DB
    const { DB_URI } = jwt.verify(req.cookies.DB_URI, clientCode);
    db.createPool(DB_URI);
    //requires sorted tables list
    db.query(query.getAllTablesAndHeaders())
        .then(data => {
            db.query(query.allKeys())
                .then(keys => {
                    const tables = [];
                    let tableName = ""
                    let j = -1;
                    for (let i = 0; i < data.rows.length; i++) {
                        //check if table name is different
                        if (tableName !== data.rows[i].table_name) {
                            tableName = data.rows[i].table_name;
                            j++;

                            //find primary key for table
                            let key
                            keys.rows.some(t => {
                                if (t.table_name === tableName) {
                                    key = t.column_name;
                                    return true;
                                }
                            })
                            //create new element in tables array
                            tables.push({
                                table_name: tableName,
                                primary_key: key,
                                columns: []
                            })
                        }
                        //add new column
                        tables[j].columns.push({
                            column_name: data.rows[i].column_name,
                            is_nullable: data.rows[i].is_nullable,
                            data_type: data.rows[i].data_type,
                        })
                    }
                    res.locals.tables = tables
                    return next();
                })
        })
        .catch(err => next({
            log: `Something went wrong with tableController.getDatabase. Hint: ${err.hint}`,
            message: { err: 'Unable to retrieve data' }
        }))

}

tableController.getTable = (req, res, next) => {
    const { table } = req.params
    const { primary_key } = req.query

    //initialize DB
    const { DB_URI } = jwt.verify(req.cookies.DB_URI, clientCode);
    db.createPool(DB_URI)

    db.query(query.pullTable(table, primary_key))
        .then(data => {
            const dataGrid = {};
            dataGrid.columns = [];
            dataGrid.rows = data.rows;
            dataGrid.name = table;
            dataGrid.primary_key = primary_key
            //create additional row for editing
            dataGrid.rows.push({ ...data.rows[0] })

            for (let cName in dataGrid.rows[dataGrid.rows.length - 1]) {
                //create additional column
                dataGrid.columns.push({ key: cName, name: cName, editable: true, filterable: true, sortable: true })
                //clear entry
                dataGrid.rows[dataGrid.rows.length - 1][cName] = ""
            }


            res.locals.table = dataGrid
            return next();
        })
        .catch(err => next({
            log: `Something went wrong with tableController.getTable. Hint: ${err.hint}`,
            message: { err: 'Unable to retrieve table data. Database did not respond.' }
        }))
};

tableController.editRows = (req, res, next) => {
    const { table } = req.params
    const { primary_key } = req.query
    const { from, to, updated } = req.body
    const column = Object.keys(updated)[0]
    const value = updated[column]

    //initialize DB
    const { DB_URI } = jwt.verify(req.cookies.DB_URI, clientCode);
    db.createPool(DB_URI)

    db.query(query.editRow(table, primary_key, from, to, column, value))
        .then(data => {
            return next();
        })
        .catch(err => next({
            log: `Something went wrong with tableController.editRows. Hint: ${err.hint}`,
            message: { err: 'Unable to edit table data.  Database did not respond.' }
        }))
};

tableController.addRow = (req, res, next) => {
    const { table } = req.params;
    const { primary_key } = req.query
    //initialize DB
    const { DB_URI } = jwt.verify(req.cookies.DB_URI, clientCode);
    db.createPool(DB_URI)

    db.query(query.addRow(table, primary_key, req.body))
        .then(data => {
            res.locals.addedRow = true;
            return next();
        })
        .catch(err => {
            res.locals.addedRow = false;
            next()
        })
};

tableController.deleteRow = (req, res, next) => {
    const { table } = req.params;
    const { id } = req.body
    const { primary_key } = req.query
    //initialize DB
    const { DB_URI } = jwt.verify(req.cookies.DB_URI, clientCode);
    db.createPool(DB_URI)

    db.query(query.deleteRow(table, primary_key, id))
        .then(data => {
            res.locals.addedRow = true;
            return next();
        })
        .catch(err => {
            res.locals.addedRow = false;
            next()
        })
};

module.exports = tableController;
