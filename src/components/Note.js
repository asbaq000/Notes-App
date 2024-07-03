import React from "react";

const Note = ({ note, onDelete, onEdit }) => {
  return (
    <div className="note">
      <h3>{note.title}</h3>
      <p>{note.content}</p>
      {note.reminder && (
        <p>
          <em>Reminder: {new Date(note.reminder).toLocaleString()}</em>
        </p>
      )}
      <button onClick={() => onEdit(note)}>Edit</button>
      <button onClick={() => onDelete(note.id)}>Delete</button>
    </div>
  );
};

export default Note;
