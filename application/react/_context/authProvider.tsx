import React, { createContext, useState } from "react";

type Auth = {
  token: string,
  roles: string[]
}

/* TODO: fix the 'any' types */
export type AuthContextType = {
  auth: any,
  setAuth: (auth: Auth) => void
}

export const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState();

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  )
}