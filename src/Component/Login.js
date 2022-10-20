import React, {useState, useEffect} from "react";
import "../preview.css"
import { login, updateUser } from "../services/services";
import { useNavigate } from "react-router-dom";

const Login = ({socket}) => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        password: "",
    })

    const handleChange = (e) => {
        const field = e.target.name;
        setForm({
            ...form,
            [field]: e.target.value
        })
    }

    const handleLogin = async () => {
        const res = await login(form)
        if(res?.success) {
          const new_form = {
            ...res.user,
            isOnline: true,
            socketId: socket.id
          }
          await updateUser(new_form);
          socket.emit('login', {isLogin: true});
          localStorage.setItem('user', JSON.stringify(new_form))
          navigate('/home', {replace: true});
        }
    }

    return (
        <div className="container" style={{display: "flex", flexDirection: "column"}}>
        <div className="row justify-content-center">
          <div className="col-md-6 text-center mb-5">
            <h2 className="heading-section">Login</h2>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="login-wrap p-4 p-md-5">
              <div className="icon d-flex align-items-center justify-content-center">
                <span className="fa fa-user-o" />
              </div>
              <h3 className="text-center mb-4">Have an account?</h3>
              <form action="#" className="login-form">
                <div className="form-group">
                  <input type="text" className="form-control rounded-left" placeholder="Email" required 
                            value={form.email} onChange={handleChange} name="email"/>
                </div>
                <div className="form-group d-flex">
                  <input type="password" className="form-control rounded-left" placeholder="Password" required 
                            value={form.password} onChange={handleChange} name="password"/>
                </div>
                <div className="form-group d-md-flex">
                  <div className="w-50">
                    <label className="checkbox-wrap checkbox-primary">Remember Me
                      <input type="checkbox" defaultChecked />
                      <span className="checkmark" />
                    </label>
                  </div>
                  <div className="w-50 text-md-right">
                    <a href="/register">Register now</a>
                  </div>
                </div>
                <div className="form-group">
                  <button type="button" className="btn btn-primary rounded submit p-3 px-5" onClick={handleLogin}>Get Started</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
};

export default Login;
