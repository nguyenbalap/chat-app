import React, {useState, useEffect} from "react";
import "../preview.css"
import { register } from "../services/services";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
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

    const handleRegister = async () => {
        const res = await register(form)
        if(res.success) {
          navigate('/login', {replace: true});
        } else {
          alert("error")
        }
    }

    return (
        <div className="container" style={{display: "flex", flexDirection: "column"}}>
        <div className="row justify-content-center">
          <div className="col-md-6 text-center mb-5">
            <h2 className="heading-section">Register</h2>
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
                  <input type="text" className="form-control rounded-left" placeholder="name" required 
                            value={form.name} onChange={handleChange} name="name"/>
                </div>
                <div className="form-group">
                  <input type="email" className="form-control rounded-left" placeholder="Email" required 
                            value={form.email} onChange={handleChange} name="email"/>
                </div>
                <div className="form-group d-flex">
                  <input type="password" className="form-control rounded-left" placeholder="Password" required 
                            value={form.password} onChange={handleChange} name="password"/>
                </div>
                <div className="form-group">
                  <button type="button" className="btn btn-primary rounded submit p-3 px-5" onClick={handleRegister}>Register Now</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
};

export default Register;
