import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import BootstrapNavbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../firebase";
import { Button } from "react-bootstrap";

function Navbar() {
  const user = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserStatus = () => {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    };

    checkUserStatus();
  }, []);

  const handleSignOut = async () => {
    try {
      await user.auth.signOut();
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  const handleSignIn = () => {
    navigate("/SignIn");
  };

  return (
    <div className="container-fluide">
      <BootstrapNavbar
        bg="dark"
        expand="lg"
        data-bs-theme="dark"
        style={{
          zIndex: "100",
          position: "fixed", 
          top: "0", 
          width: "100%", 
        }}
      >
        <Container>
          <Link to="/" className="navbar-brand">
            Invoice Application
          </Link>
          <BootstrapNavbar.Toggle
            aria-controls="responsive-navbar-nav"
            onClick={() => setExpanded(!expanded)}
          />
          <BootstrapNavbar.Collapse id="responsive-navbar-nav">
            {user && !loading ? (
              <Nav className="me-auto">
                <Link to="/InvoiceList" className="nav-link">
                  Invoice List
                </Link>
                <Link to="/ClientList" className="nav-link">
                  Client List
                </Link>
                <Link to="/checkclient" className="nav-link">
                  New Invoice
                </Link>
              </Nav>
            ) : null}
            <div className="ms-auto">
              {loading ? (
                <span>Loading...</span>
              ) : user ? (
                <Button variant="danger" onClick={handleSignOut}>
                  Logout
                </Button>
              ) : (
                <Button variant="primary" onClick={handleSignIn}>
                  SignIn
                </Button>
              )}
            </div>
          </BootstrapNavbar.Collapse>
        </Container>
      </BootstrapNavbar>
    </div>
  );
}

export default Navbar;