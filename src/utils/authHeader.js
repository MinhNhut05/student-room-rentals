const authHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.token) {
    return {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
  }
  return {};
};

export default authHeader;
import authHeader from '../utils/authHeader';

const createRoom = async (roomData) => {
  const response = await axios.post('/api/rooms/', roomData, authHeader());
  return response.data;
};
