const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.post("/create", cartController.createCart);
router.get("/:userId", cartController.getCart);
router.put("/update", cartController.updateCart);
router.delete("/clear/:userId", cartController.deleteCart);

module.exports = router;