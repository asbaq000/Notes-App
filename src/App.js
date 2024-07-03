import React, { useState, useEffect, useMemo } from "react";
import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./App.css";

// Open a connection to the IndexedDB database
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("NotesDB", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("notes")) {
        db.createObjectStore("notes", { keyPath: "id" });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

const fetchNotes = async () => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("notes", "readonly");
    const store = transaction.objectStore("notes");
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

const saveNote = async (note) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("notes", "readwrite");
    const store = transaction.objectStore("notes");
    const request = store.put(note);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

const deleteNote = async (id) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("notes", "readwrite");
    const store = transaction.objectStore("notes");
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

const App = () => {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const notesArray = await fetchNotes();
        setNotes(notesArray);
      } catch (error) {
        console.error("Failed to fetch notes from IndexedDB", error);
      }
    };

    loadNotes();
  }, []);

  const addNote = async (note) => {
    try {
      await saveNote(note);
      setNotes((prevNotes) => [...prevNotes, note]);
    } catch (error) {
      console.error("Failed to add note to IndexedDB", error);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await deleteNote(id);
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    } catch (error) {
      console.error("Failed to delete note from IndexedDB", error);
    }
  };

  const editNote = async (updatedNote) => {
    try {
      await saveNote(updatedNote);
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === updatedNote.id ? updatedNote : note
        )
      );
    } catch (error) {
      console.error("Failed to update note in IndexedDB", error);
    }
  };

  const filteredNotes = useMemo(
    () =>
      notes.filter(
        (note) =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [notes, searchQuery]
  );

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <div className="app">
      <h1>Notes App</h1>
      <div className="search-container">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar"
          />
          <button
            type="submit"
            className="search-button"
            onClick={handleSearch}
          >
            <i className="fas fa-search"></i>
          </button>
        </div>
      </div>
      <NoteForm
        addNote={addNote}
        editNote={editNote}
        currentNote={currentNote}
        setCurrentNote={setCurrentNote}
      />
      <NoteList
        notes={filteredNotes}
        onDelete={handleDeleteNote}
        onEdit={setCurrentNote}
      />
    </div>
  );
};

export default App;
