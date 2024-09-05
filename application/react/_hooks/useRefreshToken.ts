import { UserAuth } from "../_context/authProvider";
import axios from "axios";
import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";

export const useRefreshToken = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
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
      navigate('/react-ui/login', { replace: true })
    }

    return userAuth;
  }

  return fetchAccessToken
}