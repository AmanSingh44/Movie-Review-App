const express = require("express");
const router = express.Router();
const {
  create,
  update,
  deleteActor,
  searchActor,
  getLatestActors,
  getSingleActor,
} = require("../controller/actor-controlller");
const { uploadImage } = require("../middlewares/multer");
const { actorInfoValidator, validate } = require("../middlewares/validator");
const { isAdmin, isAuth } = require("../middlewares/auth");

router.post(
  "/create",
  isAuth,
  isAdmin,
  uploadImage.single("avatar"),
  actorInfoValidator,
  validate,
  create
);

router.post(
  "/update/:actorId",
  isAuth,
  isAdmin,
  uploadImage.single("avatar"),
  actorInfoValidator,
  validate,
  update
);

router.delete("/:actorId", isAuth, isAdmin, deleteActor);
router.get("/search", isAuth, isAdmin, searchActor);
router.get("/latest-uploads", isAuth, isAdmin, getLatestActors);
router.get("/single/:id", getSingleActor);

module.exports = router;
