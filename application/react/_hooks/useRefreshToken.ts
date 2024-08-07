import axios from "../axios";
import { useAuth } from "./useAuth"

export const useRefreshToken = () => {
  const { setAuth } = useAuth();
  
  const fetchRefreshToken = async () => {
    const response = await axios.get('/auth/access-token', {
      withCredentials: true // Tells axios to include HTTP only cookies in request to server
    })

    const { accessToken, roles } = response.data

    setAuth({
      accessToken,
      roles
    })

    return accessToken
  }

  return fetchRefreshToken
}