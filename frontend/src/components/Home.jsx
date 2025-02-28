import React from 'react';
import './Home.css';    

function Home() {
    return (
        <div className="content">
            <h1>Main Content Area</h1>
            <p>This is where your video content would appear</p>
            
            <div className="video-grid">
                {Array(12).fill().map((_, i) => (
                    <div key={i} className="video-card">
                        <div className="thumbnail"></div>
                        <div className="video-info">
                            <div className="channel-thumbnail"></div>
                            <div className="video-details">
                                <h3 className="video-title">Video Title {i + 1}</h3>
                                <p className="channel-name">Channel Name</p>
                                <p className="video-meta">100K views • 2 days ago</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;
