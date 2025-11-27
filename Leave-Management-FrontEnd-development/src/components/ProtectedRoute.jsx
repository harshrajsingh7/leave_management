import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ClipLoader } from 'react-spinners';

// Protected Route component
const ProtectedRoute = ({ children, allowedPrivileges }) => {
  const { user, loading, authChecked } = useContext(AuthContext);

  if (loading || !authChecked) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw'
      }}>
        <ClipLoader
          color={'#36D7B7'} // You can change this color
          loading={true}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Check if the user's privilege matches the allowed privileges
  if (!allowedPrivileges.includes(user.privilege) && user.privilege !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
