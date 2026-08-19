import React, { useEffect, useState, useRef } from "react";
import "./Notes.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import NoteContext from "../../context/Notes/NoteContext";

function Notes() {
  //Bring backend deployed URL
  const url="https://inote-benk.onrender.com"

  const [alert, setAlert] = useState("");
  const navigate = useNavigate();
  const context = useContext(NoteContext);
  const { notes, addNote, deleteNote, getNotes, editingNote } = context;
  useEffect(() => {
    context.getNotes();
  }, []);

  //Form Handling:
  const [note, setNote] = useState({ title: "", description: "", tags: "" });
  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };
  const handleClick = (e) => {
    e.preventDefault();
    if (note.title.length < 3) {
        setAlert("Title must contain at least 3 characters.");
        return;
    }

    if (note.description.length < 5) {
        setAlert("Description must contain at least 5 characters.");
        return;
    }

    if (note.tags.length < 2) {
        setAlert("Tags must contain at least 2 characters.");
        return;
    }
    addNote(note.title, note.description, note.tags);
    setNote({ title: "", description: "", tags: "" });
  };

  //LogOut {BACKEND}
  const handleLogout = async () => {
    await fetch(`${url}/user/logout`, {
      method: "POST",
      credentials: "include",
    });

    navigate("/");
  };

  //To get loggin User info
  const [foundUser, setUser] = useState([]);
  useEffect(() => {
    //make fn
    const getuser = async () => {
      let response = await fetch(`${url}/user/getuser`, {
        method: "POST",
        credentials: "include",
      });
      const user = await response.json();
      setUser(user);
    };
    // now call fn
    getuser();
  }, []);

  //update note(edit)
  const [editNote, setEditNote] = useState({
    id: "",
    etitle: "",
    edescription: "",
    etags: "",
  });

  const ref = useRef(null);
  const updateNote = (note) => {
    ref.current.click();
    setEditNote({
      id: note._id,
      etitle: note.title,
      edescription: note.description,
      etags: note.tags,
    });
  };

  const closeRef = useRef(null);
  const chngNote = (e) => {
    e.preventDefault();
    if (editNote.etitle.length < 3) {
      setAlert("Title must contain at least 3 characters.");
      return;
    }

    if (editNote.edescription.length < 5) {
      setAlert("Description must contain at least 5 characters.");
      return;
    }

    if (editNote.etags.length < 2) {
      setAlert("Tags must contain at least 2 characters.");
      return;
    }

    editingNote(
      editNote.id,
      editNote.etitle,
      editNote.edescription,
      editNote.etags,
    );
    closeRef.current.click();
  };

  
    useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert("");
      }, 2000);
  
      return () => clearTimeout(timer);
    }
  }, [alert]);
  

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a
            className="navbar-brand"
            style={{
              color: "rgb(19, 95, 188)",
              fontSize: "25px",
              fontWeight: "600",
              fontFamily: "Stack Sans Text",
            }}
          >
            iN
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item d-flex">
                <Link className="nav-link" onClick={handleLogout}>
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {alert && (
    <div className="alert alert-danger" role="alert">
        {alert}
    </div>
)}

      <button
        ref={ref}
        type="button"
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Launch demo modal
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Edit Note
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={chngNote}>
                <input
                  style={{
                    width: "100%",
                    height: "45px",
                    marginTop: "12px",
                    padding: "0 10px",
                    backgroundColor: "black",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                    fontFamily: '"Open Sans", sans-serif',
                  }}
                  type="text"
                  placeholder="Note title"
                  name="title"
                  value={editNote.etitle}
                  onChange={(e) =>
                    setEditNote({ ...editNote, etitle: e.target.value })
                  }
                  required
                />

                <br />

                <textarea
                  style={{
                    width: "100%",
                    height: "18vh",
                    minHeight: "130px",
                    marginTop: "16px",
                    padding: "10px",
                    backgroundColor: "rgba(26, 26, 26, 0.81)",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                    resize: "none",
                    fontFamily: '"Open Sans", sans-serif',
                  }}
                  name="description"
                  placeholder="Note content"
                  value={editNote.edescription}
                  onChange={(e) =>
                    setEditNote({ ...editNote, edescription: e.target.value })
                  }
                  required
                />

                <br />

                <input
                  style={{
                    width: "100%",
                    height: "45px",
                    marginTop: "12px",
                    padding: "0 10px",
                    backgroundColor: "black",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                    fontFamily: '"Open Sans", sans-serif',
                  }}
                  type="text"
                  placeholder="Note tag"
                  name="tags"
                  value={editNote.etags}
                  onChange={(e) =>
                    setEditNote({ ...editNote, etags: e.target.value })
                  }
                  required
                />
                <div className="modal-footer">
                  <button
                    ref={closeRef}
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Update Note
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="cont">
        <div className="row">
          {/* LEFT SIDE - ADD NOTE */}
          <div className="col-md-4">
            <div className="noteWrite">
              <div className="welcome">
                <h1>Welcome, {foundUser.name}!</h1>
              </div>

              <div className="noteadd">
                <h4 style={{ fontFamily: "Stack Sans Text" }}>Add a Note</h4>

                <form onSubmit={handleClick}>
                  <input
                    type="text"
                    placeholder="Note title"
                    name="title"
                    onChange={onChange}
                    value={note.title}
                    required
                  />

                  <br />

                  <textarea
                    style={{ minHeight: "16vh" }}
                    name="description"
                    placeholder="Note content"
                    value={note.description}
                    onChange={onChange}
                    required
                  />

                  <br />

                  <input
                    type="text"
                    placeholder="Note tag"
                    name="tags"
                    value={note.tags}
                    onChange={onChange}
                    required
                  />

                  <br />

                  <input
                    id="submit"
                    value="Add Note"
                    type="submit"
                  />
                </form>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - NOTES */}
          <div className="col-md-8" id="noteShow">
            <div className="row g-4">
              {notes.map((note) => {
                return (
                  <div className="col-md-6" key={note._id}>
                    <div className="card noteCard">
                      <div className="card-body">
                        <h2 className="noteTitle">{note.title}</h2>
                        <p className="noteDescription">{note.description}</p>
                      </div>
                      <div className="but">
                        <div className="delete">
                          <svg
                            onClick={() => {
                              deleteNote(note._id);
                            }}
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="red"
                            className="bi bi-trash"
                            viewBox="0 0 16 16"
                          >
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                          </svg>
                        </div>
                        <div className="edit">
                          <svg
                            onClick={() => updateNote(note)}
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="black"
                            className="bi bi-pencil-square"
                            viewBox="0 0 16 16"
                          >
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path
                              fillRule="evenodd"
                              d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                            />
                          </svg>
                        </div>
                        <div className="tag" style={{ paddingLeft: "60%" }}>
                          <span className="badge text-bg-info">
                            {note.tags}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Notes;
