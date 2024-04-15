import React, { useEffect } from "react";
import { auth } from "../../Firebase.js";
import { useNavigate } from "react-router-dom";

function PrivateRoute({ Component }) {
  const navigate = useNavigate();
  useEffect(() => {
    const userData = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/getstarted");
      }
    });
    return userData;
  }, []);
  return (
    <div>
      <Component />
    </div>
  );
}

export default PrivateRoute;
