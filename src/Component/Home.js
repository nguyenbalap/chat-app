import { useState, useEffect, useRef } from "react";
import "../App.css"
import { useLocation, useNavigate } from "react-router-dom";
import { get } from "../services/services";

function Home({ socket }) {
    const [userId, setUserId] = useState("");
    const [message, setMessage] = useState("")
    const [mess, setMess] = useState([]);
    const userRef = useRef(JSON.parse(localStorage.getItem('user')))
    const location  = useLocation();
    const navigate = useNavigate();
    const [listUsersOnline, setListUsersOnline] = useState([]);
    const [activeClass, setActiveClass] = useState("")
    
    useEffect(() => {
      socket.on('user disconnected', async ({socketId}) => {
        localStorage.removeItem('user');
      });
      socket?.on(`server response ${userId}`, (dataGot) => {
        console.log({dataGot})
        setMess(oldMsgs => [...oldMsgs, dataGot])
      });

      return () => {
        // socket?.off(`server response ${userId}`);
        socket?.off('user disconnected');
        // socket?.off('response login');
      };
    }, [userId]);

    useEffect(() => {
      if (!userRef.current) {
        navigate("/login")
      } else {
        getListUserOnline()
      }
    }, [])

    const getListUserOnline = async () => {
      const list = await get();
      setListUsersOnline(list); 
    }

    function getRandomInt(max) {
      return Math.floor(Math.random() * max);
    }

    const handleSendMessage = () => {
      socket.emit('chat message', {message: message, user: userRef.current.name, target: userId});
      setMessage("")
    }

    const handleChangeUser = (e) => {
      if (activeClass === e.target.id) {
        setActiveClass('')
      } else {
        setActiveClass(e.target.id)
      }
      setUserId(e.target.getAttribute("value"))
    }
    
    return (
        <>
        <div className="container1">
            <div className="site_bar">
                <h4>Online</h4>
                {
                  listUsersOnline.length > 0 && listUsersOnline.map((item,key) => {
                    return (
                      <div key={item._id} className={`site_bar_list ${activeClass == key ? "active" : ""}`} id={key} onClick={handleChangeUser} value={item._id}>
                        <div style={{width: "30%"}}>
                          <img src={process.env.PUBLIC_URL + "/images/" + getRandomInt(7) + ".jpeg"} alt="#" className="site_bar_list_avatar"/>
                        </div>
                        <div className="site_bar_list_name">{item.name}</div>
                      </div>
                    )
                  })
                }
            </div>
            {
              userId === "" ? 
              <div style={{margin: "auto"}}>
                  <h3>Welcome: {userRef.current?.name}</h3>
              </div>
              :
              <div className="content1">
                  <div className="content_message">
                      {
                          mess.filter(item => item.target === userId)?.map((item, key) => (
                              <p key={key}>{item?.user} - {item?.message}</p>
                          ))
                      }
                  </div>
                  <div className="content_input"> activeClassBV C 
                      <input value={message} onChange={(e) => setMessage(e.target.value)} style={{width: "80%"}}/>
                      <button onClick={ handleSendMessage } style={{width: "20%"}}>Send</button>
                  </div>
              </div>
            }
            
        </div>
      </>
    );
  }

  export default Home;