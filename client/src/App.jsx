import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./auth/Login";
import ProtectedRoute from "./controller/PrivateRoute";


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoute Component={Home} />} />
          <Route path="/getstarted" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
