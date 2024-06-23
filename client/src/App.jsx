import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import React from 'react'
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import ProtectedRoute from './components/ProtectedRoute';
import Create from './pages/Create';

function App() {

  const [user] = useAuthState(auth);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        {/*Add Protected Route component here which utilises user details from google auth above*/}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/create" element={<ProtectedRoute><Create /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
