import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";
import { Container, Row, Col, Button, Tab, Tabs, Image } from "react-bootstrap";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/profile", { withCredentials: true })
      .then(response => {
        setUser(response.data.user);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching profile:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <div className="error">User not found</div>;

  return (
    <Container className="profile-container" style={{ marginTop: "80px", padding: "20px" }}>
      <Row className="profile-header">
        <Col md={3} className="text-center">
          <Image src={user.profilePic || "/default-avatar.png"} roundedCircle className="profile-pic" />
        </Col>
        <Col md={9} className="profile-info">
          <h2>{user.name}</h2>
          <p>@{user.username}</p>
          <Button variant="danger">Subscribe</Button>
        </Col>
      </Row>
      <Tabs defaultActiveKey="videos" className="profile-tabs">
        <Tab eventKey="videos" title="Your Videos">
          <div className="tab-content">No videos uploaded yet.</div>
        </Tab>
        <Tab eventKey="history" title="History">
          <div className="tab-content">No history available.</div>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Profile;
