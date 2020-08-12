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


// router.delete(
//     "/:id",
//     fileController.getFavs,
//     fileController.deleteFavs,
//     (req, res) => {
//         return res.status(200).json(res.locals);
//     }
// );

module.exports = router;
