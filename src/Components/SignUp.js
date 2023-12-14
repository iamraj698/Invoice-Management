import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Alert, Spinner } from "react-bootstrap";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(true);
  const [validationError, setValidationError] = useState("");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  
  useEffect(() => {
    const delay = setTimeout(() => {
      setLoading(false);
    }, 700);

    return () => clearTimeout(delay); 
  }, [loading]);


  useEffect(() => {
    // Check user login status when the component mounts
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  const handleSignUp = async () => {
    setValidationError("");

    if (!formData.name || !formData.email || !formData.password) {
      setValidationError("All fields must be filled in.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      console.log("User signed up successfully!");
      navigate("/SignIn");
    } catch (error) {
      console.error("Error signing up:", error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

 
  if (user) {
    navigate("/");
    return null; 
  }

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
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh", backgroundColor: "#f1f1f1" }}
    >
      <div className="card p-5" style={{ width: "30rem" }}>
        <h2 className="text-center">Sign Up</h2>
        <label htmlFor="name" className="form-label">
          Name:
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
          className="form-control mb-2"
        />
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
          className="form-control "
        />
        <br />
        {validationError && <Alert variant="danger">{validationError}</Alert>}
        <Button onClick={handleSignUp} className="mb-2">Sign Up</Button>
        <a href="/SignIn" className="text-center">Already have an account</a>
      </div>
    </div>
  );
};

export default SignUp;
