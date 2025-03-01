import { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import "./Login.css";

export default function Login({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setToken(token);
      navigate("/");
    }
    const checkTokenFromRedirect = () => {
      const token = Cookies.get("token");
      if (token) {
        setToken(token);
        navigate("/");
      }
    };
    
    window.addEventListener('focus', checkTokenFromRedirect);
    
    return () => {
      window.removeEventListener('focus', checkTokenFromRedirect);
    };
  }, [navigate, setToken]);

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      let res;
      const endpoint = isLogin ? "login" : "register";
      const payload = isLogin 
        ? { email, password } 
        : { name, email, password };
        
      res = await axios.post(
        `http://localhost:5000/${endpoint}`,
        payload,
        { withCredentials: true }
      );
      
      if (res.data && res.data.token) {
        Cookies.set("token", res.data.token);
        setToken(res.data.token);
        navigate("/");
      } else {
        setError("Authentication failed. Please try again.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="Login d-flex align-items-center justify-content-center vh-100 bg-black">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-100 d-flex justify-content-center"
      >
        <Card
          className="bg-dark text-white border border-danger shadow-lg rounded-3 p-4"
          style={{ width: "24rem" }}
        >
          <Card.Body>
            <h2 className="text-center mb-4 text-danger">
              {isLogin ? "Welcome Back!" : "Create an Account"}
            </h2>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <form className="mb-3" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control bg-secondary text-white"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control bg-secondary text-white"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control bg-secondary text-white"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-danger w-100"
                disabled={loading}
              >
                {loading ? "Processing..." : (isLogin ? "Login" : "Sign Up")}
              </button>
            </form>
            <div className="d-flex align-items-center mb-3">
              <div className="flex-grow-1 border-bottom border-secondary"></div>
              <span className="px-2 text-secondary">OR</span>
              <div className="flex-grow-1 border-bottom border-secondary"></div>
            </div>
            <button
              className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <FcGoogle size={20} className="me-2" /> Continue with Google
            </button>
            <p className="text-center text-secondary mt-3">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <span
                className="text-danger ms-1"
                style={{ cursor: "pointer" }}
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Sign Up" : "Login"}
              </span>
            </p>
          </Card.Body>
        </Card>
      </motion.div>
    </div>
  );
}