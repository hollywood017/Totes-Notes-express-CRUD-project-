const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const myNoteSchema = new Schema(
  {
    title: { type: String },
    content: { type: String },
    user: {type: String}
  },
  {
    timstamps:true
  }
);

const NoteModel = mongoose.model('Note', myNoteSchema);

module.exports = NoteModel;
