import { useState, useEffect, useRef } from "react";
import "../App.css"
import { useLocation, useNavigate } from "react-router-dom";
import { get, updateUser, updateIsOnlineUser } from "../services/services";

function Home({ socket }) {
    const [isConnected, setIsConnected] = useState(true);
    const [message, setMessage] = useState("")
    const [mess, setMess] = useState([]);
    const userRef = useRef(JSON.parse(localStorage.getItem('user')))
    const location  = useLocation();
    const navigate = useNavigate();
    const [listUsersOnline, setListUsersOnline] = useState([]);

    useEffect(() => {

      socket?.on('connect', () => {
        setIsConnected(true)
      })

      socket.on('user disconnected', async ({socketId}) => {
        await updateIsOnlineUser({
          socketId,
          isOnline: false
        })
        localStorage.removeItem('user');
      });

      socket?.on('server response', (dataGot) => {
        setMess(oldMsgs => [...oldMsgs, dataGot])
      });

      socket.on('response login', (res) => {
        console.log("nhay vao day")
        setIsConnected(!isConnected)
      })
  
      return () => {
        socket?.off('connect');
        socket?.off('server response');
        socket?.off('user disconnected');
        // socket?.off('response login');

      };
    }, []);

    useEffect(() => {
      console.log(isConnected, "check")
      if (!userRef.current) {
        navigate("/login")
      } else {
        getListUserOnline()
      }
    }, [isConnected])

    const getListUserOnline = async () => {
      const list = await get();
      setListUsersOnline(list); 
    }

    function getRandomInt(max) {
      return Math.floor(Math.random() * max);
    }

    const handleSendMessage = () => {
      socket.emit('chat message', {message: message, user: userRef.current.name});
      setMessage("")
    }
    
    return (
        <>
        <div className="welcome">
            <h4>Welcome</h4>
        </div>
        <div className="container1">
            <div className="site_bar">
                <h4>Online</h4>
                {
                  listUsersOnline.length > 0 && listUsersOnline.map((item,key) => {
                    return (
                      <div key={key} className="site_bar_list">
                        <div style={{width: "30%"}}>
                          <img src={process.env.PUBLIC_URL + "/images/" + getRandomInt(7) + ".jpeg"} alt="#" className="site_bar_list_avatar"/>
                        </div>
                        <div className="site_bar_list_name">{item.name}</div>
                      </div>
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