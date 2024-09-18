import axios from "axios";
import { UserAuth } from "../_context/authProvider";
import { useAuth } from "./useAuth";

export const useRefreshToken = () => {
  const { setAuth } = useAuth();
  const fetchAccessToken = async (): Promise<void> => {
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
    } catch (error) { /* throws if the refreshToken is expired or non-existant. */ 
      setAuth(userAuth)
      throw error;
    }
  }

  return fetchAccessToken
}