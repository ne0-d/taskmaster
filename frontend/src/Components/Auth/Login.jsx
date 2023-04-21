import React, { useEffect, useState } from "react";
import "./Login.css";
import profileDefault from "../../img/profileDefault.svg";
import logo from "../../img/LogoSmall.png";
import * as AuthApi from "../../Api/AuthRequests";

// import { logIn } from "../../actions/AuthAction.js";
// import { useDispatch, useSelector } from "react-redux";

const Login = () => {
  // const dispatch = useDispatch();
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [signupData, setSignupData] = useState({ name:"", username: "", password: "" });
  const [isSignup, setIsSignup] = useState(false);
  const [resData, setResData] = useState();
  const handleSubmit = (e) => {
    // e.preventDefault();
    // if (loginData.email && loginData.passwotestObjectrd) {
    //   dispatch(logIn(loginData));
    // } else {
    //   console.log("Please input all the fields");
    // }
  };
  // useEffect(() => {
  //   localStorage.setItem('items', JSON.stringify(2));
  // }, []);

  const handleSignupSubmit =  async (e) =>{
    e.preventDefault();
    try {
      const response = await AuthApi.signUp(signupData);
      console.log(response);
      if(response){

        localStorage.setItem('user', JSON.stringify(response.data));
        window.location.reload(false);
        // setResData(response.data);
      }
    } catch (error) {
      if(error.response.status===409) 
        alert("This username is already taken, try with a different username :(")
    }
  }

  const handleLogin = async (e)=>{
    e.preventDefault();
    try {
      const response = await AuthApi.logIn(loginData);
      console.log(response);
      if(response){
        localStorage.setItem('user', JSON.stringify(response.data));
        window.location.reload(false);
      }
      
    } catch (error) {
      if(error.response.status === 400) alert("Wrong Password")
    }
  }

  return (
    <>
    {
      isSignup ? (
        
      (
        <div className="signin">
        <img className="tm-logo-signin" src={logo} />
        {/* <img src={profileDefault} className="profileDefault" alt="" /> */}
        
        <form action="" className="loginForm">
          <input
            type="text"
            name="name"
            value={signupData.name}
            className="loginForm-data"
            placeholder="Full Name"
            onChange={(e) =>
              setSignupData({ ...signupData, [e.target.name]: e.target.value })
            }
          />
          <input
            type="text"
            name="username"
            value={signupData.username}
            className="loginForm-data"
            placeholder="Username"
            onChange={(e) =>
              setSignupData({ ...signupData, [e.target.name]: e.target.value })
            }
          />
          <input
            type="password"
            name="password"
            value={signupData.password}
            onChange={(e) =>
              setSignupData({ ...signupData, [e.target.name]: e.target.value })
            }
            className="loginForm-data"
            placeholder="Password"
          />
          <button
            type="submit"
            className="loginForm-button"
            onClick={handleSignupSubmit}
          >
            Sign Up
          </button>
          <p className="forgot-password" onClick={()=>{setIsSignup(false)}}> {isSignup ? "Already have an account, Signin" : "Dont have an account, Sign Up?" } </p>
        </form>
        
      </div>
      )
      ) :
      (
        <div className="signin">
        <img className="tm-logo-signin" src={logo} />
        {/* <img src={profileDefault} className="profileDefault" alt="" /> */}
        
        <form action="" className="loginForm">
          <input
            type="text"
            name="username"
            value={loginData.username}
            className="loginForm-data"
            placeholder="Username"
            onChange={(e) =>
              setLoginData({ ...loginData, [e.target.name]: e.target.value })
            }
          />
          <input
            type="password"
            name="password"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({ ...loginData, [e.target.name]: e.target.value })
            }
            className="loginForm-data"
            placeholder="Password"
          />
          <button
            type="submit"
            className="loginForm-button"
            onClick={handleLogin}
          >
            Sign In
          </button>
          <p className="forgot-password" onClick={()=> setIsSignup(true)}> {isSignup ? "Already have an account, Signin" : "Dont have an account, Sign Up?" } </p>
        </form>
        
      </div>
      )
    }
    
    </>
   
  );
};

export default Login;
