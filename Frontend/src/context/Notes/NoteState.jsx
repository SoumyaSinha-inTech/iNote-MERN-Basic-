import React, { useState } from "react";
import NoteContext from "./NoteContext";

const noteState = (props) => {
  //Bring backend deployed URL
  const url = "https://inote-benk.onrender.com";

  const [notes, setNotes] = useState([]);

  //Fetching Notes from backend:
  const getNotes = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${url}/notes/getallnotes`, {
      method: "GET",
      headers: {
        "auth-token": token,
      },
    });

    const data = await response.json();

    if (response.ok) {
      setNotes(data);
    } else {
      console.log(data);
    }
  };

  //Add Note
  const addNote = async (title, description, tags) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${url}/notes/createnotes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
      body: JSON.stringify({
        title,
        description,
        tags,
      }),
    });

    const note = await response.json();

    if (response.ok) {
      setNotes(notes.concat(note));
    } else {
      console.log(note);
    }
  };

  //Delete Note
  const deleteNote = async (id) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${url}/notes/deletenotes/${id}`, {
      method: "DELETE",
      headers: {
        "auth-token": token,
      },
    });

    const data = await response.json();

    if (response.ok) {
      setNotes(notes.filter((note) => note._id !== id));
    }
  };

  //Edit Note
  const editingNote = async (id, title, description, tags) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${url}/notes/updatenotes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
      body: JSON.stringify({
        title,
        description,
        tags,
      }),
    });

    const updatedNote = await response.json();

    if (response.ok) {
      setNotes(notes.map((note) => (note._id === id ? updatedNote : note)));
    }
  };

  return (
    <NoteContext.Provider
      value={{ notes, getNotes, addNote, deleteNote, editingNote }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};
export default noteState;
