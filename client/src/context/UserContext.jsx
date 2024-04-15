import React, { createContext, useState, useEffect } from "react";
import { auth } from "../../Firebase.js";

const AuthContext = createContext();

function UserContext({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return unsubscribe;
  }, [setUser]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, UserContext };
