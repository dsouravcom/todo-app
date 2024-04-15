import React, { useEffect, useContext } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../Firebase.js";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/UserContext";

// assets
import GoogleLogo from "../assets/googleLogo.png";

function Login() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const onLoginHandle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  //verify if user is logged in
  useEffect(() => {
    const ifUser = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/"); // Redirect to home page if user is already logged in
      }
    });

    return ifUser; // Cleanup function to remove the listener
  }, []);

  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-screen dark:bg-gray-950 dark:text-white">
        <div className="flex">
          <h1 className="text-4xl">To</h1>
          <h1 className="text-blue-400 text-4xl">Do.</h1>
        </div>

        <button
          className="flex bg-white px-4 py-1 mt-10 rounded-lg text-black"
          onClick={onLoginHandle}
        >
          <img
            src={GoogleLogo}
            alt="sign up with google"
            className="w-6 pt-[1px] mr-1"
          />
          <p className="font-semibold">Sign up with Google</p>
        </button>
      </div>
    </>
  );
}

export default Login;
