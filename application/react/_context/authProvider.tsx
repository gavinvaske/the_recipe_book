import React, { createContext, useState } from "react";

export type UserAuth = {
  accessToken: string,
  authRoles: string[]
}

export type AuthContextType = {
  auth: UserAuth,
  setAuth: (auth: UserAuth) => void
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

type Props = {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: Props) => {
  const [auth, setAuth] = useState<UserAuth>({} as UserAuth);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  )
}