const express = require('express');
const NoteModel = require('../models/note-model.js');
const router = express.Router();

router.get('/notes/new', (req, res, next) => {
  if(req.user){
    res.render('note-views/add-a-note.ejs');
  }
  else{
    res.redirect('/signup');
  }
});
router.post('/notes', (req, res, next) => {
  const theNote = new NoteModel({
    title : req.body.noteTitle,
    content: req.body.noteContent,
    user: req.user.email
  });

  theNote.save((err) => {
    if (err){
      next(err);
      return;
    }
    res.redirect('/my-notes');
  });
});

router.get('/my-notes', (req, res, next) => {
  NoteModel.find(
    //find the notes owned by the logged in user
    { user: req.user._id },

    (err, noteResults) => {
      if(err) {
        next(err);
        return;
      }
      if(req.user){
        res.locals.notesAndStuff = noteResults;
        res.render('note-views/note-list-view.ejs');

      }
      else{
        res.redirect('/signup');
      }
    }
  );
});

module.exports = router;
