import React from 'react'
import Home from './components/Home/Home'
import Login from './components/Login/Login'
import NoteState from './context/Notes/NoteState'
import { Route, Routes } from 'react-router-dom'
import Notes from './components/Notes/Notes'

function App() {
  return (
   <>
   <NoteState>
   <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/notes" element={<Notes/>}/>   
   </Routes>
   </NoteState>
   <div style={{ width:"100%",height:"5vh",marginBottom:0}}>
   </div>
   </>
  )
}

export default App
