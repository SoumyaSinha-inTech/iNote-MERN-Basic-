const express = require("express");
const router = express.Router();
const notesModel = require("../models/Notes");

const ifLoggedIn = require("../middleware/ifLoggedIn");

const { body, validationResult } = require("express-validator");

// Creating Note
router.post(
  "/createnotes",
  ifLoggedIn,
  [
    body("title").isLength({ min: 3 }),
    body("description").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(400).json({
        error: error.array(),
      });
    }

    try {
      const note = await notesModel.create({
        user: req.user.id,
        title: req.body.title,
        description: req.body.description,
        tags: req.body.tags,
      });

      res.json(note);
    } catch (error) {
      console.error(error.message);

      res.status(500).json({
        error: error.message,
      });
    }
  }
);


// Get All Notes
router.get(
  "/getallnotes",
  ifLoggedIn,
  async (req, res) => {
    try {
      const notes = await notesModel.find({
        user: req.user.id,
      });

      res.json(notes);
    } catch (error) {
      console.error(error.message);

      res.status(500).json({
        error: error.message,
      });
    }
  }
);


// Update Note
router.put(
  "/updatenotes/:id",
  ifLoggedIn,
  [
    body("title").isLength({ min: 3 }),
    body("description").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let { title, description, tags } = req.body;

    let error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(400).json({
        error: error.array(),
      });
    }

    try {
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

      let note = await notesModel.findById(req.params.id);

      if (!note) {
        return res.status(404).send("Not Found!");
      }

      if (note.user.toString() !== req.user.id.toString()) {
        return res.status(401).send("Not Allowed!");
      }

      note = await notesModel.findByIdAndUpdate(
        req.params.id,
        {
          $set: newnote,
        },
        {
          new: true,
        }
      );

      res.json(note);

    } catch (error) {
      console.error(error.message);

      res.status(500).json({
        error: error.message,
      });
    }
  }
);


// Delete Note
router.delete(
  "/deletenotes/:id",
  ifLoggedIn,
  async (req, res) => {
    try {

      let note = await notesModel.findById(req.params.id);

      if (!note) {
        return res.status(404).send("Not Found!");
      }

   
      if (note.user.toString() !== req.user.id.toString()) {
        return res.status(401).send("Not Allowed!");
      }

      await notesModel.findByIdAndDelete(req.params.id);

      res.json({
        success: "The Note has been deleted",
      });

    } catch (error) {
      console.error(error.message);

      res.status(500).json({
        error: error.message,
      });
    }
  }
);


module.exports = router;