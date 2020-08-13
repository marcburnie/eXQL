const query = {};

//must be sorted
query.allTables = () => {
    return "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema' AND  ORDER BY tablename"
}

//get list of keys
query.allKeys = () => {
    return `
        SELECT t.table_catalog,
            t.table_schema,
            t.table_name,
            kcu.constraint_name,
            kcu.column_name,
            kcu.ordinal_position
        FROM INFORMATION_SCHEMA.TABLES t
        LEFT JOIN INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
            ON tc.table_catalog = t.table_catalog
            AND tc.table_schema = t.table_schema
            AND tc.table_name = t.table_name
            AND tc.constraint_type = 'PRIMARY KEY'
        LEFT JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu
            ON kcu.table_catalog = tc.table_catalog
            AND kcu.table_schema = tc.table_schema
            AND kcu.table_name = tc.table_name
            AND kcu.constraint_name = tc.constraint_name
        WHERE t.table_schema NOT IN ('pg_catalog', 'information_schema')
        ORDER BY t.table_catalog,
            t.table_schema,
            t.table_name,
            kcu.constraint_name,
            kcu.ordinal_position;`
}

//must be sorted
query.getAllTablesAndHeaders = () => {
    // return "SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE table_schema != 'pg_catalog' AND table_schema != 'information_schema'"
    return "SELECT table_name, column_name, ordinal_position, is_nullable, data_type FROM INFORMATION_SCHEMA.COLUMNS WHERE table_schema != 'pg_catalog' AND table_schema != 'information_schema' AND table_name != 'pg_stat_statements' ORDER BY table_name, ordinal_position"
}

//must be sorted
query.pullTable = (tableName, primary_key) => {
    return `SELECT * FROM "${tableName}" ORDER BY ${primary_key}`
}

query.editRow = (table, primary_key, rowNumFrom, rowNumTo, column, value) => {
    return `
        UPDATE ${table}
        SET ${column} = '${value}'
        WHERE ${primary_key} >= ${rowNumFrom} AND ${primary_key} <= ${rowNumTo};`
}

query.addRow = (table, primary_key, row) => {

    let columnNames = "";
    let values = "";

    for (let k in row) {
        if (k !== primary_key) {
            columnNames += `${k}, `
            values += `'${row[k]}', `
        }
    }

    return `
        INSERT INTO ${table}(${columnNames.slice(0, -2)})
        VALUES(${values.slice(0, -2)});
    `
}

query.deleteRow = (table, primary_key, row) => {
    return `
        DELETE FROM ${table} WHERE ${primary_key} = ${row}
    `
}

module.exports = query;