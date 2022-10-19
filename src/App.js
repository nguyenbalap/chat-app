import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import Home from "./Component/Home"
import NotFound from "./Component/NotFound";
import Login from "./Component/Login";
import Register from "./Component/Register";

export default function App() {
  return (
    <Router>
      <div style={{height: "500px", width: "600px"}}>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/register" element={<Register />}/>
          <Route  path="*" element={<NotFound />}/>
        </Routes>
      </div>
    </Router>
  );
}