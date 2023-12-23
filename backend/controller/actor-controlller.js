const { isValidObjectId } = require("mongoose");
const Actor = require("../models/actor");
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

exports.create = async (req, res) => {
  const { name, about, gender } = req.body;
  const { file } = req;

  const newActor = new Actor({ name, about, gender });

  if (file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { gravity: "face", height: 500, width: 500, crop: "thumb" }
    );
    newActor.avatar = { url: secure_url, public_id };
  }

  await newActor.save();
  res.status(201).json({
    id: newActor._id,
    name,
    about,
    gender,
    avatar: newActor.avatar && newActor.avatar.url,
  });
};

exports.update = async (req, res) => {
  const { name, about, gender } = req.body;
  const { file } = req;
  const { actorId } = req.params;

  if (!isValidObjectId(actorId)) return res.json({ error: "Invalid request!" });
  const actor = await Actor.findById(actorId);

  if (!actor) return res.json({ error: "Invalid request, record not found!" });

  const public_id = actor.avatar && actor.avatar.public_id;

  if (public_id && file) {
    const { result } = await cloudinary.uploader.destroy(public_id);
    if (result !== "ok") {
      return res.json({ error: "Could not remove image form cloud" });
    }
  }

  if (file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { gravity: "face", height: 100, width: 100, crop: "thumb" }
    );
    actor.avatar = { url: secure_url, public_id };
  }

  actor.name = name;
  actor.about = about;
  actor.gender = gender;

  await actor.save();
  res.status(201).json({
    id: actor._id,
    name,
    about,
    gender,
    avatar: actor.avatar && actor.avatar.url,
  });
};

exports.deleteActor = async (req, res) => {
  const { actorId } = req.params;

  if (!isValidObjectId(actorId)) return res.json({ error: "Invalid request!" });
  const actor = await Actor.findById(actorId);

  if (!actor) return res.json({ error: "Invalid request, record not found!" });

  const public_id = actor.avatar && actor.avatar.public_id;

  if (public_id) {
    const { result } = await cloudinary.uploader.destroy(public_id);
    if (result !== "ok") {
      return res.json({ error: "Could not remove image from cloud" });
    }
  }
  await Actor.findByIdAndDelete(actorId);
  res.json({ message: "Record removed sucessfully" });
};

exports.searchActor = async (req, res) => {
  const { query } = req;
  query.name;
  const result = await Actor.find({ $text: { $search: `"${query.name}"` } });

  res.json(result);
};

exports.getLatestActors = async (req, res) => {
  const result = await Actor.find().sort({ createdAt: "-1" }).limit(12);
  res.json(result);
};

exports.getSingleActor = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) return res.json({ error: "Invalid request!" });

  const actor = await Actor.findById(id);

  if (!actor)
    return res.status(404).json({ error: "Invalid request, Actor not found!" });

  res.json(actor);
};
