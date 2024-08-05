import { useContext } from "react";
import { AuthContext } from "../_context/authProvider";


export const useAuth = () => {
    return useContext(AuthContext);
}
