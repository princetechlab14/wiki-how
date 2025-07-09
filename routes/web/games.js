const express = require("express");
const router = express.Router();
const gamesController = require("../../controller/gamesController");
const { upload } = require("../../services/fileupload");

router.get("/", gamesController.getIndex);
router.get("/list", gamesController.getData);
router.get("/create", gamesController.create);
router.post("/store", upload.fields([{ name: "logo", maxCount: 1 }, { name: "banner", maxCount: 1 }]), gamesController.store);
router.post("/delete/:id", gamesController.deleteRecord);
router.get("/:id/edit", gamesController.edit);
router.post("/:id/update", upload.fields([{ name: "logo", maxCount: 1 }, { name: "banner", maxCount: 1 }]), gamesController.update);
router.post("/changestatus/:id", gamesController.changeStatus);

module.exports = router;
