import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import "./Navbar.css";
import { FaVideo, FaFilm, FaPen, FaBroadcastTower } from "react-icons/fa";
import "./Horizontal.css"
const CombinedNavbar = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };
  

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5000/logout", { withCredentials: true });
      Cookies.remove("token", { path: "/" });
      Cookies.remove("auth_token", { path: "/" });
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      Cookies.remove("token", { path: "/" });
      Cookies.remove("auth_token", { path: "/" });
      navigate("/login");
    }
  };
  const handleProfile = async () => {
    try {
      navigate("/profile");
    } catch (error) {
      console.error("Profile failed:", error);
    }
  }

  return (
    <div className="app-container" style={{ zIndex: 1 }}>
      <nav className="navbar fixed-top w-100 shadow-sm black-navbar">
        <div className="container-fluid d-flex justify-content-between" style={{ zIndex: 2 }}>
          <div className="d-flex align-items-center">
            <div className="menu-button" onClick={toggleSidebar}>
              <svg height="24" viewBox="0 0 24 24" width="24">
                <path d="M21,6H3V5h18V6z M21,11H3v1h18V11z M21,17H3v1h18V17z"></path>
              </svg>
            </div>
            <a className="navbar-brand"style={{ zIndex: 2 ,color:'white'}} >Share Eat</a>
          </div>
          <form className="d-flex">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button className="btn btn-outline-danger" type="submit">
              Search
            </button>
          </form>
          <div className="d-flex gap-2">
          <div className="position-relative">
            <button className="btn btn-danger" onClick={toggleDropdown}>Create</button>
            {showDropdown && (
              <div className="dropdown-menu show mt-2 bg-dark border border-secondary" style={{ position: "absolute", right: 0, zIndex: 10 }}>
                <button className="dropdown-item text-light d-flex align-items-center gap-2" onClick={() => { navigate("/uploadvideo"); setShowDropdown(false); }}>
                  <FaVideo /> Upload Video
                </button>
                <button className="dropdown-item text-light d-flex align-items-center gap-2" onClick={() => { navigate("/upload-reel"); setShowDropdown(false); }}>
                  <FaFilm /> Upload Reel
                </button>
                <button className="dropdown-item text-light d-flex align-items-center gap-2" onClick={() => { navigate("/upload-blog"); setShowDropdown(false); }}>
                  <FaPen /> Upload Blog
                </button>
                <button className="dropdown-item text-light d-flex align-items-center gap-2 text-danger" onClick={() => { navigate("/go-live"); setShowDropdown(false); }}>
                  <FaBroadcastTower /> Go Live
                </button>
              </div>
            )}
          </div>
          <button className="btn btn-danger" onClick={handleLogout}>Logout</button>

          </div>          
        </div>
      </nav>

      {/* Sidebar Navigation */}
      <div className={`sidebar ${expanded ? 'expanded' : 'collapsed'}`}>
      <div className="sidebar-header">
        <div className="menu-button" onClick={toggleSidebar}>
          <svg height="24" viewBox="0 0 24 24" width="24">
            <path d="M21,6H3V5h18V6z M21,11H3v1h18V11z M21,17H3v1h18V17z"></path>
          </svg>
        </div>

      </div>

      <div className="sidebar-items" style={{paddingTop:'40px'}}>
        <div className="sidebar-item active" onClick={() => navigate("/")}>
          <svg viewBox="0 0 24 24" height="24" width="24">
            <path d="M4,10V21h6V15h4v6h6V10L12,3Z"></path>
          </svg>
          {expanded && <span>Home</span>}
        </div>
        <div className="sidebar-item">
          <svg viewBox="0 0 24 24" height="24" width="24">
            <path d="M10,14.65V9.35L15,12L10,14.65ZM12,9c1.1,0 2,-0.9 2,-2c0,-1.1 -0.9,-2 -2,-2c-1.1,0 -2,0.9 -2,2C10,8.1 10.9,9 12,9ZM12,14c-1.1,0 -2,0.9 -2,2c0,1.1 0.9,2 2,2c1.1,0 2,-0.9 2,-2C14,14.9 13.1,14 12,14ZM12,19c-1.1,0 -2,0.9 -2,2c0,1.1 0.9,2 2,2c1.1,0 2,-0.9 2,-2C14,19.9 13.1,19 12,19ZM18,14c-1.1,0 -2,0.9 -2,2c0,1.1 0.9,2 2,2c1.1,0 2,-0.9 2,-2C20,14.9 19.1,14 18,14ZM18,9c1.1,0 2,-0.9 2,-2c0,-1.1 -0.9,-2 -2,-2c-1.1,0 -2,0.9 -2,2C16,8.1 16.9,9 18,9ZM18,19c-1.1,0 -2,0.9 -2,2c0,1.1 0.9,2 2,2c1.1,0 2,-0.9 2,-2C20,19.9 19.1,19 18,19ZM6,14c-1.1,0 -2,0.9 -2,2c0,1.1 0.9,2 2,2c1.1,0 2,-0.9 2,-2C8,14.9 7.1,14 6,14ZM6,9c1.1,0 2,-0.9 2,-2c0,-1.1 -0.9,-2 -2,-2c-1.1,0 -2,0.9 -2,2C4,8.1 4.9,9 6,9ZM6,19c-1.1,0 -2,0.9 -2,2c0,1.1 0.9,2 2,2c1.1,0 2,-0.9 2,-2C8,19.9 7.1,19 6,19Z"></path>
          </svg>
          {expanded && <span>Reels</span>}
        </div>
        <div className="sidebar-item">
          <svg viewBox="0 0 24 24" height="24" width="24">
            <path d="M10,18v-6l5,3L10,18z M17,3H7v1h10V3z M20,6H4v1h16V6z M22,9H2v12h20V9z M3,10h18v10H3V10z"></path>
          </svg>
          {expanded && <span>Followers</span>}
        </div>
        <div className="sidebar-item" onClick={() => navigate("/profile")}>
        <i class="bi bi-person-circle" style={{padding:'10x'}}></i>
          {expanded && <span style={{paddingLeft:'40px'}}>Profile</span>}
        </div>

        {expanded && <div className="divider"></div>}

        {expanded && (
          <div className="sidebar-section">
            <div className="sidebar-item">
              <svg viewBox="0 0 24 24" height="24" width="24">
                <path d="M11,7l6,3.5L11,14V7L11,7z M18,20H4V6H3v15h15V20z M21,18H6V3h15V18z M7,17h13V4H7V17z"></path>
              </svg>
              <span>Library</span>
            </div>
            <div className="sidebar-item">
              <svg viewBox="0 0 24 24" height="24" width="24">
                <path d="M14.97,16.95L10,13.87V7h2v5.76l4.03,2.49L14.97,16.95z M22,12c0,5.51-4.49,10-10,10S2,17.51,2,12h1c0,4.96,4.04,9,9,9 s9-4.04,9-9s-4.04-9-9-9C8.81,3,5.92,4.64,4.28,7.38C4.17,7.56,4.06,7.75,3.97,7.94C3.96,7.96,3.95,7.98,3.94,8H8v1H1.96V3h1v4.74 C3,7.65,3.03,7.57,3.07,7.49C3.18,7.27,3.3,7.07,3.42,6.86C5.22,3.86,8.51,2,12,2C17.51,2,22,6.49,22,12z"></path>
              </svg>
              <span>History</span>
            </div>
            <div className="sidebar-item">
              <svg viewBox="0 0 24 24" height="24" width="24">
                <path d="M10,8l6,4l-6,4V8L10,8z M21,3v18H3V3H21z M20,4H4v16h16V4z"></path>
              </svg>
              <span>Your videos</span>
            </div>
            <div className="sidebar-item">
              <svg viewBox="0 0 24 24" height="24" width="24">
                <path d="M14.97,16.95L10,13.87V7h2v5.76l4.03,2.49L14.97,16.95z M12,3c-4.96,0-9,4.04-9,9s4.04,9,9,9s9-4.04,9-9S16.96,3,12,3 M12,2c5.52,0,10,4.48,10,10s-4.48,10-10,10S2,17.52,2,12S6.48,2,12,2L12,2z"></path>
              </svg>
              <span>Watch later</span>
            </div>
            <div className="sidebar-item">
              <svg viewBox="0 0 24 24" height="24" width="24">
                <path d="M18.77,11h-4.23l1.52-4.94C16.38,5.03,15.54,4,14.38,4c-0.58,0-1.14,0.24-1.52,0.65L7,11H3v10h4h1h9.43 c1.06,0,1.98-0.67,2.19-1.61l1.34-6C21.23,12.15,20.18,11,18.77,11z M7,20H4v-8h3V20z M19.98,13.17l-1.34,6 C18.54,19.65,18.03,20,17.43,20H8v-8.61l5.6-6.06C13.79,5.12,14.08,5,14.38,5c0.26,0,0.5,0.11,0.63,0.3 c0.07,0.1,0.15,0.26,0.09,0.47l-1.52,4.94L13.18,12h1.35h4.23c0.41,0,0.8,0.17,1.03,0.46C19.92,12.61,20.05,12.86,19.98,13.17z"></path>
              </svg>
              <span>Liked videos</span>
            </div>
          </div>
        )}

        {expanded && <div className="divider"></div>}

        {expanded && (
          <div className="sidebar-section">
            <h3>Followers</h3>
            <div className="sidebar-item">
              <div className="channel-icon"></div>
              <span>Frnd1</span>
            </div>
            <div className="sidebar-item">
              <div className="channel-icon"></div>
              <span>Frnd 2</span>
            </div>
            <div className="sidebar-item">
              <div className="channel-icon"></div>
              <span>Frnd 3</span>
            </div>
            <div className="sidebar-item show-more">
              <span>Show more</span>
            </div>
          </div>
        )}

        {expanded && <div className="divider"></div>}

        {expanded && (
          <div className="sidebar-section">
            <h3>Explore</h3>
            <div className="sidebar-item">
              <svg viewBox="0 0 24 24" height="24" width="24">
                <path d="M19,3.87v9.77C19,17.61,15.47,20,12,20s-7-2.39-7-6.36V4.87C5,3.84,5.84,3,6.87,3h10.26C18.16,3,19,3.84,19,4.87z M14.5,10.09V8h-5L8,14h2.5v2l5-6L14.5,10.09z"></path>
              </svg>
              <span>Trending</span>
            </div>
            <div className="sidebar-item">
              <svg viewBox="0 0 24 24" height="24" width="24">
                <path d="M12,4v9.38C11.27,12.54,10.2,12,9,12c-2.21,0-4,1.79-4,4c0,2.21,1.79,4,4,4s4-1.79,4-4V8h6V4H12z M9,19c-1.66,0-3-1.34-3-3 s1.34-3,3-3s3,1.34,3,3S10.66,19,9,19z M18,7h-5V5h5V7z"></path>
              </svg>
              <span>Infulencer</span>
            </div>
            <div className="sidebar-item">
              <svg viewBox="0 0 24 24" height="24" width="24">
                <path d="M10,12H8v2H6v-2H4v-2h2V8h2v2h2V12z M17,12.5c0-0.83-0.67-1.5-1.5-1.5S14,11.67,14,12.5c0,0.83,0.67,1.5,1.5,1.5 S17,13.33,17,12.5z M20,9.5C20,8.67,19.33,8,18.5,8S17,8.67,17,9.5c0,0.83,0.67,1.5,1.5,1.5S20,10.33,20,9.5z M18.5,4 C19.33,4,20,3.33,20,2.5S19.33,1,18.5,1S17,1.67,17,2.5S17.67,4,18.5,4z M17,6.5c0,0.83,0.67,1.5,1.5,1.5S20,7.33,20,6.5 S19.33,5,18.5,5S17,5.67,17,6.5z M11,22c-1.1,0-2-0.9-2-2V6.27L7.21,8.06l-1.41-1.41l4.98-4.98c0.78-0.78,2.05-0.78,2.83,0 l4.98,4.98l-1.41,1.41L15.38,6.27V20c0,1.1-0.9,2-2,2H11z"></path>
              </svg>
              <span>Nuterian</span>
            </div>
          </div>
        )}

        {expanded && <div className="divider"></div>}

        {expanded && (
          <div className="sidebar-footer">
            <div className="sidebar-section">
              <div className="sidebar-item small">
                <span>About</span>
              </div>
              <div className="sidebar-item small">
                <span>Press</span>
              </div>
              <div className="sidebar-item small">
                <span>Copyright</span>
              </div>
              <div className="sidebar-item small">
                <span>Contact us</span>
              </div>
              <div className="sidebar-item small">
                <span>Creators</span>
              </div>
              <div className="sidebar-item small">
                <span>Advertise</span>
              </div>
              <div className="sidebar-item small">
                <span>Developers</span>
              </div>
            </div>
            <div className="sidebar-section">
              <div className="sidebar-item small">
                <span>Terms</span>
              </div>
            </div>
            <div className="copyright">
              © 2025 Google LLC
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default CombinedNavbar;
