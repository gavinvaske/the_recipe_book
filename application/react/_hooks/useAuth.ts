import { useContext } from "react";
import { AuthContext, AuthContextType } from "../_context/authProvider";

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  return context
}
