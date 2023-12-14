import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../firebase';
import { Spinner } from 'react-bootstrap';

const ProtectedRoute = ({ children }) => {
  const user = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 1000); 

    return () => clearTimeout(timeoutId);
  }, []);

  if (loading) {
    
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/SignIn"/>;
  }

  return children;
};

export default ProtectedRoute;
