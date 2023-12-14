import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, useAuth } from "../firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert, Button, Spinner } from "react-bootstrap";

const SignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [validationError, setValidationError] = useState("");
  const [loading, setLoading] = useState(true);
  const user = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    
    const delay = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(delay); 
  }, [loading]);

  useEffect(() => {
    if (user) {
      navigate("/Home");
    }
  }, [user, navigate]);

  const handleSignIn = async () => {
    setValidationError("");

    if (!formData.email || !formData.password) {
      setValidationError("All fields must be filled in.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      console.log("User signed in successfully!");
    } catch (error) {
      console.error("Error signing in:", error.message);
      setValidationError("Invalid email or password.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh", backgroundColor: "#f1f1f1" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh", backgroundColor: "#f1f1f1" }}>
      <div className="card p-5" style={{ width: "30rem" }}>
        <h2 className="text-center">Sign In</h2>
        <label htmlFor="email" className="form-label">
          Email:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          className="form-control mb-2"
        />
        <label htmlFor="password" className="form-label">
          Password:
        </label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          className="form-control"
        />
        <br />
        {validationError && <Alert variant="danger">{validationError}</Alert>}
        <Button onClick={handleSignIn} className="mb-2">
          Sign In
        </Button>
        <a href="/SignUp" className="text-center">
          Sign Up for a new Account
        </a>
      </div>
    </div>
  );
};

export default SignIn;
