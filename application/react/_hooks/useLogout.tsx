import axios from "../axios";
import { useAuth } from "./useAuth";

export const useLogout = () => {
  const { setAuth } = useAuth();

  const logout = async () => {
    setAuth({});
    try {
      await axios.get('/logout');
    } catch (err) {
      console.error(err);
    }
  }

  return logout;
}