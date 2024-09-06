import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../_context/authProvider";
import { useAuth } from "./useAuth";

export const useRefreshToken = () => {
  const { setAuth } = useAuth();
  const fetchAccessToken = async (): Promise<UserAuth> => {
    let userAuth: UserAuth = {
      accessToken: '',
      authRoles: []
    }

    try {
      const response = await axios.get('/auth/access-token', {
        withCredentials: true // Tells axios to include HTTP only cookies in request to server
      })

      userAuth = response.data

      setAuth(userAuth);
    } catch (error) {
      setAuth(userAuth)
    }

    return userAuth;
  }

  return fetchAccessToken
}