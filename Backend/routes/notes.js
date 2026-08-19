const express = require("express");
const router = express.Router();
const notesModel = require("../models/Notes");
//middleware-ifLoggedIn
const ifLoggedIn = require("../middleware/ifLoggedIn");

//require validator
const { body, validationResult, cookie } = require("express-validator");

//Creating Note
router.post(
  "/createnotes",
  ifLoggedIn,
  [
    body("title").isLength({ min: 3 }),
    body("description").isLength({ min: 5 }),
  ],
  async (req, res) => {
    //validation error handling
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }

    try {
      let note = await notesModel.create({
        user: req.user._id,
        title: req.body.title,
        description: req.body.description,
        tags: req.body.tags,
      });
      res.json(note);
    } catch (error) {
      console.error(error.message);
      res.status(500).json(error.message);
    }
  },
);

//Get All Notes
router.get("/getallnotes", ifLoggedIn, async (req, res) => {
  let notes = await notesModel.find({ user: req.user._id });
  res.json(notes);
});

//Update Note
router.put(
  "/updatenotes/:id",
  ifLoggedIn,
  [
    body("title").isLength({ min: 3 }),
    body("description").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let { title, description, tags } = req.body;
    //validation error handling
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }

    try {
      // new note:
      let newnote = {};
      if (title) {
        newnote.title = title;
      }
      if (description) {
        newnote.description = description;
      }
      if (tags) {
        newnote.tags = tags;
      }

      //find note to be updated:
      let note = await notesModel.findById(req.params.id);
      if (!note) {
        return res.status(404).send("Not Found!");
      }
      if (note.user.toString() !== req.user._id.toString()) {
        return res.status(401).send("Not Allowed!");
      }
      note = await notesModel.findByIdAndUpdate(
        req.params.id,
        { $set: newnote },
        { new: true },
      );
      res.json(note);
    } catch (error) {
      console.error(error.message);
      res.status(500).json(error.message);
    }
  },
);

//Delete Note
router.delete("/deletenotes/:id", ifLoggedIn, async (req, res) => {
  try {
    //find note to be deleted:
    let note = await notesModel.findById(req.params.id);

    //if note not found
    if (!note) {
      return res.status(404).send("Not Found!");
    }

    //if other user tries to make chnges in other user note
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).send("Not Allowed!");
    }

    note = await notesModel.findByIdAndDelete(req.params.id);
    res.json({ Success: "The Note has been deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json(error.message);
  }
});

module.exports = router;
