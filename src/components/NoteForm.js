import React, { useState, useEffect } from "react";

const NoteForm = ({ addNote, editNote, currentNote, setCurrentNote }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [reminder, setReminder] = useState("");

  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setContent(currentNote.content);
      setReminder(currentNote.reminder || "");
    }
  }, [currentNote]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const note = { id: Date.now().toString(), title, content, reminder };
    if (currentNote) {
      editNote({ ...currentNote, title, content, reminder });
      setCurrentNote(null);
    } else {
      addNote(note);
    }
    setTitle("");
    setContent("");
    setReminder("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <input
        type="datetime-local"
        value={reminder}
        onChange={(e) => setReminder(e.target.value)}
      />
      <button type="submit">{currentNote ? "Update Note" : "Add Note"}</button>
    </form>
  );
};

export default NoteForm;
