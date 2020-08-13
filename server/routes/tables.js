const express = require("express");
const router = express.Router();

const tableController = require("../controllers/tableController");

router.get('/', tableController.getDatabase, (req, res, next) => {
    res.status(200).json(res.locals.tables)

})

router.get(
    "/:table",
    tableController.getTable,
    (req, res) => {
        return res.status(200).json(res.locals.table);
    }
);

router.put(
    "/:table",
    tableController.editRows,
    (req, res) => {
        return res.status(200).json({});
    }
);

router.post(
    "/:table",
    tableController.addRow,
    (req, res) => {
        return res.status(200).json(res.locals.addedRow);
    }
);

router.delete(
    "/:table",
    tableController.deleteRow,
    (req, res) => {
        return res.status(200).json({});
    }
);

module.exports = router;
