import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './RoomDetailPage.scss';

const RoomDetailPage = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // TODO: Implement API call to fetch room details
    setLoading(false);
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!room) return <div>Room not found</div>;

  return (
    <div className="room-detail">
      <h1>{room?.title}</h1>
      <div className="room-info">
        <p className="price">${room?.price}/month</p>
        <p className="location">{room?.location}</p>
        <p className="description">{room?.description}</p>
      </div>
      <div className="contact-info">
        <h2>Contact Landlord</h2>
        <button className="btn primary">Send Message</button>
      </div>
    </div>
  );
};

export default RoomDetailPage;
