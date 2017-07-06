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
router.post('/notes/new', (req, res, next) => {
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
    { user: req.user.email },


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

router.get('/:id/edit', (req, res, next) => {
  const noteId = req.params.id;

  NoteModel.findById(noteId, (err, note) => {
    if (err) { return next(err); }
    res.locals.noteId = noteId;
    res.render('note-views/edit-a-note.ejs', { note: note});
  });
});

router.post('/note/edit/:id', (req, res, next) => {


  const noteId = req.params.id;

  const updates = {
      title: req.body.noteTitle,
      content: req.body.noteContent
  };

  NoteModel.findByIdAndUpdate(noteId, updates, (err, note) => {
    if (err){ return next(err); }
     res.redirect('/my-notes');
  });
});

router.post('/notes/:id/delete', (req, res, next) => {
  console.log('🚨🚨🚨🚨🚨🚨🚨🚨');
  const id = req.params.id;

  NoteModel.findByIdAndRemove(id, (err, note) => {
    if (err){ return next(err); }

    return res.redirect('/my-notes');
  });

});


module.exports = router;
