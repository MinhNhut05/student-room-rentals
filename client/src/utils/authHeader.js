export default function authHeader() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.token) {
    // Trả về object đúng chuẩn cho header Authorization
    return { Authorization: "Bearer " + user.token };
  } else {
    // Trả về object rỗng nếu không có user hoặc token
    return {};
  }
}

const createRoom = async (roomData) => {
  const response = await axios.post("/api/rooms/", roomData, authHeader());
  return response.data;
};
