import React, { useEffect, useState } from 'react';
import './Home.css';

function Home() {
  const [videos, setVideos] = useState([]); // State to store video data
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null);

  // Fetch video data from the backend
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/feed'); 
        if (!response.ok) {
          throw new Error('Failed to fetch videos');
        }
        const data = await response.json();
        setVideos(data.videos);
      } catch (err) {
        setError(err.message); 
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return <div className="loading">Loading videos...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="content">
      <div className="video-grid">
        {videos.map((video, i) => (
          <div key={i} className="video-card">
            <div className="thumbnail">
            <video controls width="320">
  <source src={`http://localhost:5000${video.videoUrl}`} type="video/mp4" />
  Your browser does not support the video tag.
</video>
            </div>
            <div className="video-info">
              <div className="channel-thumbnail">
                <img src="userprofile" alt="Channel" />
              </div>
              <div className="video-details">
                <h3 className="video-title">{video.title}</h3>
                <p className="channel-name">{video.user_name}</p>
                <p className="video-meta">{new Date(video.date).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;