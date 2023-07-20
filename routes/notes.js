const express = require("express");
const { find } = require("../models/user");
const fetchuser = require("../middleware/fecthuser");
const Notes = require("../models/notes");
const router = express.Router();

router.get("/fetchAllnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("some error occured");
  }
});

router.post("/addNotes", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;

    const note = new Notes({
      title,
      description,
      tag,
      user: req.user.id,
    });

    const saveNotes = await note.save();
    res.json(saveNotes);
  } catch (error) {
    console.log(error.message);
    res.status(500).json("some error occured");
  }
});

// updating notes

router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, tag, description } = req.body;

    const newNote = {};

    if (title) {
      newNote.title = title;
    }
    if (tag) {
      newNote.tag = tag;
    }
    if (description) {
      newNote.description = description;
    }

    //find note and update it
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );

    res.json({ note });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("some error occured");
  }
});

//delete note

router.delete("/deletenote/:id",fetchuser, async (req, res) => {
  try {
    let note = await Notes.findById(req.params.id);

    if (!note) {
      return res.status(404).send("Not found");
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("not allowed");
    }

    note = await Notes.findByIdAndDelete(req.params.id);

    res.json("successfully deleted the note");


  } catch (error) {
    console.log(error.message);
    res.status(500).send("some error occured");
  }
});

module.exports = router;
