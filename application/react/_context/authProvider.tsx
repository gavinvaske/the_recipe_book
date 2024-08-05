import React, { createContext, useState } from "react";

/* TODO: fix the 'any' types */
export type AuthContextType = {
  auth: any,
  setAuth: (auth: any) => void
}

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}