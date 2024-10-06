const express = require('express')
const productController = require("../controllers/Product")
const router = express.Router()

const {upload} = require('../utils/fileUpload');

router
    .post("/", upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'images', maxCount: 10 }]), productController.create)
    .get("/", productController.getAll)
    .get("/:id", productController.getById)
    .patch("/:id", productController.updateById)
    .patch("/undelete/:id", productController.undeleteById)
    .delete("/:id", productController.deleteById)

module.exports = router