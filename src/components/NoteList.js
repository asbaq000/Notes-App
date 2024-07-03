import React from "react";

const NoteList = ({ notes, onDelete, onEdit }) => {
  return (
    <ul>
      {notes.map((note) => (
        <li key={note.id}>
          <h2>{note.title}</h2>
          <p>{note.content}</p>
          <p>
            {note.reminder
              ? new Date(note.reminder).toLocaleString()
              : "No Reminder"}
          </p>
          <button onClick={() => onEdit(note)}>Edit</button>
          <button onClick={() => onDelete(note.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;
