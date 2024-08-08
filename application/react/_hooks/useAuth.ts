import { useContext } from "react";
import { AuthContext } from "../_context/authProvider";


export const useAuth = () => {
  const context = useContext(AuthContext);
  const { auth } = context;

  return context
}
