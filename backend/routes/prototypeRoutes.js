const express = require("express");
const prototypeControllers = require("../controllers/prototypeControllers");
const router = express.Router();

// @route - /api/v1/prototype/
router
  .route("/")
  .get(prototypeControllers.getAllPrototypes)
  .post(prototypeControllers.createNewPrototype);

// @route - /api/v1/prototype/someid
router
  .route("/:id")
  .put(prototypeControllers.updatePrototypeById)
  .delete(prototypeControllers.deletePrototypeById);
module.exports = router;
