
const query = {};

query.test = (tableName) => {
    return `SELECT * FROM "${tableName}" LIMIT 5`
}

//must be sorted
query.allTables = () => {
    return "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema' AND  ORDER BY tablename"
}

//must be sorted
query.getAllTablesAndHeaders = () => {
    // return "SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE table_schema != 'pg_catalog' AND table_schema != 'information_schema'"
    return "SELECT table_name, column_name, ordinal_position, is_nullable, data_type FROM INFORMATION_SCHEMA.COLUMNS WHERE table_schema != 'pg_catalog' AND table_schema != 'information_schema' ORDER BY table_name, ordinal_position"
}

//must be sorted
query.pullTable = (tableName) => {
    return `SELECT * FROM "${tableName}" ORDER BY _id`
}

query.editRow = (table, rowNumFrom, rowNumTo, column, value) => {
    return `
        UPDATE ${table}
        SET ${column} = '${value}'
        WHERE _id >= ${rowNumFrom} AND _id <= ${rowNumTo};`
}

query.addRow = (table, row) => {
    console.log(row)
    let columnNames = "";
    let values = "";

    for (let k in row) {
        if (k !== "_id") {
            columnNames += `${k}, `
            values += `'${row[k]}', `
        }
    }
    // console.log(columnNames.slice(0, -2))
    // console.log(values.slice(0, -2))

    return `
        INSERT INTO ${table}(${columnNames.slice(0, -2)})
        VALUES(${values.slice(0, -2)});
    `


}

module.exports = query;