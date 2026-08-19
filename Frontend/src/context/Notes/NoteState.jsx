import React, { useState } from "react";
import NoteContext from "./NoteContext";

const noteState = (props) => {
  //Bring backend deployed URL
  const url="https://inote-benk.onrender.com";


  const [notes, setNotes] = useState([]);

  //Fetching Notes from backend:
  const getNotes = async () => {
    const response = await fetch(`${url}notes/getallnotes`, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    setNotes(data);
  };

  //Add Note
  const addNote = async (title, description, tags) => {
    const response = await fetch(`${url}/notes/createnotes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
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
    const response = await fetch(
      `${url}/notes/deletenotes/${id}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );

    const data = await response.json();

    if (response.ok) {
      setNotes(notes.filter((note) => note._id !== id));
    }
  };

  //Edit Note
  const editingNote = async (id, title, description, tags) => {
    const response = await fetch(
      `${url}/notes/updatenotes/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title,
          description,
          tags,
        }),
      },
    );

    const updatedNote = await response.json();

    if (response.ok) {
      setNotes(notes.map((note) => (note._id === id ? updatedNote : note)));
    }
  };

  return (
    <NoteContext.Provider value={{ notes, getNotes, addNote, deleteNote, editingNote }}>
      {props.children}
    </NoteContext.Provider>
  );

};
export default noteState;
