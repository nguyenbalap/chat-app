import { useState, useEffect, useRef } from "react";
import "../App.css"
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { get } from "../services/services";

function Home() {
    // const [isConnected, setIsConnected] = useState(socket.connected);
    const [message, setMessage] = useState("")
    const [mess, setMess] = useState([]);
    const location  = useLocation();
    const navigate = useNavigate();
    const socket = useRef(null);
    const [listUsersOnline, setListUsersOnline] = useState([]);
    console.log(listUsersOnline);

    useEffect(() => {
      socket.current = io(location?.state?.ws)
      // socket.current?.on('connect', (e) => {
      //   console.log(e)
      // });
  
      // socket.on('disconnect', () => {
      //   setIsConnected(false);
      // });

      socket.current?.on('server response', (dataGot) => {
        setMess(oldMsgs => [...oldMsgs, dataGot])
      });
  
      return () => {
        // socket.off('connect');
        // socket.off('disconnect');
        socket.current?.off('pong');
        socket.current?.off('server response');
      };
    }, []);

    useEffect(() => {
      if (!location?.state?.user) {
        navigate("/login")
      } else {
        getListUserOnline()
      }
    }, [])

    const getListUserOnline = async () => {
      const list = await get();
      setListUsersOnline(list); 
    }

    const handleSendMessage = () => {
      socket.current.emit('chat message', {message: message, user: location?.state.user.name});
      setMessage("")
    }
    
    return (
        <>
        <div style={{width: "100%", height: "10%", backgroundColor: "", border: "0.1px solid"}}>
            <h4>Welcome</h4>
        </div>
        <div className="container1">
            <div className="site_bar">
                <h4>Online</h4>
                {
                  listUsersOnline.length > 0 && listUsersOnline.map((item,key) => {
                    return (
                      <p key={key}>{item.name}</p>
                    )
                  })
                }
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