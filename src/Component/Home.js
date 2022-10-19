import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import "../App.css"
import axios from "axios";
import { useLocation } from "react-router-dom";
var socket = io('ws://localhost:3010');

function Home() {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [message, setMessage] = useState("")
    const [mess, setMess] = useState([]);
    const location  = useLocation();
    
    useEffect(() => {
      socket.on('connect', () => {
        setIsConnected(true);
      });
  
      socket.on('disconnect', () => {
        setIsConnected(false);
      });

      socket.on('server response', (dataGot) => {
        setMess(oldMsgs => [...oldMsgs, dataGot])
      });
  
      return () => {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('pong');
        socket.off('server response');
      };
    }, []);
  
    const handleSendMessage = () => {
      socket.emit('chat message', {message: message, user: location?.state.user.name});
      setMessage("")
    }

    return (
        <>
        <div style={{width: "100%", height: "10%", backgroundColor: "", border: "0.1px solid"}}>
            <h4>Welcome</h4>
        </div>
        <div className="container1">
            <div className="site_bar">
                <h4>Site bar</h4>
            </div>
            <div className="content1">
                <div className="content_message">
                    {
                        mess?.map((item, key) => (
                            <p key={key}>{item?.user} - {item?.message}</p>
                        ))
                    }
                </div>
                <div className="content_input">
                    <input value={message} onChange={(e) => setMessage(e.target.value)} style={{width: "80%"}}/>
                    <button onClick={ handleSendMessage } style={{width: "20%"}}>Send</button>
                </div>
            </div>
        </div>
      </>
    );
  }

  export default Home;