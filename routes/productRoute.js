const express = require("express");
const { createProduct, getAllProducts } = require("../controllers/productController");

const router = express.Router();

router.route('/products').post(getAllProducts);
router.route('/admin/product/new').post(createProduct);

module.exports = router;