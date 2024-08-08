import { UserAuth } from "../_context/authProvider";
import axios from "../axios";
import { useAuth } from "./useAuth";

export const useRefreshToken = () => {
  const { setAuth } = useAuth();
  const fetchAccessToken = async (): Promise<UserAuth> => {

    const response = await axios.get('/auth/access-token', {
      withCredentials: true // Tells axios to include HTTP only cookies in request to server
    })

    const userAuth: UserAuth = response.data

    setAuth(userAuth);

    return userAuth;
  }

  return fetchAccessToken
}