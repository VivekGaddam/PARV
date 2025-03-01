import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Shorts.css";

const shortsData = [
  {
    id: 1,
    videoUrl: "https://www.youtube.com/embed/mJSJcOYIdYA",
    title: "Veg Manchuria",
    likes: 1500,
    comments: 300,
  },
  {
    id: 2,
    videoUrl: "https://www.youtube.com/embed/nrboTnHxLrg",
    title: "Pizza",
    likes: 1800,
    comments: 500,
  },
];

const Shorts = () => {
  return (
    <div className="shorts-container d-flex justify-content-center align-items-center vh-100">
      <div className="shorts-wrapper">
        {shortsData.map((short) => (
          <div key={short.id} className="short">
            <iframe src={short.videoUrl} controls className="short-video" />
            <div className="short-info">
              <h5>{short.title}</h5>
              <div className="actions">
                <button className="btn btn-danger">❤️ {short.likes}</button>
                <button className="btn btn-primary">💬 {short.comments}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shorts;
