const express = require("express");
const router = express.Router();
const protect = require("../middleWare/authMiddleware");
const { createCustomerOrder,getCustomersByUserId, generateInvoice,getCustomers,customerOrders } = require("../controllers/customerController");
const { upload } = require("../utils/fileUpload");

router.post("/",protect, createCustomerOrder);
router.get("/orders",protect, customerOrders);
// router.patch("/:id", protect, upload.single("image"), updateProduct);
router.get("/:id", getCustomersByUserId);
router.get("/", protect, getCustomers);
// router.delete("/:id", protect, deleteProduct);
router.get("/invoice/:customer_id",generateInvoice)
module.exports = router;
