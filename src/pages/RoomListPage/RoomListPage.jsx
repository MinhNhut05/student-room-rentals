import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './RoomListPage.scss';

const RoomListPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // TODO: Fetch rooms from API
    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="room-list">
      <h1>Available Rooms</h1>
      <div className="room-grid">
        {rooms.map(room => (
          <div key={room._id} className="room-card">
            <h3>{room.title}</h3>
            <p>{room.location}</p>
            <p className="price">${room.price}/month</p>
            <Link to={`/rooms/${room._id}`}>View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomListPage;
