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
import { io } from "socket.io-client";
const socket = io("ws://localhost:3010")

export default function App() {
  return (
    <Router>
      <div style={{height: "500px", width: "900px", border: "1px solid"}}>
        <Routes>
          <Route path="/home" element={<Home socket={socket}/>}/>
          <Route path="/login" element={<Login socket={socket}/>}/>
          <Route path="/register" element={<Register />}/>
          <Route  path="*" element={<NotFound />}/>
        </Routes>
      </div>
    </Router>
  );
}