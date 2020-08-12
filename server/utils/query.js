
const query = {};

query.test = (tableName) => {
    return `SELECT * FROM "${tableName}" LIMIT 5`
}

query.allTables = () => {
    return "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema' ORDER BY tablename"
}

query.getAllTablesAndHeaders = () => {
    // return "SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE table_schema != 'pg_catalog' AND table_schema != 'information_schema'"
    return "SELECT table_name, column_name, ordinal_position, is_nullable, data_type FROM INFORMATION_SCHEMA.COLUMNS WHERE table_schema != 'pg_catalog' AND table_schema != 'information_schema' ORDER BY table_name, ordinal_position"
}

query.pullTable = (tableName) => {
    return `SELECT * FROM "${tableName}" LIMIT 5`
}

query.editRow = (table, rowNumFrom, rowNumTo, column, value) => {
    return `
        UPDATE ${table}
        SET ${column} = '${value}'
        WHERE _id >= ${rowNumFrom} AND _id <= ${rowNumTo};`
}

module.exports = query;